import express from 'express';
import warehouseController from './warehouse.controller.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Warehouses
 *   description: Gestión de bodegas y ubicaciones físicas
 */

/**
 * @swagger
 * /api/warehouses/boxes:
 *   get:
 *     summary: Obtener todas las cajas
 *     tags: [Warehouses]
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
 *         description: Lista de cajas
 */
router.get('/boxes', authenticate, warehouseController.getAllBoxes);

/**
 * @swagger
 * /api/warehouses/boxes/{id}:
 *   get:
 *     summary: Obtener caja por ID
 *     tags: [Warehouses]
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
 *         description: Caja encontrada
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/boxes/:id', authenticate, warehouseController.getBoxById);

/**
 * @swagger
 * /api/warehouses/boxes:
 *   post:
 *     summary: Crear nueva caja
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *               companyId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Caja creada exitosamente
 */
router.post('/boxes', authenticate, warehouseController.createBox);

/**
 * @swagger
 * /api/warehouses/boxes/{id}:
 *   put:
 *     summary: Actualizar caja
 *     tags: [Warehouses]
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
 *         description: Caja actualizada exitosamente
 */
router.put('/boxes/:id', authenticate, warehouseController.updateBox);

/**
 * @swagger
 * /api/warehouses/boxes/{id}:
 *   delete:
 *     summary: Eliminar caja
 *     tags: [Warehouses]
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
 *         description: Caja eliminada exitosamente
 */
router.delete('/boxes/:id', authenticate, warehouseController.deleteBox);

/**
 * @swagger
 * /api/warehouses:
 *   get:
 *     summary: Obtener todas las bodegas
 *     tags: [Warehouses]
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
 *         description: Lista de bodegas
 */
router.get('/', authenticate, warehouseController.getAllWarehouses);

/**
 * @swagger
 * /api/warehouses/{id}:
 *   get:
 *     summary: Obtener bodega por ID
 *     tags: [Warehouses]
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
 *         description: Bodega encontrada
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', authenticate, warehouseController.getWarehouseById);

/**
 * @swagger
 * /api/warehouses:
 *   post:
 *     summary: Crear nueva bodega
 *     tags: [Warehouses]
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
 *             properties:
 *               name:
 *                 type: string
 *               companyId:
 *                 type: integer
 *               code:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bodega creada exitosamente
 */
router.post('/', authenticate, warehouseController.createWarehouse);

/**
 * @swagger
 * /api/warehouses/{id}:
 *   put:
 *     summary: Actualizar bodega
 *     tags: [Warehouses]
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
 *         description: Bodega actualizada exitosamente
 */
router.put('/:id', authenticate, warehouseController.updateWarehouse);

/**
 * @swagger
 * /api/warehouses/{id}:
 *   delete:
 *     summary: Eliminar bodega
 *     tags: [Warehouses]
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
 *         description: Bodega eliminada exitosamente
 */
router.delete('/:id', authenticate, warehouseController.deleteWarehouse);

export default router;
