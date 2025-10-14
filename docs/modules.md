# Guía de Módulos

Esta guía explica cómo están organizados los módulos en el proyecto GDI y cómo crear nuevos módulos.

## Estructura de Módulos

Los módulos son unidades funcionales autocontenidas que agrupan toda la lógica relacionada con una característica específica del negocio.

## Módulos Existentes

### 1. Auth (Autenticación)

**Ubicación:**
- Frontend: `client/src/modules/auth/`
- Backend: `server/src/modules/auth/`

**Responsabilidades:**
- Registro de usuarios
- Inicio de sesión
- Cierre de sesión
- Renovación de tokens
- Gestión de sesión

**Archivos Frontend:**

```
auth/
├── components/          # Componentes específicos
├── forms/
│   └── LoginForm.jsx   # Formulario de login con Formik
├── pages/
│   └── LoginPage.jsx   # Página de login
├── services/
│   └── authService.js  # Llamadas a la API
├── schemas/
│   └── loginSchema.js  # Validación con Yup
└── index.jsx           # Exportaciones públicas
```

**Archivos Backend:**

```
auth/
├── auth.controller.js   # Controladores HTTP
├── auth.service.js      # Lógica de negocio
├── auth.routes.js       # Definición de rutas
├── auth.validation.js   # Validaciones
└── tests/
    └── auth.test.js     # Tests del módulo
```

### 2. Dashboard

**Ubicación:**
- Frontend: `client/src/modules/dashboard/`

**Responsabilidades:**
- Vista principal después del login
- Resumen de estadísticas
- Acceso rápido a módulos

**Archivos:**

```
dashboard/
└── pages/
    └── DashboardPage.jsx
```

## Crear un Nuevo Módulo

### Ejemplo: Módulo de Usuarios

#### Paso 1: Backend

##### 1.1. Crear estructura de carpetas

```bash
mkdir -p server/src/modules/users/tests
```

##### 1.2. Crear modelo en Prisma

```prisma
// server/prisma/schema.prisma

// El modelo User ya existe, pero si necesitas relaciones:
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Nuevas relaciones
  posts     Post[]
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```

##### 1.3. Crear servicio

```javascript
// server/src/modules/users/user.service.js

import { prisma } from '../../db/prisma.js';
import { ApiError } from '../../utils/ApiError.js';

export const userService = {
  getAll: async (filters = {}) => {
    const users = await prisma.user.findMany({
      where: filters,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    return users;
  },

  getById: async (id) => {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    return user;
  },

  update: async (id, data) => {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return user;
  },

  delete: async (id) => {
    await prisma.user.delete({
      where: { id },
    });
  },
};
```

##### 1.4. Crear controlador

```javascript
// server/src/modules/users/user.controller.js

import { userService } from './user.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const userController = {
  getAll: asyncHandler(async (req, res) => {
    const users = await userService.getAll(req.query);
    
    res.status(200).json({
      success: true,
      data: users,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const user = await userService.getById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const user = await userService.update(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user,
    });
  }),

  delete: asyncHandler(async (req, res) => {
    await userService.delete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente',
    });
  }),
};
```

##### 1.5. Crear validaciones

```javascript
// server/src/modules/users/user.validation.js

import { body, param } from 'express-validator';

export const userValidation = {
  update: [
    param('id').isUUID().withMessage('ID inválido'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('El nombre debe tener al menos 2 caracteres'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Email inválido'),
  ],

  delete: [
    param('id').isUUID().withMessage('ID inválido'),
  ],
};
```

##### 1.6. Crear rutas

```javascript
// server/src/modules/users/user.routes.js

import { Router } from 'express';
import { userController } from './user.controller.js';
import { userValidation } from './user.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate, authorize } from '../../middlewares/auth.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/', userController.getAll);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', userController.getById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */
router.put('/:id', userValidation.update, validate, userController.update);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar usuario (solo ADMIN)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
router.delete(
  '/:id',
  authorize('ADMIN'),
  userValidation.delete,
  validate,
  userController.delete
);

export default router;
```

##### 1.7. Registrar rutas

```javascript
// server/src/routes/index.js

import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/users/user.routes.js'; // ← Nuevo

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes); // ← Nuevo

// ... resto del código
```

##### 1.8. Crear tests

