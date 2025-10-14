import { prisma } from '../../db/prisma.js';

class CorrespondenceService {
  // Generar radicado automático
  async generateRadicado(type = 'incoming') {
    const year = new Date().getFullYear();
    const prefix = type === 'incoming' ? 'IN' : 'OUT';
    
    // Obtener el último radicado del año
    const lastCorrespondence = await prisma.correspondence.findFirst({
      where: {
        [type === 'incoming' ? 'incomingRadicado' : 'outgoingRadicado']: {
          startsWith: `${prefix}-${year}-`,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let sequence = 1;
    if (lastCorrespondence) {
      const radicado = type === 'incoming' 
        ? lastCorrespondence.incomingRadicado 
        : lastCorrespondence.outgoingRadicado;
      
      if (radicado) {
        const parts = radicado.split('-');
        sequence = parseInt(parts[2]) + 1;
      }
    }

    return `${prefix}-${year}-${String(sequence).padStart(6, '0')}`;
  }

  async getAll(filters = {}) {
    const { search, companyId, status, correspondenceTypeId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(companyId && { companyId: parseInt(companyId) }),
      ...(status && { status }),
      ...(correspondenceTypeId && { correspondenceTypeId: parseInt(correspondenceTypeId) }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { incomingRadicado: { contains: search, mode: 'insensitive' } },
          { recipientName: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [correspondences, total] = await Promise.all([
      prisma.correspondence.findMany({
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
          correspondenceType: {
            select: {
              id: true,
              name: true,
            },
          },
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          createdByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: { threads: true },
          },
        },
      }),
      prisma.correspondence.count({ where }),
    ]);

    return {
      correspondences,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id) {
    const correspondence = await prisma.correspondence.findFirst({
      where: { id: parseInt(id), deletedAt: null },
      include: {
        company: true,
        correspondenceType: true,
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        threads: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!correspondence) {
      throw new Error('Correspondencia no encontrada');
    }

    return correspondence;
  }

  async create(data, userId) {
    // Generar radicado de entrada automáticamente
    const incomingRadicado = await this.generateRadicado('incoming');

    // Si no hay userId, usar un valor por defecto (primer usuario del sistema)
    let createdBy = userId;
    if (!createdBy) {
      const firstUser = await prisma.user.findFirst({
        where: { deletedAt: null },
        orderBy: { id: 'asc' },
      });
      createdBy = firstUser?.id || 1;
    }

    const correspondence = await prisma.correspondence.create({
      data: {
        title: data.title,
        companyId: parseInt(data.companyId),
        correspondenceTypeId: parseInt(data.correspondenceTypeId),
        recipientType: data.recipientType,
        recipientName: data.recipientName,
        recipientEmail: data.recipientEmail,
        advisorCode: data.advisorCode,
        assignedUserId: data.assignedUserId ? parseInt(data.assignedUserId) : null,
        createdByUserId: createdBy,
        comments: data.comments,
        incomingRadicado,
        status: data.assignedUserId ? 'assigned' : 'registered',
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            short: true,
          },
        },
        correspondenceType: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return correspondence;
  }

  async update(id, data) {
    const correspondence = await prisma.correspondence.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!correspondence) {
      throw new Error('Correspondencia no encontrada');
    }

    const updated = await prisma.correspondence.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        recipientName: data.recipientName,
        recipientEmail: data.recipientEmail,
        advisorCode: data.advisorCode,
        assignedUserId: data.assignedUserId ? parseInt(data.assignedUserId) : null,
        comments: data.comments,
        ...(data.assignedUserId && correspondence.status === 'registered' && { status: 'assigned' }),
      },
      include: {
        company: true,
        correspondenceType: true,
        assignedUser: true,
      },
    });

    return updated;
  }

  async delete(id) {
    const correspondence = await prisma.correspondence.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!correspondence) {
      throw new Error('Correspondencia no encontrada');
    }

    await prisma.correspondence.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    return { message: 'Correspondencia eliminada correctamente' };
  }

  // Hilos de conversación
  async createThread(correspondenceId, data, userId) {
    const correspondence = await this.getById(correspondenceId);

    // Si no hay userId, usar un valor por defecto
    let threadUserId = userId;
    if (!threadUserId) {
      const firstUser = await prisma.user.findFirst({
        where: { deletedAt: null },
        orderBy: { id: 'asc' },
      });
      threadUserId = firstUser?.id || 1;
    }

    const thread = await prisma.correspondenceThread.create({
      data: {
        correspondenceId: parseInt(correspondenceId),
        userId: threadUserId,
        message: data.message,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return thread;
  }

  // Responder correspondencia (genera radicado de salida y cierra)
  async respond(id, data, userId) {
    const correspondence = await this.getById(id);

    if (correspondence.status === 'closed') {
      throw new Error('La correspondencia ya está cerrada');
    }

    // Generar radicado de salida
    const outgoingRadicado = await this.generateRadicado('outgoing');

    const updated = await prisma.correspondence.update({
      where: { id: parseInt(id) },
      data: {
        outgoingRadicado,
        status: 'closed',
        closedAt: new Date(),
      },
      include: {
        company: true,
        correspondenceType: true,
        assignedUser: true,
      },
    });

    // Crear hilo con la respuesta
    await this.createThread(id, { message: data.response }, userId);

    return updated;
  }

  // Marcar como entregado físicamente
  async markAsDelivered(id) {
    const correspondence = await this.getById(id);

    const updated = await prisma.correspondence.update({
      where: { id: parseInt(id) },
      data: { deliveredPhysically: true },
    });

    return updated;
  }

  // Estadísticas
  async getStats(companyId) {
    const where = {
      deletedAt: null,
      ...(companyId && { companyId: parseInt(companyId) }),
    };

    const [total, registered, assigned, closed] = await Promise.all([
      prisma.correspondence.count({ where }),
      prisma.correspondence.count({ where: { ...where, status: 'registered' } }),
      prisma.correspondence.count({ where: { ...where, status: 'assigned' } }),
      prisma.correspondence.count({ where: { ...where, status: 'closed' } }),
    ]);

    return {
      total,
      registered,
      assigned,
      closed,
    };
  }
}

export default new CorrespondenceService();
