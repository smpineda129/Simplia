import express from 'express';
import correspondenceTypeController from './correspondenceType.controller.js';
import { createCorrespondenceTypeValidation, updateCorrespondenceTypeValidation } from './correspondenceType.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';
import { hasPermission } from '../../middlewares/permission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CorrespondenceTypes
 *   description: Gestión de tipos de correspondencia
 */

/**
 * @swagger
 * /api/correspondence-types:
 *   get:
 *     summary: Obtener todos los tipos de correspondencia
 *     tags: [CorrespondenceTypes]
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
 *         description: Lista de tipos de correspondencia
 */
router.get('/', authenticate, hasPermission('correspondence_type.view'), correspondenceTypeController.getAll);

/**
 * @swagger
 * /api/correspondence-types/{id}:
 *   get:
 *     summary: Obtener tipo de correspondencia por ID
 *     tags: [CorrespondenceTypes]
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
 *         description: Tipo de correspondencia encontrado
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', authenticate, hasPermission('correspondence_type.view'), correspondenceTypeController.getById);

/**
 * @swagger
 * /api/correspondence-types:
 *   post:
 *     summary: Crear nuevo tipo de correspondencia
 *     tags: [CorrespondenceTypes]
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
 *               - companyId
 *               - description
 *               - expiration
 *             properties:
 *               name:
 *                 type: string
 *               companyId:
 *                 type: integer
 *               description:
 *                 type: string
 *               expiration:
 *                 type: integer
 *                 description: Días de expiración
 *               areaId:
 *                 type: integer
 *               public:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Tipo de correspondencia creado exitosamente
 */
router.post('/', authenticate, hasPermission('correspondence_type.create'), createCorrespondenceTypeValidation, validate, correspondenceTypeController.create);

/**
 * @swagger
 * /api/correspondence-types/{id}:
 *   put:
 *     summary: Actualizar tipo de correspondencia
 *     tags: [CorrespondenceTypes]
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
 *         description: Tipo de correspondencia actualizado exitosamente
 */
router.put('/:id', authenticate, hasPermission('correspondence_type.update'), updateCorrespondenceTypeValidation, validate, correspondenceTypeController.update);

/**
 * @swagger
 * /api/correspondence-types/{id}:
 *   delete:
 *     summary: Eliminar tipo de correspondencia
 *     tags: [CorrespondenceTypes]
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
 *         description: Tipo de correspondencia eliminado exitosamente
 */
router.delete('/:id', authenticate, hasPermission('correspondence_type.delete'), correspondenceTypeController.delete);

export default router;
