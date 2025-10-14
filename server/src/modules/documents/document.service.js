import { prisma } from '../../db/prisma.js';

class DocumentService {
  async getAll(filters = {}) {
    const { search, companyId, proceedingId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(companyId && { companyId: parseInt(companyId) }),
      ...(proceedingId && { proceedingId: parseInt(proceedingId) }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          company: { select: { id: true, name: true, short: true } },
          proceeding: { select: { id: true, name: true, code: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.document.count({ where }),
    ]);

    return {
      documents,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id) {
    const document = await prisma.document.findFirst({
      where: { id: parseInt(id), deletedAt: null },
      include: {
        company: true,
        proceeding: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!document) {
      throw new Error('Documento no encontrado');
    }

    return document;
  }

  async create(data, userId) {
    const document = await prisma.document.create({
      data: {
        name: data.name,
        description: data.description,
        filePath: data.filePath,
        fileSize: parseInt(data.fileSize),
        mimeType: data.mimeType,
        companyId: parseInt(data.companyId),
        proceedingId: data.proceedingId ? parseInt(data.proceedingId) : null,
        uploadedBy: userId,
      },
      include: {
        company: true,
        proceeding: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return document;
  }

  async update(id, data) {
    const document = await prisma.document.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!document) {
      throw new Error('Documento no encontrado');
    }

    const updated = await prisma.document.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        description: data.description,
        ...(data.proceedingId && { proceedingId: parseInt(data.proceedingId) }),
      },
      include: {
        company: true,
        proceeding: true,
      },
    });

    return updated;
  }

  async delete(id) {
    const document = await prisma.document.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!document) {
      throw new Error('Documento no encontrado');
    }

    await prisma.document.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    return { message: 'Documento eliminado correctamente' };
  }
}

export default new DocumentService();
