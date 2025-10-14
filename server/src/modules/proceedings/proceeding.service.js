import { prisma } from '../../db/prisma.js';

class ProceedingService {
  async getAll(filters = {}) {
    const { search, companyId, retentionLineId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(companyId && { companyId: parseInt(companyId) }),
      ...(retentionLineId && { retentionLineId: parseInt(retentionLineId) }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [proceedings, total] = await Promise.all([
      prisma.proceeding.findMany({
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
          retentionLine: {
            select: {
              id: true,
              series: true,
              subseries: true,
              code: true,
              retention: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
            },
          },
        },
      }),
      prisma.proceeding.count({ where }),
    ]);

    return {
      proceedings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id) {
    const proceeding = await prisma.proceeding.findFirst({
      where: { id: parseInt(id), deletedAt: null },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            short: true,
          },
        },
        retentionLine: {
          select: {
            id: true,
            series: true,
            subseries: true,
            code: true,
            retention: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    if (!proceeding) {
      throw new Error('Expediente no encontrado');
    }

    return proceeding;
  }

  async create(data) {
    const proceeding = await prisma.proceeding.create({
      data: {
        name: data.name,
        code: data.code,
        startDate: new Date(data.startDate),
        companyOne: data.companyOne,
        companyTwo: data.companyTwo,
        companyId: parseInt(data.companyId),
        retentionLineId: parseInt(data.retentionLineId),
      },
      include: {
        company: {
          select: { id: true, name: true, short: true },
        },
        retentionLine: {
          select: { 
            id: true, 
            series: true, 
            subseries: true, 
            code: true,
            retention: {
              select: { id: true, name: true, code: true },
            },
          },
        },
      },
    });

    return proceeding;
  }

  async update(id, data) {
    const proceeding = await prisma.proceeding.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!proceeding) {
      throw new Error('Expediente no encontrado');
    }

    const updated = await prisma.proceeding.update({
      where: { id: parseInt(id) },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.code && { code: data.code }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
        ...(data.companyOne && { companyOne: data.companyOne }),
        ...(data.companyTwo && { companyTwo: data.companyTwo }),
        ...(data.companyId && { companyId: parseInt(data.companyId) }),
        ...(data.retentionLineId && { retentionLineId: parseInt(data.retentionLineId) }),
      },
      include: {
        company: {
          select: { id: true, name: true, short: true },
        },
        retentionLine: {
          select: {
            id: true,
            series: true,
            subseries: true,
            code: true,
            retention: {
              select: { id: true, name: true, code: true },
            },
          },
        },
      },
    });

    return updated;
  }

  async delete(id) {
    const proceeding = await prisma.proceeding.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!proceeding) {
      throw new Error('Expediente no encontrado');
    }

    // Soft delete
    await prisma.proceeding.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    return { message: 'Expediente eliminado correctamente' };
  }
}

export default new ProceedingService();
