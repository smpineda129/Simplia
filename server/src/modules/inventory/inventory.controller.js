import { inventoryService } from './inventory.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const inventoryController = {
  getAll: asyncHandler(async (req, res) => {
    const items = await inventoryService.getAll(req.query);

    res.status(200).json({
      success: true,
      data: items,
      count: items.length,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const item = await inventoryService.getById(req.params.id);

    res.status(200).json({
      success: true,
      data: item,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const item = await inventoryService.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Item creado exitosamente',
      data: item,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const item = await inventoryService.update(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Item actualizado exitosamente',
      data: item,
    });
  }),

  delete: asyncHandler(async (req, res) => {
    await inventoryService.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Item eliminado exitosamente',
    });
  }),

  getStats: asyncHandler(async (req, res) => {
    const stats = await inventoryService.getStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  }),
};
