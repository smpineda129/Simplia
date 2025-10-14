# 🚀 Quick Start Guide - GDI Monolith

## ✅ Pasos Completados

1. ✅ Estructura de proyecto creada
2. ✅ Dependencias instaladas
3. ✅ Prisma Client generado
4. ✅ Variables de entorno configuradas (`.env`)

## 📋 Próximos Pasos

### 1. Configurar PostgreSQL

**Opción A: PostgreSQL ya instalado**
```bash
createdb gdi_db
```

**Opción B: Usar Docker**
```bash
docker run --name gdi-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=gdi_db \
  -p 5432:5432 \
  -d postgres:14
```

Si usas Docker, actualiza `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gdi_db?schema=public"
```

### 2. Ejecutar Migraciones

```bash
npm run prisma:migrate
```

### 3. Poblar Base de Datos

```bash
npm run prisma:seed
```

### 4. Iniciar el Proyecto

```bash
npm run dev
```

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Swagger Docs**: http://localhost:5000/api-docs
- **Prisma Studio**: `npm run prisma:studio`

## 🔑 Credenciales

| Usuario | Email | Password | Permisos |
|---------|-------|----------|----------|
| Admin | admin@gdi.com | admin123 | Todos |
| Manager | manager@gdi.com | manager123 | Lectura/Escritura |
| User | user@gdi.com | user123 | Solo lectura |

## 📦 Módulos Disponibles

### 1. Dashboard (`/dashboard`)
- Vista general del sistema
- Estadísticas en tiempo real
- Acceso rápido a módulos

### 2. Usuarios (`/users`)
- ✅ Listar usuarios
- ✅ Crear usuario (Admin)
- ✅ Editar usuario
- ✅ Eliminar usuario (Admin)
- ✅ Validaciones con Yup
- ✅ Tests incluidos

### 3. Inventario (`/inventory`)
- ✅ Listar items
- ✅ Crear item
- ✅ Editar item
- ✅ Eliminar item
- ✅ Búsqueda por nombre
- ✅ Filtros por categoría
- ✅ Tests incluidos

### 4. Reportes (`/reports`)
- ✅ Dashboard con gráficos
- ✅ Estadísticas de usuarios
- ✅ Estadísticas de inventario
- ✅ Gráficos con Recharts
- ✅ Tests incluidos

## 🧪 Testing

### Backend
```bash
cd server
npm test
```

### Frontend
```bash
cd client
npm test
```

## 📁 Estructura del Proyecto

```
GDI/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── modules/       # Módulos de negocio
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── inventory/
│   │   │   └── reports/
│   │   ├── components/    # Componentes compartidos
│   │   ├── layouts/       # Layouts
│   │   └── api/           # Configuración Axios
│   └── package.json
│
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── modules/       # Módulos de negocio
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── inventory/
│   │   │   └── reports/
│   │   ├── middlewares/   # Middlewares
│   │   ├── config/        # Configuración
│   │   └── db/            # Prisma
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── package.json
│
├── docs/                  # Documentación
├── .env                   # Variables de entorno
└── package.json           # Scripts raíz
```

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Cliente + Servidor
npm run dev:client       # Solo cliente
npm run dev:server       # Solo servidor

# Prisma
npm run prisma:generate  # Generar cliente
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:seed      # Poblar base de datos
npm run prisma:studio    # GUI de base de datos

# Testing
npm test                 # Todos los tests
npm run test:client      # Tests del cliente
npm run test:server      # Tests del servidor

# Build
npm run build            # Build del cliente
```

## 🎯 Características Implementadas

### Backend
- ✅ Express + Node.js
- ✅ PostgreSQL + Prisma ORM
- ✅ JWT Authentication (Access + Refresh tokens)
- ✅ Validaciones con express-validator
- ✅ Swagger/OpenAPI documentation
- ✅ Tests con Jest + Supertest
- ✅ Arquitectura modular
- ✅ Manejo de errores centralizado

### Frontend
- ✅ React 18 + Vite
- ✅ Material UI (Dark mode)
- ✅ Tailwind CSS
- ✅ React Router DOM
- ✅ Formik + Yup validations
- ✅ Axios con interceptors
- ✅ Context API para auth
- ✅ Tests con React Testing Library
- ✅ Recharts para gráficos
- ✅ Responsive design

## 📊 Datos de Ejemplo

Después del seed tendrás:
- **3 usuarios** con diferentes roles
- **10 items de inventario** en 5 categorías:
  - Electrónica
  - Accesorios
  - Audio
  - Almacenamiento
  - Redes
  - Oficina

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"
```bash
# Verifica que PostgreSQL esté corriendo
pg_isready

# O si usas Docker
docker ps | grep postgres
```

### Error: "Port 5000 already in use"
Cambia el puerto en `.env`:
```env
PORT=3000
```

### Error: "Prisma Client not generated"
```bash
npm run prisma:generate
```

## 📚 Documentación Completa

- [INSTALLATION.md](./INSTALLATION.md) - Guía detallada de instalación
- [docs/architecture.md](./docs/architecture.md) - Arquitectura del proyecto
- [docs/api-reference.md](./docs/api-reference.md) - Referencia de API
- [docs/modules.md](./docs/modules.md) - Guía de módulos
- [README.md](./README.md) - Documentación general

## 🎉 ¡Listo!

Tu proyecto monolito está completamente configurado y listo para desarrollo.

**Siguiente paso**: Ejecuta `npm run dev` y accede a http://localhost:5173

¡Happy coding! 🚀
