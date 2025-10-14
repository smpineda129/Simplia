import { body, param } from 'express-validator';

export const inventoryValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('El nombre es requerido')
      .isLength({ min: 2 })
      .withMessage('El nombre debe tener al menos 2 caracteres'),
    body('quantity')
      .isInt({ min: 0 })
      .withMessage('La cantidad debe ser un número entero positivo'),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('La categoría es requerida'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('El precio debe ser un número positivo'),
  ],

  update: [
    param('id').isUUID().withMessage('ID inválido'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('El nombre debe tener al menos 2 caracteres'),
    body('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('La cantidad debe ser un número entero positivo'),
    body('category')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('La categoría no puede estar vacía'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('El precio debe ser un número positivo'),
  ],

  getById: [
    param('id').isUUID().withMessage('ID inválido'),
  ],

  delete: [
    param('id').isUUID().withMessage('ID inválido'),
  ],
};
