# Referencia de la API - Sistema GDI

Documentación de referencia rápida de los endpoints disponibles en la API del Sistema de Gestión Documental Inteligente (GDI).

## 📚 Documentación Completa

Para documentación interactiva completa con ejemplos y esquemas detallados, visita:

**Swagger UI**: `http://localhost:5000/api-docs`

## 🌐 URL Base

```
http://localhost:5000/api
```

## 🔐 Autenticación

Todos los endpoints (excepto `/api/auth/login` y `/api/auth/register`) requieren autenticación JWT.

**Header requerido**:
```
Authorization: Bearer <access_token>
```

**Tokens**:
- **Access Token**: Válido por 15 minutos
- **Refresh Token**: Válido por 7 días

## 📋 Índice de Módulos

1. [Autenticación](#autenticación)
2. [Usuarios](#usuarios)
3. [Empresas](#empresas)
4. [Áreas](#áreas)
5. [Correspondencia](#correspondencia)
6. [Documentos](#documentos)
7. [Plantillas](#plantillas)
8. [Expedientes](#expedientes)
9. [Retenciones](#retenciones)
10. [Entidades](#entidades)
11. [Bodegas](#bodegas)
12. [Roles](#roles)
13. [Permisos](#permisos)

---

## 🔐 Autenticación

#### Registrar Usuario

Crea un nuevo usuario en el sistema.

```http
POST /api/auth/register
```

**Request Body:**

```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "name": "Nombre Usuario"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "uuid",
      "email": "usuario@ejemplo.com",
      "name": "Nombre Usuario",
      "role": "USER",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores:**

- `400` - Email ya registrado o validación fallida
- `500` - Error del servidor

---

#### Iniciar Sesión

Autentica un usuario y devuelve tokens.

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": "uuid",
      "email": "usuario@ejemplo.com",
      "name": "Nombre Usuario",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores:**

- `401` - Credenciales inválidas
- `400` - Validación fallida
- `500` - Error del servidor

---

#### Renovar Token

Obtiene un nuevo access token usando el refresh token.

```http
POST /api/auth/refresh
```

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Token renovado exitosamente",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores:**

- `401` - Refresh token inválido o expirado
- `400` - Refresh token no proporcionado
- `500` - Error del servidor

---

#### Obtener Usuario Actual

Obtiene la información del usuario autenticado.

```http
GET /api/auth/me
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "name": "Nombre Usuario",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errores:**

- `401` - No autenticado o token inválido
- `404` - Usuario no encontrado
- `500` - Error del servidor

---

#### Cerrar Sesión

```http
POST /api/auth/logout
```

**Requiere**: Autenticación

---

## 👥 Usuarios

### Endpoints Principales

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/users` | Listar usuarios | ✅ |
| `GET` | `/api/users/:id` | Obtener usuario por ID | ✅ |
| `POST` | `/api/users` | Crear usuario | ✅ ADMIN |
| `PUT` | `/api/users/:id` | Actualizar usuario | ✅ |
| `DELETE` | `/api/users/:id` | Eliminar usuario | ✅ ADMIN |
| `GET` | `/api/users/:userId/roles` | Obtener roles del usuario | ✅ |
| `GET` | `/api/users/:userId/permissions` | Obtener permisos del usuario | ✅ |
| `POST` | `/api/users/:userId/roles` | Asignar rol a usuario | ✅ ADMIN |
| `DELETE` | `/api/users/:userId/roles/:roleId` | Remover rol de usuario | ✅ ADMIN |
| `POST` | `/api/users/:userId/roles/sync` | Sincronizar roles del usuario | ✅ ADMIN |

**Query params (GET /api/users)**:
- `search`: Buscar por nombre o email
- `page`: Número de página (default: 1)
- `limit`: Items por página (default: 10)

---

## 🏢 Empresas

### Endpoints Principales

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/companies` | Listar empresas | ✅ |
| `GET` | `/api/companies/:id` | Obtener empresa por ID | ✅ |
| `GET` | `/api/companies/:id/stats` | Estadísticas de la empresa | ✅ |
| `POST` | `/api/companies` | Crear empresa | ✅ |
| `PUT` | `/api/companies/:id` | Actualizar empresa | ✅ |
| `DELETE` | `/api/companies/:id` | Eliminar empresa | ✅ |

**Campos principales**:
- `name`: Nombre de la empresa
- `identifier`: NIT o identificador fiscal
- `short`: Nombre corto
- `email`: Email de contacto
- `maxUsers`: Límite de usuarios

---

## 🏛️ Áreas

### Endpoints Principales

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/areas` | Listar áreas | ✅ |
| `GET` | `/api/areas/:id` | Obtener área por ID | ✅ |
| `POST` | `/api/areas` | Crear área | ✅ |
| `PUT` | `/api/areas/:id` | Actualizar área | ✅ |
| `DELETE` | `/api/areas/:id` | Eliminar área | ✅ |
| `POST` | `/api/areas/:id/users` | Asignar usuarios al área | ✅ |
| `DELETE` | `/api/areas/:id/users/:userId` | Remover usuario del área | ✅ |

**Query params**:
- `search`: Buscar por nombre o código
- `companyId`: Filtrar por empresa

---

## 📧 Correspondencia

### Endpoints Principales

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/correspondences` | Listar correspondencias | ✅ |
| `GET` | `/api/correspondences/stats` | Estadísticas de correspondencia | ✅ |
| `GET` | `/api/correspondences/:id` | Obtener correspondencia por ID | ✅ |
| `POST` | `/api/correspondences` | Crear correspondencia | ✅ |
| `PUT` | `/api/correspondences/:id` | Actualizar correspondencia | ✅ |
| `DELETE` | `/api/correspondences/:id` | Eliminar correspondencia | ✅ |
| `POST` | `/api/correspondences/:id/threads` | Crear hilo de conversación | ✅ |
| `POST` | `/api/correspondences/:id/respond` | Responder correspondencia | ✅ |
| `POST` | `/api/correspondences/:id/mark-delivered` | Marcar como entregada | ✅ |

**Características**:
- Radicados automáticos de entrada (`in_settled`) y salida (`out_settled`)
- Número de seguimiento único (`tracking_number`)
- Estados: `registered`, `in_transit`, `delivered`
- Prioridades: `low`, `medium`, `high`, `urgent`

---

## 📄 Documentos

### Endpoints Principales

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/documents` | Listar documentos | ✅ |
| `GET` | `/api/documents/:id` | Obtener documento por ID | ✅ |
| `POST` | `/api/documents` | Crear documento | ✅ |
| `PUT` | `/api/documents/:id` | Actualizar documento | ✅ |
| `DELETE` | `/api/documents/:id` | Eliminar documento | ✅ |

**Campos principales**:
- `name`: Nombre del documento
- `file`: Ruta del archivo
- `medium`: Medio (físico/digital)
- `documentDate`: Fecha del documento
- `meta`: Metadatos JSON
- `entities`: Entidades vinculadas

---

## 📝 Plantillas

### Endpoints Principales

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/templates` | Listar plantillas | ✅ |
| `GET` | `/api/templates/helpers` | Obtener helpers disponibles | ✅ |
| `GET` | `/api/templates/:id` | Obtener plantilla por ID | ✅ |
| `POST` | `/api/templates` | Crear plantilla | ✅ |
| `PUT` | `/api/templates/:id` | Actualizar plantilla | ✅ |
| `DELETE` | `/api/templates/:id` | Eliminar plantilla | ✅ |
| `POST` | `/api/templates/:id/process` | Procesar plantilla con datos | ✅ |

**Características**:
- Sistema de helpers dinámicos personalizados
- Sintaxis tipo Handlebars
- Procesamiento de plantillas con datos

---

## 📁 Expedientes

### Endpoints Principales

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/proceedings` | Listar expedientes | ✅ |
| `GET` | `/api/proceedings/:id` | Obtener expediente por ID | ✅ |
| `POST` | `/api/proceedings` | Crear expediente | ✅ |
| `PUT` | `/api/proceedings/:id` | Actualizar expediente | ✅ |
| `DELETE` | `/api/proceedings/:id` | Eliminar expediente | ✅ |

**Campos principales**:
- `name`: Nombre del expediente
- `code`: Código único
- `startDate`: Fecha de inicio
- `endDate`: Fecha de fin
- `loan`: Estado de préstamo (`custody`, `loan`, `returned`)
- `retentionLineId`: Línea de retención asociada

---

## 📊 Retenciones

### Endpoints Principales

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/retentions` | Listar tablas de retención | ✅ |
| `GET` | `/api/retentions/:id` | Obtener TRD por ID | ✅ |
| `POST` | `/api/retentions` | Crear TRD | ✅ |
| `PUT` | `/api/retentions/:id` | Actualizar TRD | ✅ |
| `DELETE` | `/api/retentions/:id` | Eliminar TRD | ✅ |
| `GET` | `/api/retentions/:retentionId/lines` | Obtener líneas de retención | ✅ |
| `GET` | `/api/retentions/lines/:id` | Obtener línea por ID | ✅ |
| `POST` | `/api/retentions/:retentionId/lines` | Crear línea de retención | ✅ |
| `PUT` | `/api/retentions/lines/:id` | Actualizar línea | ✅ |
| `DELETE` | `/api/retentions/lines/:id` | Eliminar línea | ✅ |

**Características**:
- Tablas de Retención Documental (TRD)
- Series y subseries documentales
- Tiempos de retención local y central
- Disposiciones finales (CT, E, M, D, S)

---

## � Entidades

### Endpoints Principales

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/entities` | Listar entidades | ✅ |
| `GET` | `/api/entities/:id` | Obtener entidad por ID | ✅ |
| `POST` | `/api/entities` | Crear entidad | ✅ |
| `PUT` | `/api/entities/:id` | Actualizar entidad | ✅ |
| `DELETE` | `/api/entities/:id` | Eliminar entidad | ✅ |

**Campos principales**:
- `name`: Nombre de la entidad
- `identification`: Identificación (NIT, CC, etc.)
- `meta`: Metadatos JSON adicionales

---

## 🏭 Bodegas

### Endpoints Principales

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/warehouses` | Listar bodegas | ✅ |
| `GET` | `/api/warehouses/:id` | Obtener bodega por ID | ✅ |
| `POST` | `/api/warehouses` | Crear bodega | ✅ |
| `PUT` | `/api/warehouses/:id` | Actualizar bodega | ✅ |
| `DELETE` | `/api/warehouses/:id` | Eliminar bodega | ✅ |
| `GET` | `/api/warehouses/boxes` | Listar cajas | ✅ |
| `GET` | `/api/warehouses/boxes/:id` | Obtener caja por ID | ✅ |
| `POST` | `/api/warehouses/boxes` | Crear caja | ✅ |
| `PUT` | `/api/warehouses/boxes/:id` | Actualizar caja | ✅ |
| `DELETE` | `/api/warehouses/boxes/:id` | Eliminar caja | ✅ |

**Características**:
- Gestión de ubicaciones físicas
- Cajas con ubicación (isla, estantería, estante)
- Vinculación de cajas con expedientes

---

## 🔑 Roles

### Endpoints Principales

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/roles` | Listar roles | ✅ |
| `GET` | `/api/roles/:id` | Obtener rol por ID | ✅ |
| `POST` | `/api/roles` | Crear rol | ✅ |
| `PUT` | `/api/roles/:id` | Actualizar rol | ✅ |
| `DELETE` | `/api/roles/:id` | Eliminar rol | ✅ |
| `GET` | `/api/roles/:id/permissions` | Obtener permisos del rol | ✅ |
| `POST` | `/api/roles/:id/permissions/sync` | Sincronizar permisos del rol | ✅ |

---

## 🛡️ Permisos

### Endpoints Principales

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/permissions` | Listar permisos | ✅ |
| `GET` | `/api/permissions/grouped` | Permisos agrupados | ✅ |
| `GET` | `/api/permissions/:id` | Obtener permiso por ID | ✅ |
| `POST` | `/api/permissions` | Crear permiso | ✅ |
| `PUT` | `/api/permissions/:id` | Actualizar permiso | ✅ |
| `DELETE` | `/api/permissions/:id` | Eliminar permiso | ✅ |
| `GET` | `/api/permissions/:id/roles` | Obtener roles con el permiso | ✅ |

---

## 🏥 Health Check

```http
GET /api/health
```

Verifica que la API esté funcionando correctamente.

**Response (200)**:
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 📊 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| `200` | OK - Solicitud exitosa |
| `201` | Created - Recurso creado exitosamente |
| `400` | Bad Request - Error de validación |
| `401` | Unauthorized - No autenticado |
| `403` | Forbidden - No autorizado |
| `404` | Not Found - Recurso no encontrado |
| `500` | Internal Server Error - Error del servidor |

---

## 📦 Estructura de Respuestas

### Respuesta Exitosa

```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": {
    // Datos de la respuesta
  }
}
```

### Respuesta de Error

```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [
    // Array de errores (opcional, para validación)
  ]
}
```

### Respuesta con Paginación

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

---

## 🔍 Parámetros de Consulta Comunes

### Paginación

- `page`: Número de página (default: 1)
- `limit`: Items por página (default: 10)

### Búsqueda y Filtros

- `search`: Búsqueda de texto libre
- `companyId`: Filtrar por empresa
- `areaId`: Filtrar por área
- `status`: Filtrar por estado
- `priority`: Filtrar por prioridad

---

## 💡 Ejemplos de Uso

### JavaScript (Axios)

```javascript
import axios from 'axios';

// Configurar cliente
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
const login = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    password,
  });
  
  const { accessToken, refreshToken } = response.data.data;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  
  return response.data;
};

// Obtener correspondencias con paginación
const getCorrespondences = async (page = 1, limit = 10) => {
  const response = await api.get('/correspondences', {
    params: { page, limit }
  });
  return response.data;
};

// Crear correspondencia
const createCorrespondence = async (data) => {
  const response = await api.post('/correspondences', data);
  return response.data;
};
```

### cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gdi.com","password":"admin123"}'

# Listar usuarios (con token)
curl -X GET "http://localhost:5000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer <access_token>"

# Crear correspondencia
curl -X POST http://localhost:5000/api/correspondences \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Solicitud de información",
    "content": "Contenido de la correspondencia",
    "priority": "medium",
    "companyId": 1,
    "sender_id": 1,
    "recipient_id": 2
  }'
```

---

## 🔐 Seguridad

### Mejores Prácticas

1. **Tokens**: Nunca expongas los tokens en logs o URLs
2. **HTTPS**: Usa HTTPS en producción
3. **Refresh Tokens**: Renueva el access token antes de que expire
4. **Logout**: Limpia los tokens del localStorage al cerrar sesión
5. **Validación**: Siempre valida los datos antes de enviarlos

### Manejo de Tokens Expirados

```javascript
// Interceptor para manejar tokens expirados
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/api/auth/refresh', {
          refreshToken
        });
        
        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

---

## 📚 Documentación Adicional

### Swagger UI

Documentación interactiva completa disponible en:

```
http://localhost:5000/api-docs
```

**Características de Swagger**:
- ✅ Explorar todos los endpoints
- ✅ Probar requests directamente desde el navegador
- ✅ Ver esquemas de datos detallados
- ✅ Exportar especificación OpenAPI
- ✅ Autenticación integrada

### Otros Recursos

- [Guía del Desarrollador](./DEVELOPER_GUIDE.md) - Guía completa para desarrolladores
- [Arquitectura](./architecture.md) - Detalles de la arquitectura del sistema
- [Configuración de BD](./database-setup.md) - Configuración de base de datos
- [Guía de Módulos](./modules.md) - Cómo crear nuevos módulos

---

## 🚀 Características del Sistema

### Módulos Implementados

- ✅ **Autenticación**: JWT con refresh tokens
- ✅ **Usuarios**: Gestión completa de usuarios
- ✅ **Empresas**: Multi-tenancy
- ✅ **Áreas**: Departamentos y áreas
- ✅ **Correspondencia**: Radicados automáticos, tracking
- ✅ **Documentos**: Gestión documental digital/física
- ✅ **Plantillas**: Sistema de templates dinámicos
- ✅ **Expedientes**: Gestión de expedientes
- ✅ **Retenciones**: Tablas de retención documental (TRD)
- ✅ **Entidades**: Gestión de entidades externas
- ✅ **Bodegas**: Ubicaciones físicas y cajas
- ✅ **Roles y Permisos**: RBAC completo

### Características Técnicas

- ✅ Paginación en todos los listados
- ✅ Búsqueda de texto completo
- ✅ Filtros por múltiples criterios
- ✅ Validación de datos en backend
- ✅ Manejo centralizado de errores
- ✅ Logging de operaciones
- ✅ Documentación Swagger completa
- ✅ Tests automatizados

---

## 🆘 Soporte

### Solución de Problemas

**Error 401 - No autenticado**:
- Verifica que el token esté presente en el header
- Verifica que el token no haya expirado
- Intenta renovar el token con `/api/auth/refresh`

**Error 403 - No autorizado**:
- Verifica que tu usuario tenga los permisos necesarios
- Algunos endpoints requieren rol ADMIN

**Error 404 - No encontrado**:
- Verifica que el ID del recurso sea correcto
- Verifica que el recurso no haya sido eliminado

**Error 500 - Error del servidor**:
- Revisa los logs del servidor
- Verifica la conexión a la base de datos
- Contacta al equipo de desarrollo

### Contacto

Para reportar bugs o solicitar features:

1. Revisa la documentación de Swagger
2. Consulta los logs del servidor
3. Revisa esta documentación
4. Contacta al equipo de desarrollo

---

**Última actualización**: Diciembre 2024  
**Versión de la API**: 1.0.0
