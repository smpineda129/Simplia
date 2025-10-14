import express from 'express';
import proceedingController from './proceeding.controller.js';
import { createProceedingValidation, updateProceedingValidation } from './proceeding.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Proceedings
 *   description: Gestión de expedientes
 */

router.get('/', authenticate, proceedingController.getAll);
router.get('/:id', authenticate, proceedingController.getById);
router.post('/', authenticate, createProceedingValidation, validate, proceedingController.create);
router.put('/:id', authenticate, updateProceedingValidation, validate, proceedingController.update);
router.delete('/:id', authenticate, proceedingController.delete);

export default router;
