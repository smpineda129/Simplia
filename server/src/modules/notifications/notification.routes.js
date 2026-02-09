import express from 'express';
import notificationController from './notification.controller.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Sistema de notificaciones internas
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Obtener notificaciones del usuario autenticado
 *     description: |
 *       Retorna las notificaciones del usuario autenticado con paginación.
 *       Incluye el contador de notificaciones no leídas.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Cantidad de notificaciones por página
 *       - in: query
 *         name: unreadOnly
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Si es true, solo retorna notificaciones no leídas
 *     responses:
 *       200:
 *         description: Lista de notificaciones con paginación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationListResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', authenticate, notificationController.getAll);

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Obtener conteo de notificaciones no leídas
 *     description: Retorna el número total de notificaciones no leídas del usuario autenticado
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conteo de notificaciones no leídas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnreadCountResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/unread-count', authenticate, notificationController.getUnreadCount);

/**
 * @swagger
 * /api/notifications/mark-all-read:
 *   post:
 *     summary: Marcar todas las notificaciones como leídas
 *     description: Marca todas las notificaciones no leídas del usuario como leídas
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Todas las notificaciones marcadas como leídas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Todas las notificaciones han sido marcadas como leídas
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/mark-all-read', authenticate, notificationController.markAllAsRead);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   post:
 *     summary: Marcar notificación como leída
 *     description: Marca una notificación específica como leída y actualiza su fecha de lectura
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único de la notificación (UUID)
 *     responses:
 *       200:
 *         description: Notificación marcada como leída
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Notificación marcada como leída
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Notificación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/:id/read', authenticate, notificationController.markAsRead);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Eliminar notificación
 *     description: Elimina permanentemente una notificación específica del usuario
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único de la notificación (UUID)
 *     responses:
 *       200:
 *         description: Notificación eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Notificación eliminada
 *       400:
 *         description: Notificación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/:id', authenticate, notificationController.delete);

/**
 * @swagger
 * /api/notifications:
 *   delete:
 *     summary: Eliminar todas las notificaciones del usuario
 *     description: Elimina permanentemente todas las notificaciones del usuario autenticado
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Todas las notificaciones eliminadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Todas las notificaciones han sido eliminadas
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/', authenticate, notificationController.deleteAll);

export default router;
