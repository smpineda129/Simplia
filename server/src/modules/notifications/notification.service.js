import { prisma } from '../../db/prisma.js';
import { v4 as uuidv4 } from 'uuid';

// Tipos de notificación del sistema - escalable para otros módulos
export const NOTIFICATION_TYPES = {
  // Correspondencias
  CORRESPONDENCE_CREATED: 'App\\Notifications\\CorrespondenceCreated',
  CORRESPONDENCE_ASSIGNED: 'App\\Notifications\\CorrespondenceAssigned',
  CORRESPONDENCE_UPDATED: 'App\\Notifications\\CorrespondenceUpdated',
  CORRESPONDENCE_RESPONDED: 'App\\Notifications\\CorrespondenceResponded',
  CORRESPONDENCE_CLOSED: 'App\\Notifications\\CorrespondenceClosed',
  CORRESPONDENCE_THREAD_CREATED: 'App\\Notifications\\CorrespondenceThreadCreated',
  
  // Expedientes (para futuro uso)
  PROCEEDING_CREATED: 'App\\Notifications\\ProceedingCreated',
  PROCEEDING_ASSIGNED: 'App\\Notifications\\ProceedingAssigned',
  PROCEEDING_UPDATED: 'App\\Notifications\\ProceedingUpdated',
  
  // Documentos (para futuro uso)
  DOCUMENT_UPLOADED: 'App\\Notifications\\DocumentUploaded',
  DOCUMENT_SHARED: 'App\\Notifications\\DocumentShared',
  
  // Sistema general
  SYSTEM_NOTIFICATION: 'App\\Notifications\\SystemNotification',
};

// Plantillas de mensajes para cada tipo de notificación
const NOTIFICATION_TEMPLATES = {
  [NOTIFICATION_TYPES.CORRESPONDENCE_CREATED]: {
    title: 'Nueva correspondencia',
    getMessage: (data) => `Se ha creado una nueva correspondencia: ${data.title}`,
    icon: 'mail',
  },
  [NOTIFICATION_TYPES.CORRESPONDENCE_ASSIGNED]: {
    title: 'Correspondencia asignada',
    getMessage: (data) => `Se te ha asignado la correspondencia: ${data.title}`,
    icon: 'assignment_ind',
  },
  [NOTIFICATION_TYPES.CORRESPONDENCE_UPDATED]: {
    title: 'Correspondencia actualizada',
    getMessage: (data) => `La correspondencia "${data.title}" ha sido actualizada`,
    icon: 'edit',
  },
  [NOTIFICATION_TYPES.CORRESPONDENCE_RESPONDED]: {
    title: 'Respuesta recibida',
    getMessage: (data) => `La correspondencia "${data.title}" ha recibido una respuesta`,
    icon: 'reply',
  },
  [NOTIFICATION_TYPES.CORRESPONDENCE_CLOSED]: {
    title: 'Correspondencia cerrada',
    getMessage: (data) => `La correspondencia "${data.title}" ha sido cerrada`,
    icon: 'check_circle',
  },
  [NOTIFICATION_TYPES.CORRESPONDENCE_THREAD_CREATED]: {
    title: 'Nuevo mensaje',
    getMessage: (data) => `Nuevo mensaje en la correspondencia: ${data.title}`,
    icon: 'chat',
  },
  [NOTIFICATION_TYPES.SYSTEM_NOTIFICATION]: {
    title: 'Notificación del sistema',
    getMessage: (data) => data.message || 'Notificación del sistema',
    icon: 'info',
  },
};

