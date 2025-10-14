import { body } from 'express-validator';

export const createProceedingValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),

  body('code')
    .trim()
    .notEmpty()
    .withMessage('El código es requerido')
    .isLength({ min: 2, max: 255 })
    .withMessage('El código debe tener entre 2 y 255 caracteres'),

  body('startDate')
    .notEmpty()
    .withMessage('La fecha inicial es requerida')
    .isISO8601()
    .withMessage('Debe ser una fecha válida'),

  body('companyId')
    .notEmpty()
    .withMessage('La empresa es requerida')
    .isInt()
    .withMessage('El ID de empresa debe ser un número entero'),

  body('retentionLineId')
    .notEmpty()
    .withMessage('La línea de retención es requerida')
    .isInt()
    .withMessage('El ID de línea de retención debe ser un número entero'),

  body('companyOne')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Empresa Uno debe tener máximo 255 caracteres'),

  body('companyTwo')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Empresa Dos debe tener máximo 255 caracteres'),
];

export const updateProceedingValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),

  body('code')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('El código debe tener entre 2 y 255 caracteres'),

  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Debe ser una fecha válida'),

  body('companyId')
    .optional()
    .isInt()
    .withMessage('El ID de empresa debe ser un número entero'),

  body('retentionLineId')
    .optional()
    .isInt()
    .withMessage('El ID de línea de retención debe ser un número entero'),

  body('companyOne')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Empresa Uno debe tener máximo 255 caracteres'),

  body('companyTwo')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Empresa Dos debe tener máximo 255 caracteres'),
];
