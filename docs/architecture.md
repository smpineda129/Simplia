# Arquitectura del Proyecto GDI

Este documento describe la arquitectura general del Sistema de Gestión Documental Integral (GDI), un monolito fullstack moderno diseñado para la gestión empresarial de documentos.

## Visión General

**GDI (Gestión Documental Integral)** es un sistema completo de gestión documental empresarial que combina frontend y backend en un solo repositorio monolítico, facilitando el desarrollo y mantenimiento mientras mantiene una clara separación de responsabilidades.

### Propósito del Sistema

GDI proporciona una solución integral para:
- Gestión de correspondencia con radicados automáticos
- Control de expedientes y archivos físicos/digitales
- Tablas de Retención Documental (TRD)
- Gestión de bodegas y ubicaciones físicas
- Sistema de plantillas dinámicas
- Control de acceso basado en roles y permisos (RBAC)
- Soporte multi-tenant para múltiples empresas

```
┌─────────────────────────────────────────────────────────┐
│                     GDI Monolith                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐              ┌──────────────┐        │
│  │   Client     │◄────────────►│   Server     │        │
│  │   (React)    │   HTTP/REST  │  (Express)   │        │
│  └──────────────┘              └──────┬───────┘        │
│                                       │                 │
│                                       ▼                 │
│                              ┌──────────────┐           │
│                              │  PostgreSQL  │           │
│                              │   (Prisma)   │           │
│                              └──────────────┘           │
└─────────────────────────────────────────────────────────┘
```

## Estructura de Carpetas

### Raíz del Proyecto

```
/
├── client/           # Aplicación React
├── server/           # API Express
├── docs/             # Documentación
├── tests/            # Tests de integración
├── .env              # Variables de entorno
├── package.json      # Scripts y dependencias raíz
└── README.md         # Documentación principal
```

## Frontend (Client)

### Stack Tecnológico

- **React 18**: Biblioteca UI con hooks
- **Vite**: Build tool y dev server
- **React Router DOM**: Enrutamiento SPA
- **Material UI**: Componentes UI
- **Tailwind CSS**: Utilidades CSS
- **Formik + Yup**: Manejo de formularios y validación
- **Axios**: Cliente HTTP
- **Jest + RTL**: Testing

### Estructura del Cliente

```
client/
├── public/                 # Archivos estáticos
└── src/
    ├── api/               # Configuración de Axios
    ├── assets/            # Imágenes, fuentes, etc.
    ├── components/        # Componentes compartidos
    ├── context/           # React Context (estado global)
    ├── hooks/             # Custom hooks
    ├── layouts/           # Layouts de página
    ├── modules/           # Módulos de negocio
    │   ├── auth/
    │   │   ├── components/
    │   │   ├── forms/
    │   │   ├── pages/
    │   │   ├── services/
    │   │   ├── schemas/
    │   │   └── index.jsx
    │   └── dashboard/
    ├── routes/            # Configuración de rutas
    ├── styles/            # Estilos globales y tema
    ├── utils/             # Utilidades
    ├── App.jsx            # Componente raíz
    └── main.jsx           # Entry point
```

### Patrones de Frontend

#### 1. Arquitectura Modular

Cada módulo de negocio (auth, users, inventory, etc.) contiene:

- **components/**: Componentes específicos del módulo
- **forms/**: Formularios con Formik
- **pages/**: Páginas/vistas del módulo
- **services/**: Llamadas a la API
- **schemas/**: Validaciones con Yup
- **index.jsx**: Exportaciones públicas del módulo

#### 2. Gestión de Estado

- **Context API**: Estado global (autenticación, tema)
- **Custom Hooks**: Lógica reutilizable
- **Local State**: Estado de componentes con useState

#### 3. Enrutamiento

```jsx
<Routes>
  {/* Rutas públicas */}
  <Route element={<AuthLayout />}>
    <Route path="/auth/login" element={<LoginPage />} />
  </Route>

  {/* Rutas protegidas */}
  <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
    <Route path="/dashboard" element={<DashboardPage />} />
  </Route>
