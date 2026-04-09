import { prisma } from '../../db/prisma.js';
import notificationService from '../notifications/notification.service.js';
import emailService from '../../utils/emailService.js';
import { correspondenceAssignedEmailTemplate } from '../../templates/correspondenceAssignedEmail.js';
import { correspondenceResponseEmailTemplate } from '../../templates/correspondenceResponseEmail.js';
import ExcelJS from 'exceljs';
import s3, { BUCKET } from '../../config/storage.js';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { presignValue } from '../../utils/s3Presign.js';

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

      // Send email notification
      try {
        const assignedUser = await prisma.user.findUnique({
          where: { id: BigInt(data.assignedUserId) },
          select: { id: true, name: true, email: true },
        });

        if (assignedUser?.email) {
          const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
          const correspondenceUrl = `${clientUrl}/correspondences/${correspondence.id}`;

          const emailHtml = correspondenceAssignedEmailTemplate({
            userName: assignedUser.name,
            correspondenceTitle: correspondence.title,
            correspondenceRadicado: correspondence.in_settled,
            correspondenceUrl,
            assignedBy: 'Sistema',
            companyName: correspondence.company?.name || 'Simplia',
            logoUrl: `${clientUrl}/Horizontal_Logo.jpeg`,
          });

          await emailService.send({
            to: assignedUser.email,
            subject: `📋 Nueva correspondencia asignada: ${correspondence.title}`,
            html: emailHtml,
          });
          
          console.log(`[CorrespondenceService] ✅ Email sent to ${assignedUser.email}`);
        }
      } catch (emailError) {
        console.error('[CorrespondenceService] ❌ Error sending email:', emailError);
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

      // Send email notification
      try {
        const assignedUser = await prisma.user.findUnique({
          where: { id: BigInt(data.assignedUserId) },
          select: { id: true, name: true, email: true },
        });

        if (assignedUser?.email) {
          const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
          const correspondenceUrl = `${clientUrl}/correspondences/${updated.id}`;

          const emailHtml = correspondenceAssignedEmailTemplate({
            userName: assignedUser.name,
            correspondenceTitle: updated.title,
            correspondenceRadicado: updated.in_settled,
            correspondenceUrl,
            assignedBy: 'Sistema',
            companyName: updated.company?.name || 'Simplia',
            logoUrl: `${clientUrl}/Horizontal_Logo.jpeg`,
          });

          await emailService.send({
            to: assignedUser.email,
            subject: `📋 Nueva correspondencia asignada: ${updated.title}`,
            html: emailHtml,
          });
          
          console.log(`[CorrespondenceService] ✅ Email sent to ${assignedUser.email}`);
        }
      } catch (emailError) {
        console.error('[CorrespondenceService] ❌ Error sending email:', emailError);
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
        createdAt: new Date(),
      },
      include: {
        users_correspondence_threads_from_idTousers: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    // Auto-reassign correspondence to first tagged user
    if (taggedUserIds.length > 0) {
      try {
        await prisma.correspondence.update({
          where: { id: parseInt(correspondenceId) },
          data: {
            recipient_id: BigInt(taggedUserIds[0]),
            status: 'assigned',
          },
        });
      } catch (reassignError) {
        console.error('Error al reasignar correspondencia:', reassignError);
      }
    }

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
      let recipientName = '';
      let corrUser = correspondence.correspondenceUser;

      if (correspondence.user_type === 'external' && correspondence.comments) {
        const parsed = typeof correspondence.comments === 'string'
          ? JSON.parse(correspondence.comments)
          : correspondence.comments;
        recipientEmail = parsed?.senderEmail;
        recipientName = parsed?.senderName || '';
      } else if (corrUser?.email) {
        recipientEmail = corrUser.email;
        recipientName = corrUser.name || '';
      }

      if (recipientEmail) {
        const ccAddresses = Array.isArray(data.cc) ? data.cc : [];
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

        // Fetch responder details (used in both paths)
        const responderRaw = await prisma.user.findUnique({
          where: { id: BigInt(userId) },
          select: { name: true, email: true, signature: true },
        });

        // Presign signature and company logo
        const [signatureUrl, logoUrl] = await Promise.all([
          presignValue(responderRaw?.signature),
          presignValue(updated.company?.imageUrl),
        ]);

        const responder = { ...responderRaw, signature: signatureUrl };

        let emailHtml;
        let emailAttachments = [];

        if (data.templateId) {
          // ── Case 1: Template ──────────────────────────────────────────────
          const template = await prisma.template.findFirst({
            where: { id: parseInt(data.templateId), deletedAt: null },
            select: { content: true, title: true },
          });

          if (template?.content) {
            const today = new Date();
            emailHtml = template.content
              .replace(/\{fecha\}/g, today.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }))
              .replace(/\{dia\}/g, today.getDate())
              .replace(/\{mes\}/g, today.toLocaleString('es-ES', { month: 'long' }))
              .replace(/\{ano\}/g, today.getFullYear())
              .replace(/\{radicado_entrada\}/g, correspondence.in_settled || '')
              .replace(/\{radicado_salida\}/g, updated.out_settled || '')
              .replace(/\{nombre\}/g, corrUser?.name || '')
              .replace(/\{apellido\}/g, corrUser?.lastName || '')
              .replace(/\{dni\}/g, corrUser?.dni || corrUser?.documentNumber || '')
              .replace(/\{correo\}/g, corrUser?.email || recipientEmail || '')
              .replace(/\{mi_nombre\}/g, responder?.name || '')
              .replace(/\{mi_correo\}/g, responder?.email || '')
              .replace(/\{mi_cargo\}/g, '')
              .replace(/\{firma\}/g, responder?.signature
                ? `<img src="${responder.signature}" alt="Firma" style="max-height:80px;max-width:200px;" />`
                : '');
          }
        } else {
          // ── Case 2: Plain message (+ optional document attachment) ────────
          // Fetch file from S3 and attach if provided
          if (data.documentKey) {
            try {
              const s3Obj = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: data.documentKey }));
              const chunks = [];
              for await (const chunk of s3Obj.Body) {
                chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
              }
              const fileBuffer = Buffer.concat(chunks);
              emailAttachments.push({
                filename: data.documentName || data.documentKey.split('/').pop(),
                content: fileBuffer,
              });
            } catch (s3Err) {
              console.error('[CorrespondenceService] Could not fetch S3 attachment:', s3Err.message);
            }
          }

          emailHtml = correspondenceResponseEmailTemplate({
            recipientName,
            correspondenceTitle: correspondence.title,
            inSettled: correspondence.in_settled,
            outSettled: updated.out_settled,
            message: data.response,
            responderName: responder?.name || '',
            responderSignature: signatureUrl || '',
            companyName: updated.company?.name || process.env.MAIL_FROM_NAME || 'Simplia',
            logoUrl: logoUrl || `${clientUrl}/Horizontal_Logo.jpeg`,
            hasAttachment: emailAttachments.length > 0,
            attachmentName: emailAttachments[0]?.filename || '',
          });
        }

        if (!emailHtml) {
          emailHtml = correspondenceResponseEmailTemplate({
            recipientName,
            correspondenceTitle: correspondence.title,
            inSettled: correspondence.in_settled,
            outSettled: updated.out_settled,
            message: data.response,
            responderName: responder?.name || '',
            responderSignature: signatureUrl || '',
            companyName: updated.company?.name || process.env.MAIL_FROM_NAME || 'Simplia',
            logoUrl: logoUrl || `${clientUrl}/Horizontal_Logo.jpeg`,
          });
        }

        await emailService.send({
          to: recipientEmail,
          cc: ccAddresses.length > 0 ? ccAddresses : undefined,
          subject: `Re: ${correspondence.title} [${updated.out_settled}]`,
          html: emailHtml,
          text: data.response,
          attachments: emailAttachments.length > 0 ? emailAttachments : undefined,
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

    // Auto-save response document to "respuesta" folder
    try {
      if (data.documentKey || data.templateId) {
        const folder = await this.getOrCreateResponseFolder(id);

        let docName = null;
        let docFile = null;

        if (data.documentKey) {
          docName = data.documentName || 'Respuesta';
          docFile = data.documentKey;
        } else if (data.templateId) {
          const template = await prisma.template.findFirst({
            where: { id: parseInt(data.templateId), deletedAt: null },
            select: { title: true },
          });
          docName = template ? `Respuesta - ${template.title}` : 'Respuesta (plantilla)';
        }

        if (docName) {
          const doc = await prisma.document.create({
            data: {
              name: docName,
              file: docFile || null,
              file_original_name: docName,
              medium: 'digital',
              companyId: correspondence.companyId ? parseInt(correspondence.companyId) : null,
              documentDate: new Date(),
              createdAt: new Date(),
            },
          });
          await prisma.correspondence_document.create({
            data: {
              correspondence_id: BigInt(id),
              document_id: doc.id,
              folder_id: folder.id,
              created_at: new Date(),
              updated_at: new Date(),
            },
          });
        }
      }
    } catch (docError) {
      console.error('Error al guardar documento de respuesta:', docError);
    }

    return updated;
  }

  async getOrCreateResponseFolder(correspondenceId) {
    const existing = await prisma.correspondenceFolder.findFirst({
      where: { correspondenceId: parseInt(correspondenceId), name: 'respuesta', deletedAt: null },
    });
    if (existing) return existing;
    return prisma.correspondenceFolder.create({
      data: {
        correspondenceId: parseInt(correspondenceId),
        name: 'respuesta',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
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

  // ─── Document Folders ─────────────────────────────────────────────────────

  async createFolder(correspondenceId, name) {
    const folder = await prisma.correspondenceFolder.create({
      data: {
        correspondenceId: parseInt(correspondenceId),
        name,
        createdAt: new Date(),
      },
    });
    return folder;
  }

  async getFolders(correspondenceId) {
    return prisma.correspondenceFolder.findMany({
      where: { correspondenceId: parseInt(correspondenceId), deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
  }

  async deleteFolder(correspondenceId, folderId) {
    const folder = await prisma.correspondenceFolder.findFirst({
      where: { id: parseInt(folderId), correspondenceId: parseInt(correspondenceId), deletedAt: null },
    });
    if (!folder) throw new Error('Carpeta no encontrada');

    await prisma.correspondenceFolder.update({
      where: { id: parseInt(folderId) },
      data: { deletedAt: new Date() },
    });

    return { message: 'Carpeta eliminada correctamente' };
  }

  // ─── Export Excel ──────────────────────────────────────────────────────────

  async exportExcel(filters = {}, res) {
    const { startDate, endDate, companyId, search, status } = filters;

    const where = {
      deletedAt: null,
      ...(companyId && { companyId: parseInt(companyId) }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { in_settled: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(startDate && endDate && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
    };

    const correspondences = await prisma.correspondence.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 5000,
      include: {
        company: { select: { name: true } },
        users_correspondences_sender_idTousers: { select: { name: true } },
        users_correspondences_recipient_idTousers: { select: { name: true } },
      },
    });

    // Fetch types
    const typeIds = [...new Set(correspondences.map(c => c.correspondenceTypeId).filter(Boolean))];
    let typesMap = {};
    if (typeIds.length > 0) {
      const types = await prisma.correspondenceType.findMany({
        where: { id: { in: typeIds } },
        select: { id: true, name: true },
      });
      typesMap = Object.fromEntries(types.map(t => [Number(t.id), t.name]));
    }

    const statusLabel = (s) => ({ registered: 'Registrada', assigned: 'Asignada', closed: 'Cerrada' }[s] || s || '');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Correspondencias');

    worksheet.columns = [
      { header: 'Radicado', key: 'settled', width: 22 },
      { header: 'Título', key: 'title', width: 40 },
      { header: 'Estado', key: 'status', width: 14 },
      { header: 'Tipo', key: 'type', width: 25 },
      { header: 'Remitente', key: 'sender', width: 28 },
      { header: 'Asignado a', key: 'recipient', width: 28 },
      { header: 'Empresa', key: 'company', width: 25 },
      { header: 'Fecha Creación', key: 'createdAt', width: 18 },
    ];

    correspondences.forEach(c => {
      worksheet.addRow({
        settled: c.in_settled || '',
        title: c.title || '',
        status: statusLabel(c.status),
        type: typesMap[c.correspondenceTypeId] || '',
        sender: c.users_correspondences_sender_idTousers?.name || '',
        recipient: c.users_correspondences_recipient_idTousers?.name || '',
        company: c.company?.name || '',
        createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString('es-ES') : '',
      });
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="Correspondencias_${Date.now()}.xlsx"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    await workbook.xlsx.write(res);
    res.end();
  }
}

export default new CorrespondenceService();
