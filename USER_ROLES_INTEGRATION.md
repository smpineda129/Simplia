# ✅ INTEGRACIÓN DE ROLES CON USUARIOS

**Fecha:** 2025-10-12  
**Estado:** ✅ COMPLETADO

---

## 🎯 RESUMEN

Se ha integrado el sistema de Roles y Permisos (Spatie-like) con el módulo de Usuarios, manteniendo **compatibilidad total** con la estructura original de Laravel.

---

## 📊 ESTRUCTURA DE USER

### **Campos en Base de Datos:**
```sql
users {
  id                INT
  name              VARCHAR(255)
  email             VARCHAR(255) UNIQUE
  email_verified_at TIMESTAMP
  password          VARCHAR(255)
  remember_token    VARCHAR(100)
  phone             VARCHAR(255)
  locale            VARCHAR(255)
  signature         TEXT
  role              VARCHAR(255)      -- Campo legacy de Laravel
  company_id        INT               -- ✅ Multi-tenant
  created_at        TIMESTAMP
  updated_at        TIMESTAMP
  deleted_at        TIMESTAMP
}
```

---

## 🔄 SISTEMA DUAL DE ROLES

### **1. Campo `role` (Legacy - Laravel):**
- ✅ Mantiene compatibilidad con app existente
- ✅ Valores: 'USER', 'ADMIN', 'MANAGER', etc.
- ✅ Se usa para autenticación básica

### **2. Sistema Spatie (Nuevo):**
- ✅ Tabla `model_has_roles` (M2M)
- ✅ Roles dinámicos por compañía
- ✅ Permisos granulares
- ✅ Niveles jerárquicos

---

## 🔗 NUEVOS ENDPOINTS

### **Obtener Roles de un Usuario:**
```
GET /api/users/:userId/roles
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "Administrador de Expedientes",
    "guard_name": "web",
    "role_level": 3,
    "company_id": 1
  }
]
```

### **Obtener Permisos de un Usuario:**
```
GET /api/users/:userId/permissions
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "proceeding.view",
    "guard_name": "web",
    "permission_level": 1
  },
  {
    "id": 2,
    "name": "proceeding.create",
    "guard_name": "web",
    "permission_level": 2
  }
]
```

### **Asignar Rol a Usuario:**
```
POST /api/users/:userId/roles
Content-Type: application/json

{
  "roleId": 1
}
```

### **Remover Rol de Usuario:**
```
DELETE /api/users/:userId/roles/:roleId
```

### **Sincronizar Roles (Reemplaza todos):**
```
POST /api/users/:userId/roles/sync
Content-Type: application/json

{
  "roleIds": [1, 2, 3]
}
```

---

## 📝 SERVICIOS CREADOS

### **1. userRole.service.js**
```javascript
- assignRole(userId, roleId)
- removeRole(userId, roleId)
- syncRoles(userId, roleIds)
- getUserRoles(userId)
- getUserPermissions(userId)
- hasRole(userId, roleName)
- hasPermission(userId, permissionName)
```

### **2. userRole.controller.js**
```javascript
- assignRole(req, res)
- removeRole(req, res)
- syncRoles(req, res)
- getUserRoles(req, res)
- getUserPermissions(req, res)
```

---

## 🔧 CAMBIOS EN user.service.js

### **getAll():**
```javascript
// Ahora incluye:
- company (id, name, short)
- phone
- roles[] (de Spatie)
```

### **getById():**
```javascript
// Ahora incluye:
- company (id, name, short)
- phone, locale, signature
- roles[] (de Spatie)
- permissions[] (de Spatie)
```

---

## 💡 EJEMPLOS DE USO

### **1. Crear Usuario con Rol Legacy:**
```javascript
POST /api/users
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "role": "ADMIN",           // Rol legacy
  "companyId": 1,
  "phone": "+57 300 123 4567"
}
```

### **2. Asignar Rol Spatie al Usuario:**
```javascript
POST /api/users/1/roles
{
  "roleId": 3  // Administrador de Expedientes
}
```

