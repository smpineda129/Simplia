import express from 'express';
import retentionController from './retention.controller.js';
import retentionLineController from './retentionLine.controller.js';
import {
  createRetentionValidation,
  updateRetentionValidation,
  createRetentionLineValidation,
  updateRetentionLineValidation,
} from './retention.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Retentions
 *   description: Gestión de tablas de retención documental (TRD)
 */

/**
 * @swagger
 * /api/retentions:
 *   get:
 *     summary: Obtener todas las tablas de retención
 *     tags: [Retentions]
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
 *         description: Lista de tablas de retención
 */
router.get('/', authenticate, retentionController.getAll);

/**
 * @swagger
 * /api/retentions/{id}:
 *   get:
 *     summary: Obtener tabla de retención por ID
 *     tags: [Retentions]
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
 *         description: Tabla de retención encontrada
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', authenticate, retentionController.getById);

/**
 * @swagger
 * /api/retentions:
 *   post:
 *     summary: Crear nueva tabla de retención
 *     tags: [Retentions]
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
 *               - areaId
 *               - code
 *               - date
 *             properties:
 *               name:
 *                 type: string
 *               companyId:
 *                 type: integer
 *               areaId:
 *                 type: integer
 *               code:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               comments:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tabla de retención creada exitosamente
 */
router.post('/', authenticate, createRetentionValidation, validate, retentionController.create);

/**
 * @swagger
 * /api/retentions/{id}:
 *   put:
 *     summary: Actualizar tabla de retención
 *     tags: [Retentions]
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
 *         description: Tabla de retención actualizada exitosamente
 */
router.put('/:id', authenticate, updateRetentionValidation, validate, retentionController.update);

/**
 * @swagger
 * /api/retentions/{id}:
 *   delete:
 *     summary: Eliminar tabla de retención
 *     tags: [Retentions]
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
 *         description: Tabla de retención eliminada exitosamente
 */
router.delete('/:id', authenticate, retentionController.delete);

/**
 * @swagger
 * /api/retentions/{retentionId}/lines:
 *   get:
 *     summary: Obtener líneas de retención de una TRD
 *     tags: [Retentions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: retentionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de líneas de retención
 */
router.get('/:retentionId/lines', authenticate, retentionLineController.getByRetentionId);

/**
 * @swagger
 * /api/retentions/lines/{id}:
 *   get:
 *     summary: Obtener línea de retención por ID
 *     tags: [Retentions]
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
 *         description: Línea de retención encontrada
 */
router.get('/lines/:id', authenticate, retentionLineController.getById);

/**
 * @swagger
 * /api/retentions/{retentionId}/lines:
 *   post:
 *     summary: Crear nueva línea de retención
 *     tags: [Retentions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: retentionId
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
 *               - series
 *               - subseries
 *               - code
 *               - localRetention
 *               - centralRetention
 *             properties:
 *               series:
 *                 type: string
 *               subseries:
 *                 type: string
 *               documents:
 *                 type: string
 *               code:
 *                 type: string
 *               localRetention:
 *                 type: integer
 *               centralRetention:
 *                 type: integer
 *               disposition_ct:
 *                 type: boolean
 *               disposition_e:
 *                 type: boolean
 *               disposition_m:
 *                 type: boolean
 *               disposition_d:
 *                 type: boolean
 *               disposition_s:
 *                 type: boolean
 *               comments:
 *                 type: string
 *     responses:
 *       201:
 *         description: Línea de retención creada exitosamente
 */
router.post('/:retentionId/lines', authenticate, createRetentionLineValidation, validate, retentionLineController.create);

/**
 * @swagger
 * /api/retentions/lines/{id}:
 *   put:
 *     summary: Actualizar línea de retención
 *     tags: [Retentions]
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
 *         description: Línea de retención actualizada exitosamente
 */
router.put('/lines/:id', authenticate, updateRetentionLineValidation, validate, retentionLineController.update);

/**
 * @swagger
 * /api/retentions/lines/{id}:
 *   delete:
 *     summary: Eliminar línea de retención
 *     tags: [Retentions]
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
 *         description: Línea de retención eliminada exitosamente
 */
router.delete('/lines/:id', authenticate, retentionLineController.delete);

export default router;