</Routes>
```

## Backend (Server)

### Stack Tecnológico

- **Node.js + Express**: Framework web
- **Prisma**: ORM para PostgreSQL
- **JWT**: Autenticación
- **bcryptjs**: Hash de contraseñas
- **Swagger**: Documentación API
- **Jest + Supertest**: Testing

### Estructura del Servidor

```
server/
├── prisma/
│   ├── schema.prisma      # Esquema de base de datos
│   └── seed.js            # Datos iniciales
└── src/
    ├── config/            # Configuraciones
    │   ├── env.js
    │   ├── cors.js
    │   └── swagger.js
    ├── db/                # Conexión a DB
    │   └── prisma.js
    ├── middlewares/       # Middlewares Express
    │   ├── auth.js
    │   ├── validate.js
    │   ├── errorHandler.js
    │   └── notFound.js
    ├── modules/           # Módulos de negocio
    │   └── auth/
    │       ├── auth.controller.js
    │       ├── auth.service.js
    │       ├── auth.routes.js
    │       ├── auth.validation.js
    │       └── tests/
    ├── routes/            # Enrutador principal
    │   └── index.js
    ├── services/          # Servicios compartidos
    │   └── tokenService.js
    ├── utils/             # Utilidades
    │   ├── ApiError.js
    │   └── asyncHandler.js
    ├── app.js             # Configuración Express
    └── server.js          # Entry point
```

### Patrones de Backend

#### 1. Arquitectura en Capas

Cada módulo sigue el patrón MVC adaptado:

```
Routes → Controller → Service → Database
  ↓          ↓           ↓          ↓
Routing   HTTP      Business    Data
Layer     Layer     Logic       Access
```

**Ejemplo: Módulo Auth**

```javascript
// auth.routes.js - Define endpoints
router.post('/login', validate, authController.login);

// auth.controller.js - Maneja HTTP
export const login = async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
};

// auth.service.js - Lógica de negocio
export const login = async (credentials) => {
  const user = await prisma.user.findUnique(...);
  // ... lógica de autenticación
  return { user, token };
};
```

#### 2. Manejo de Errores

```javascript
// Errores personalizados
throw new ApiError(401, 'Credenciales inválidas');

// Capturados por errorHandler middleware
app.use(errorHandler);
```

#### 3. Validación

```javascript
// Validación con express-validator
export const loginValidation = [
  body('email').isEmail(),
  body('password').notEmpty(),
];

// Middleware de validación
router.post('/login', loginValidation, validate, controller.login);
```

## Base de Datos

### Esquema Prisma

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
  MANAGER
}
```

### Migraciones

```bash
# Crear migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones
npx prisma migrate deploy
```

## Autenticación y Autorización

### Flujo de Autenticación

```
1. Usuario envía credenciales → POST /api/auth/login
2. Servidor valida credenciales
3. Genera Access Token (15min) y Refresh Token (7d)
4. Cliente guarda tokens en localStorage
5. Cliente incluye Access Token en headers: Authorization: Bearer <token>
6. Middleware authenticate verifica token
7. Si token expira, cliente usa Refresh Token → POST /api/auth/refresh
```

### Implementación

```javascript
// Cliente: Interceptor de Axios
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Servidor: Middleware de autenticación
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  next();
};
```

## Testing

### Frontend Testing

```javascript
// Component testing con RTL
import { render, screen } from '@testing-library/react';

test('renders login form', () => {
  render(<LoginForm />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
});
```

### Backend Testing

```javascript
// Integration testing con Supertest
import request from 'supertest';
import app from '../app';

test('POST /api/auth/login', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(200);
  
  expect(response.body.data.accessToken).toBeDefined();
});
```

## Flujo de Desarrollo

### 1. Agregar un Nuevo Módulo

#### Backend

```bash
server/src/modules/inventory/
├── inventory.controller.js
├── inventory.service.js
├── inventory.routes.js
├── inventory.validation.js
└── tests/
    └── inventory.test.js
```

#### Frontend

```bash
client/src/modules/inventory/
├── components/
├── forms/
├── pages/
├── services/
├── schemas/
└── index.jsx
```

