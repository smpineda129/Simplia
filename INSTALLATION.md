# Guía de Instalación y Configuración

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
# Instalar dependencias del proyecto completo
npm run install:all
```

### 2. Configurar Variables de Entorno

El archivo `.env` ya está creado. Actualiza la URL de la base de datos si es necesario:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/gdi_db?schema=public"
```

### 3. Configurar Base de Datos PostgreSQL

#### Opción A: PostgreSQL Local

```bash
# Crear la base de datos
createdb gdi_db

# O usando psql
psql -U postgres
CREATE DATABASE gdi_db;
\q
```

#### Opción B: PostgreSQL con Docker

```bash
docker run --name gdi-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=gdi_db \
  -p 5432:5432 \
  -d postgres:14
```

Actualiza el `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gdi_db?schema=public"
```

### 4. Ejecutar Migraciones de Prisma

```bash
# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate
```

### 5. Poblar Base de Datos (Seed)

```bash
npm run prisma:seed
```

Esto creará:
- **3 usuarios** (admin, manager, user)
- **10 items de inventario** de ejemplo

### 6. Ejecutar el Proyecto

```bash
# Ejecutar cliente y servidor en paralelo
npm run dev
```

Accede a:
- **Cliente**: http://localhost:5173
- **Servidor**: http://localhost:5000
- **API Docs**: http://localhost:5000/api-docs

## 🔑 Credenciales de Acceso

Después del seed, puedes usar estas credenciales:

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@gdi.com | admin123 |
| Manager | manager@gdi.com | manager123 |
| User | user@gdi.com | user123 |

## 📦 Módulos Disponibles

### 1. **Users** (`/users`)
- Listar usuarios
- Crear nuevo usuario (solo ADMIN)
- Editar usuario
- Eliminar usuario (solo ADMIN)

### 2. **Inventory** (`/inventory`)
- Listar items del inventario
- Crear nuevo item
- Editar item
- Eliminar item
- Buscar por nombre

### 3. **Reports** (`/reports`)
- Dashboard con estadísticas
- Gráficos de distribución
- Resumen de usuarios e inventario

## 🧪 Testing

### Backend Tests

```bash
cd server
npm test
```

Tests disponibles:
- `auth.test.js` - Autenticación
- `user.test.js` - Módulo de usuarios
- `inventory.test.js` - Módulo de inventario
- `reports.test.js` - Módulo de reportes

### Frontend Tests

```bash
cd client
npm test
```

## 🛠️ Comandos Útiles

### Prisma

```bash
# Ver base de datos en GUI
npm run prisma:studio

# Resetear base de datos (¡CUIDADO!)
cd server
npx prisma migrate reset

# Crear nueva migración
cd server
npx prisma migrate dev --name nombre_migracion
```

### Desarrollo

```bash
# Solo cliente
npm run dev:client

# Solo servidor
npm run dev:server

# Build del cliente
npm run build
```

## 🔧 Solución de Problemas

### Error: "Cannot find module 'vite'"

```bash
cd client
npm install
```

### Error: "Cannot find module 'nodemon'"

```bash
cd server
npm install
```

### Error de conexión a PostgreSQL

1. Verifica que PostgreSQL esté ejecutándose
2. Confirma las credenciales en `.env`
3. Asegúrate de que la base de datos `gdi_db` exista

### Puerto ya en uso

Cambia el puerto en `.env`:

```env
PORT=3000  # En lugar de 5000
```

Y actualiza `CLIENT_URL` si es necesario.

## 📚 Estructura de Módulos

Cada módulo sigue esta estructura:

### Backend
```
/server/src/modules/[nombre]/
├── [nombre].service.js      # Lógica de negocio
├── [nombre].controller.js   # Controladores HTTP
├── [nombre].routes.js       # Definición de rutas
├── [nombre].validation.js   # Validaciones
└── tests/
    └── [nombre].test.js     # Tests
```

### Frontend
```
/client/src/modules/[nombre]/
├── components/              # Componentes del módulo
├── forms/                   # Formularios
├── pages/                   # Páginas/vistas
├── services/                # Llamadas a API
├── schemas/                 # Validaciones Yup
└── index.jsx                # Exportaciones
```

## 🎯 Próximos Pasos

1. Personaliza los módulos según tus necesidades
2. Agrega más validaciones
3. Implementa paginación en las tablas
4. Agrega filtros avanzados
5. Implementa exportación de reportes (PDF, Excel)
6. Agrega notificaciones en tiempo real
7. Implementa carga de archivos

## 📖 Documentación Adicional

- [Arquitectura](./docs/architecture.md)
- [API Reference](./docs/api-reference.md)
- [Guía de Módulos](./docs/modules.md)
- [Setup](./docs/setup.md)

## 🤝 Contribuir

1. Crea una rama para tu feature
2. Implementa tus cambios
3. Asegúrate de que los tests pasen
4. Documenta los cambios
5. Crea un Pull Request

## 📄 Licencia

MIT
