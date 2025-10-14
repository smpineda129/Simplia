import { prisma } from '../../db/prisma.js';

class EntityService {
  async getAll(filters = {}) {
    const { search, companyId, categoryId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(companyId && { companyId: parseInt(companyId) }),
      ...(categoryId && { categoryId: parseInt(categoryId) }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [entities, total] = await Promise.all([
      prisma.entity.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          company: { select: { id: true, name: true, short: true } },
          category: { select: { id: true, name: true } },
        },
      }),
      prisma.entity.count({ where }),
    ]);

    return {
      entities,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id) {
    const entity = await prisma.entity.findFirst({
      where: { id: parseInt(id), deletedAt: null },
      include: {
        company: true,
        category: true,
      },
    });

    if (!entity) {
      throw new Error('Entidad no encontrada');
    }

    return entity;
  }

  async create(data) {
    const entity = await prisma.entity.create({
      data: {
        name: data.name,
        categoryId: parseInt(data.categoryId),
        companyId: parseInt(data.companyId),
        email: data.email,
        phone: data.phone,
        address: data.address,
        metadata: data.metadata || null,
      },
      include: {
        company: true,
        category: true,
      },
    });

    return entity;
  }

  async update(id, data) {
    const entity = await prisma.entity.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!entity) {
      throw new Error('Entidad no encontrada');
    }

    const updated = await prisma.entity.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        metadata: data.metadata,
        ...(data.categoryId && { categoryId: parseInt(data.categoryId) }),
      },
      include: {
        company: true,
        category: true,
      },
    });

    return updated;
  }

  async delete(id) {
    const entity = await prisma.entity.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!entity) {
      throw new Error('Entidad no encontrada');
    }

    await prisma.entity.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    return { message: 'Entidad eliminada correctamente' };
  }

  // Categories
  async getAllCategories(companyId) {
    return await prisma.entityCategory.findMany({
      where: {
        deletedAt: null,
        ...(companyId && { companyId: parseInt(companyId) }),
      },
      include: {
        _count: { select: { entities: true } },
      },
    });
  }

  async createCategory(data) {
    return await prisma.entityCategory.create({
      data: {
        name: data.name,
        companyId: parseInt(data.companyId),
      },
    });
  }
}

export default new EntityService();