### 2. Agregar un Nuevo Modelo

```prisma
// 1. Actualizar schema.prisma
model Product {
  id    String @id @default(uuid())
  name  String
  price Float
}

// 2. Crear migración
npx prisma migrate dev --name add_product_model

// 3. Generar cliente
npx prisma generate
```

## Mejores Prácticas

### Frontend

1. **Componentes pequeños y reutilizables**
2. **Custom hooks para lógica compartida**
3. **Validación con Yup en formularios**
4. **Manejo de errores en servicios**
5. **Lazy loading de rutas**

### Backend

1. **Separación de responsabilidades (Controller/Service)**
2. **Validación de entrada con express-validator**
3. **Manejo centralizado de errores**
4. **Logging apropiado**
5. **Tests para endpoints críticos**

### General

1. **Variables de entorno para configuración**
2. **Documentación de código**
3. **Commits semánticos**
4. **Code review antes de merge**
5. **CI/CD para testing automático**

## Escalabilidad

### Consideraciones Futuras

1. **Migración a Microservicios**: Los módulos están diseñados para ser extraídos fácilmente
2. **Cache con Redis**: Para mejorar performance
3. **Queue System**: Para tareas asíncronas
4. **CDN**: Para assets estáticos
5. **Load Balancer**: Para múltiples instancias

## Seguridad

### Implementaciones

- ✅ Hash de contraseñas con bcrypt
- ✅ JWT con expiración
- ✅ CORS configurado
- ✅ Validación de entrada
- ✅ SQL Injection prevention (Prisma)
- ✅ XSS prevention (React)
- ✅ HTTPS en producción (recomendado)

## Monitoreo y Logging

### Desarrollo

- Morgan para logs HTTP
- Console logs para debugging

### Producción (Recomendado)

- Winston para logging estructurado
- Sentry para error tracking
- PM2 para process management
- Prometheus + Grafana para métricas

## Módulos del Sistema

### Módulos Implementados

1. **Auth (Autenticación)**: Sistema JWT con refresh tokens
2. **Users (Usuarios)**: Gestión completa con roles y permisos
3. **Companies (Empresas)**: Multi-tenancy
4. **Areas (Áreas)**: Departamentos y áreas organizacionales
5. **Correspondences (Correspondencia)**: Radicados automáticos y tracking
6. **Documents (Documentos)**: Gestión documental digital/física
7. **Templates (Plantillas)**: Sistema de templates dinámicos
8. **Proceedings (Expedientes)**: Gestión de expedientes
9. **Retentions (Retenciones)**: Tablas de Retención Documental
10. **Entities (Entidades)**: Gestión de entidades externas
11. **Warehouses (Bodegas)**: Ubicaciones físicas y cajas
12. **Roles**: Sistema de roles
13. **Permissions**: Sistema de permisos granulares
14. **Correspondence Types**: Tipos de correspondencia

### Características Clave por Módulo

#### Correspondencia
- Generación automática de radicados de entrada y salida
- Número de seguimiento único (tracking number)
- Estados: registered, in_transit, delivered
- Prioridades: low, medium, high, urgent
- Hilos de conversación (threads)
- Adjuntos JSON

#### Expedientes
- Código único de expediente
- Vinculación con tablas de retención (TRD)
- Estados de préstamo: custody, loan, returned
- Vinculación con cajas físicas
- Hilos de seguimiento

#### Retenciones (TRD)
- Series y subseries documentales
- Tiempos de retención local y central
- Disposiciones finales: CT, E, M, D, S
- Vinculación con expedientes

#### Bodegas
- Gestión de ubicaciones físicas
- Cajas con ubicación detallada (isla, estantería, estante)
- Vinculación de cajas con expedientes

## Diagrama de Relaciones de Base de Datos

