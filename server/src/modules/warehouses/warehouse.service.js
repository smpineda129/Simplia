import { prisma } from '../../db/prisma.js';

class WarehouseService {
  // Warehouses
  async getAllWarehouses(filters = {}) {
    const { search, companyId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(companyId && { companyId: parseInt(companyId) }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [warehouses, total] = await Promise.all([
      prisma.warehouse.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          company: { select: { id: true, name: true, short: true } },
          _count: { select: { boxes: true } },
        },
      }),
      prisma.warehouse.count({ where }),
    ]);

    return {
      warehouses,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getWarehouseById(id) {
    const warehouse = await prisma.warehouse.findFirst({
      where: { id: parseInt(id), deletedAt: null },
      include: {
        company: true,
        boxes: {
          where: { deletedAt: null },
          orderBy: { code: 'asc' },
        },
      },
    });

    if (!warehouse) {
      throw new Error('Bodega no encontrada');
    }

    return warehouse;
  }

  async createWarehouse(data) {
    const warehouse = await prisma.warehouse.create({
      data: {
        name: data.name,
        code: data.code,
        companyId: parseInt(data.companyId),
        address: data.address,
      },
      include: {
        company: true,
      },
    });

    return warehouse;
  }

  async updateWarehouse(id, data) {
    const warehouse = await prisma.warehouse.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!warehouse) {
      throw new Error('Bodega no encontrada');
    }

    const updated = await prisma.warehouse.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        code: data.code,
        address: data.address,
      },
      include: {
        company: true,
      },
    });

    return updated;
  }

  async deleteWarehouse(id) {
    const warehouse = await prisma.warehouse.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!warehouse) {
      throw new Error('Bodega no encontrada');
    }

    await prisma.warehouse.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    return { message: 'Bodega eliminada correctamente' };
  }

  // Boxes
  async getAllBoxes(filters = {}) {
    const { search, companyId, warehouseId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(companyId && { companyId: parseInt(companyId) }),
      ...(warehouseId && { warehouseId: parseInt(warehouseId) }),
      ...(search && {
        code: { contains: search, mode: 'insensitive' },
      }),
    };

    const [boxes, total] = await Promise.all([
      prisma.box.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          company: { select: { id: true, name: true, short: true } },
          warehouse: { select: { id: true, name: true, code: true } },
        },
      }),
      prisma.box.count({ where }),
    ]);

    return {
      boxes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getBoxById(id) {
    const box = await prisma.box.findFirst({
      where: { id: parseInt(id), deletedAt: null },
      include: {
        company: true,
        warehouse: true,
      },
    });

    if (!box) {
      throw new Error('Caja no encontrada');
    }

    return box;
  }

  async createBox(data) {
    const box = await prisma.box.create({
      data: {
        code: data.code,
        warehouseId: parseInt(data.warehouseId),
        companyId: parseInt(data.companyId),
        island: data.island,
        shelf: data.shelf,
        level: data.level,
      },
      include: {
        company: true,
        warehouse: true,
      },
    });

    return box;
  }

  async updateBox(id, data) {
    const box = await prisma.box.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!box) {
      throw new Error('Caja no encontrada');
    }

    const updated = await prisma.box.update({
      where: { id: parseInt(id) },
      data: {
        code: data.code,
        island: data.island,
        shelf: data.shelf,
        level: data.level,
        ...(data.warehouseId && { warehouseId: parseInt(data.warehouseId) }),
      },
      include: {
        company: true,
        warehouse: true,
      },
    });

    return updated;
  }

  async deleteBox(id) {
    const box = await prisma.box.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!box) {
      throw new Error('Caja no encontrada');
    }

    await prisma.box.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    return { message: 'Caja eliminada correctamente' };
  }
}

export default new WarehouseService();
