import express from 'express';
import templateController from './template.controller.js';
import { createTemplateValidation, updateTemplateValidation } from './template.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Templates
 *   description: Gestión de plantillas con helpers dinámicos
 */

// Get available helpers
router.get('/helpers', authenticate, templateController.getHelpers);

// CRUD routes
router.get('/', authenticate, templateController.getAll);
router.get('/:id', authenticate, templateController.getById);
router.post('/', authenticate, createTemplateValidation, validate, templateController.create);
router.put('/:id', authenticate, updateTemplateValidation, validate, templateController.update);
router.delete('/:id', authenticate, templateController.delete);

// Process template with data
router.post('/:id/process', authenticate, templateController.processTemplate);

export default router;
