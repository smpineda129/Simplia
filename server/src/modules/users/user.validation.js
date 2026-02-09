import { body, param } from 'express-validator';

export const userValidation = {
  create: [
    body('email')
      .isEmail()
      .withMessage('Debe proporcionar un correo electrónico válido')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('El nombre es requerido')
      .isLength({ min: 2 })
      .withMessage('El nombre debe tener al menos 2 caracteres'),
    body('role')
      .optional()
      .isIn(['USER', 'ADMIN', 'MANAGER'])
      .withMessage('Rol inválido'),
    body('roleId')
      .optional()
      .isInt()
      .withMessage('ID de rol inválido'),
  ],

  update: [
    param('id').isInt().withMessage('ID inválido'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Debe proporcionar un correo electrónico válido')
      .normalizeEmail(),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('El nombre debe tener al menos 2 caracteres'),
    body('role')
      .optional()
      .isIn(['USER', 'ADMIN', 'SUPER_ADMIN'])
      .withMessage('Rol inválido'),
    body('roleId')
      .optional()
      .isInt()
      .withMessage('ID de rol inválido'),
  ],

  getById: [
    param('id').isInt().withMessage('ID inválido'),
  ],

  delete: [
    param('id').isInt().withMessage('ID inválido'),
  ],
};
