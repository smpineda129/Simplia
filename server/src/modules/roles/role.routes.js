import express from 'express';
import roleController from './role.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { hasPermission } from '../../middlewares/permission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Gestión de roles del sistema
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Obtener todos los roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles
 */
router.get('/', authenticate, hasPermission('role.view'), roleController.getAllRoles);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Obtener rol por ID
 *     tags: [Roles]
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
 *         description: Rol encontrado
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', authenticate, hasPermission('role.view'), roleController.getRoleById);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Crear nuevo rol
 *     tags: [Roles]
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
 *               roleLevel:
 *                 type: integer
 *                 default: 1
 *               companyId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Rol creado exitosamente
 */
router.post('/', authenticate, hasPermission('role.create'), roleController.createRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Actualizar rol
 *     tags: [Roles]
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
 *         description: Rol actualizado exitosamente
 */
router.put('/:id', authenticate, hasPermission('role.update'), roleController.updateRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Eliminar rol
 *     tags: [Roles]
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
 *         description: Rol eliminado exitosamente
 */
router.delete('/:id', authenticate, hasPermission('role.delete'), roleController.deleteRole);

/**
 * @swagger
 * /api/roles/{id}/permissions:
 *   get:
 *     summary: Obtener permisos del rol
 *     tags: [Roles]
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
 *         description: Lista de permisos del rol
 */
router.get('/:id/permissions', authenticate, hasPermission('role.view'), roleController.getRolePermissions);

/**
 * @swagger
 * /api/roles/{id}/permissions/sync:
 *   post:
 *     summary: Sincronizar permisos del rol
 *     tags: [Roles]
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
 *             required:
 *               - permissionIds
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Permisos sincronizados exitosamente
 */
router.post('/:id/permissions/sync', authenticate, hasPermission('role.assign-permissions'), roleController.syncRolePermissions);

export default router;
