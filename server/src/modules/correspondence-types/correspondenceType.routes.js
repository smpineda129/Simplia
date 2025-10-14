import express from 'express';
import correspondenceTypeController from './correspondenceType.controller.js';
import { createCorrespondenceTypeValidation, updateCorrespondenceTypeValidation } from './correspondenceType.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CorrespondenceTypes
 *   description: Gestión de tipos de correspondencia
 */

router.get('/', authenticate, correspondenceTypeController.getAll);
router.get('/:id', authenticate, correspondenceTypeController.getById);
router.post('/', authenticate, createCorrespondenceTypeValidation, validate, correspondenceTypeController.create);
router.put('/:id', authenticate, updateCorrespondenceTypeValidation, validate, correspondenceTypeController.update);
router.delete('/:id', authenticate, correspondenceTypeController.delete);

export default router;
