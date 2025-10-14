import { body } from 'express-validator';

export const createCorrespondenceValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 3, max: 255 })
    .withMessage('El título debe tener entre 3 y 255 caracteres'),

  body('companyId')
    .notEmpty()
    .withMessage('La empresa es requerida')
    .isInt()
    .withMessage('El ID de empresa debe ser un número entero'),

  body('correspondenceTypeId')
    .notEmpty()
    .withMessage('El tipo de correspondencia es requerido')
    .isInt()
    .withMessage('El ID de tipo debe ser un número entero'),

  body('recipientType')
    .notEmpty()
    .withMessage('El tipo de destinatario es requerido')
    .isIn(['internal', 'external'])
    .withMessage('El tipo debe ser internal o external'),

  body('recipientName')
    .trim()
    .notEmpty()
    .withMessage('El nombre del destinatario es requerido')
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),

  body('recipientEmail')
    .trim()
    .notEmpty()
    .withMessage('El email del destinatario es requerido')
    .isEmail()
    .withMessage('Debe ser un email válido'),

  body('advisorCode')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('El código de asesor debe tener máximo 255 caracteres'),

  body('assignedUserId')
    .optional({ nullable: true, checkFalsy: true })
    .isInt()
    .withMessage('El ID de usuario debe ser un número entero'),

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

  body('recipientName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),

  body('recipientEmail')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Debe ser un email válido'),

  body('advisorCode')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('El código de asesor debe tener máximo 255 caracteres'),

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
