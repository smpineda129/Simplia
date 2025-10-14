import { body } from 'express-validator';

export const createEntityValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),

  body('categoryId')
    .notEmpty()
    .withMessage('La categoría es requerida')
    .isInt()
    .withMessage('El ID de categoría debe ser un número entero'),

  body('companyId')
    .notEmpty()
    .withMessage('La empresa es requerida')
    .isInt()
    .withMessage('El ID de empresa debe ser un número entero'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Debe ser un email válido'),

  body('phone')
    .optional()
    .trim(),

  body('address')
    .optional()
    .trim(),

  body('metadata')
    .optional(),
];

export const updateEntityValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),

  body('categoryId')
    .optional()
    .isInt()
    .withMessage('El ID de categoría debe ser un número entero'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Debe ser un email válido'),

  body('phone')
    .optional()
    .trim(),

  body('address')
    .optional()
    .trim(),

  body('metadata')
    .optional(),
];

export const createCategoryValidation = [
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
];
