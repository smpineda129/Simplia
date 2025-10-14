import express from 'express';
import warehouseController from './warehouse.controller.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

// Box routes (MUST be before /:id routes to avoid conflicts)
router.get('/boxes', authenticate, warehouseController.getAllBoxes);
router.get('/boxes/:id', authenticate, warehouseController.getBoxById);
router.post('/boxes', authenticate, warehouseController.createBox);
router.put('/boxes/:id', authenticate, warehouseController.updateBox);
router.delete('/boxes/:id', authenticate, warehouseController.deleteBox);

// Warehouse routes
router.get('/', authenticate, warehouseController.getAllWarehouses);
router.get('/:id', authenticate, warehouseController.getWarehouseById);
router.post('/', authenticate, warehouseController.createWarehouse);
router.put('/:id', authenticate, warehouseController.updateWarehouse);
router.delete('/:id', authenticate, warehouseController.deleteWarehouse);

export default router;
