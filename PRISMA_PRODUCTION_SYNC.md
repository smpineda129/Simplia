# Prisma ↔ Producción — Proceso de Sincronización

**Fecha:** 29 de abril de 2026
**Base de datos:** `db-simplia-public` (PostgreSQL en AWS RDS us-east-2)
**Motor:** Prisma ORM v5.12.1
**Resultado:** ✅ Exitoso — sin pérdida de datos

---

## Contexto

La base de datos de producción fue construida con migraciones de **Laravel** (142 registros en la tabla `migrations`). **No existía** tabla `_prisma_migrations`. Las migraciones locales de Prisma eran de un entorno de desarrollo completamente diferente y no coincidían con producción.

**Riesgo principal evitado:** Si se hubiese ejecutado `prisma migrate dev` directamente, Prisma habría intentado resetear (borrar) toda la base de datos al no encontrar `_prisma_migrations`.

---

## Pasos ejecutados

### Paso 1 — Archivar migraciones antiguas

```bash
mkdir -p server/prisma/migrations_archive
mv server/prisma/migrations/20251* server/prisma/migrations_archive/
mv server/prisma/migrations/20260* server/prisma/migrations_archive/
mv server/prisma/migrations/migration_lock.toml server/prisma/migrations_archive/
```

Las 16 migraciones del entorno de desarrollo fueron **movidas** (no borradas) a `migrations_archive/`. Esto impide que Prisma las intente aplicar sobre producción.

---

### Paso 2 — Introspección de producción

```bash
cd server && npx prisma db pull
```

Este comando **sobreescribió** `schema.prisma` con la estructura exacta de producción: **57 modelos** extraídos directamente de la DB.

---

### Paso 3 — Restaurar modelos y columnas nuevas en schema.prisma

Después del `db pull`, se agregaron manualmente al `schema.prisma`:

#### Columnas nuevas en tablas existentes

| Tabla | Columnas agregadas |
|-------|-------------------|
| `correspondences` | `type`, `tracking_number` (unique), `content`, `priority`, `received_at`, `sender_id`, `recipient_id`, `origin_area_id`, `destination_area_id`, `attachments` |
| `users` | `avatar` |
| `correspondence_threads` | `tagged_users` (JSON) |
| `external_users` | `otp_code`, `otp_expires_at` |
| `document_proceeding` | `folder_id` |
| `correspondence_document` | `folder_id` |
| `action_events` | `company_id`, `ip_address`, `user_agent` |
| `warehouses` | `address` |

#### Relaciones restauradas en modelos existentes

- `User` → relaciones con `Correspondence` (sender/recipient), `SupportTicket` (creator/assignee), `TicketComment`, `TicketHistory`
- `Area` → relaciones con `Correspondence` (origin_area, destination_area)
- `Company` → relación con `SupportTicket`
- `Proceeding` → relación con `ProceedingFolder`
- `Correspondence` → relaciones con `Area` (FK con nombre explícito), `User` (FK con nombre explícito), `CorrespondenceFolder`, `ElectronicSignature`
- `CorrespondenceThread` → relación con `ElectronicSignature`

#### Nuevas tablas (modelos nuevos)

| Modelo Prisma | Tabla en DB | Descripción |
|---------------|-------------|-------------|
| `Audit` | `audits` | Registro de auditoría de cambios |
| `Session` | `sessions` | Sesiones de usuario |
| `ProceedingFolder` | `proceeding_folders` | Carpetas dentro de expedientes |
| `CorrespondenceFolder` | `correspondence_folders` | Carpetas dentro de correspondencias |
| `SupportTicket` | `support_tickets` | Sistema PQRS/soporte |
| `TicketComment` | `ticket_comments` | Comentarios en tickets |
| `TicketHistory` | `ticket_history` | Historial de cambios en tickets |
| `ElectronicSignature` | `electronic_signatures` | Firmas electrónicas (Decreto 2364/2012) |
| `password_reset_tokens` | `password_reset_tokens` | Tokens de reset de contraseña |

#### Enums nuevos

```prisma
enum TicketStatus  { OPEN, IN_PROGRESS, WAITING_RESPONSE, RESOLVED, CLOSED, CANCELLED }
enum TicketPriority { LOW, MEDIUM, HIGH, URGENT }
enum TicketType    { PQRS, TECHNICAL_SUPPORT, BILLING, FEATURE_REQUEST, BUG_REPORT, OTHER }
```

---

### Paso 4 — Fix del modelo Entity

El `db pull` corrigió automáticamente el modelo `Entity` para que coincida con producción:

| Campo | Antes (dev) | Después (producción real) |
|-------|-------------|--------------------------|
| `companyId` | `BigInt?` (opcional) | **eliminado** (no existe en producción) |
| `entityCategoryId` | `BigInt?` (opcional) | `BigInt` (requerido, NOT NULL) |
| `identification` | `String?` (opcional) | `String` (requerido, NOT NULL) |
| `meta` | `Json?` (opcional) | `Json` (requerido, NOT NULL) |

> **Nota:** El servicio `entity.service.js` usa el modelo `ExternalUser`, no `Entity`, por lo que no requirió cambios de código.

---

### Paso 5 — Generar SQL de migración (sin aplicar todavía)