class NotificationService {
  /**
   * Crear una notificación
   * @param {Object} params - Parámetros de la notificación
   * @param {string} params.type - Tipo de notificación (usar NOTIFICATION_TYPES)
   * @param {BigInt|number} params.notifiableId - ID del usuario que recibirá la notificación
   * @param {string} params.notifiableType - Tipo de modelo (por defecto 'App\\Models\\User')
   * @param {Object} params.data - Datos adicionales de la notificación
   */
  async create({ type, notifiableId, notifiableType = 'App\\Models\\User', data }) {
    const template = NOTIFICATION_TEMPLATES[type] || NOTIFICATION_TEMPLATES[NOTIFICATION_TYPES.SYSTEM_NOTIFICATION];
    
    const notificationData = {
      ...data,
      title: data.title || template.title,
      message: template.getMessage(data),
      icon: data.icon || template.icon,
      url: data.url || null,
      module: data.module || 'system',
      entityId: data.entityId || null,
      entityType: data.entityType || null,
    };

    const notification = await prisma.notification.create({
      data: {
        id: uuidv4(),
        type,
        notifiableType,
        notifiableId: BigInt(notifiableId),
        data: JSON.stringify(notificationData),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return this.formatNotification(notification);
  }

  /**
   * Crear notificaciones para múltiples usuarios
   */
  async createForMultipleUsers({ type, userIds, notifiableType = 'App\\Models\\User', data }) {
    const notifications = await Promise.all(
      userIds.map((userId) =>
        this.create({
          type,
          notifiableId: userId,
          notifiableType,
          data,
        })
      )
    );

    return notifications;
  }

  /**
   * Obtener notificaciones de un usuario
   */
  async getByUserId(userId, { page = 1, limit = 20, unreadOnly = false } = {}) {
    const skip = (page - 1) * limit;

    const where = {
      notifiableId: BigInt(userId),
      notifiableType: 'App\\Models\\User',
      ...(unreadOnly && { readAt: null }),
    };

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          notifiableId: BigInt(userId),
          notifiableType: 'App\\Models\\User',
          readAt: null,
        },
      }),
    ]);

    return {
      notifications: notifications.map(this.formatNotification),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    };
  }

  /**
   * Marcar notificación como leída
   */
  async markAsRead(notificationId, userId) {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        notifiableId: BigInt(userId),
      },
    });

    if (!notification) {
      throw new Error('Notificación no encontrada');
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });

    return this.formatNotification(updated);
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  async markAllAsRead(userId) {
    await prisma.notification.updateMany({
      where: {
        notifiableId: BigInt(userId),
        notifiableType: 'App\\Models\\User',
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    return { message: 'Todas las notificaciones han sido marcadas como leídas' };
  }

  /**
   * Obtener conteo de notificaciones no leídas
   */
  async getUnreadCount(userId) {
    const count = await prisma.notification.count({
      where: {
        notifiableId: BigInt(userId),
        notifiableType: 'App\\Models\\User',
        readAt: null,
      },
    });

    return { unreadCount: count };
  }

  /**
   * Eliminar una notificación
   */
  async delete(notificationId, userId) {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        notifiableId: BigInt(userId),
      },
    });

    if (!notification) {
      throw new Error('Notificación no encontrada');
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return { message: 'Notificación eliminada' };
  }

  /**
   * Eliminar todas las notificaciones de un usuario
   */
  async deleteAll(userId) {
    await prisma.notification.deleteMany({
      where: {
        notifiableId: BigInt(userId),
        notifiableType: 'App\\Models\\User',
      },
    });

    return { message: 'Todas las notificaciones han sido eliminadas' };
  }

  /**
   * Formatear notificación para respuesta
   */
  formatNotification(notification) {
    let parsedData = {};
    try {
      parsedData = JSON.parse(notification.data);
    } catch (e) {
      parsedData = { message: notification.data };
    }

    return {
      id: notification.id,
      type: notification.type,
      notifiableType: notification.notifiableType,
      notifiableId: notification.notifiableId.toString(),
      data: parsedData,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
      isRead: notification.readAt !== null,
    };
  }

  // ===============================
  // Métodos específicos para módulos
  // ===============================

  /**
   * Notificar creación de correspondencia
   */
  async notifyCorrespondenceCreated(correspondence, creatorId, recipientIds = []) {
    const data = {
      title: correspondence.title,
      correspondenceId: correspondence.id.toString(),
      radicado: correspondence.in_settled,
      module: 'correspondences',
      entityId: correspondence.id.toString(),
      entityType: 'Correspondence',
      url: `/correspondences/${correspondence.id}`,
    };

    // Notificar a los destinatarios (excluyendo al creador)
    const usersToNotify = recipientIds.filter((id) => id !== creatorId);
    
    if (usersToNotify.length > 0) {
      return this.createForMultipleUsers({
        type: NOTIFICATION_TYPES.CORRESPONDENCE_CREATED,
        userIds: usersToNotify,
        data,
      });
    }

    return [];
  }

  /**
   * Notificar asignación de correspondencia
   */
  async notifyCorrespondenceAssigned(correspondence, assignedUserId, assignerName) {
    return this.create({
      type: NOTIFICATION_TYPES.CORRESPONDENCE_ASSIGNED,
      notifiableId: assignedUserId,
      data: {
        title: correspondence.title,
        correspondenceId: correspondence.id.toString(),
        radicado: correspondence.in_settled,
        assignedBy: assignerName,
        module: 'correspondences',
        entityId: correspondence.id.toString(),
        entityType: 'Correspondence',
        url: `/correspondences/${correspondence.id}`,
      },
    });
  }

  /**
   * Notificar nuevo mensaje/hilo en correspondencia
   */
  async notifyCorrespondenceThread(correspondence, thread, senderName, recipientIds) {
    const data = {
      title: correspondence.title,
      correspondenceId: correspondence.id.toString(),
      threadId: thread.id.toString(),
      senderName,
      message: thread.message?.substring(0, 100) + (thread.message?.length > 100 ? '...' : ''),
      module: 'correspondences',
      entityId: correspondence.id.toString(),
      entityType: 'Correspondence',
      url: `/correspondences/${correspondence.id}`,
    };

    return this.createForMultipleUsers({
      type: NOTIFICATION_TYPES.CORRESPONDENCE_THREAD_CREATED,
      userIds: recipientIds,
      data,
    });
  }

  /**
   * Notificar respuesta de correspondencia
   */
  async notifyCorrespondenceResponded(correspondence, responderName, recipientIds) {
    const data = {
      title: correspondence.title,
      correspondenceId: correspondence.id.toString(),
      radicadoSalida: correspondence.out_settled,
      responderName,
      module: 'correspondences',
      entityId: correspondence.id.toString(),
      entityType: 'Correspondence',
      url: `/correspondences/${correspondence.id}`,
    };

    return this.createForMultipleUsers({
      type: NOTIFICATION_TYPES.CORRESPONDENCE_RESPONDED,
      userIds: recipientIds,
      data,
    });
  }

  /**
   * Notificar cierre de correspondencia
   */
  async notifyCorrespondenceClosed(correspondence, recipientIds) {
    const data = {
      title: correspondence.title,
      correspondenceId: correspondence.id.toString(),
      radicado: correspondence.in_settled,
      module: 'correspondences',
      entityId: correspondence.id.toString(),
      entityType: 'Correspondence',
      url: `/correspondences/${correspondence.id}`,
    };

    return this.createForMultipleUsers({
      type: NOTIFICATION_TYPES.CORRESPONDENCE_CLOSED,
      userIds: recipientIds,
      data,
    });
  }
}

export default new NotificationService();
