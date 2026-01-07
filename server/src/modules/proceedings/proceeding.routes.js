import express from 'express';
import proceedingController from './proceeding.controller.js';
import { createProceedingValidation, updateProceedingValidation } from './proceeding.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';
import { hasPermission } from '../../middlewares/permission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Proceedings
 *   description: Gestión de expedientes documentales
 */

/**
 * @swagger
 * /api/proceedings:
 *   get:
 *     summary: Obtener todos los expedientes
 *     tags: [Proceedings]
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
 *         description: Lista de expedientes
 */
router.get('/', authenticate, hasPermission('proceeding.view'), proceedingController.getAll);

/**
 * @swagger
 * /api/proceedings/{id}:
 *   get:
 *     summary: Obtener expediente por ID
 *     tags: [Proceedings]
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
 *         description: Expediente encontrado
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', authenticate, hasPermission('proceeding.view'), proceedingController.getById);

/**
 * @swagger
 * /api/proceedings:
 *   post:
 *     summary: Crear nuevo expediente
 *     tags: [Proceedings]
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
 *               - code
 *               - companyId
 *               - startDate
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               companyId:
 *                 type: integer
 *               retentionLineId:
 *                 type: integer
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               loan:
 *                 type: string
 *                 enum: [custody, loan, returned]
 *                 default: custody
 *     responses:
 *       201:
 *         description: Expediente creado exitosamente
 */
router.post('/', authenticate, hasPermission('proceeding.create'), createProceedingValidation, validate, proceedingController.create);

/**
 * @swagger
 * /api/proceedings/{id}:
 *   put:
 *     summary: Actualizar expediente
 *     tags: [Proceedings]
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
 *         description: Expediente actualizado exitosamente
 */
router.put('/:id', authenticate, hasPermission('proceeding.update'), updateProceedingValidation, validate, proceedingController.update);

/**
 * @swagger
 * /api/proceedings/{id}:
 *   delete:
 *     summary: Eliminar expediente
 *     tags: [Proceedings]
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
 *         description: Expediente eliminado exitosamente
 */
router.delete('/:id', authenticate, hasPermission('proceeding.delete'), proceedingController.delete);

export default router;
