# 🗄️ Configuración de Base de Datos Externa

Este documento explica cómo configurar la aplicación GDI para conectarse a una base de datos PostgreSQL externa ya desplegada.

## 📋 Requisitos Previos

- Base de datos PostgreSQL 12+ desplegada y accesible
- Credenciales de acceso (usuario, contraseña, host, puerto, nombre de BD)
- Permisos para crear tablas y ejecutar migraciones

## 🔧 Configuración

### 1. Variables de Entorno

Edita el archivo `server/.env` con los datos de tu base de datos:

```env
DATABASE_URL="postgresql://[USUARIO]:[CONTRASEÑA]@[HOST]:[PUERTO]/[NOMBRE_BD]?schema=public"
```

#### Parámetros:

- **USUARIO**: Usuario de PostgreSQL con permisos de escritura
- **CONTRASEÑA**: Contraseña del usuario
- **HOST**: Dirección del servidor (puede ser IP o dominio)
- **PUERTO**: Puerto de PostgreSQL (por defecto 5432)
- **NOMBRE_BD**: Nombre de la base de datos

#### Ejemplos:

**Base de datos en servidor remoto:**
```env
DATABASE_URL="postgresql://gdi_user:SecureP@ss123@db.mycompany.com:5432/gdi_production?schema=public"
```

**Base de datos en AWS RDS:**
```env
DATABASE_URL="postgresql://admin:mypassword@gdi-db.abc123.us-east-1.rds.amazonaws.com:5432/gdi_db?schema=public"
```

**Base de datos en Azure:**
```env
DATABASE_URL="postgresql://gdi_admin@myserver:MyP@ssw0rd@myserver.postgres.database.azure.com:5432/gdi_db?schema=public&sslmode=require"
```

**Base de datos en Google Cloud SQL:**
```env
DATABASE_URL="postgresql://gdi_user:password@10.123.45.67:5432/gdi_db?schema=public"
```

### 2. Verificar Conectividad

Antes de ejecutar migraciones, verifica que puedes conectarte a la base de datos:

```bash
# Usando psql
psql "postgresql://usuario:contraseña@host:puerto/nombre_bd"

# O usando telnet para verificar el puerto
telnet host puerto
```

### 3. Ejecutar Migraciones

Una vez configurada la conexión, ejecuta las migraciones de Prisma:

```bash
# Generar el cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Verificar el estado de las migraciones
cd server && npx prisma migrate status
```

### 4. Verificar Instalación

Puedes verificar que las tablas se crearon correctamente:

```bash
# Abrir Prisma Studio
npm run prisma:studio
```

O conectándote directamente a la base de datos:

```sql
-- Listar todas las tablas
\dt

-- Ver estructura de una tabla
\d users
```

## 🔒 Consideraciones de Seguridad

### 1. Protección de Credenciales

- **Nunca** commitees el archivo `.env` al repositorio
- Usa variables de entorno del sistema en producción
- Considera usar servicios de gestión de secretos (AWS Secrets Manager, Azure Key Vault, etc.)

### 2. Conexiones SSL

Para producción, es recomendable usar conexiones SSL:

```env
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public&sslmode=require"
```

Opciones de `sslmode`:
- `disable`: Sin SSL (no recomendado en producción)
- `require`: Requiere SSL pero no valida certificado
- `verify-ca`: Requiere SSL y valida certificado
- `verify-full`: Requiere SSL, valida certificado y hostname

### 3. Pool de Conexiones

Prisma maneja automáticamente el pool de conexiones. Para ajustarlo:

```env
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public&connection_limit=10"
```

## 🚨 Troubleshooting

### Error: "Can't reach database server"

**Causas comunes:**
- Firewall bloqueando el puerto
- Host o puerto incorrectos
- Base de datos no está ejecutándose

**Solución:**
1. Verifica que el servidor de BD esté activo
2. Confirma que el puerto está abierto en el firewall
3. Prueba la conexión con `telnet` o `psql`

### Error: "Authentication failed"

**Causas comunes:**
- Usuario o contraseña incorrectos
- Usuario no tiene permisos
- Método de autenticación no soportado

**Solución:**
1. Verifica las credenciales
2. Confirma que el usuario tiene permisos: `GRANT ALL PRIVILEGES ON DATABASE nombre_bd TO usuario;`
3. Revisa el método de autenticación en `pg_hba.conf`

### Error: "SSL connection required"

**Solución:**
Agrega el parámetro SSL a la URL:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public&sslmode=require"
```

### Error: "Database does not exist"

**Solución:**
Crea la base de datos manualmente:
```sql
CREATE DATABASE nombre_bd;
```

## 📊 Monitoreo

### Verificar Conexiones Activas

```sql
SELECT count(*) FROM pg_stat_activity WHERE datname = 'nombre_bd';
```

### Ver Queries Lentas

```sql
SELECT pid, now() - pg_stat_activity.query_start AS duration, query 
FROM pg_stat_activity 
WHERE state = 'active' AND now() - pg_stat_activity.query_start > interval '5 seconds';
```

## 🔄 Migración desde Docker

Si anteriormente usabas Docker y quieres migrar los datos:

### 1. Exportar datos desde Docker

```bash
docker exec -t gdi-postgres-16 pg_dump -U postgres gdi_db > backup.sql
```

### 2. Importar a la nueva base de datos

```bash
psql "postgresql://usuario:contraseña@host:puerto/nombre_bd" < backup.sql
```

### 3. Actualizar configuración

Actualiza el archivo `server/.env` con la nueva URL de conexión.

## 📝 Notas Adicionales

- **Backups**: Asegúrate de tener un sistema de backups configurado en tu servidor de base de datos
- **Escalabilidad**: Considera usar réplicas de lectura para mejorar el rendimiento
- **Mantenimiento**: Programa tareas de mantenimiento (VACUUM, ANALYZE) regularmente
- **Monitoreo**: Implementa alertas para monitorear el estado de la base de datos

## 🆘 Soporte

Si encuentras problemas, verifica:
1. Los logs del servidor: `cd server && npm run dev` (modo desarrollo)
2. Los logs de PostgreSQL en tu servidor
3. La documentación de Prisma: https://www.prisma.io/docs
