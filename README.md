# 📊 GDI DOCU - Sistema de Gestión Documental y Correspondencia

Sistema completo de gestión documental, correspondencia y archivo construido con arquitectura multi-tenant.

**Versión:** 1.0.0  
**Última actualización:** 2025-10-11

## ✅ Módulos Completados

1. **Companies**
2. **Areas** - Departamentos con asignación de usuarios
3. **Retentions** - Tablas de retención documental (TRD)
4. **Correspondence Types** - Tipos de correspondencia
5. **Templates** - Plantillas con 14 helpers dinámicos
6. **Proceedings** - Expedientes documentales

## 🚀 Características principales
- ✅ **Multi-tenant robusto** - Aislamiento completo de datos
- ✅ **Sistema de helpers dinámicos** - 14 helpers para plantillas
- ✅ **Gestión documental completa** - TRD, expedientes, series/subseries
- ✅ **Autenticación JWT** - Segura y escalable
- ✅ **UI/UX profesional** - Material UI con filtros en cascada
- ✅ **API RESTful** - 42+ endpoints documentados
- ✅ **Soft delete** - Preservación de datos para auditoría
- ✅ **Validaciones robustas** - Frontend y backend

## 🚀 Stack Tecnológico

{{ ... }}
- **React** con Vite
- **React Router DOM** para enrutamiento
- **Material UI** + **Tailwind CSS** para UI
- **Formik** + **Yup** para formularios y validación
- **Jest** + **React Testing Library** para testing

### Backend
- **Node.js** + **Express**
- **PostgreSQL** con **Prisma ORM**
- **JWT** para autenticación (con refresh token)
- **Swagger** para documentación API
- **Jest** + **Supertest** para testing

## 📁 Estructura del Proyecto

```
/project-root
├── /client/          # Frontend React
├── /server/          # Backend Node.js
├── /docs/            # Documentación
├── /tests/           # Tests integración
├── .env              # Variables de entorno
└── package.json      # Scripts raíz
```

## 🛠️ Instalación

### 1. Clonar e instalar dependencias

```bash
npm run install:all
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env` y configura tus valores:

```bash
cp .env.example .env
```

### 3. Configurar base de datos

Asegúrate de tener PostgreSQL instalado y ejecutándose.

```bash
# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# (Opcional) Abrir Prisma Studio
npm run prisma:studio
```

## 🚀 Desarrollo

### Ejecutar en modo desarrollo (cliente + servidor)

```bash
npm run dev
```

- **Cliente**: http://localhost:5173
- **Servidor**: http://localhost:5000
- **API Docs**: http://localhost:5000/api-docs

### Ejecutar solo cliente

```bash
npm run dev:client
```

```bash
npm run dev:server
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Solo tests del cliente
npm run test:client

# Solo tests del servidor
npm run test:server
```

## 📚 Documentación

Consulta la carpeta `/docs` para más información:

- [Arquitectura](./docs/architecture.md)
- [Configuración inicial](./docs/setup.md)
- [Referencia API](./docs/api-reference.md)
- [Módulos](./docs/modules.md)

## 🔐 Autenticación

El proyecto incluye autenticación JWT con refresh token:

- **Login**: `POST /api/auth/login`
- **Register**: `POST /api/auth/register`
- **Refresh Token**: `POST /api/auth/refresh`

## 📦 Build para Producción

```bash
npm run build
```

## 🤝 Contribuir

1. Crea una rama para tu feature
2. Implementa tus cambios
3. Asegúrate de que los tests pasen
4. Crea un Pull Request

## 📄 Licencia

MIT
