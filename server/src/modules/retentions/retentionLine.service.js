import { prisma } from '../../db/prisma.js';

class RetentionLineService {
  async getByRetentionId(retentionId) {
    const lines = await prisma.retentionLine.findMany({
      where: {
        retentionId: parseInt(retentionId),
        deletedAt: null,
      },
      orderBy: { id: 'asc' },
    });
    return lines;
  }

  async getById(id) {
    const line = await prisma.retentionLine.findFirst({
      where: {
        id: parseInt(id),
        deletedAt: null,
      },
      include: {
        retention: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    if (!line) {
      throw new Error('Línea de retención no encontrada');
    }

    return line;
  }

  async create(data) {
    const line = await prisma.retentionLine.create({
      data: {
        retentionId: parseInt(data.retentionId),
        series: data.series,
        subseries: data.subseries,
        code: data.code,
        documents: data.documents,
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

  async update(id, data) {
    const line = await prisma.retentionLine.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!line) {
      throw new Error('Línea de retención no encontrada');
    }

    const updated = await prisma.retentionLine.update({
      where: { id: parseInt(id) },
      data: {
        ...(data.series && { series: data.series }),
        ...(data.subseries && { subseries: data.subseries }),
        ...(data.code && { code: data.code }),
        ...(data.documents && { documents: data.documents }),
        ...(data.localRetention && { localRetention: parseInt(data.localRetention) }),
        ...(data.centralRetention && { centralRetention: parseInt(data.centralRetention) }),
        ...(data.dispositionCt !== undefined && { dispositionCt: data.dispositionCt }),
        ...(data.dispositionE !== undefined && { dispositionE: data.dispositionE }),
        ...(data.dispositionM !== undefined && { dispositionM: data.dispositionM }),
        ...(data.dispositionD !== undefined && { dispositionD: data.dispositionD }),
        ...(data.dispositionS !== undefined && { dispositionS: data.dispositionS }),
        ...(data.comments && { comments: data.comments }),
      },
    });

    return updated;
  }

  async delete(id) {
    const line = await prisma.retentionLine.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!line) {
      throw new Error('Línea de retención no encontrada');
    }

    // Soft delete
    await prisma.retentionLine.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    return { message: 'Línea de retención eliminada correctamente' };
  }
}

export default new RetentionLineService();
