import express from 'express';
import entityController from './entity.controller.js';
import { createEntityValidation, updateEntityValidation, createCategoryValidation } from './entity.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

// Categories routes
router.get('/categories', authenticate, entityController.getAllCategories);
router.post('/categories', authenticate, createCategoryValidation, validate, entityController.createCategory);

// Entities routes
router.get('/', authenticate, entityController.getAll);
router.get('/:id', authenticate, entityController.getById);
router.post('/', authenticate, createEntityValidation, validate, entityController.create);
router.put('/:id', authenticate, updateEntityValidation, validate, entityController.update);
router.delete('/:id', authenticate, entityController.delete);

export default router;
