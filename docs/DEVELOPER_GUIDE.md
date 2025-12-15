# Guía del Desarrollador - Sistema GDI

## 📋 Índice

1. [Introducción al Proyecto](#introducción-al-proyecto)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Configuración del Entorno](#configuración-del-entorno)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Módulos del Sistema](#módulos-del-sistema)
7. [Base de Datos](#base-de-datos)
8. [API y Endpoints](#api-y-endpoints)
9. [Autenticación y Autorización](#autenticación-y-autorización)
10. [Flujos de Trabajo Principales](#flujos-de-trabajo-principales)
11. [Desarrollo Frontend](#desarrollo-frontend)
12. [Desarrollo Backend](#desarrollo-backend)
13. [Testing](#testing)
14. [Despliegue](#despliegue)
15. [Mejores Prácticas](#mejores-prácticas)

---

## 🎯 Introducción al Proyecto

**GDI (Gestión Documental Integral)** es un sistema completo de gestión documental empresarial que permite:

- Gestión de correspondencia con radicados automáticos
- Administración de expedientes y archivos físicos
- Control de retención documental
- Gestión de bodegas y ubicaciones físicas
- Sistema de plantillas dinámicas
- Control de acceso basado en roles y permisos
- Multi-tenancy (múltiples empresas)

### Características Principales

- ✅ **Multi-tenant**: Soporte para múltiples empresas
- ✅ **RBAC**: Sistema robusto de roles y permisos
- ✅ **Radicados Automáticos**: Generación automática de números de radicado
- ✅ **Trazabilidad**: Auditoría completa de todas las operaciones
- ✅ **Gestión Física y Digital**: Control de documentos físicos y digitales
- ✅ **Plantillas Dinámicas**: Sistema de templates con helpers personalizados
- ✅ **API RESTful**: API completa documentada con Swagger

---

## 🏗️ Arquitectura del Sistema

### Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                     GDI MONOLITH                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐         ┌──────────────────┐        │
│  │   Frontend       │◄───────►│    Backend       │        │
│  │   React + Vite   │  REST   │  Node.js/Express │        │
│  │   Port: 5173     │         │    Port: 5000    │        │
│  └──────────────────┘         └─────────┬────────┘        │
│                                          │                  │
│                                          ▼                  │
│                               ┌──────────────────┐         │
│                               │   PostgreSQL     │         │
│                               │   (Prisma ORM)   │         │
│                               └──────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### Patrón de Arquitectura

El backend sigue una arquitectura en capas:

```
┌─────────────────────────────────────────┐
│           Routes Layer                  │  ← Define endpoints
├─────────────────────────────────────────┤
│        Validation Layer                 │  ← Valida entrada
├─────────────────────────────────────────┤
│        Controller Layer                 │  ← Maneja HTTP
├─────────────────────────────────────────┤
│         Service Layer                   │  ← Lógica de negocio
├─────────────────────────────────────────┤
│       Data Access Layer                 │  ← Prisma ORM
├─────────────────────────────────────────┤
│          Database                       │  ← PostgreSQL
└─────────────────────────────────────────┘
```

---

## 💻 Stack Tecnológico

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18+ | Runtime de JavaScript |
| **Express** | 4.x | Framework web |
| **Prisma** | 5.x | ORM para PostgreSQL |
| **PostgreSQL** | 14+ | Base de datos relacional |
| **JWT** | - | Autenticación |
| **bcryptjs** | - | Hash de contraseñas |
| **express-validator** | - | Validación de datos |
| **Swagger/OpenAPI** | 3.0 | Documentación de API |
| **Morgan** | - | Logging HTTP |

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.x | Biblioteca UI |
| **Vite** | 4.x | Build tool y dev server |
| **React Router** | 6.x | Enrutamiento SPA |
| **Material-UI** | 5.x | Componentes UI |
| **Tailwind CSS** | 3.x | Utilidades CSS |
| **Formik** | - | Manejo de formularios |
| **Yup** | - | Validación de esquemas |
| **Axios** | - | Cliente HTTP |

---

## ⚙️ Configuración del Entorno

### Requisitos Previos

- Node.js 18 o superior
- npm 9 o superior
- PostgreSQL 14 o superior
- Git

### Instalación Paso a Paso

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd GDI

# 2. Instalar dependencias
npm run install:all

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 4. Configurar base de datos
# Crear la base de datos en PostgreSQL
createdb gdi_db

# 5. Ejecutar migraciones
npm run prisma:migrate

# 6. (Opcional) Poblar con datos de prueba
npm run prisma:seed

# 7. Ejecutar en modo desarrollo
npm run dev
```

### Variables de Entorno Importantes

```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/gdi_db"

# JWT
JWT_SECRET="tu-clave-secreta-muy-segura"
JWT_REFRESH_SECRET="tu-clave-refresh-muy-segura"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development

# Client
CLIENT_URL="http://localhost:5173"
```

---

## 📁 Estructura del Proyecto

```
GDI/
├── client/                    # Aplicación React
│   ├── public/               # Archivos estáticos
│   └── src/ 
│       ├── api/              # Configuración Axios
│       ├── assets/           # Imágenes, fuentes
│       ├── components/       # Componentes compartidos
│       ├── context/          # React Context
│       ├── hooks/            # Custom hooks
│       ├── layouts/          # Layouts de página
│       ├── modules/          # Módulos de negocio
│       │   ├── auth/
│       │   ├── dashboard/
│       │   └── ...
│       ├── routes/           # Configuración de rutas
│       ├── styles/           # Estilos globales
│       ├── utils/            # Utilidades
│       ├── App.jsx           # Componente raíz
│       └── main.jsx          # Entry point
│
├── server/                   # API Express
│   ├── prisma/
│   │   ├── schema.prisma    # Esquema de base de datos
│   │   └── seed.js          # Datos iniciales
│   └── src/
│       ├── config/          # Configuraciones
│       │   ├── env.js
│       │   ├── cors.js
│       │   └── swagger.js
│       ├── db/              # Conexión a DB
│       │   └── prisma.js
│       ├── middlewares/     # Middlewares Express
│       │   ├── auth.js
│       │   ├── validate.js
│       │   ├── errorHandler.js
│       │   └── notFound.js
│       ├── modules/         # Módulos de negocio
│       │   ├── auth/
│       │   ├── users/
│       │   ├── companies/
│       │   ├── areas/
│       │   ├── correspondences/
│       │   ├── documents/
│       │   ├── proceedings/
│       │   ├── templates/
│       │   ├── retentions/
│       │   ├── entities/
│       │   ├── warehouses/
│       │   ├── roles/
│       │   └── permissions/
│       ├── routes/          # Enrutador principal
│       │   └── index.js
│       ├── services/        # Servicios compartidos
│       │   └── tokenService.js
│       ├── utils/           # Utilidades
│       │   ├── ApiError.js
│       │   └── asyncHandler.js
│       ├── app.js           # Configuración Express
│       └── server.js        # Entry point
│
├── docs/                    # Documentación
│   ├── DEVELOPER_GUIDE.md   # Esta guía
│   ├── api-reference.md     # Referencia de API
│   ├── architecture.md      # Arquitectura
│   ├── database-setup.md    # Configuración de BD
│   └── modules.md           # Guía de módulos
│
├── .env                     # Variables de entorno
├── .env.example             # Ejemplo de variables
├── package.json             # Scripts y dependencias
└── README.md                # Documentación principal
```

---

## 🧩 Módulos del Sistema

### 1. Autenticación (Auth)

**Propósito**: Gestión de autenticación y sesiones de usuario.

**Endpoints principales**:
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/logout` - Cerrar sesión

**Archivos**:
- `server/src/modules/auth/`
- `client/src/modules/auth/`

### 2. Usuarios (Users)

**Propósito**: Gestión de usuarios del sistema.

**Endpoints principales**:
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `POST /api/users` - Crear usuario (ADMIN)
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (ADMIN)
- `GET /api/users/:userId/roles` - Obtener roles del usuario
- `POST /api/users/:userId/roles` - Asignar rol
- `GET /api/users/:userId/permissions` - Obtener permisos

### 3. Empresas (Companies)

**Propósito**: Gestión multi-tenant de empresas.

**Endpoints principales**:
- `GET /api/companies` - Listar empresas
- `GET /api/companies/:id` - Obtener empresa
- `POST /api/companies` - Crear empresa
- `PUT /api/companies/:id` - Actualizar empresa
- `DELETE /api/companies/:id` - Eliminar empresa
- `GET /api/companies/:id/stats` - Estadísticas de empresa

**Campos importantes**:
- `name`: Nombre de la empresa
- `identifier`: NIT o identificador fiscal
- `short`: Nombre corto
- `maxUsers`: Límite de usuarios
- `email`: Email de contacto

### 4. Áreas (Areas)

**Propósito**: Gestión de departamentos/áreas dentro de empresas.

**Endpoints principales**:
- `GET /api/areas` - Listar áreas
- `POST /api/areas` - Crear área
- `PUT /api/areas/:id` - Actualizar área
- `DELETE /api/areas/:id` - Eliminar área
- `POST /api/areas/:id/users` - Asignar usuarios al área
- `DELETE /api/areas/:id/users/:userId` - Remover usuario

### 5. Correspondencia (Correspondences)

**Propósito**: Gestión de correspondencia con radicados automáticos.

**Características**:
- Radicados de entrada y salida automáticos
- Tracking number único
- Estados: registered, in_transit, delivered
- Prioridades: low, medium, high, urgent
- Hilos de conversación (threads)
- Adjuntos

**Endpoints principales**:
- `GET /api/correspondences` - Listar correspondencias
- `GET /api/correspondences/stats` - Estadísticas
- `POST /api/correspondences` - Crear correspondencia
- `POST /api/correspondences/:id/threads` - Crear hilo
- `POST /api/correspondences/:id/respond` - Responder
- `POST /api/correspondences/:id/mark-delivered` - Marcar como entregada

### 6. Documentos (Documents)

**Propósito**: Gestión de documentos digitales y físicos.

**Características**:
- Almacenamiento de archivos
- Metadatos JSON
- Extracción de texto (OCR)
- Vinculación con entidades
- Contador de vistas

**Endpoints principales**:
- `GET /api/documents` - Listar documentos
- `POST /api/documents` - Crear documento
- `PUT /api/documents/:id` - Actualizar documento
- `DELETE /api/documents/:id` - Eliminar documento

### 7. Expedientes (Proceedings)

**Propósito**: Gestión de expedientes/carpetas documentales.

**Características**:
- Código único de expediente
- Fechas de inicio y fin
- Vinculación con tablas de retención
- Estados de préstamo: custody, loan, returned
- Hilos de seguimiento
- Vinculación con cajas físicas

**Endpoints principales**:
- `GET /api/proceedings` - Listar expedientes
- `POST /api/proceedings` - Crear expediente
- `PUT /api/proceedings/:id` - Actualizar expediente

### 8. Plantillas (Templates)

**Propósito**: Sistema de plantillas dinámicas para generación de documentos.

**Características**:
- Helpers dinámicos personalizados
- Procesamiento de plantillas con datos
- Sintaxis Handlebars

**Endpoints principales**:
- `GET /api/templates` - Listar plantillas
- `GET /api/templates/helpers` - Obtener helpers disponibles
- `POST /api/templates` - Crear plantilla
- `POST /api/templates/:id/process` - Procesar plantilla con datos

### 9. Retenciones (Retentions)

**Propósito**: Gestión de tablas de retención documental (TRD).

**Características**:
- Tablas de retención por área
- Líneas de retención con series y subseries
- Tiempos de retención local y central
- Disposiciones finales (CT, E, M, D, S)

**Endpoints principales**:
- `GET /api/retentions` - Listar TRD
- `POST /api/retentions` - Crear TRD
- `GET /api/retentions/:id/lines` - Obtener líneas de retención
- `POST /api/retentions/:id/lines` - Crear línea de retención

### 10. Entidades (Entities)

**Propósito**: Gestión de entidades externas (personas, empresas).

**Endpoints principales**:
- `GET /api/entities` - Listar entidades
- `POST /api/entities` - Crear entidad
- `PUT /api/entities/:id` - Actualizar entidad

### 11. Bodegas (Warehouses)

**Propósito**: Gestión de ubicaciones físicas de almacenamiento.

**Características**:
- Bodegas con código único
- Cajas con ubicación (isla, estantería, estante)
- Vinculación de cajas con expedientes

**Endpoints principales**:
- `GET /api/warehouses` - Listar bodegas
- `POST /api/warehouses` - Crear bodega
- `GET /api/warehouses/boxes` - Listar cajas
- `POST /api/warehouses/boxes` - Crear caja

### 12. Roles y Permisos

**Propósito**: Sistema RBAC (Role-Based Access Control).

**Características**:
- Roles con niveles de jerarquía
- Permisos granulares
- Asignación de permisos a roles
- Asignación de roles a usuarios

**Endpoints principales**:
- `GET /api/roles` - Listar roles
- `POST /api/roles` - Crear rol
- `GET /api/roles/:id/permissions` - Obtener permisos del rol
- `POST /api/roles/:id/permissions/sync` - Sincronizar permisos
- `GET /api/permissions` - Listar permisos
- `GET /api/permissions/grouped` - Permisos agrupados

---

## 🗄️ Base de Datos

### Modelos Principales

#### User
```prisma
model User {
  id              BigInt
  name            String
  email           String
  password        String
  role            String?
  companyId       BigInt?
  phone           String?
  signature       String?
  // ... relaciones
}
```

#### Company
```prisma
model Company {
  id              BigInt
  name            String
  identifier      String
  short           String
  email           String?
  maxUsers        Int
  // ... relaciones
}
```

#### Correspondence
```prisma
model Correspondence {
  id                  BigInt
  title               String
  in_settled          String      // Radicado entrada
  out_settled         String?     // Radicado salida
  status              String      // registered, in_transit, delivered
  tracking_number     String?     // Número de seguimiento único
  priority            String?     // low, medium, high, urgent
  sender_id           BigInt?
  recipient_id        BigInt?
  origin_area_id      BigInt?
  destination_area_id BigInt?
  // ... más campos
}
```

#### Proceeding
```prisma
model Proceeding {
  id              BigInt
  name            String
  code            String
  startDate       DateTime
  endDate         DateTime?
  loan            String      // custody, loan, returned
  retentionLineId BigInt?
  // ... relaciones
}
```

### Relaciones Importantes

- **User** ↔ **Company**: Muchos a uno (multi-tenant)
- **User** ↔ **Area**: Muchos a muchos (a través de AreaUser)
- **Correspondence** ↔ **User**: Sender y Recipient
- **Correspondence** ↔ **Area**: Origin y Destination
- **Proceeding** ↔ **RetentionLine**: Muchos a uno
- **Proceeding** ↔ **Box**: Muchos a muchos
- **Document** ↔ **Proceeding**: Muchos a muchos

---

## 🔌 API y Endpoints

### Autenticación

Todos los endpoints (excepto `/api/auth/login` y `/api/auth/register`) requieren autenticación JWT.

**Header requerido**:
```
Authorization: Bearer <access_token>
```

### Estructura de Respuestas

**Éxito**:
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { ... }
}
```

**Error**:
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [ ... ]
}
```

### Paginación

Endpoints que retornan listas soportan paginación:

**Query params**:
- `page`: Número de página (default: 1)
- `limit`: Items por página (default: 10)
- `search`: Búsqueda de texto

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

### Documentación Interactiva

Swagger UI disponible en: `http://localhost:5000/api-docs`

---

## 🔐 Autenticación y Autorización

### Flujo de Autenticación

```
1. Usuario → POST /api/auth/login (email, password)
2. Servidor valida credenciales
3. Servidor genera:
   - Access Token (15 min)
   - Refresh Token (7 días)
4. Cliente guarda tokens en localStorage
5. Cliente incluye Access Token en cada request
6. Si Access Token expira → POST /api/auth/refresh
7. Servidor retorna nuevo Access Token
```

### Implementación en el Cliente

```javascript
// Configurar interceptor de Axios
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejar token expirado
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Intentar renovar token
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post('/api/auth/refresh', { refreshToken });
      localStorage.setItem('accessToken', response.data.data.accessToken);
      // Reintentar request original
      return axiosInstance(error.config);
    }
    return Promise.reject(error);
  }
);
```

### Sistema de Roles y Permisos

**Roles predefinidos**:
- `ADMIN`: Acceso completo al sistema
- `MANAGER`: Gestión de su área
- `USER`: Usuario estándar

**Middleware de autorización**:
```javascript
// Requiere rol específico
router.delete('/:id', 
  authenticate, 
  authorize('ADMIN'), 
  controller.delete
);
```

---

## 🔄 Flujos de Trabajo Principales

### Flujo de Correspondencia

```
1. Usuario crea correspondencia
   ↓
2. Sistema genera radicado automático (in_settled)
   ↓
3. Se asigna área de destino y destinatario
   ↓
4. Estado: "registered"
   ↓
5. Destinatario recibe notificación
   ↓
6. Destinatario puede:
   - Crear thread de respuesta
   - Marcar como entregada
   - Responder generando nueva correspondencia
   ↓
7. Sistema genera radicado de salida (out_settled)
   ↓
8. Estado: "delivered"
```

### Flujo de Expedientes

```
1. Crear expediente con código único
   ↓
2. Vincular con línea de retención (TRD)
   ↓
3. Agregar documentos al expediente
   ↓
4. Asignar a caja física
   ↓
5. Ubicar caja en bodega (isla/estante)
   ↓
6. Gestionar préstamos:
   - custody → loan → returned
   ↓
7. Aplicar disposición final según TRD
```

---

## 🎨 Desarrollo Frontend

### Estructura de un Módulo

```
modules/[nombre]/
├── components/        # Componentes específicos
├── forms/            # Formularios con Formik
├── pages/            # Páginas/vistas
├── services/         # Llamadas a API
├── schemas/          # Validaciones Yup
└── index.jsx         # Exportaciones
```

### Crear un Nuevo Componente

```jsx
// modules/users/components/UserCard.jsx
import { Card, CardContent, Typography } from '@mui/material';

const UserCard = ({ user }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{user.name}</Typography>
        <Typography color="textSecondary">{user.email}</Typography>
      </CardContent>
    </Card>
  );
};

export default UserCard;
```

### Crear un Formulario

```jsx
// modules/users/forms/UserForm.jsx
import { Formik, Form, Field } from 'formik';
import { TextField, Button } from '@mui/material';
import { userSchema } from '../schemas/userSchema';

const UserForm = ({ initialValues, onSubmit }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={userSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <Field
            as={TextField}
            name="name"
            label="Nombre"
            error={touched.name && Boolean(errors.name)}
            helperText={touched.name && errors.name}
          />
          <Button type="submit" disabled={isSubmitting}>
            Guardar
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;
```

### Servicio de API

```javascript
// modules/users/services/userService.js
import axiosInstance from '../../../api/axiosConfig';

const userService = {
  getAll: async (params) => {
    const response = await axiosInstance.get('/users', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await axiosInstance.post('/users', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },
};

export default userService;
```

---

## ⚙️ Desarrollo Backend

### Estructura de un Módulo

```
modules/[nombre]/
├── [nombre].controller.js   # Controladores HTTP
├── [nombre].service.js      # Lógica de negocio
├── [nombre].routes.js       # Definición de rutas
├── [nombre].validation.js   # Validaciones
└── tests/
    └── [nombre].test.js     # Tests
```

### Crear un Servicio

```javascript
// modules/users/user.service.js
import { prisma } from '../../db/prisma.js';
import { ApiError } from '../../utils/ApiError.js';
import bcrypt from 'bcryptjs';

export const userService = {
  getAll: async (filters = {}) => {
    const { search, page = 1, limit = 10 } = filters;
    
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    } : {};
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);
    
    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
  
  create: async (data) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    
    if (existingUser) {
      throw new ApiError(400, 'El email ya está registrado');
    }
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    
    return user;
  },
};
```

### Crear un Controlador

```javascript
// modules/users/user.controller.js
import { userService } from './user.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const userController = {
  getAll: asyncHandler(async (req, res) => {
    const result = await userService.getAll(req.query);
    
    res.status(200).json({
      success: true,
      data: result,
    });
  }),
  
  create: asyncHandler(async (req, res) => {
    const user = await userService.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: user,
    });
  }),
};
```

### Crear Validaciones

```javascript
// modules/users/user.validation.js
import { body, param, query } from 'express-validator';

export const userValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('El nombre es requerido')
      .isLength({ min: 2 })
      .withMessage('El nombre debe tener al menos 2 caracteres'),
    body('email')
      .isEmail()
      .withMessage('Email inválido')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  
  update: [
    param('id').isInt().withMessage('ID inválido'),
    body('name').optional().trim().isLength({ min: 2 }),
    body('email').optional().isEmail().normalizeEmail(),
  ],
};
```

### Crear Rutas con Swagger

```javascript
// modules/users/user.routes.js
import { Router } from 'express';
import { userController } from './user.controller.js';
import { userValidation } from './user.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate, authorize } from '../../middlewares/auth.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/', userController.getAll);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear nuevo usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado
 */
router.post('/', 
  authorize('ADMIN'), 
  userValidation.create, 
  validate, 
  userController.create
);

export default router;
```

---

## 🧪 Testing

### Tests de Backend

```javascript
// modules/users/tests/user.test.js
import { describe, it, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../../app.js';

describe('Users Module', () => {
  let authToken;
  let userId;
  
  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@gdi.com',
        password: 'admin123',
      });
    
    authToken = response.body.data.accessToken;
  });
  
  describe('GET /api/users', () => {
    it('debe obtener lista de usuarios', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.users)).toBe(true);
    });
  });
  
  describe('POST /api/users', () => {
    it('debe crear un nuevo usuario', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('test@example.com');
      userId = response.body.data.id;
    });
  });
});
```

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests del servidor
npm run test:server

# Tests con coverage
npm run test:coverage
```

---

## 🚀 Despliegue

### Preparación para Producción

```bash
# 1. Build del frontend
npm run build

# 2. Configurar variables de entorno de producción
# Editar .env con valores de producción

# 3. Ejecutar migraciones en producción
cd server && npx prisma migrate deploy

# 4. Iniciar servidor
npm start
```

### Variables de Entorno de Producción

```env
NODE_ENV=production
DATABASE_URL="postgresql://..."
JWT_SECRET="clave-super-segura-produccion"
CLIENT_URL="https://tu-dominio.com"
```

### Recomendaciones

- Usar PM2 para gestión de procesos
- Configurar HTTPS con certificados SSL
- Implementar rate limiting
- Configurar logs con Winston
- Usar CDN para assets estáticos
- Implementar backups automáticos de BD

---

## ✅ Mejores Prácticas

### General

1. **Commits semánticos**: Usa conventional commits
   ```
   feat: agregar módulo de reportes
   fix: corregir validación de email
   docs: actualizar guía de desarrollo
   ```

2. **Code review**: Siempre hacer review antes de merge

3. **Documentación**: Documenta funciones complejas y decisiones de arquitectura

### Backend

1. **Separación de responsabilidades**: Controller → Service → Data Access
2. **Validación**: Siempre validar entrada del usuario
3. **Manejo de errores**: Usar try-catch y ApiError
4. **Logging**: Log de operaciones importantes
5. **Tests**: Cubrir casos de éxito y error
6. **Prisma**: Usar transacciones para operaciones múltiples

### Frontend

1. **Componentes pequeños**: Máximo 200 líneas
2. **Custom hooks**: Extraer lógica reutilizable
3. **Validación**: Usar Yup en todos los formularios
4. **Manejo de errores**: Mostrar mensajes claros al usuario
5. **Loading states**: Indicar cuando se está cargando
6. **Optimización**: Lazy loading de rutas y componentes

### Seguridad

1. **Nunca** exponer secretos en el código
2. **Siempre** validar y sanitizar entrada
3. **Usar** HTTPS en producción
4. **Implementar** rate limiting
5. **Mantener** dependencias actualizadas
6. **Aplicar** principio de mínimo privilegio

---

## 📚 Recursos Adicionales

### Documentación

- [API Reference](./api-reference.md)
- [Architecture](./architecture.md)
- [Database Setup](./database-setup.md)
- [Modules Guide](./modules.md)

### Enlaces Útiles

- [Prisma Docs](https://www.prisma.io/docs)
- [Express Docs](https://expressjs.com)
- [React Docs](https://react.dev)
- [Material-UI](https://mui.com)
- [Swagger/OpenAPI](https://swagger.io/docs)

---

**Última actualización**: Diciembre 2025
**Versión**: 0.5.4
