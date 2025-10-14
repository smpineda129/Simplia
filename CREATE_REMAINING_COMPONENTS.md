# 📝 COMPONENTES RESTANTES A CREAR

Por favor, crea los siguientes archivos manualmente o déjame saber si quieres que continúe creándolos:

## Componentes de Roles:

### 1. RoleTable.jsx
Similar a CompanyTable.jsx pero con columnas:
- Nombre
- Nivel de Rol  
- Permisos (botón "Ver")
- Acciones (Editar, Eliminar)

### 2. RoleModalForm.jsx
Formulario con:
- Campo: Nombre (text)
- Campo: Nivel de rol (number)
- Campo: Empresa (select, opcional)
- Lista de permisos (checkboxes agrupados por categoría)

## Componentes de Permisos:

### 3. PermissionList.jsx
Similar a RoleList.jsx

### 4. PermissionTable.jsx
Tabla con columnas:
- Nombre
- Permiso (slug)
- Roles (chips con nombres de roles)

## Rutas y Navegación:

### 5. Actualizar App.jsx
Agregar rutas:
```jsx
<Route path="/roles" element={<RoleList />} />
<Route path="/permissions" element={<PermissionList />} />
```

### 6. Actualizar Sidebar
Agregar items de menú para Roles y Permisos

¿Quieres que continúe creando estos archivos?
