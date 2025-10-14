# Referencia de la API

Documentación completa de los endpoints disponibles en la API de GDI.

## URL Base

```
http://localhost:5000/api
```

## Autenticación

La mayoría de los endpoints requieren autenticación mediante JWT. Incluye el token en el header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### 🔐 Autenticación

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

Cierra la sesión del usuario (invalidación en cliente).

```http
POST /api/auth/logout
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

**Errores:**

- `401` - No autenticado
- `500` - Error del servidor

---

### 🏥 Health Check

#### Verificar Estado de la API

Verifica que la API esté funcionando correctamente.

```http
GET /api/health
```

**Response (200):**

```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| `200` | OK - Solicitud exitosa |
| `201` | Created - Recurso creado exitosamente |
| `400` | Bad Request - Error de validación |
| `401` | Unauthorized - No autenticado |
| `403` | Forbidden - No autorizado |
| `404` | Not Found - Recurso no encontrado |
| `500` | Internal Server Error - Error del servidor |

## Estructura de Respuestas

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

## Validaciones

### Registro y Login

**Email:**
- Debe ser un email válido
- Requerido

**Password:**
- Mínimo 6 caracteres
- Requerido

**Name (solo registro):**
- Mínimo 2 caracteres
- Requerido

## Roles de Usuario

| Role | Descripción |
|------|-------------|
| `USER` | Usuario estándar |
| `MANAGER` | Gerente con permisos adicionales |
| `ADMIN` | Administrador con todos los permisos |

## Rate Limiting

Actualmente no implementado. Recomendado para producción:

- 100 requests por 15 minutos por IP
- 5 intentos de login por 15 minutos por IP

## CORS

La API acepta requests desde:

```
http://localhost:5173 (desarrollo)
```

Configurable en `.env` con `CLIENT_URL`.

## Tokens JWT

### Access Token

- **Duración**: 15 minutos (configurable)
- **Uso**: Autenticación de requests
- **Header**: `Authorization: Bearer <token>`

### Refresh Token

- **Duración**: 7 días (configurable)
- **Uso**: Renovar access token
- **Almacenamiento**: localStorage (cliente)

## Ejemplos de Uso

### JavaScript (Axios)

```javascript
import axios from 'axios';

// Configurar cliente
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
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

// Request autenticado
const getProfile = async () => {
  const token = localStorage.getItem('accessToken');
  
  const response = await api.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
};
```

### cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gdi.com","password":"admin123"}'

# Request autenticado
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <access_token>"
```

## Swagger UI

Para una documentación interactiva, visita:

```
http://localhost:5000/api-docs
```

Aquí puedes:
- Ver todos los endpoints
- Probar requests directamente
- Ver esquemas de datos
- Exportar especificación OpenAPI

## Próximos Endpoints

Endpoints planificados para futuras versiones:

### Usuarios

- `GET /api/users` - Listar usuarios (ADMIN)
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (ADMIN)

### Inventario

- `GET /api/inventory` - Listar productos
- `POST /api/inventory` - Crear producto
- `GET /api/inventory/:id` - Obtener producto
- `PUT /api/inventory/:id` - Actualizar producto
- `DELETE /api/inventory/:id` - Eliminar producto

### Reportes

- `GET /api/reports` - Listar reportes
- `POST /api/reports` - Generar reporte
- `GET /api/reports/:id` - Obtener reporte
- `GET /api/reports/:id/download` - Descargar reporte

## Versionado

Actualmente en versión `v1`. Futuras versiones usarán:

```
/api/v2/...
```

## Soporte

Para reportar bugs o solicitar features:

1. Revisa la documentación de Swagger
2. Consulta los logs del servidor
3. Crea un issue en el repositorio

## Changelog

### v1.0.0 (2024-01-01)

- ✅ Autenticación con JWT
- ✅ Registro de usuarios
- ✅ Login/Logout
- ✅ Refresh token
- ✅ Obtener perfil de usuario
- ✅ Health check endpoint
