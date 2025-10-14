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

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Correspondences
 *   description: Gestión de correspondencia con radicados automáticos
 */

// CRUD routes
router.get('/', authenticate, correspondenceController.getAll);
router.get('/stats', authenticate, correspondenceController.getStats);
router.get('/:id', authenticate, correspondenceController.getById);
router.post('/', authenticate, createCorrespondenceValidation, validate, correspondenceController.create);
router.put('/:id', authenticate, updateCorrespondenceValidation, validate, correspondenceController.update);
router.delete('/:id', authenticate, correspondenceController.delete);

// Thread routes
router.post('/:id/threads', authenticate, createThreadValidation, validate, correspondenceController.createThread);

// Action routes
router.post('/:id/respond', authenticate, respondValidation, validate, correspondenceController.respond);
router.post('/:id/mark-delivered', authenticate, correspondenceController.markAsDelivered);

export default router;