```bash
DB_URL="postgresql://vapor:...@db-simplia-public..."
npx prisma migrate diff \
  --from-url "$DB_URL" \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/20260429000000_sync_new_features/migration.sql
```

Este comando genera el SQL **exacto** de la diferencia entre la DB actual y nuestro schema — sin tocar nada.

**Verificación del SQL generado:**
- ✅ Solo `CREATE TYPE`
- ✅ Solo `ALTER TABLE ADD COLUMN`
- ✅ Solo `CREATE TABLE`
- ✅ Solo `CREATE INDEX` / `CREATE UNIQUE INDEX`
- ✅ Solo `ADD FOREIGN KEY`
- ❌ Cero `DROP TABLE`
- ❌ Cero `DROP COLUMN`
- ❌ Cero `ALTER COLUMN TYPE`

---

### Paso 6 — Baseline de producción

Como la DB ya tenía datos pero no tenía `_prisma_migrations`, se creó una migración de baseline vacía:

```bash
# 1. Crear migración baseline vacía
mkdir -p prisma/migrations/20260428000000_baseline
echo "-- Baseline: represents existing production schema" \
  > prisma/migrations/20260428000000_baseline/migration.sql

# 2. Marcarla como aplicada (crea la tabla _prisma_migrations, NO ejecuta SQL)
npx prisma migrate resolve --applied 20260428000000_baseline
```

Esto crea la tabla `_prisma_migrations` en producción y registra el baseline, sin tocar ningún dato existente.

---

### Paso 7 — Aplicar la migración real

```bash
npx prisma migrate deploy
```

Salida:
```
2 migrations found in prisma/migrations
Applying migration `20260429000000_sync_new_features`
All migrations have been successfully applied.
```

---

### Paso 8 — Regenerar cliente Prisma

```bash
npx prisma generate
```

---

## Estado final del repositorio

```
server/prisma/
├── schema.prisma                          ← Sincronizado con producción + nuevos modelos
├── migrations/
│   ├── migration_lock.toml
│   ├── 20260428000000_baseline/
│   │   └── migration.sql                 ← Vacío (solo baseline)
│   └── 20260429000000_sync_new_features/
│       └── migration.sql                 ← SQL con todas las adiciones
└── migrations_archive/                   ← Migraciones antiguas (dev, no aplicar)
    ├── 20251012011256_base_migration/
    ├── 20251012015753_update_users_and_companies/
    └── ... (14 migraciones más)
```

---

## Verificación post-migración

### Tablas nuevas confirmadas en producción

```
_prisma_migrations      ← Control de migraciones (nueva)
audits
correspondence_folders
electronic_signatures
proceeding_folders
sessions
support_tickets
ticket_comments
ticket_history
password_reset_tokens
```

### Columnas nuevas confirmadas en producción

```
action_events.company_id
action_events.ip_address
action_events.user_agent
correspondence_threads.tagged_users
correspondences.content
correspondences.priority
correspondences.recipient_id
correspondences.sender_id
correspondences.tracking_number
correspondences.type
correspondences.origin_area_id
correspondences.destination_area_id
correspondences.received_at
correspondences.attachments
document_proceeding.folder_id
correspondence_document.folder_id
external_users.otp_code
external_users.otp_expires_at
users.avatar
warehouses.address
```

### Servidor arrancó correctamente

```
✅ Base de datos conectada correctamente
✅ MongoDB conectada correctamente
```

---

## Para próximas migraciones

Ahora que existe `_prisma_migrations`, el flujo normal de Prisma funciona:

### Agregar nuevos campos o tablas

```bash
# 1. Editar schema.prisma con los nuevos campos/modelos

# 2. Generar la migración (en local, con terminal interactiva)
cd server && npx prisma migrate dev --name nombre_descriptivo

# 3. Revisar el SQL generado en prisma/migrations/<timestamp>_nombre/migration.sql
#    Verificar: solo ADD, CREATE — nunca DROP

# 4. Aplicar en producción
npx prisma migrate deploy

# 5. Regenerar cliente
npx prisma generate
```

### Si el entorno no es interactivo (CI/CD, Render)

```bash
# Generar diff primero (para revisión)
npx prisma migrate diff \
  --from-url "$DATABASE_URL" \
  --to-schema-datamodel prisma/schema.prisma \
  --script

# Luego aplicar
npx prisma migrate deploy
```

---

## Advertencias importantes

> ⚠️ **NO ejecutar `prisma migrate dev` directamente sobre producción** — es un comando interactivo que puede ofrecer resetear la DB.

> ⚠️ **NO ejecutar `prisma migrate reset`** — borra todos los datos.

> ⚠️ **Siempre revisar el SQL** generado antes de aplicar con `migrate deploy`. El SQL debe contener SOLO operaciones `ADD`/`CREATE`, nunca `DROP` ni `ALTER COLUMN TYPE`.

> ⚠️ **Las migraciones en `migrations_archive/`** son del entorno de desarrollo y **nunca deben aplicarse** sobre la base de datos de producción.

---

## Variables de entorno necesarias

```env
DATABASE_URL="postgresql://vapor:<PASSWORD>@db-simplia-public.cpo4wotv7yic.us-east-2.rds.amazonaws.com:5432/vapor"
```

El archivo `server/.env` contiene la URL activa. El archivo `server/global-bundle.pem` es el certificado SSL de AWS RDS (requerido para la conexión segura en producción/Render).
