import express from 'express';
import permissionController from './permission.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { hasPermission } from '../../middlewares/permission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: Gestión de permisos del sistema
 */

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Obtener todos los permisos
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de permisos
 */
router.get('/', authenticate, hasPermission('permission.view'), permissionController.getAllPermissions);

/**
 * @swagger
 * /api/permissions/grouped:
 *   get:
 *     summary: Obtener permisos agrupados
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permisos agrupados por categoría
 */
router.get('/grouped', authenticate, hasPermission('permission.view'), permissionController.getGroupedPermissions);

/**
 * @swagger
 * /api/permissions/{id}:
 *   get:
 *     summary: Obtener permiso por ID
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Permiso encontrado
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', authenticate, hasPermission('permission.view'), permissionController.getPermissionById);

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Crear nuevo permiso
 *     tags: [Permissions]
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
 *               - guardName
 *             properties:
 *               name:
 *                 type: string
 *               guardName:
 *                 type: string
 *               permissionLevel:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       201:
 *         description: Permiso creado exitosamente
 */
router.post('/', authenticate, hasPermission('permission.create'), permissionController.createPermission);

/**
 * @swagger
 * /api/permissions/{id}:
 *   put:
 *     summary: Actualizar permiso
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Permiso actualizado exitosamente
 */
router.put('/:id', authenticate, hasPermission('permission.update'), permissionController.updatePermission);

/**
 * @swagger
 * /api/permissions/{id}:
 *   delete:
 *     summary: Eliminar permiso
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Permiso eliminado exitosamente
 */
router.delete('/:id', authenticate, hasPermission('permission.delete'), permissionController.deletePermission);

/**
 * @swagger
 * /api/permissions/{id}/roles:
 *   get:
 *     summary: Obtener roles que tienen este permiso
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de roles con el permiso
 */
router.get('/:id/roles', authenticate, hasPermission('permission.view'), permissionController.getPermissionRoles);

export default router;
