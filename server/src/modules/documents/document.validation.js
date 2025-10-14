import { body } from 'express-validator';

export const createDocumentValidation = [
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

  body('filePath')
    .trim()
    .notEmpty()
    .withMessage('La ruta del archivo es requerida'),

  body('fileSize')
    .notEmpty()
    .withMessage('El tamaño del archivo es requerido')
    .isInt()
    .withMessage('El tamaño debe ser un número entero'),

  body('mimeType')
    .trim()
    .notEmpty()
    .withMessage('El tipo MIME es requerido'),

  body('description')
    .optional()
    .trim(),

  body('proceedingId')
    .optional()
    .isInt()
    .withMessage('El ID de expediente debe ser un número entero'),
];

export const updateDocumentValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),

  body('description')
    .optional()
    .trim(),

  body('proceedingId')
    .optional()
    .isInt()
    .withMessage('El ID de expediente debe ser un número entero'),
];
