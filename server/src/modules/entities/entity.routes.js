import express from 'express';
import entityController from './entity.controller.js';
import { createEntityValidation, updateEntityValidation, createCategoryValidation } from './entity.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';
import { hasPermission } from '../../middlewares/permission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Entities
 *   description: Gestión de entidades externas
 */

// Categories routes - DISABLED (tabla entity_categories no existe en BD importada)
// router.get('/categories', authenticate, entityController.getAllCategories);
// router.post('/categories', authenticate, createCategoryValidation, validate, entityController.createCategory);

/**
 * @swagger
 * /api/entities:
 *   get:
 *     summary: Obtener todas las entidades
 *     tags: [Entities]
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
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de entidades
 */
router.get('/', authenticate, hasPermission('entity.view'), entityController.getAll);

/**
 * @swagger
 * /api/entities/{id}:
 *   get:
 *     summary: Obtener entidad por ID
 *     tags: [Entities]
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
 *         description: Entidad encontrada
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', authenticate, hasPermission('entity.view'), entityController.getById);

/**
 * @swagger
 * /api/entities:
 *   post:
 *     summary: Crear nueva entidad
 *     tags: [Entities]
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
 *               - identification
 *               - entity_category_id
 *             properties:
 *               name:
 *                 type: string
 *               identification:
 *                 type: string
 *               entity_category_id:
 *                 type: integer
 *               meta:
 *                 type: object
 *     responses:
 *       201:
 *         description: Entidad creada exitosamente
 */
router.post('/', authenticate, hasPermission('entity.create'), createEntityValidation, validate, entityController.create);

/**
 * @swagger
 * /api/entities/{id}:
 *   put:
 *     summary: Actualizar entidad
 *     tags: [Entities]
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
 *         description: Entidad actualizada exitosamente
 */
router.put('/:id', authenticate, hasPermission('entity.update'), updateEntityValidation, validate, entityController.update);

/**
 * @swagger
 * /api/entities/{id}:
 *   delete:
 *     summary: Eliminar entidad
 *     tags: [Entities]
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
 *         description: Entidad eliminada exitosamente
 */
router.delete('/:id', authenticate, hasPermission('entity.delete'), entityController.delete);

export default router;
