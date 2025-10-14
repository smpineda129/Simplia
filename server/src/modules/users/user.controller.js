import { userService } from './user.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const userController = {
  getAll: asyncHandler(async (req, res) => {
    const users = await userService.getAll(req.query);

    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const user = await userService.getById(req.params.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const user = await userService.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: user,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const user = await userService.update(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user,
    });
  }),

  delete: asyncHandler(async (req, res) => {
    await userService.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente',
    });
  }),
};
