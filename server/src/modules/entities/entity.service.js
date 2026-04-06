import { prisma } from '../../db/prisma.js';

class EntityService {
  async getAll(filters = {}) {
    const { search, companyId, page = 1, limit = 10 } = filters;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      deletedAt: null,
      ...(companyId && { companyId: BigInt(companyId) }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { dni: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [entities, total] = await Promise.all([
      prisma.externalUser.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          company: { select: { id: true, name: true, short: true } },
        },
      }),
      prisma.externalUser.count({ where }),
    ]);

    return {
      entities,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  async getById(id) {
    const entity = await prisma.externalUser.findFirst({
      where: { id: BigInt(id), deletedAt: null },
      include: {
        company: { select: { id: true, name: true, short: true } },
      },
    });

    if (!entity) {
      throw new Error('Entidad no encontrada');
    }

    return entity;
  }

  async create(data) {
    const entity = await prisma.externalUser.create({
      data: {
        name: data.name,
        lastName: data.lastName || null,
        email: data.email || '',
        phone: data.phone || null,
        dni: data.dni || data.identification || null,
        state: data.state || data.department || null,
        city: data.city || null,
        address: data.address || null,
        ...(data.companyId && { companyId: BigInt(data.companyId) }),
      },
      include: {
        company: { select: { id: true, name: true, short: true } },
      },
    });

    return entity;
  }

  async update(id, data) {
    const entity = await prisma.externalUser.findFirst({
      where: { id: BigInt(id), deletedAt: null },
    });

    if (!entity) {
      throw new Error('Entidad no encontrada');
    }

    const updated = await prisma.externalUser.update({
      where: { id: BigInt(id) },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.lastName !== undefined && { lastName: data.lastName || null }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone || null }),
        ...(data.dni !== undefined && { dni: data.dni || null }),
        ...(data.identification !== undefined && { dni: data.identification || null }),
        ...(data.state !== undefined && { state: data.state || null }),
        ...(data.department !== undefined && { state: data.department || null }),
        ...(data.city !== undefined && { city: data.city || null }),
        ...(data.address !== undefined && { address: data.address || null }),
      },
      include: {
        company: { select: { id: true, name: true, short: true } },
      },
    });

    return updated;
  }

  async delete(id) {
    const entity = await prisma.externalUser.findFirst({
      where: { id: BigInt(id), deletedAt: null },
    });

    if (!entity) {
      throw new Error('Entidad no encontrada');
    }

    await prisma.externalUser.update({
      where: { id: BigInt(id) },
      data: { deletedAt: new Date() },
    });

    return { message: 'Entidad eliminada correctamente' };
  }
}

export default new EntityService();
