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
        address: data.address || null,
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
        address: data.address ?? undefined,
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
      ...(warehouseId && {
        box_warehouse: { some: { warehouse_id: BigInt(warehouseId), deleted_at: null } },
      }),
    };

    const [rawBoxes, total] = await Promise.all([
      prisma.box.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          company: { select: { id: true, name: true, short: true } },
          box_warehouse: {
            where: { deleted_at: null },
            include: {
              warehouses: { select: { id: true, name: true, code: true } },
            },
          },
        },
      }),
      prisma.box.count({ where }),
    ]);

    const boxes = rawBoxes.map(box => {
      const bw = box.box_warehouse?.[0];
      return {
        ...box,
        warehouseId: bw?.warehouses?.id || null,
        warehouse: bw?.warehouses || null,
        island: bw?.island || null,
        shelf: bw?.shelving || null,
        level: bw?.shelf || null,
      };
    });

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
      include: { company: true },
    });

    if (data.warehouseId) {
      await prisma.box_warehouse.create({
        data: {
          warehouse_id: BigInt(data.warehouseId),
          box_id: box.id,
          island: data.island || null,
          shelving: data.shelf || null,
          shelf: data.level || null,
        },
      });
    }

    const bwEntry = data.warehouseId
      ? await prisma.box_warehouse.findFirst({
          where: { box_id: box.id, deleted_at: null },
          include: { warehouses: { select: { id: true, name: true, code: true } } },
        })
      : null;

    return {
      ...box,
      warehouseId: bwEntry?.warehouses?.id || null,
      warehouse: bwEntry?.warehouses || null,
      island: bwEntry?.island || null,
      shelf: bwEntry?.shelving || null,
      level: bwEntry?.shelf || null,
    };
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
      data: { code: data.code },
      include: { company: true },
    });

    const existingBw = await prisma.box_warehouse.findFirst({
      where: { box_id: BigInt(id), deleted_at: null },
    });

    if (existingBw) {
      await prisma.box_warehouse.update({
        where: { id: existingBw.id },
        data: {
          island: data.island || null,
          shelving: data.shelf || null,
          shelf: data.level || null,
        },
      });
    } else if (data.warehouseId) {
      await prisma.box_warehouse.create({
        data: {
          warehouse_id: BigInt(data.warehouseId),
          box_id: BigInt(id),
          island: data.island || null,
          shelving: data.shelf || null,
          shelf: data.level || null,
        },
      });
    }

    const bwEntry = await prisma.box_warehouse.findFirst({
      where: { box_id: BigInt(id), deleted_at: null },
      include: { warehouses: { select: { id: true, name: true, code: true } } },
    });

    return {
      ...updated,
      warehouseId: bwEntry?.warehouses?.id || null,
      warehouse: bwEntry?.warehouses || null,
      island: bwEntry?.island || null,
      shelf: bwEntry?.shelving || null,
      level: bwEntry?.shelf || null,
    };
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
