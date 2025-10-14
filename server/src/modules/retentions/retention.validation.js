import { body } from 'express-validator';

export const createRetentionValidation = [
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

  body('date')
    .notEmpty()
    .withMessage('La fecha es requerida')
    .isISO8601()
    .withMessage('Debe ser una fecha válida'),

  body('companyId')
    .notEmpty()
    .withMessage('La empresa es requerida')
    .isInt()
    .withMessage('El ID de empresa debe ser un número entero'),

  body('areaId')
    .notEmpty()
    .withMessage('El área es requerida')
    .isInt()
    .withMessage('El ID de área debe ser un número entero'),

  body('comments')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Los comentarios deben tener máximo 255 caracteres'),
];

export const updateRetentionValidation = [
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

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Debe ser una fecha válida'),

  body('companyId')
    .optional()
    .isInt()
    .withMessage('El ID de empresa debe ser un número entero'),

  body('areaId')
    .optional()
    .isInt()
    .withMessage('El ID de área debe ser un número entero'),

  body('comments')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Los comentarios deben tener máximo 255 caracteres'),
];

export const createRetentionLineValidation = [
  body('series')
    .trim()
    .notEmpty()
    .withMessage('La serie es requerida')
    .isLength({ min: 2, max: 255 })
    .withMessage('La serie debe tener entre 2 y 255 caracteres'),

  body('subseries')
    .trim()
    .notEmpty()
    .withMessage('La subserie es requerida')
    .isLength({ min: 2, max: 255 })
    .withMessage('La subserie debe tener entre 2 y 255 caracteres'),

  body('code')
    .trim()
    .notEmpty()
    .withMessage('El código es requerido')
    .isLength({ min: 2, max: 255 })
    .withMessage('El código debe tener entre 2 y 255 caracteres'),

  body('localRetention')
    .notEmpty()
    .withMessage('El tiempo de retención local es requerido')
    .isInt({ min: 0 })
    .withMessage('Debe ser un número entero positivo'),

  body('centralRetention')
    .notEmpty()
    .withMessage('El tiempo de retención central es requerido')
    .isInt({ min: 0 })
    .withMessage('Debe ser un número entero positivo'),

  body('documents')
    .optional()
    .trim(),

  body('dispositionCt')
    .optional()
    .isBoolean()
    .withMessage('Debe ser un valor booleano'),

  body('dispositionE')
    .optional()
    .isBoolean()
    .withMessage('Debe ser un valor booleano'),

  body('dispositionM')
    .optional()
    .isBoolean()
    .withMessage('Debe ser un valor booleano'),

  body('dispositionD')
    .optional()
    .isBoolean()
    .withMessage('Debe ser un valor booleano'),

  body('dispositionS')
    .optional()
    .isBoolean()
    .withMessage('Debe ser un valor booleano'),

  body('comments')
    .optional()
    .trim(),
];

export const updateRetentionLineValidation = [
  body('series')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('La serie debe tener entre 2 y 255 caracteres'),

  body('subseries')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('La subserie debe tener entre 2 y 255 caracteres'),

  body('code')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('El código debe tener entre 2 y 255 caracteres'),

  body('localRetention')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Debe ser un número entero positivo'),

  body('centralRetention')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Debe ser un número entero positivo'),

  body('documents')
    .optional()
    .trim(),

  body('dispositionCt')
    .optional()
    .isBoolean()
    .withMessage('Debe ser un valor booleano'),

  body('dispositionE')
    .optional()
    .isBoolean()
    .withMessage('Debe ser un valor booleano'),

  body('dispositionM')
    .optional()
    .isBoolean()
    .withMessage('Debe ser un valor booleano'),

  body('dispositionD')
    .optional()
    .isBoolean()
    .withMessage('Debe ser un valor booleano'),

  body('dispositionS')
    .optional()
    .isBoolean()
    .withMessage('Debe ser un valor booleano'),

  body('comments')
    .optional()
    .trim(),
];
