import { prisma } from '../../db/prisma.js';
import notificationService from '../notifications/notification.service.js';
import emailService from '../../utils/emailService.js';

class CorrespondenceService {
  // Generar radicado automático
  async generateRadicado(correspondenceTypeId) {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    const dateStr = `${month}${day}${year}`;

    const correspondenceType = await prisma.correspondenceType.findUnique({
      where: { id: BigInt(correspondenceTypeId) },
      select: { name: true },
    });

    if (!correspondenceType) {
      throw new Error('Tipo de correspondencia no encontrado');
    }

    const prefix = correspondenceType.name.substring(0, 2).toUpperCase();

    const lastCorrespondence = await prisma.correspondence.findFirst({
      where: {
        in_settled: {
          startsWith: `${prefix}-${dateStr}-`,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let sequence = 1;
    if (lastCorrespondence && lastCorrespondence.in_settled) {
      const parts = lastCorrespondence.in_settled.split('-');
      if (parts.length >= 3) {
        sequence = parseInt(parts[2]) + 1;
      }
    }

    return `${prefix}-${dateStr}-${String(sequence).padStart(2, '0')}`;
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
            select: { id: true, name: true, short: true },
          },
          users_correspondences_sender_idTousers: {
            select: { id: true, name: true, email: true },
          },
          users_correspondences_recipient_idTousers: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { threads: true },
          },
        },
      }),
      prisma.correspondence.count({ where }),
    ]);

    // Fetch correspondence types separately (type mismatch between Int? and BigInt prevents Prisma relation)
    const typeIds = [...new Set(correspondences.map(c => c.correspondenceTypeId).filter(Boolean))];
    let typesMap = {};
    if (typeIds.length > 0) {
      const types = await prisma.correspondenceType.findMany({
        where: { id: { in: typeIds } },
        select: { id: true, name: true },
      });
      typesMap = Object.fromEntries(types.map(t => [Number(t.id), t]));
    }

    // Fetch user info for user_type/user_id (correspondence sender/recipient)
    const internalUserIds = [...new Set(correspondences.filter(c => c.user_type === 'internal' && c.user_id).map(c => BigInt(c.user_id)))];
    const externalUserIds = [...new Set(correspondences.filter(c => c.user_type === 'external' && c.user_id).map(c => BigInt(c.user_id)))];

    let internalUsersMap = {};
    let externalUsersMap = {};

    if (internalUserIds.length > 0) {
      const internalUsers = await prisma.user.findMany({
        where: { id: { in: internalUserIds } },
        select: { id: true, name: true, email: true },
      });
      internalUsersMap = Object.fromEntries(internalUsers.map(u => [Number(u.id), u]));
    }

    if (externalUserIds.length > 0) {
      const externalUsers = await prisma.externalUser.findMany({
        where: { id: { in: externalUserIds } },
        select: { id: true, name: true, email: true },
      });
      externalUsersMap = Object.fromEntries(externalUsers.map(u => [Number(u.id), u]));
    }

    const enriched = correspondences.map(c => {
      let correspondenceUser = null;
      if (c.user_id) {
        if (c.user_type === 'internal') {
          correspondenceUser = internalUsersMap[Number(c.user_id)] || null;
        } else {
          correspondenceUser = externalUsersMap[Number(c.user_id)] || null;
        }
      }

      return {
        ...c,
        correspondenceType: c.correspondenceTypeId ? typesMap[c.correspondenceTypeId] || null : null,
        assignedUser: c.users_correspondences_recipient_idTousers || null,
        correspondenceUser,
      };
    });

    return {
      correspondences: enriched,
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
        threads: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
          include: {
            users_correspondence_threads_from_idTousers: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },

        users_correspondences_sender_idTousers: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        users_correspondences_recipient_idTousers: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        correspondence_document: {
          where: { deleted_at: null },
          include: {
            documents: {
              select: { id: true, name: true, file: true, medium: true, createdAt: true, file_original_name: true },
            },
          },
        },
      },
    });

    if (!correspondence) {
      throw new Error('Correspondencia no encontrada');
    }

    // Fetch correspondence type with area
    let correspondenceType = null;
    if (correspondence.correspondenceTypeId) {
      const type = await prisma.correspondenceType.findUnique({
        where: { id: correspondence.correspondenceTypeId },
        select: { id: true, name: true, areaId: true, expiration: true },
      });
      if (type) {
        let area = null;
        if (type.areaId) {
          area = await prisma.area.findUnique({
            where: { id: BigInt(type.areaId) },
            select: { id: true, name: true },
          });
        }
        correspondenceType = { ...type, area };
      }
    }

    // Fetch user info for user_type/user_id
    let correspondenceUser = null;
    if (correspondence.user_id) {
      try {
        if (correspondence.user_type === 'internal') {
          correspondenceUser = await prisma.user.findUnique({
            where: { id: BigInt(correspondence.user_id) },
            select: { id: true, name: true, email: true },
          });
        } else {
          correspondenceUser = await prisma.externalUser.findUnique({
            where: { id: BigInt(correspondence.user_id) },
            select: { id: true, name: true, email: true },
          });
        }
      } catch (_) {
        // ignore if user not found
      }
    }

    // Resolve tagged user IDs to names for each thread
    const threadsWithTaggedNames = await Promise.all(
      (correspondence.threads || []).map(async (thread) => {
        const taggedIds = Array.isArray(thread.tagged_users) ? thread.tagged_users : [];
        if (taggedIds.length === 0) return thread;
        const taggedUsers = await prisma.user.findMany({
          where: { id: { in: taggedIds.map(id => BigInt(id)) } },
          select: { id: true, name: true, email: true },
        });
        return { ...thread, tagged_users_data: taggedUsers };
      })
    );

    return {
      ...correspondence,
      threads: threadsWithTaggedNames,
      correspondenceType,
      correspondenceUser,
    };
  }

  async create(data, userId) {
    if (!data.correspondenceTypeId) {
      throw new Error('El tipo de correspondencia es requerido');
    }

    const incomingRadicado = await this.generateRadicado(data.correspondenceTypeId);

    let createdBy = userId;
    if (!createdBy) {
      const firstUser = await prisma.user.findFirst({
        where: { deletedAt: null },
        orderBy: { id: 'asc' },
      });
      createdBy = firstUser?.id || 1;
    }

    // Determine companyId: from data or from context
    const companyId = data.companyId;
    if (!companyId) {
      throw new Error('El ID de empresa es requerido');
    }

    const correspondence = await prisma.correspondence.create({
      data: {
        title: data.title,
        companyId: parseInt(companyId),
        correspondenceTypeId: data.correspondenceTypeId ? parseInt(data.correspondenceTypeId) : null,
        comments: data.comments || null,
        user_type: data.user_type || 'internal',
        user_id: data.user_id ? Number(data.user_id) : Number(createdBy),
        type: data.user_type || 'internal',
        in_settled: incomingRadicado,
        status: data.assignedUserId ? 'assigned' : 'registered',
        recipient_id: data.assignedUserId ? BigInt(data.assignedUserId) : null,
        sender_id: BigInt(createdBy),
        attachments: data.attachments || null,
        createdAt: new Date(),
      },
      include: {
        company: true,
      },
    });

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
        ...(data.user_type && { user_type: data.user_type }),
        ...(data.user_id && { user_id: Number(data.user_id) }),
        ...(data.correspondenceTypeId !== undefined && {
          correspondenceTypeId: data.correspondenceTypeId ? parseInt(data.correspondenceTypeId) : null,
        }),
        recipient_id: data.assignedUserId ? BigInt(data.assignedUserId) : (data.assignedUserId === null ? null : undefined),
        ...(data.assignedUserId && correspondence.status === 'registered' && { status: 'assigned' }),
      },
      include: {
        company: true,
      },
    });

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

    let threadUserId = userId;
    if (!threadUserId) {
      const firstUser = await prisma.user.findFirst({
        where: { deletedAt: null },
        orderBy: { id: 'asc' },
      });
      threadUserId = firstUser?.id || 1;
    }

    const taggedUserIds = Array.isArray(data.taggedUserIds) ? data.taggedUserIds : [];

    const thread = await prisma.correspondenceThread.create({
      data: {
        correspondenceId: parseInt(correspondenceId),
        from_id: BigInt(threadUserId),
        to_id: data.to_id ? BigInt(data.to_id) : null,
        message: data.message,
        tagged_users: taggedUserIds.length > 0 ? taggedUserIds : null,
      },
      include: {
        users_correspondence_threads_from_idTousers: {
          select: { id: true, name: true, email: true, avatar: true },
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

    // Notificar a usuarios etiquetados
    if (taggedUserIds.length > 0) {
      try {
        const sender = await prisma.user.findUnique({
          where: { id: BigInt(threadUserId) },
          select: { name: true },
        });
        const toNotify = taggedUserIds.filter(uid => String(uid) !== String(threadUserId));
        if (toNotify.length > 0) {
          await notificationService.notifyCorrespondenceThread(
            correspondence,
            thread,
            sender?.name || 'Usuario',
            toNotify
          );
        }
      } catch (notifError) {
        console.error('Error al notificar usuarios etiquetados:', notifError);
      }
    }

    return thread;
  }

  async deleteThread(correspondenceId, threadId) {
    const thread = await prisma.correspondenceThread.findFirst({
      where: { id: parseInt(threadId), correspondenceId: parseInt(correspondenceId), deletedAt: null },
    });

    if (!thread) {
      throw new Error('Hilo no encontrado');
    }

    await prisma.correspondenceThread.update({
      where: { id: parseInt(threadId) },
      data: { deletedAt: new Date() },
    });

    return { message: 'Hilo eliminado correctamente' };
  }

  async getAreaUsers(correspondenceTypeId) {
    const type = await prisma.correspondenceType.findUnique({
      where: { id: parseInt(correspondenceTypeId) },
    });

    if (!type?.areaId) return [];

    const areaUsers = await prisma.areaUser.findMany({
      where: { areaId: BigInt(type.areaId), deletedAt: null },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    return areaUsers.map(au => au.user);
  }

  async getCompanyUsers(companyId, type = 'internal') {
    if (type === 'external') {
      const users = await prisma.externalUser.findMany({
        where: {
          companyId: BigInt(companyId),
          deletedAt: null,
        },
        select: { id: true, name: true, lastName: true, email: true },
        take: 200,
        orderBy: { name: 'asc' },
      });
      return users.map(u => ({ id: u.id, name: u.name, lastName: u.lastName, email: u.email }));
    } else {
      const users = await prisma.user.findMany({
        where: { companyId: BigInt(companyId), deletedAt: null },
        select: { id: true, name: true, email: true, avatar: true },
        take: 200,
        orderBy: { name: 'asc' },
      });
      return users;
    }
  }

  // Responder correspondencia (genera radicado de salida y cierra)
  async respond(id, data, userId) {
    const correspondence = await this.getById(id);

    if (correspondence.status === 'closed') {
      throw new Error('La correspondencia ya está cerrada');
    }

    if (!correspondence.correspondenceTypeId) {
      throw new Error('La correspondencia no tiene un tipo asociado');
    }

    const outgoingRadicado = await this.generateRadicado(correspondence.correspondenceTypeId);

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

    await this.createThread(id, { message: data.response }, userId);

    // Send email to original sender if email is available
    try {
      let recipientEmail = null;
      if (correspondence.user_type === 'external' && correspondence.comments) {
        const parsed = typeof correspondence.comments === 'string'
          ? JSON.parse(correspondence.comments)
          : correspondence.comments;
        recipientEmail = parsed?.senderEmail;
      } else if (correspondence.correspondenceUser?.email) {
        recipientEmail = correspondence.correspondenceUser.email;
      }

      if (recipientEmail) {
        const ccAddresses = Array.isArray(data.cc) ? data.cc : [];
        await emailService.send({
          to: recipientEmail,
          cc: ccAddresses.length > 0 ? ccAddresses : undefined,
          subject: `Re: ${correspondence.title} [${updated.out_settled}]`,
          html: `<p>${data.response.replace(/\n/g, '<br>')}</p>`,
          text: data.response,
        });
      }
    } catch (emailErr) {
      console.error('Error al enviar email de respuesta:', emailErr);
    }

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

  async markAsDelivered(id) {
    await this.getById(id);

    return prisma.correspondence.update({
      where: { id: parseInt(id) },
      data: { physical_delivered: true },
    });
  }

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

    return { total, registered, assigned, closed };
  }
}

export default new CorrespondenceService();
