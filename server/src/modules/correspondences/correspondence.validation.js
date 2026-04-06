import { body } from 'express-validator';

export const createCorrespondenceValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 3, max: 255 })
    .withMessage('El título debe tener entre 3 y 255 caracteres'),

  body('user_type')
    .notEmpty()
    .withMessage('El tipo de usuario es requerido')
    .isIn(['internal', 'external'])
    .withMessage('El tipo debe ser internal o external'),

  body('user_id')
    .notEmpty()
    .withMessage('El usuario es requerido')
    .isInt()
    .withMessage('El ID de usuario debe ser un número entero'),

  body('correspondenceTypeId')
    .optional({ nullable: true, checkFalsy: true })
    .isInt()
    .withMessage('El ID de tipo debe ser un número entero'),

  body('assignedUserId')
    .optional({ nullable: true, checkFalsy: true })
    .isInt()
    .withMessage('El ID de usuario asignado debe ser un número entero'),

  body('comments')
    .optional()
    .trim(),
];

export const updateCorrespondenceValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('El título debe tener entre 3 y 255 caracteres'),

  body('assignedUserId')
    .optional({ nullable: true, checkFalsy: true })
    .isInt()
    .withMessage('El ID de usuario debe ser un número entero'),

  body('comments')
    .optional()
    .trim(),
];

export const createThreadValidation = [
  body('message')
    .trim()
    .notEmpty()
    .withMessage('El mensaje es requerido')
    .isLength({ min: 1 })
    .withMessage('El mensaje no puede estar vacío'),
];

export const respondValidation = [
  body('response')
    .trim()
    .notEmpty()
    .withMessage('La respuesta es requerida')
    .isLength({ min: 10 })
    .withMessage('La respuesta debe tener al menos 10 caracteres'),
];
