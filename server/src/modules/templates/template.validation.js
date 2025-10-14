import { body } from 'express-validator';

export const createTemplateValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 2, max: 255 })
    .withMessage('El título debe tener entre 2 y 255 caracteres'),

  body('companyId')
    .notEmpty()
    .withMessage('La empresa es requerida')
    .isInt()
    .withMessage('El ID de empresa debe ser un número entero'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La descripción debe tener máximo 255 caracteres'),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('El contenido es requerido'),
];

export const updateTemplateValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('El título debe tener entre 2 y 255 caracteres'),

  body('companyId')
    .optional()
    .isInt()
    .withMessage('El ID de empresa debe ser un número entero'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La descripción debe tener máximo 255 caracteres'),

  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El contenido no puede estar vacío'),
];
