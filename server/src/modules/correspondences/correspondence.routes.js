import express from 'express';
import correspondenceController from './correspondence.controller.js';
import {
  createCorrespondenceValidation,
  updateCorrespondenceValidation,
  createThreadValidation,
  respondValidation,
} from './correspondence.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';
import { hasPermission } from '../../middlewares/permission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Correspondences
 *   description: Gestión de correspondencia con radicados automáticos
 */

/**
 * @swagger
 * /api/correspondences:
 *   get:
 *     summary: Obtener todas las correspondencias
 *     tags: [Correspondences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [registered, in_transit, delivered]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, urgent]
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
 *         description: Lista de correspondencias
 */
router.get('/', authenticate, hasPermission('correspondence.view'), correspondenceController.getAll);

/**
 * @swagger
 * /api/correspondences/stats:
 *   get:
 *     summary: Obtener estadísticas de correspondencia
 *     tags: [Correspondences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de correspondencia
 */
router.get('/stats', authenticate, hasPermission('correspondence.view'), correspondenceController.getStats);

/**
 * @swagger
 * /api/correspondences/{id}:
 *   get:
 *     summary: Obtener correspondencia por ID
 *     tags: [Correspondences]
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
 *         description: Correspondencia encontrada
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', authenticate, hasPermission('correspondence.view'), correspondenceController.getById);

/**
 * @swagger
 * /api/correspondences:
 *   post:
 *     summary: Crear nueva correspondencia
 *     tags: [Correspondences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - companyId
 *               - user_type
 *               - user_id
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               companyId:
 *                 type: integer
 *               user_type:
 *                 type: string
 *               user_id:
 *                 type: integer
 *               correspondenceTypeId:
 *                 type: integer
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 default: medium
 *               sender_id:
 *                 type: integer
 *               recipient_id:
 *                 type: integer
 *               origin_area_id:
 *                 type: integer
 *               destination_area_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Correspondencia creada exitosamente con radicado automático
 */
router.post('/', authenticate, hasPermission('correspondence.create'), createCorrespondenceValidation, validate, correspondenceController.create);

/**
 * @swagger
 * /api/correspondences/{id}:
 *   put:
 *     summary: Actualizar correspondencia
 *     tags: [Correspondences]
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
 *         description: Correspondencia actualizada exitosamente
 */
router.put('/:id', authenticate, hasPermission('correspondence.update'), updateCorrespondenceValidation, validate, correspondenceController.update);

/**
 * @swagger
 * /api/correspondences/{id}:
 *   delete:
 *     summary: Eliminar correspondencia
 *     tags: [Correspondences]
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
 *         description: Correspondencia eliminada exitosamente
 */
router.delete('/:id', authenticate, hasPermission('correspondence.delete'), correspondenceController.delete);

/**
 * @swagger
 * /api/correspondences/{id}/threads:
 *   post:
 *     summary: Crear hilo de conversación
 *     tags: [Correspondences]
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
 *               - message
 *               - from_id
 *             properties:
 *               message:
 *                 type: string
 *               from_id:
 *                 type: integer
 *               to_id:
 *                 type: integer
 *               answer:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hilo creado exitosamente
 */
router.post('/:id/threads', authenticate, hasPermission('correspondence.thread'), createThreadValidation, validate, correspondenceController.createThread);

/**
 * @swagger
 * /api/correspondences/{id}/respond:
 *   post:
 *     summary: Responder correspondencia
 *     tags: [Correspondences]
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
 *               - answer
 *             properties:
 *               answer:
 *                 type: string
 *     responses:
 *       200:
 *         description: Respuesta registrada exitosamente con radicado de salida
 */
router.post('/:id/respond', authenticate, hasPermission('correspondence.create'), respondValidation, validate, correspondenceController.respond);

/**
 * @swagger
 * /api/correspondences/{id}/mark-delivered:
 *   post:
 *     summary: Marcar correspondencia como entregada
 *     tags: [Correspondences]
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
 *         description: Correspondencia marcada como entregada
 */
router.post('/:id/mark-delivered', authenticate, hasPermission('correspondence.update'), correspondenceController.markAsDelivered);

export default router;
