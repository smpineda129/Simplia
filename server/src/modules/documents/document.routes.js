import express from 'express';
import documentController from './document.controller.js';
import { createDocumentValidation, updateDocumentValidation } from './document.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, documentController.getAll);
router.get('/:id', authenticate, documentController.getById);
router.post('/', authenticate, createDocumentValidation, validate, documentController.create);
router.put('/:id', authenticate, updateDocumentValidation, validate, documentController.update);
router.delete('/:id', authenticate, documentController.delete);

export default router;
