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
          _count: { select: { box_warehouse: true } },
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
        box_warehouse: {
          where: { deleted_at: null },
          include: {
            boxes: true,
          },
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
        companyId: BigInt(data.companyId),
        email: data.email,
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
        email: data.email,
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
      ...(companyId && { companyId: BigInt(companyId) }),
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
          box_warehouse: {
            include: {
              warehouses: { select: { id: true, name: true, code: true } },
            },
          },
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
        box_warehouse: {
          include: {
            warehouses: true,
          },
        },
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
        companyId: BigInt(data.companyId),
      },
      include: {
        company: true,
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
      },
      include: {
        company: true,
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
