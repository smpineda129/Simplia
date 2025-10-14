import { prisma } from '../../db/prisma.js';

class CorrespondenceTypeService {
  async getAll(filters = {}) {
    const { search, companyId, areaId, publicOnly, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(companyId && { companyId: parseInt(companyId) }),
      ...(areaId && { areaId: parseInt(areaId) }),
      ...(publicOnly === 'true' && { public: true }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [types, total] = await Promise.all([
      prisma.correspondenceType.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              short: true,
            },
          },
          area: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      }),
      prisma.correspondenceType.count({ where }),
    ]);

    return {
      types,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id) {
    const type = await prisma.correspondenceType.findFirst({
      where: { id: parseInt(id), deletedAt: null },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            short: true,
          },
        },
        area: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    if (!type) {
      throw new Error('Tipo de correspondencia no encontrado');
    }

    return type;
  }

  async create(data) {
    const type = await prisma.correspondenceType.create({
      data: {
        name: data.name,
        description: data.description,
        expiration: data.expiration ? parseInt(data.expiration) : null,
        public: data.public || false,
        companyId: parseInt(data.companyId),
        areaId: data.areaId ? parseInt(data.areaId) : null,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            short: true,
          },
        },
        area: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return type;
  }

  async update(id, data) {
    const type = await prisma.correspondenceType.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!type) {
      throw new Error('Tipo de correspondencia no encontrado');
    }

    const updated = await prisma.correspondenceType.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        description: data.description,
        expiration: data.expiration ? parseInt(data.expiration) : null,
        public: data.public,
        ...(data.companyId && { companyId: parseInt(data.companyId) }),
        areaId: data.areaId ? parseInt(data.areaId) : null,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            short: true,
          },
        },
        area: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return updated;
  }

  async delete(id) {
    const type = await prisma.correspondenceType.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!type) {
      throw new Error('Tipo de correspondencia no encontrado');
    }

    // Soft delete
    await prisma.correspondenceType.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    return { message: 'Tipo de correspondencia eliminado correctamente' };
  }
}

export default new CorrespondenceTypeService();
