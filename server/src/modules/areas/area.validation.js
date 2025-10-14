import { body } from 'express-validator';

export const createAreaValidation = [
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

  body('companyId')
    .notEmpty()
    .withMessage('La empresa es requerida')
    .isInt()
    .withMessage('El ID de empresa debe ser un número entero'),
];

export const updateAreaValidation = [
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

  body('companyId')
    .optional()
    .isInt()
    .withMessage('El ID de empresa debe ser un número entero'),
];

export const assignUsersValidation = [
  body('userIds')
    .isArray({ min: 1 })
    .withMessage('Debe proporcionar al menos un usuario')
    .custom((value) => {
      if (!value.every((id) => Number.isInteger(id))) {
        throw new Error('Todos los IDs de usuario deben ser números enteros');
      }
      return true;
    }),
];