```
┌──────────────┐
│   Company    │
└──────┬───────┘
       │
       ├─────────────┬─────────────┬─────────────┬─────────────┐
       │             │             │             │             │
       ▼             ▼             ▼             ▼             ▼
   ┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐
   │ User │     │ Area │     │ Doc  │     │Proc. │     │Wareh.│
   └──┬───┘     └──┬───┘     └──────┘     └──┬───┘     └──────┘
      │            │                          │
      │            │                          │
      ▼            ▼                          ▼
┌──────────────────────────┐        ┌──────────────┐
│   Correspondence         │        │ Retention    │
│  - in_settled (RAD)      │        │ - TRD        │
│  - out_settled (RAD)     │        │ - Lines      │
│  - tracking_number       │        └──────────────┘
│  - threads               │
└──────────────────────────┘
```

## Flujos de Negocio Principales

### Flujo de Correspondencia

```
1. Usuario crea correspondencia
   ↓
2. Sistema genera radicado de entrada (in_settled)
   ↓
3. Se asigna área de destino y destinatario
   ↓
4. Estado inicial: "registered"
   ↓
5. Destinatario recibe y procesa
   ↓
6. Puede crear threads de respuesta
   ↓
7. Al responder, se genera radicado de salida (out_settled)
   ↓
8. Estado final: "delivered"
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
5. Ubicar caja en bodega (isla/estante/estantería)
   ↓
6. Gestionar préstamos (custody → loan → returned)
   ↓
7. Aplicar disposición final según TRD
```

## Patrones de Diseño Implementados

### Backend

1. **Repository Pattern**: Prisma actúa como capa de abstracción de datos
2. **Service Layer Pattern**: Lógica de negocio separada de controladores
3. **Middleware Pattern**: Autenticación, validación, manejo de errores
4. **Factory Pattern**: Generación de radicados y tracking numbers
5. **Strategy Pattern**: Diferentes estrategias de validación por módulo

### Frontend

1. **Container/Presentational Pattern**: Separación de lógica y UI
2. **Custom Hooks Pattern**: Lógica reutilizable
3. **Context Pattern**: Estado global (autenticación, tema)
4. **Module Pattern**: Organización por características de negocio

## Decisiones de Arquitectura

### ¿Por qué Monolito?

**Ventajas**:
- Simplicidad en desarrollo y despliegue
- Transacciones ACID nativas
- Menor latencia entre componentes
- Más fácil de debuggear
- Ideal para equipos pequeños/medianos

**Preparado para Microservicios**:
- Módulos independientes y desacoplados
- Comunicación a través de servicios
- Fácil extracción de módulos a servicios separados

### ¿Por qué Prisma?

- Type-safety completo
- Migraciones automáticas
- Excelente DX (Developer Experience)
- Prisma Studio para visualización de datos
- Soporte completo para PostgreSQL

### ¿Por qué PostgreSQL?

- ACID compliant
- Excelente para datos relacionales complejos
- JSON support para metadatos flexibles
- Escalabilidad probada
- Herramientas maduras de backup y replicación

## Consideraciones de Rendimiento

### Base de Datos

- **Índices**: Creados en campos de búsqueda frecuente
- **Paginación**: Implementada en todos los listados
- **Soft Deletes**: Usando campo `deletedAt`
- **Eager/Lazy Loading**: Controlado por Prisma select

### API

- **Validación temprana**: En capa de validación antes de lógica
- **Async/Await**: Operaciones no bloqueantes
- **Error Handling**: Centralizado y eficiente
- **Logging**: Estructurado con Morgan

### Frontend

- **Code Splitting**: Lazy loading de rutas
- **Memoization**: React.memo para componentes pesados
- **Debouncing**: En búsquedas y filtros
- **Virtual Scrolling**: Para listas largas (recomendado)

## Conclusión

Esta arquitectura proporciona:

- ✅ Separación clara de responsabilidades
- ✅ Escalabilidad modular
- ✅ Fácil mantenimiento
- ✅ Testing comprehensivo
- ✅ Documentación integrada
- ✅ Seguridad robusta
- ✅ Multi-tenancy nativo
- ✅ Sistema RBAC completo
- ✅ Trazabilidad y auditoría
- ✅ Preparado para crecimiento

## Referencias

- [Guía del Desarrollador](./DEVELOPER_GUIDE.md)
- [Referencia de API](./api-reference.md)
- [Configuración de BD](./database-setup.md)
- [Guía de Módulos](./modules.md)