```javascript
// server/src/modules/users/tests/user.test.js

import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../../../app.js';

describe('Users Module', () => {
  let authToken;

  beforeAll(async () => {
    // Login para obtener token
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
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
```

#### Paso 2: Frontend

##### 2.1. Crear estructura de carpetas

```bash
mkdir -p client/src/modules/users/{components,forms,pages,services,schemas}
```

##### 2.2. Crear servicio

```javascript
// client/src/modules/users/services/userService.js

import axiosInstance from '../../../api/axiosConfig';

const userService = {
  getAll: async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
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

##### 2.3. Crear schema de validación

```javascript
// client/src/modules/users/schemas/userSchema.js

import * as Yup from 'yup';

export const userSchema = Yup.object({
  name: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .required('El nombre es requerido'),
  email: Yup.string()
    .email('Email inválido')
    .required('El email es requerido'),
});
```

##### 2.4. Crear formulario

```jsx
// client/src/modules/users/forms/UserForm.jsx

import { Formik, Form, Field } from 'formik';
import { TextField, Button, Box } from '@mui/material';
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Field
              as={TextField}
              name="name"
              label="Nombre"
              fullWidth
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />

            <Field
              as={TextField}
              name="email"
              label="Email"
              type="email"
              fullWidth
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              Guardar
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;
```

##### 2.5. Crear componente de lista

```jsx
// client/src/modules/users/components/UserList.jsx

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const UserList = ({ users, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(user)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => onDelete(user.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserList;
```

##### 2.6. Crear página

```jsx
// client/src/modules/users/pages/UsersPage.jsx

import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import UserList from '../components/UserList';
import userService from '../services/userService';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    // Implementar edición
    console.log('Edit user:', user);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro?')) {
      try {
        await userService.delete(id);
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Usuarios
      </Typography>
      <UserList
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default UsersPage;
```

##### 2.7. Exportar módulo

```javascript
// client/src/modules/users/index.jsx

export { default as UsersPage } from './pages/UsersPage';
export { default as UserForm } from './forms/UserForm';
export { default as UserList } from './components/UserList';
export { default as userService } from './services/userService';
export { userSchema } from './schemas/userSchema';
```

##### 2.8. Agregar ruta

```jsx
// client/src/App.jsx

import { UsersPage } from './modules/users';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ... rutas existentes */}
        
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} /> {/* ← Nueva */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}
```

## Checklist para Nuevo Módulo

### Backend

- [ ] Crear carpeta en `server/src/modules/[nombre]/`
- [ ] Actualizar `schema.prisma` si es necesario
- [ ] Ejecutar migración de Prisma
- [ ] Crear `[nombre].service.js`
- [ ] Crear `[nombre].controller.js`
- [ ] Crear `[nombre].validation.js`
- [ ] Crear `[nombre].routes.js`
- [ ] Registrar rutas en `server/src/routes/index.js`
- [ ] Crear tests en `tests/[nombre].test.js`
- [ ] Documentar con Swagger

### Frontend

- [ ] Crear carpeta en `client/src/modules/[nombre]/`
- [ ] Crear servicio en `services/[nombre]Service.js`
- [ ] Crear schemas en `schemas/[nombre]Schema.js`
- [ ] Crear formularios en `forms/`
- [ ] Crear componentes en `components/`
- [ ] Crear páginas en `pages/`
- [ ] Exportar en `index.jsx`
- [ ] Agregar rutas en `App.jsx`
- [ ] Crear tests si es necesario

## Mejores Prácticas

1. **Mantén los módulos independientes**: Evita dependencias circulares
2. **Usa servicios compartidos**: Para lógica común entre módulos
3. **Documenta todo**: Especialmente las APIs públicas del módulo
4. **Tests comprehensivos**: Cubre casos de éxito y error
5. **Validación en ambos lados**: Cliente y servidor
6. **Manejo de errores**: Siempre captura y maneja errores apropiadamente
7. **Nombres consistentes**: Usa la misma nomenclatura en frontend y backend

## Módulos Sugeridos

Aquí hay algunos módulos que podrías implementar:

- **Inventory**: Gestión de inventario
- **Reports**: Generación de reportes
- **Notifications**: Sistema de notificaciones
- **Settings**: Configuración de la aplicación
- **Audit**: Logs de auditoría
- **Files**: Gestión de archivos

Cada uno siguiendo la misma estructura modular descrita en esta guía.
