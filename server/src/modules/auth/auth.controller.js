import { authService } from './auth.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const authController = {
  register: asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: result,
    });
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: result,
    });
  }),

  refreshToken: asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Token renovado exitosamente',
      data: result,
    });
  }),

  getCurrentUser: asyncHandler(async (req, res) => {
    const user = await authService.getCurrentUser(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  logout: asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Sesión cerrada exitosamente',
    });
  }),
};
