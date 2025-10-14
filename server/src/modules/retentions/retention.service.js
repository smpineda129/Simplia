import { prisma } from '../../db/prisma.js';

class RetentionService {
  async getAll(filters = {}) {
    const { search, companyId, areaId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(companyId && { companyId: parseInt(companyId) }),
      ...(areaId && { areaId: parseInt(areaId) }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [retentions, total] = await Promise.all([
      prisma.retention.findMany({
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
          _count: {
            select: { retentionLines: true },
          },
        },
      }),
      prisma.retention.count({ where }),
    ]);

    return {
      retentions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id) {
    const retention = await prisma.retention.findFirst({
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
        retentionLines: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: { retentionLines: true },
        },
      },
    });

    if (!retention) {
      throw new Error('Tabla de retención no encontrada');
    }

    return retention;
  }

  async create(data) {
    const retention = await prisma.retention.create({
      data: {
        name: data.name,
        code: data.code,
        date: new Date(data.date),
        comments: data.comments,
        companyId: parseInt(data.companyId),
        areaId: parseInt(data.areaId),
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

    return retention;
  }

  async update(id, data) {
    const retention = await prisma.retention.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!retention) {
      throw new Error('Tabla de retención no encontrada');
    }

    const updated = await prisma.retention.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        code: data.code,
        ...(data.date && { date: new Date(data.date) }),
        comments: data.comments,
        ...(data.companyId && { companyId: parseInt(data.companyId) }),
        ...(data.areaId && { areaId: parseInt(data.areaId) }),
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
    const retention = await prisma.retention.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!retention) {
      throw new Error('Tabla de retención no encontrada');
    }

    // Soft delete
    await prisma.retention.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    return { message: 'Tabla de retención eliminada correctamente' };
  }

  // Retention Lines methods
  async createLine(retentionId, data) {
    const retention = await this.getById(retentionId);

    const line = await prisma.retentionLine.create({
      data: {
        retentionId: parseInt(retentionId),
        series: data.series,
        subseries: data.subseries,
        documents: data.documents,
        code: data.code,
        localRetention: parseInt(data.localRetention),
        centralRetention: parseInt(data.centralRetention),
        dispositionCt: data.dispositionCt || false,
        dispositionE: data.dispositionE || false,
        dispositionM: data.dispositionM || false,
        dispositionD: data.dispositionD || false,
        dispositionS: data.dispositionS || false,
        comments: data.comments,
      },
    });

    return line;
  }

  async updateLine(lineId, data) {
    const line = await prisma.retentionLine.findFirst({
      where: { id: parseInt(lineId), deletedAt: null },
    });

    if (!line) {
      throw new Error('Línea de retención no encontrada');
    }

    const updated = await prisma.retentionLine.update({
      where: { id: parseInt(lineId) },
      data: {
        series: data.series,
        subseries: data.subseries,
        documents: data.documents,
        code: data.code,
        localRetention: parseInt(data.localRetention),
        centralRetention: parseInt(data.centralRetention),
        dispositionCt: data.dispositionCt,
        dispositionE: data.dispositionE,
        dispositionM: data.dispositionM,
        dispositionD: data.dispositionD,
        dispositionS: data.dispositionS,
        comments: data.comments,
      },
    });

    return updated;
  }

  async deleteLine(lineId) {
    const line = await prisma.retentionLine.findFirst({
      where: { id: parseInt(lineId), deletedAt: null },
    });

    if (!line) {
      throw new Error('Línea de retención no encontrada');
    }

    await prisma.retentionLine.update({
      where: { id: parseInt(lineId) },
      data: { deletedAt: new Date() },
    });

    return { message: 'Línea de retención eliminada correctamente' };
  }
}

export default new RetentionService();
