import { userService } from './user.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const userController = {
  getAll: asyncHandler(async (req, res) => {
    // Enforce company scope
    if (req.user.companyId) {
      req.query.companyId = req.user.companyId;
    }

    const result = await userService.getAll(req.query);

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination,
      count: result.pagination.total,
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
    // If the requester belongs to a company, force the new user into that company
    const body = { ...req.body };
    if (req.user.companyId && !body.companyId) {
      body.companyId = req.user.companyId;
    }
    const user = await userService.create(body);

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

  uploadAvatar: asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se recibió ningún archivo' });
    }
    const { presignValue } = await import('../../utils/s3Presign.js');
    const key = req.file.key;
    await userService.update(req.params.id, { avatar: key });
    const url = await presignValue(key);
    res.json({ success: true, data: { key, url } });
  }),

  uploadSignature: asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se recibió ningún archivo' });
    }
    const { presignValue } = await import('../../utils/s3Presign.js');
    const key = req.file.key;
    await userService.update(req.params.id, { signature: key });
    const url = await presignValue(key);
    res.json({ success: true, data: { key, url } });
  }),

  sendSetPasswordEmail: asyncHandler(async (req, res) => {
    const result = await userService.sendSetPasswordEmail(req.params.id);
    res.json({ success: true, message: result.message });
  }),
};