### **3. Obtener Usuario con Roles:**
```javascript
GET /api/users/1

Response:
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "role": "ADMIN",           // Rol legacy
  "phone": "+57 300 123 4567",
  "companyId": 1,
  "company": {
    "id": 1,
    "name": "Mi Empresa",
    "short": "ME"
  },
  "roles": [                 // Roles Spatie
    {
      "id": 3,
      "name": "Administrador de Expedientes",
      "role_level": 3
    }
  ],
  "permissions": [           // Permisos del usuario
    { "id": 1, "name": "proceeding.view" },
    { "id": 2, "name": "proceeding.create" }
  ]
}
```

### **4. Verificar Permisos en Código:**
```javascript
import userRoleService from './userRole.service.js';

// Verificar si tiene un rol
const hasRole = await userRoleService.hasRole(userId, 'Administrador de Expedientes');

// Verificar si tiene un permiso
const hasPermission = await userRoleService.hasPermission(userId, 'proceeding.create');
```

---

## 🎨 INTEGRACIÓN FRONTEND (Próximo Paso)

### **Actualizar UserList.jsx:**
```jsx
// Mostrar roles en tabla de usuarios
<TableCell>
  {user.roles.map(role => (
    <Chip key={role.id} label={role.name} size="small" />
  ))}
</TableCell>
```

### **Actualizar UserForm.jsx:**
```jsx
// Agregar selector de roles
<FormControl>
  <InputLabel>Roles</InputLabel>
  <Select multiple value={selectedRoles}>
    {roles.map(role => (
      <MenuItem key={role.id} value={role.id}>
        {role.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>
```

---

## 🔒 SEGURIDAD

### **Middleware de Autorización:**
```javascript
// Verificar permiso específico
const checkPermission = async (req, res, next) => {
  const hasPermission = await userRoleService.hasPermission(
    req.user.id,
    'proceeding.create'
  );
  
  if (!hasPermission) {
    return res.status(403).json({ error: 'No autorizado' });
  }
  
  next();
};
```

---

## 📊 TABLAS RELACIONADAS

```
users
├── company_id → companies
├── role (varchar legacy)
└── model_has_roles (M2M)
    ├── role_id → roles
    ├── model_type = 'User'
    └── model_id = user.id

roles
├── company_id (nullable)
└── role_has_permissions (M2M)
    └── permission_id → permissions
```

---

## ✅ CARACTERÍSTICAS IMPLEMENTADAS

- ✅ **Compatibilidad total** con sistema legacy
- ✅ **Multi-tenant** por compañía
- ✅ **Roles dinámicos** por compañía
- ✅ **Permisos granulares**
- ✅ **Niveles jerárquicos**
- ✅ **Queries optimizadas** con raw SQL
- ✅ **API REST completa**
- ✅ **Documentación Swagger**

---

## 🚀 PRÓXIMOS PASOS

1. ⏳ Actualizar frontend de Usuarios
   - Mostrar roles en tabla
   - Selector de roles en formulario
   - Sincronizar roles al guardar

2. ⏳ Middleware de permisos
   - Verificar permisos en rutas
   - Decoradores de permisos

3. ⏳ Migración de datos
   - Convertir roles legacy a Spatie
   - Script de migración

---

## 📄 ARCHIVOS CREADOS/MODIFICADOS

### **Creados:**
```
/server/src/modules/users/
├── userRole.service.js       ✅ Nuevo
└── userRole.controller.js    ✅ Nuevo
```

### **Modificados:**
```
/server/src/modules/users/
├── user.service.js            ✅ Actualizado
└── user.routes.js             ✅ Actualizado (5 nuevos endpoints)

/server/prisma/
└── schema.prisma              ✅ Verificado
```

---

## 🎯 CONCLUSIÓN

**¡Sistema de Roles completamente integrado con Usuarios!**

- ✅ Backend funcional con 5 nuevos endpoints
- ✅ Compatibilidad con sistema legacy
- ✅ Multi-tenant robusto
- ✅ Permisos granulares
- ✅ Queries optimizadas
- ✅ Documentación completa

**El sistema está listo para asignar roles a usuarios.** 🚀

---

**Última actualización:** 2025-10-12 12:30  
**Estado:** ✅ COMPLETADO
