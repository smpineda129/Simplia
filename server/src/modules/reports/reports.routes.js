import { Router } from 'express';
import { reportsController } from './reports.controller.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * @swagger
 * /api/reports/summary:
 *   get:
 *     summary: Obtener resumen general del sistema
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumen general con estadísticas de usuarios e inventario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: object
 *                     inventory:
 *                       type: object
 *                     timestamp:
 *                       type: string
 */
router.get('/summary', reportsController.getSummary);

/**
 * @swagger
 * /api/reports/users:
 *   get:
 *     summary: Obtener reporte de usuarios
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte detallado de usuarios
 */
router.get('/users', reportsController.getUsersReport);

/**
 * @swagger
 * /api/reports/inventory:
 *   get:
 *     summary: Obtener reporte de inventario
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte detallado de inventario
 */
router.get('/inventory', reportsController.getInventoryReport);

export default router;
