# 🚀 Guía de Inicio Rápido - Sistema GDI DOCU

**Última actualización:** 2025-10-11

---

## ⚡ Inicio Rápido (5 minutos)

### 1. Iniciar PostgreSQL (Docker)

```bash
cd /Users/mac/Documents/GDI
./start-postgres.sh
```

Espera a ver: `✅ PostgreSQL está corriendo!`

---

### 2. Iniciar Backend

```bash
cd server
npm run dev
```

Espera a ver: `✅ Base de datos conectada correctamente`

El servidor estará en: **http://localhost:3000**

---

### 3. Iniciar Frontend (Nueva terminal)

```bash
cd client
npm run dev
```

El frontend estará en: **http://localhost:5173**

---

### 4. Acceder al Sistema

Abre tu navegador en: **http://localhost:5173**

**Credenciales:**
```
Admin:   admin@gdi.com / admin123
Manager: manager@gdi.com / manager123
User:    user@gdi.com / user123
```

---

## 🔧 Comandos Útiles

### Backend (desde /server)

```bash
# Generar cliente de Prisma
npm run prisma:generate

# Crear migración
npm run prisma:migrate

# Ejecutar seed
npm run prisma:seed

# Ver base de datos (Prisma Studio)
npx prisma studio

# Reiniciar base de datos (⚠️ BORRA TODO)
npx prisma migrate reset --force
```

### Frontend (desde /client)

```bash
# Iniciar desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

---

## 📊 Módulos Disponibles

Una vez dentro del sistema, puedes acceder a:

1. **Dashboard** - Vista general
2. **Empresas** - Gestión de empresas (multi-tenant)
3. **Áreas** - Departamentos
4. **Retención** - Tablas de retención documental
5. **Tipos Corresp.** - Tipos de correspondencia
6. **Plantillas** - Plantillas con helpers dinámicos
7. **Expedientes** - Gestión de expedientes
8. **Usuarios** - Gestión de usuarios
9. **Inventario** - Gestión de inventario (demo)
10. **Reportes** - Reportes y estadísticas

---

## 🔍 Verificar que Todo Funciona

### 1. Health Check del Backend

```bash
curl http://localhost:3000/api/health
```

Deberías ver:
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2025-10-11T..."
}
```

### 2. Verificar Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gdi.com","password":"admin123"}'
```

Deberías recibir un token JWT.

### 3. Verificar Frontend

Abre: http://localhost:5173

Deberías ver la página de login.

---

## 🐛 Solución de Problemas

### Puerto 3000 ocupado

```bash
# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9

# Reiniciar backend
cd server && npm run dev
```

### Puerto 5432 ocupado (PostgreSQL)

```bash
# Matar proceso en puerto 5432
lsof -ti:5432 | xargs kill -9

# Reiniciar PostgreSQL
./start-postgres.sh
```

### Error de conexión a base de datos

```bash
# Verificar que Docker está corriendo
docker ps

# Verificar que el contenedor existe
docker ps -a | grep gdi-postgres

# Reiniciar contenedor
docker restart gdi-postgres
```

### Error "Prisma Client not generated"

```bash
cd server
npx prisma generate
```

### Base de datos vacía

```bash
cd server
npx prisma migrate dev
npx prisma db seed
```

---

## 📁 Estructura del Proyecto

```
GDI/
├── server/               # Backend (Node.js + Express + Prisma)
│   ├── src/
│   │   ├── modules/     # Módulos (Companies, Areas, etc.)
│   │   ├── middlewares/ # Auth, validaciones
│   │   └── routes/      # Rutas API
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seeds/
│   └── package.json
│
├── client/              # Frontend (React + Material UI)
│   ├── src/
│   │   ├── modules/     # Módulos (Companies, Areas, etc.)
│   │   ├── layouts/     # Layouts (Main, Auth)
│   │   ├── context/     # Context API (Auth)
│   │   └── api/         # Axios config
│   └── package.json
│
├── docs/                # Documentación
└── *.md                 # Guías y documentación
```

---

## 🔑 Variables de Entorno

### Backend (.env en /server)

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gdi_db?schema=public"
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
NODE_ENV=development
```

### Frontend (.env en /client)

```env
VITE_API_URL=http://localhost:3000/api
```

---

## 📚 Documentación Disponible

- `EXECUTIVE_SUMMARY.md` - Resumen ejecutivo del proyecto
- `PROJECT_STATUS.md` - Estado actual del proyecto
- `FINAL_SESSION_SUMMARY.md` - Resumen de la sesión
- `MODULES_ROADMAP.md` - Roadmap de módulos
- `QUICK_START_GUIDE.md` - Esta guía
- `INSTALLATION.md` - Guía de instalación detallada
- `*_MODULE_COMPLETE.md` - Documentación de cada módulo

---

## 🎯 Flujo de Trabajo Típico

### 1. Crear una Empresa

1. Login como admin
2. Ir a **Empresas**
3. Click en "Nueva Empresa"
4. Llenar formulario
5. Guardar

### 2. Crear Áreas

1. Ir a **Áreas**
2. Click en "Nueva Área"
3. Seleccionar empresa
4. Ingresar nombre y código
5. Guardar

### 3. Crear Tabla de Retención

1. Ir a **Retención**
2. Click en "Nueva Tabla de Retención"
3. Seleccionar empresa y área
4. Llenar datos
5. Guardar

### 4. Crear Expediente

1. Ir a **Expedientes**
2. Click en "Nuevo Expediente"
3. Seleccionar empresa
4. Seleccionar tabla de retención
5. Llenar datos
6. Guardar

### 5. Crear Plantilla

1. Ir a **Plantillas**
2. Click en "Nueva Plantilla"
3. Seleccionar empresa
4. Expandir "Helpers Disponibles"
5. Click en helpers para insertar
6. Escribir contenido
7. Guardar

---

## 🔄 Actualizar el Proyecto

### Actualizar Dependencias

```bash
# Backend
cd server
npm update

# Frontend
cd client
npm update
```

### Crear Nueva Migración

```bash
cd server

# 1. Modificar prisma/schema.prisma
# 2. Crear migración
npx prisma migrate dev --name nombre_de_tu_migracion

# 3. Generar cliente
npx prisma generate
```

---

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

---

## 📊 Monitoreo

### Ver logs del backend

Los logs aparecen en la terminal donde ejecutaste `npm run dev`

### Prisma Studio (GUI para la BD)

```bash
cd server
npx prisma studio
```

Abre: http://localhost:5555

---

## 🚀 Deployment (Futuro)

### Backend

1. Configurar variables de entorno en producción
2. Cambiar `DATABASE_URL` a AWS RDS
3. Ejecutar migraciones: `npx prisma migrate deploy`
4. Iniciar con: `npm start`

### Frontend

1. Build: `npm run build`
2. Servir carpeta `dist/`
3. Configurar `VITE_API_URL` a URL de producción

---

## 📞 Soporte

Si encuentras algún problema:

1. Revisa esta guía
2. Revisa `INSTALLATION.md`
3. Revisa la documentación del módulo específico
4. Verifica los logs de la terminal

---

## ✅ Checklist de Inicio

- [ ] Docker Desktop está corriendo
- [ ] PostgreSQL está corriendo (puerto 5432)
- [ ] Backend está corriendo (puerto 3000)
- [ ] Frontend está corriendo (puerto 5173)
- [ ] Puedes hacer login
- [ ] Puedes ver el dashboard

---

**¡Listo para desarrollar!** 🎉

Si todo está ✅, el sistema está funcionando correctamente.
