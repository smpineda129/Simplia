import { body } from 'express-validator';

export const createCorrespondenceTypeValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),

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

  body('expiration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La expiración debe ser un número entero positivo'),

  body('areaId')
    .optional()
    .isInt()
    .withMessage('El ID de área debe ser un número entero'),

  body('public')
    .optional()
    .isBoolean()
    .withMessage('El campo público debe ser un valor booleano'),
];

export const updateCorrespondenceTypeValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),

  body('companyId')
    .optional()
    .isInt()
    .withMessage('El ID de empresa debe ser un número entero'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La descripción debe tener máximo 255 caracteres'),

  body('expiration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La expiración debe ser un número entero positivo'),

  body('areaId')
    .optional()
    .isInt()
    .withMessage('El ID de área debe ser un número entero'),

  body('public')
    .optional()
    .isBoolean()
    .withMessage('El campo público debe ser un valor booleano'),
];
