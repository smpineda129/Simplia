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

  body('medium')
    .optional()
    .isIn(['digital', 'physical'])
    .withMessage('El medio debe ser digital o physical'),

  body('file')
    .optional()
    .trim(),

  body('correspondenceId')
    .optional({ nullable: true, checkFalsy: true })
    .isInt()
    .withMessage('El ID de correspondencia debe ser un número entero'),

  body('notes')
    .optional()
    .trim(),
];

export const updateDocumentValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),

  body('notes')
    .optional()
    .trim(),
];
