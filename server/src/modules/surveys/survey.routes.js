import express from 'express';
import surveyController from './survey.controller.js';
import { createSurveyValidation, updateSurveyValidation, createSurveyDefinitionValidation } from './survey.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

// ===== SURVEY RESPONSES =====

// Estadísticas
router.get('/stats', authenticate, surveyController.getStats);

// CRUD
router.get('/', authenticate, surveyController.getAll);
router.get('/:id', authenticate, surveyController.getById);
router.post('/', authenticate, createSurveyValidation, validate, surveyController.create);
router.put('/:id', authenticate, updateSurveyValidation, validate, surveyController.update);
router.delete('/:id', authenticate, surveyController.delete);

// Generación de presentación
router.get('/:id/presentation', authenticate, surveyController.generateIndividualPresentation);

// ===== SURVEY DEFINITIONS =====

router.get('/definitions/all', authenticate, surveyController.getAllDefinitions);
router.get('/definitions/:name/active', authenticate, surveyController.getActiveDefinition);
router.get('/definitions/:id', authenticate, surveyController.getDefinitionById);
router.post('/definitions', authenticate, createSurveyDefinitionValidation, validate, surveyController.createOrUpdateDefinition);
router.delete('/definitions/:id', authenticate, surveyController.deleteDefinition);

export default router;
