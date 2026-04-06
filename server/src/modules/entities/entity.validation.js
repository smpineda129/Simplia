import { body } from 'express-validator';

export const createEntityValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 255 }).withMessage('El nombre debe tener entre 2 y 255 caracteres'),
  body('lastName').optional().trim(),
  body('email').optional({ checkFalsy: true }).trim().isEmail().withMessage('Debe ser un email válido'),
  body('phone').optional().trim(),
  body('dni').optional().trim(),
  body('state').optional().trim(),
  body('city').optional().trim(),
  body('address').optional().trim(),
];

export const updateEntityValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 255 }).withMessage('El nombre debe tener entre 2 y 255 caracteres'),
  body('lastName').optional().trim(),
  body('email').optional({ checkFalsy: true }).trim().isEmail().withMessage('Debe ser un email válido'),
  body('phone').optional().trim(),
  body('dni').optional().trim(),
  body('state').optional().trim(),
  body('city').optional().trim(),
  body('address').optional().trim(),
];
