import { body } from 'express-validator';

export const createCompanyValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 3, max: 255 })
    .withMessage('El nombre debe tener entre 3 y 255 caracteres'),

  body('identifier')
    .trim()
    .notEmpty()
    .withMessage('El identificador es requerido')
    .isLength({ min: 3, max: 255 })
    .withMessage('El identificador debe tener entre 3 y 255 caracteres'),

  body('short')
    .trim()
    .notEmpty()
    .withMessage('El nombre corto es requerido')
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre corto debe tener entre 2 y 255 caracteres'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Debe ser un email válido'),

  body('codeName')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('El código debe tener máximo 255 caracteres'),

  body('codeDescription')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La descripción del código debe tener máximo 255 caracteres'),

  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Debe ser una URL válida'),

  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Debe ser una URL válida'),

  body('watermarkUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Debe ser una URL válida'),

  body('maxUsers')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El máximo de usuarios debe ser un número positivo'),
];

export const updateCompanyValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('El nombre debe tener entre 3 y 255 caracteres'),

  body('identifier')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('El identificador debe tener entre 3 y 255 caracteres'),

  body('short')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre corto debe tener entre 2 y 255 caracteres'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Debe ser un email válido'),

  body('codeName')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('El código debe tener máximo 255 caracteres'),

  body('codeDescription')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La descripción del código debe tener máximo 255 caracteres'),

  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Debe ser una URL válida'),

  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Debe ser una URL válida'),

  body('watermarkUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Debe ser una URL válida'),

  body('maxUsers')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El máximo de usuarios debe ser un número positivo'),
];
