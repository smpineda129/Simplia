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
 *   description: Gestión de tablas de retención documental
 */

// Retention routes
router.get('/', authenticate, retentionController.getAll);
router.get('/:id', authenticate, retentionController.getById);
router.post('/', authenticate, createRetentionValidation, validate, retentionController.create);
router.put('/:id', authenticate, updateRetentionValidation, validate, retentionController.update);
router.delete('/:id', authenticate, retentionController.delete);

// Retention Lines routes
router.get('/:retentionId/lines', authenticate, retentionLineController.getByRetentionId);
router.get('/lines/:id', authenticate, retentionLineController.getById);
router.post('/:retentionId/lines', authenticate, createRetentionLineValidation, validate, retentionLineController.create);
router.put('/lines/:id', authenticate, updateRetentionLineValidation, validate, retentionLineController.update);
router.delete('/lines/:id', authenticate, retentionLineController.delete);

export default router;
