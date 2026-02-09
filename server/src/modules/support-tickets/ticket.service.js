import { prisma } from '../../db/prisma.js';
import notificationService from '../notifications/notification.service.js';

const ticketService = {
  // Generate unique ticket number
  generateTicketNumber: async () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Get count of tickets this month
    const startOfMonth = new Date(year, date.getMonth(), 1);
    const count = await prisma.supportTicket.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });
    
    const sequence = String(count + 1).padStart(4, '0');
    return `TK-${year}${month}-${sequence}`;
  },

  // Get all tickets with filters
  getAll: async (filters = {}) => {
    const {
      status,
      priority,
      type,
      assignedToId,
      userId,
      companyId,
      isAnonymous,
      search,
      page: rawPage = 1,
      limit: rawLimit = 10,
    } = filters;
    
    // Convert to integers
    const page = parseInt(rawPage, 10);
    const limit = parseInt(rawLimit, 10);

    const where = {
      deletedAt: null,
    };

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (type) where.type = type;
    if (assignedToId) where.assignedToId = assignedToId === 'unassigned' ? null : BigInt(assignedToId);
    if (userId) where.userId = BigInt(userId);
    if (companyId) where.companyId = BigInt(companyId);
    if (isAnonymous !== undefined) where.isAnonymous = isAnonymous === 'true';
    
    if (search) {
      where.OR = [
        { ticketNumber: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { contactEmail: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          comments: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.supportTicket.count({ where }),
    ]);

    return {
      data: tickets,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Get ticket by ID
  getById: async (id) => {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: BigInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        comments: {
          where: { deletedAt: null },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        history: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return ticket;
  },

  // Create ticket (authenticated user)
  create: async (data, userId) => {
    const user = await prisma.user.findUnique({
      where: { id: BigInt(userId) },
      select: { companyId: true, name: true, email: true },
    });

    const ticketNumber = await ticketService.generateTicketNumber();

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        subject: data.subject,
        description: data.description,
        type: data.type,
        module: data.module,
        priority: data.priority || 'MEDIUM',
        imageUrl: data.imageUrl,
        userId: BigInt(userId),
        companyId: user.companyId,
        isAnonymous: false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Create history entry
    await prisma.ticketHistory.create({
      data: {
        ticketId: ticket.id,
        userId: BigInt(userId),
        action: 'CREATED',
        newValue: `Ticket creado: ${ticket.subject}`,
      },
    });

    return ticket;
  },

  // Create anonymous PQRS
  createAnonymous: async (data) => {
    const ticketNumber = await ticketService.generateTicketNumber();

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        subject: data.subject,
        description: data.description,
        type: 'PQRS',
        module: data.module,
        priority: 'MEDIUM',
        imageUrl: data.imageUrl,
        isAnonymous: true,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
      },
    });

    // Create history entry
    await prisma.ticketHistory.create({
      data: {
        ticketId: ticket.id,
        action: 'CREATED',
        newValue: `PQRS anónimo creado: ${ticket.subject}`,
      },
    });

    return ticket;
  },

  // Update ticket
  update: async (id, data, userId) => {
    const oldTicket = await prisma.supportTicket.findUnique({
      where: { id: BigInt(id) },
    });

    const ticket = await prisma.supportTicket.update({
      where: { id: BigInt(id) },
      data: {
        ...data,
        assignedToId: data.assignedToId ? BigInt(data.assignedToId) : undefined,
        resolvedAt: data.status === 'RESOLVED' && !oldTicket.resolvedAt ? new Date() : undefined,
        closedAt: data.status === 'CLOSED' && !oldTicket.closedAt ? new Date() : undefined,
      },
      include: {
        user: true,
        company: true,
        assignedTo: true,
      },
    });

    // Create history entries for changes
    const changes = [];
    if (data.status && data.status !== oldTicket.status) {
      changes.push({
        ticketId: ticket.id,
        userId: BigInt(userId),
        action: 'STATUS_CHANGED',
        field: 'status',
        oldValue: oldTicket.status,
        newValue: data.status,
      });
    }
    if (data.priority && data.priority !== oldTicket.priority) {
      changes.push({
        ticketId: ticket.id,
        userId: BigInt(userId),
        action: 'PRIORITY_CHANGED',
        field: 'priority',
        oldValue: oldTicket.priority,
        newValue: data.priority,
      });
    }
    if (data.assignedToId !== undefined && data.assignedToId !== oldTicket.assignedToId?.toString()) {
      changes.push({
        ticketId: ticket.id,
        userId: BigInt(userId),
        action: 'ASSIGNED',
        field: 'assignedToId',
        oldValue: oldTicket.assignedToId?.toString() || 'Sin asignar',
        newValue: data.assignedToId || 'Sin asignar',
      });
    }

    if (changes.length > 0) {
      await prisma.ticketHistory.createMany({ data: changes });
    }

    // Send notification when ticket is assigned
    if (data.assignedToId && data.assignedToId !== oldTicket.assignedToId?.toString()) {
      try {
        await notificationService.create({
          type: 'App\\Notifications\\TicketAssigned',
          notifiableId: parseInt(data.assignedToId),
          data: {
            ticketId: ticket.id.toString(),
            ticketNumber: ticket.ticketNumber,
            subject: ticket.subject,
            module: 'tickets',
            entityId: ticket.id.toString(),
            entityType: 'ticket',
            url: `/support/tickets/${ticket.id}`,
          },
        });
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
        // Don't fail the update if notification fails
      }
    }

    return ticket;
  },

  // Add comment
  addComment: async (ticketId, data, userId) => {
    // Get ticket info to determine who to notify
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: BigInt(ticketId) },
      select: {
        id: true,
        ticketNumber: true,
        subject: true,
        userId: true,
        assignedToId: true,
      },
    });

    const comment = await prisma.ticketComment.create({
      data: {
        ticketId: BigInt(ticketId),
        userId: userId ? BigInt(userId) : null,
        comment: data.comment,
        isInternal: data.isInternal || false,
        attachmentUrl: data.attachmentUrl || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    // Create history entry
    await prisma.ticketHistory.create({
      data: {
        ticketId: BigInt(ticketId),
        userId: userId ? BigInt(userId) : null,
        action: 'COMMENT_ADDED',
        newValue: data.isInternal ? 'Comentario interno agregado' : 'Comentario agregado',
      },
    });

    // Send notification - don't send for internal comments
    if (!data.isInternal && userId && ticket) {
      try {
        let notifyUserId = null;
        
        // If comment is from ticket creator, notify assignee
        if (ticket.userId && BigInt(userId) === ticket.userId && ticket.assignedToId) {
          notifyUserId = parseInt(ticket.assignedToId.toString());
        }
        // If comment is from assignee or other user, notify ticket creator
        else if (ticket.userId && BigInt(userId) !== ticket.userId) {
          notifyUserId = parseInt(ticket.userId.toString());
        }

        if (notifyUserId) {
          await notificationService.create({
            type: 'App\\Notifications\\TicketComment',
            notifiableId: notifyUserId,
            data: {
              ticketId: ticket.id.toString(),
              ticketNumber: ticket.ticketNumber,
              subject: ticket.subject,
              commentAuthor: comment.user?.name || 'Usuario',
              module: 'tickets',
              entityId: ticket.id.toString(),
              entityType: 'ticket',
              url: `/support/tickets/${ticket.id}`,
            },
          });
        }
      } catch (notifError) {
        console.error('Error creating comment notification:', notifError);
        // Don't fail the comment creation if notification fails
      }
    }

    return comment;
  },

  // Get statistics
  getStats: async (filters = {}) => {
    const { companyId, userId } = filters;
    
    const where = { deletedAt: null };
    if (companyId) where.companyId = BigInt(companyId);
    if (userId) where.userId = BigInt(userId);

    const [
      total,
      open,
      inProgress,
      resolved,
      closed,
      highPriority,
      unassigned,
    ] = await Promise.all([
      prisma.supportTicket.count({ where }),
      prisma.supportTicket.count({ where: { ...where, status: 'OPEN' } }),
      prisma.supportTicket.count({ where: { ...where, status: 'IN_PROGRESS' } }),
      prisma.supportTicket.count({ where: { ...where, status: 'RESOLVED' } }),
      prisma.supportTicket.count({ where: { ...where, status: 'CLOSED' } }),
      prisma.supportTicket.count({ where: { ...where, priority: { in: ['HIGH', 'URGENT'] } } }),
      prisma.supportTicket.count({ where: { ...where, assignedToId: null } }),
    ]);

    return {
      total,
      open,
      inProgress,
      resolved,
      closed,
      highPriority,
      unassigned,
    };
  },

  // Delete ticket (soft delete)
  delete: async (id) => {
    return await prisma.supportTicket.update({
      where: { id: BigInt(id) },
      data: { deletedAt: new Date() },
    });
  },
};

export default ticketService;
