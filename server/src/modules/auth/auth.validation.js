import { body } from 'express-validator';

export const authValidation = {
  register: [
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
  ],

  login: [
    body('email')
      .isEmail()
      .withMessage('Debe proporcionar un correo electrónico válido')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('La contraseña es requerida'),
  ],

  refreshToken: [
    body('refreshToken')
      .notEmpty()
      .withMessage('El refresh token es requerido'),
  ],
};
