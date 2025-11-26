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
    });

    if (!type) {
      throw new Error('Tipo de correspondencia no encontrado');
    }

    return type;
  }

  async create(data) {
    // Filtrar solo los campos permitidos (sin id)
    const { id, createdAt, updatedAt, deletedAt, ...allowedData } = data;
    
    const type = await prisma.correspondenceType.create({
      data: {
        name: allowedData.name,
        description: allowedData.description,
        expiration: allowedData.expiration ? parseInt(allowedData.expiration) : 30, // Default 30 días
        public: allowedData.public !== undefined ? allowedData.public : true,
        companyId: parseInt(allowedData.companyId),
        areaId: allowedData.areaId ? parseInt(allowedData.areaId) : null,
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
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.expiration && { expiration: parseInt(data.expiration) }),
        ...(data.public !== undefined && { public: data.public }),
        ...(data.companyId && { companyId: parseInt(data.companyId) }),
        ...(data.areaId !== undefined && { areaId: data.areaId ? parseInt(data.areaId) : null }),
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
