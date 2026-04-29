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
 * /api/correspondences/export:
 *   get:
 *     summary: Exportar correspondencias a Excel
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
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Archivo Excel generado exitosamente
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/export', authenticate, hasPermission('correspondence.view'), correspondenceController.exportExcel);

/**
 * @swagger
 * /api/correspondences/stats:
 *   get:
 *     summary: Obtener estadísticas de correspondencia
 *     description: Retorna conteos por estado, tipo, prioridad y tendencias temporales
 *     tags: [Correspondences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de correspondencia
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 150
 *                     byStatus:
 *                       type: object
 *                     byPriority:
 *                       type: object
 *                     byType:
 *                       type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/stats', authenticate, hasPermission('correspondence.view'), correspondenceController.getStats);

/**
 * @swagger
 * /api/correspondences/area-users:
 *   get:
 *     summary: Obtener usuarios del área del usuario autenticado
 *     tags: [Correspondences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios del área
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/area-users', authenticate, hasPermission('correspondence.view'), correspondenceController.getAreaUsers);

/**
 * @swagger
 * /api/correspondences/company-users:
 *   get:
 *     summary: Obtener todos los usuarios de la empresa
 *     tags: [Correspondences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios de la empresa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/company-users', authenticate, hasPermission('correspondence.view'), correspondenceController.getCompanyUsers);

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
 *         description: Buscar por título, radicado o número de seguimiento
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
 *         name: typeId
 *         schema:
 *           type: integer
 *         description: Filtrar por tipo de correspondencia
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
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
 *         description: Lista de correspondencias paginada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/', authenticate, hasPermission('correspondence.view'), correspondenceController.getAll);

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
 *         description: ID de la correspondencia
 *     responses:
 *       200:
 *         description: Correspondencia encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Correspondence'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', authenticate, hasPermission('correspondence.view'), correspondenceController.getById);

/**
 * @swagger
 * /api/correspondences:
 *   post:
 *     summary: Crear nueva correspondencia
 *     description: Crea una correspondencia y genera automáticamente el número de radicado
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
 *               - typeId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Solicitud de información
 *               typeId:
 *                 type: integer
 *                 example: 1
 *                 description: ID del tipo de correspondencia
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 default: medium
 *               content:
 *                 type: string
 *                 example: Contenido de la correspondencia
 *               recipient_id:
 *                 type: integer
 *                 example: 2
 *                 description: ID del usuario destinatario
 *               origin_area_id:
 *                 type: integer
 *                 example: 1
 *               destination_area_id:
 *                 type: integer
 *                 example: 2
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de keys S3 adjuntos
 *     responses:
 *       201:
 *         description: Correspondencia creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Correspondence'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
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
 *             properties:
 *               title:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *               content:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [registered, in_transit, delivered]
 *     responses:
 *       200:
 *         description: Correspondencia actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Correspondence'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
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
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id', authenticate, hasPermission('correspondence.delete'), correspondenceController.delete);

/**
 * @swagger
 * /api/correspondences/{id}/threads:
 *   post:
 *     summary: Crear hilo de correspondencia (pase/asignación interna)
 *     description: Crea un hilo de seguimiento interno entre usuarios para la correspondencia
 *     tags: [Correspondences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la correspondencia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to_id
 *               - message
 *             properties:
 *               to_id:
 *                 type: integer
 *                 example: 2
 *                 description: ID del usuario destinatario del hilo
 *               message:
 *                 type: string
 *                 example: Por favor revisar y aprobar este documento
 *               answer:
 *                 type: string
 *                 example: Aprobado y enviado
 *     responses:
 *       201:
 *         description: Hilo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CorrespondenceThread'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/:id/threads', authenticate, hasPermission('correspondence.thread'), createThreadValidation, validate, correspondenceController.createThread);

/**
 * @swagger
 * /api/correspondences/{id}/threads/{threadId}:
 *   delete:
 *     summary: Eliminar hilo de correspondencia
 *     tags: [Correspondences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la correspondencia
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del hilo
 *     responses:
 *       200:
 *         description: Hilo eliminado exitosamente
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id/threads/:threadId', authenticate, hasPermission('correspondence.thread'), correspondenceController.deleteThread);

/**
 * @swagger
 * /api/correspondences/{id}/respond:
 *   post:
 *     summary: Responder a una correspondencia (genera radicado de salida)
 *     description: Genera una respuesta formal con radicado de salida automático
 *     tags: [Correspondences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la correspondencia a responder
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: En respuesta a su solicitud, adjuntamos los documentos requeridos
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de keys S3 de adjuntos
 *     responses:
 *       201:
 *         description: Respuesta creada con radicado de salida generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Correspondence'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/:id/respond', authenticate, hasPermission('correspondence.create'), respondValidation, validate, correspondenceController.respond);

/**
 * @swagger
 * /api/correspondences/{id}/mark-delivered:
 *   post:
 *     summary: Marcar correspondencia como entregada
 *     description: Actualiza el estado de la correspondencia a 'delivered'
 *     tags: [Correspondences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la correspondencia
 *     responses:
 *       200:
 *         description: Correspondencia marcada como entregada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Correspondence'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/:id/mark-delivered', authenticate, hasPermission('correspondence.update'), correspondenceController.markAsDelivered);

// ─── Document Folders ──────────────────────────────────────────────────────

/**
 * @swagger
 * /api/correspondences/{id}/folders:
 *   post:
 *     summary: Crear carpeta en la correspondencia
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Anexos
 *     responses:
 *       201:
 *         description: Carpeta creada exitosamente
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   get:
 *     summary: Obtener carpetas de la correspondencia
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
 *         description: Lista de carpetas
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.patch('/:id/documents/:documentId/folder', authenticate, hasPermission('correspondence.update'), correspondenceController.moveDocumentToFolder);
router.post('/:id/folders', authenticate, hasPermission('correspondence.update'), correspondenceController.createFolder);
router.get('/:id/folders', authenticate, hasPermission('correspondence.view'), correspondenceController.getFolders);

/**
 * @swagger
 * /api/correspondences/{id}/folders/{folderId}:
 *   delete:
 *     summary: Eliminar carpeta de la correspondencia
 *     tags: [Correspondences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: folderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carpeta eliminada exitosamente
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id/folders/:folderId', authenticate, hasPermission('correspondence.update'), correspondenceController.deleteFolder);

export default router;
