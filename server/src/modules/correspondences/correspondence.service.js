import { prisma } from '../../db/prisma.js';
import notificationService from '../notifications/notification.service.js';

class CorrespondenceService {
  // Generar radicado automático
  async generateRadicado(type = 'incoming') {
    const year = new Date().getFullYear();
    const prefix = type === 'incoming' ? 'IN' : 'OUT';
    
    // Obtener el último radicado del año
    const lastCorrespondence = await prisma.correspondence.findFirst({
      where: {
        [type === 'incoming' ? 'in_settled' : 'out_settled']: {
          startsWith: `${prefix}-${year}-`,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let sequence = 1;
    if (lastCorrespondence) {
      const radicado = type === 'incoming' 
        ? lastCorrespondence.in_settled 
        : lastCorrespondence.out_settled;
      
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
          { in_settled: { contains: search, mode: 'insensitive' } },
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
          // TODO: Agregar relación correspondenceType al schema
          // correspondenceType: {
          //   select: {
          //     id: true,
          //     name: true,
          //   },
          // },
          users_correspondences_sender_idTousers: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          users_correspondences_recipient_idTousers: {
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
        threads: true,
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
        comments: data.comments,
        // Campos obligatorios en el schema
        user_type: data.recipientType || 'internal',
        user_id: Number(createdBy),
        type: data.recipientType || 'internal',
        in_settled: incomingRadicado,
        status: data.assignedUserId ? 'assigned' : 'registered',
        recipient_id: data.assignedUserId ? BigInt(data.assignedUserId) : null,
        sender_id: BigInt(createdBy),
      },
      include: {
        company: true,
      },
    });

    // Crear notificación si hay un usuario asignado
    if (data.assignedUserId) {
      try {
        await notificationService.notifyCorrespondenceAssigned(
          correspondence,
          data.assignedUserId,
          'Sistema'
        );
      } catch (notifError) {
        console.error('Error al crear notificación:', notifError);
      }
    }

    return correspondence;
  }

  async update(id, data) {
    const correspondence = await prisma.correspondence.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!correspondence) {
      throw new Error('Correspondencia no encontrada');
    }

    const wasAssigned = correspondence.recipient_id;
    const isBeingAssigned = data.assignedUserId && !wasAssigned;

    const updated = await prisma.correspondence.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        comments: data.comments,
        recipient_id: data.assignedUserId ? BigInt(data.assignedUserId) : null,
        ...(data.assignedUserId && correspondence.status === 'registered' && { status: 'assigned' }),
      },
      include: {
        company: true,
      },
    });

    // Notificar si se está asignando a un nuevo usuario
    if (isBeingAssigned) {
      try {
        await notificationService.notifyCorrespondenceAssigned(
          updated,
          data.assignedUserId,
          'Sistema'
        );
      } catch (notifError) {
        console.error('Error al crear notificación:', notifError);
      }
    }

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
        from_id: BigInt(threadUserId),
        to_id: data.to_id ? BigInt(data.to_id) : null,
        message: data.message,
      },
      include: {
        users_correspondence_threads_from_idTousers: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Notificar al destinatario del thread si existe
    if (data.to_id && data.to_id !== threadUserId) {
      try {
        const sender = await prisma.user.findUnique({
          where: { id: BigInt(threadUserId) },
          select: { name: true },
        });
        await notificationService.notifyCorrespondenceThread(
          correspondence,
          thread,
          sender?.name || 'Usuario',
          [data.to_id]
        );
      } catch (notifError) {
        console.error('Error al crear notificación de thread:', notifError);
      }
    }

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
        out_settled: outgoingRadicado,
        status: 'closed',
      },
      include: {
        company: true,
      },
    });

    // Crear hilo con la respuesta
    await this.createThread(id, { message: data.response }, userId);

    // Notificar al remitente original que la correspondencia fue respondida
    if (correspondence.sender_id && correspondence.sender_id !== BigInt(userId)) {
      try {
        const responder = await prisma.user.findUnique({
          where: { id: BigInt(userId) },
          select: { name: true },
        });
        await notificationService.notifyCorrespondenceResponded(
          updated,
          responder?.name || 'Usuario',
          [Number(correspondence.sender_id)]
        );
      } catch (notifError) {
        console.error('Error al crear notificación de respuesta:', notifError);
      }
    }

    return updated;
  }

  // Marcar como entregado físicamente
  async markAsDelivered(id) {
    const correspondence = await this.getById(id);

    const updated = await prisma.correspondence.update({
      where: { id: parseInt(id) },
      data: { physical_delivered: true },
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
