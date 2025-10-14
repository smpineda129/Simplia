import { Router } from 'express';
import { inventoryController } from './inventory.controller.js';
import { inventoryValidation } from './inventory.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * @swagger
 * /api/inventory/stats:
 *   get:
 *     summary: Obtener estadísticas del inventario
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas del inventario
 */
router.get('/stats', inventoryController.getStats);

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Obtener todos los items del inventario
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de items
 */
router.get('/', inventoryController.getAll);

/**
 * @swagger
 * /api/inventory/{id}:
 *   get:
 *     summary: Obtener item por ID
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item encontrado
 *       404:
 *         description: Item no encontrado
 */
router.get('/:id', inventoryValidation.getById, validate, inventoryController.getById);

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Crear nuevo item
 *     tags: [Inventory]
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
 *               - quantity
 *               - category
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Item creado
 */
router.post(
  '/',
  inventoryValidation.create,
  validate,
  inventoryController.create
);

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Actualizar item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item actualizado
 */
router.put(
  '/:id',
  inventoryValidation.update,
  validate,
  inventoryController.update
);

/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     summary: Eliminar item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item eliminado
 */
router.delete(
  '/:id',
  inventoryValidation.delete,
  validate,
  inventoryController.delete
);

export default router;
