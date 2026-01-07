import { Router } from 'express';
import { userController } from './user.controller.js';
import { userValidation } from './user.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { hasPermission, isSelfOrHasPermission } from '../../middlewares/permission.middleware.js';
import userRoleController from './userRole.controller.js';
import userAreaController from './userArea.controller.js';

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
 *       401:
 *         description: No autenticado
 */
router.get('/', hasPermission('user.view'), userController.getAll);

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
router.get('/:id', isSelfOrHasPermission('user.view', 'id'), userValidation.getById, validate, userController.getById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear nuevo usuario (solo ADMIN)
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
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN, MANAGER]
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Error de validación
 */
router.post(
  '/',
  hasPermission('user.create'),
  userValidation.create,
  validate,
  userController.create
);

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */
router.put(
  '/:id',
  hasPermission('user.update'),
  userValidation.update,
  validate,
  userController.update
);

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
  hasPermission('user.delete'),
  userValidation.delete,
  validate,
  userController.delete
);

// ==================== RUTAS DE ROLES DE USUARIOS ====================

/**
 * @swagger
 * /api/users/{userId}/roles:
 *   get:
 *     summary: Obtener roles de un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de roles del usuario
 */
router.get('/:userId/roles', isSelfOrHasPermission('user.view', 'userId'), userRoleController.getUserRoles);

/**
 * @swagger
 * /api/users/{userId}/permissions:
 *   get:
 *     summary: Obtener permisos de un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de permisos del usuario
 */
router.get('/:userId/permissions', isSelfOrHasPermission('user.view', 'userId'), userRoleController.getUserPermissions);

/**
 * @swagger
 * /api/users/{userId}/roles:
 *   post:
 *     summary: Asignar un rol a un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *             properties:
 *               roleId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Rol asignado exitosamente
 */
router.post('/:userId/roles', hasPermission('user.attach-role'), userRoleController.assignRole);

/**
 * @swagger
 * /api/users/{userId}/roles/{roleId}:
 *   delete:
 *     summary: Remover un rol de un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rol removido exitosamente
 */
router.delete('/:userId/roles/:roleId', hasPermission('user.detach-role'), userRoleController.removeRole);

/**
 * @swagger
 * /api/users/{userId}/roles/sync:
 *   post:
 *     summary: Sincronizar roles de un usuario (reemplaza todos)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleIds
 *             properties:
 *               roleIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Roles sincronizados exitosamente
 */
router.post('/:userId/roles/sync', hasPermission('user.attach-role'), userRoleController.syncRoles);

// ==================== RUTAS DE ÁREAS DE USUARIOS ====================

/**
 * @swagger
 * /api/users/{userId}/areas:
 *   post:
 *     summary: Asignar un área a un usuario
 *     tags: [Users]
 */
router.post('/:userId/areas', hasPermission('user.attach-area'), userAreaController.assignArea);

/**
 * @swagger
 * /api/users/{userId}/areas/{areaId}:
 *   delete:
 *     summary: Remover un área de un usuario
 *     tags: [Users]
 */
router.delete('/:userId/areas/:areaId', hasPermission('user.detach-area'), userAreaController.removeArea);

// ==================== RUTAS DE PERMISOS DIRECTOS DE USUARIOS ====================

/**
 * @swagger
 * /api/users/{userId}/permissions:
 *   post:
 *     summary: Asignar un permiso directo a un usuario
 *     tags: [Users]
 */
router.post('/:userId/permissions', hasPermission('user.attach-permission'), userRoleController.assignPermission);

/**
 * @swagger
 * /api/users/{userId}/permissions/{permissionId}:
 *   delete:
 *     summary: Remover un permiso directo de un usuario
 *     tags: [Users]
 */
router.delete('/:userId/permissions/:permissionId', hasPermission('user.detach-permission'), userRoleController.removePermission);

export default router;
