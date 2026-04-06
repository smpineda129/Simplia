import { prisma } from '../../db/prisma.js';
import emailService from '../../utils/emailService.js';
import { proceedingSharedEmailTemplate } from '../../templates/proceedingSharedEmail.js';

class ProceedingService {
  async getAll(filters = {}) {
    const { search, companyId, retentionLineId, retentionId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(companyId && { companyId: parseInt(companyId) }),
      ...(retentionLineId && { retentionLineId: parseInt(retentionLineId) }),
      ...(retentionId && { retentionLine: { is: { retentionId: parseInt(retentionId) } } }),
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
        boxProceedings: {
          where: { deletedAt: null },
          include: {
            box: {
              select: {
                id: true,
                code: true,
                box_warehouse: {
                  take: 1,
                  select: {
                    island: true,
                    shelving: true,
                    shelf: true,
                    warehouses: { select: { id: true, name: true, code: true } },
                  },
                },
              },
            },
          },
        },
        documentProceedings: {
          where: { deletedAt: null },
          include: {
            document: {
              select: { id: true, name: true, file: true, createdAt: true, file_original_name: true },
            },
          },
        },
        externalUserProceedings: {
          include: {
            externalUser: {
              select: { id: true, name: true, lastName: true, email: true, phone: true, city: true, state: true, dni: true },
            },
          },
        },
        proceedingThreads: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          include: {
            fromUser: { select: { id: true, name: true, email: true } },
            assignedUser: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!proceeding) {
      throw new Error('Expediente no encontrado');
    }

    // Flatten relations for frontend convenience
    return {
      ...proceeding,
      boxes: proceeding.boxProceedings.map(bp => {
        const bw = bp.box.box_warehouse?.[0] || null;
        return {
          id: bp.box.id,
          code: bp.box.code,
          island: bw?.island || null,
          shelf: bw?.shelving || null,  // shelving → shelf for display
          level: bw?.shelf || null,     // shelf → level for display
          warehouse: bw?.warehouses || null,
          boxProceedingId: bp.id,
        };
      }),
      documents: proceeding.documentProceedings.map(dp => ({
        ...dp.document,
        documentProceedingId: dp.id,
      })),
      sharedWith: proceeding.externalUserProceedings.map(eup => ({
        ...eup.externalUser,
        externalUserProceedingId: eup.id,
      })),
      loans: proceeding.proceedingThreads,
    };
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
        ...(data.retentionLineId && { retentionLineId: parseInt(data.retentionLineId) }),
      },
      include: {
        company: { select: { id: true, name: true, short: true } },
        retentionLine: {
          select: {
            id: true,
            series: true,
            subseries: true,
            code: true,
            retention: { select: { id: true, name: true, code: true } },
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
        ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
        ...(data.companyOne !== undefined && { companyOne: data.companyOne }),
        ...(data.companyTwo !== undefined && { companyTwo: data.companyTwo }),
        ...(data.companyId && { companyId: parseInt(data.companyId) }),
        ...(data.retentionLineId && { retentionLineId: parseInt(data.retentionLineId) }),
        ...(data.loan && { loan: data.loan }),
      },
      include: {
        company: { select: { id: true, name: true, short: true } },
        retentionLine: {
          select: {
            id: true,
            series: true,
            subseries: true,
            code: true,
            retention: { select: { id: true, name: true, code: true } },
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

    await prisma.proceeding.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    return { message: 'Expediente eliminado correctamente' };
  }

  // ─── Boxes ────────────────────────────────────────────────────────────────

  async attachBox(proceedingId, boxId) {
    const existing = await prisma.boxProceeding.findFirst({
      where: { proceedingId: parseInt(proceedingId), boxId: BigInt(boxId), deletedAt: null },
    });
    if (existing) throw new Error('La caja ya está vinculada a este expediente');

    return prisma.boxProceeding.create({
      data: {
        proceedingId: parseInt(proceedingId),
        boxId: BigInt(boxId),
      },
    });
  }

  async detachBox(proceedingId, boxId) {
    const record = await prisma.boxProceeding.findFirst({
      where: { proceedingId: parseInt(proceedingId), boxId: BigInt(boxId), deletedAt: null },
    });
    if (!record) throw new Error('Vínculo de caja no encontrado');

    return prisma.boxProceeding.update({
      where: { id: record.id },
      data: { deletedAt: new Date() },
    });
  }

  // ─── External Users ───────────────────────────────────────────────────────

  async shareWithUser(proceedingId, externalUserId) {
    const existing = await prisma.externalUserProceeding.findFirst({
      where: { proceedingId: parseInt(proceedingId), externalUserId: BigInt(externalUserId) },
    });
    if (existing) throw new Error('El usuario ya tiene acceso a este expediente');

    const record = await prisma.externalUserProceeding.create({
      data: {
        proceedingId: parseInt(proceedingId),
        externalUserId: BigInt(externalUserId),
      },
      include: {
        externalUser: { select: { id: true, name: true, email: true } },
        proceeding: { 
          select: { 
            id: true, 
            name: true, 
            code: true,
            company: { select: { name: true } }
          } 
        },
      },
    });

    // Send email notification
    console.log('[ProceedingService] Checking email notification...', {
      hasEmail: !!record.externalUser.email,
      email: record.externalUser.email,
      userName: record.externalUser.name,
      proceedingName: record.proceeding.name,
    });
    
    if (record.externalUser.email) {
      try {
        console.log('[ProceedingService] Preparing to send email...');
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const proceedingUrl = `${clientUrl}/proceedings/${record.proceeding.id}`;
        
        console.log('[ProceedingService] Generating email template...');
        const emailHtml = proceedingSharedEmailTemplate({
          userName: record.externalUser.name,
          proceedingName: record.proceeding.name,
          proceedingCode: record.proceeding.code,
          proceedingUrl,
          companyName: record.proceeding.company?.name || 'Simplia',
        });

        console.log('[ProceedingService] Calling emailService.send...');
        await emailService.send({
          to: record.externalUser.email,
          subject: `📁 Expediente compartido: ${record.proceeding.name}`,
          html: emailHtml,
        });
        
        console.log(`[ProceedingService] ✅ Email sent successfully to ${record.externalUser.email}`);
        record.emailSent = true;
      } catch (emailError) {
        console.error('[ProceedingService] ❌ Error sending email:', emailError);
        console.error('[ProceedingService] Error stack:', emailError.stack);
        record.emailSent = false;
        record.emailError = emailError.message;
        // Don't throw - we don't want to fail the share operation if email fails
      }
    } else {
      console.log('[ProceedingService] ⚠️ No email address found for external user');
      record.emailSent = false;
      record.emailError = 'No email address';
    }

    return record;
  }

  async unshareWithUser(proceedingId, externalUserId) {
    const record = await prisma.externalUserProceeding.findFirst({
      where: { proceedingId: parseInt(proceedingId), externalUserId: BigInt(externalUserId) },
    });
    if (!record) throw new Error('Vínculo de usuario no encontrado');

    return prisma.externalUserProceeding.delete({ where: { id: record.id } });
  }

  // ─── Threads (Loans) ──────────────────────────────────────────────────────

  async createThread(proceedingId, data, userId) {
    const thread = await prisma.proceedingThread.create({
      data: {
        proceedingId: parseInt(proceedingId),
        fromId: BigInt(userId),
        reason: data.reason,
        name: data.name,
        document: data.document,
        address: data.address || '',
        ...(data.assignedId && { assignedId: BigInt(data.assignedId) }),
      },
      include: {
        fromUser: { select: { id: true, name: true, email: true } },
        assignedUser: { select: { id: true, name: true, email: true } },
      },
    });

    return thread;
  }

  async deleteThread(proceedingId, threadId) {
    const thread = await prisma.proceedingThread.findFirst({
      where: { id: parseInt(threadId), proceedingId: parseInt(proceedingId), deletedAt: null },
    });
    if (!thread) throw new Error('Préstamo no encontrado');

    return prisma.proceedingThread.update({
      where: { id: parseInt(threadId) },
      data: { deletedAt: new Date() },
    });
  }

  // ─── Documents ────────────────────────────────────────────────────────────

  async uploadAndAttachDocument(proceedingId, file) {
    const proceeding = await prisma.proceeding.findFirst({
      where: { id: parseInt(proceedingId), deletedAt: null },
    });
    if (!proceeding) throw new Error('Expediente no encontrado');

    const document = await prisma.document.create({
      data: {
        name: file.originalname,
        file: file.key,
        file_original_name: file.originalname,
        fileSize: file.size,
        companyId: proceeding.companyId,
        medium: 'digital',
      },
    });

    await prisma.documentProceeding.create({
      data: {
        proceedingId: parseInt(proceedingId),
        documentId: document.id,
      },
    });

    return document;
  }

  async attachDocument(proceedingId, documentId) {
    const existing = await prisma.documentProceeding.findFirst({
      where: { proceedingId: parseInt(proceedingId), documentId: BigInt(documentId), deletedAt: null },
    });
    if (existing) throw new Error('El documento ya está vinculado a este expediente');

    return prisma.documentProceeding.create({
      data: {
        proceedingId: parseInt(proceedingId),
        documentId: BigInt(documentId),
      },
    });
  }

  async detachDocument(proceedingId, documentId) {
    const record = await prisma.documentProceeding.findFirst({
      where: { proceedingId: parseInt(proceedingId), documentId: BigInt(documentId), deletedAt: null },
    });
    if (!record) throw new Error('Vínculo de documento no encontrado');

    return prisma.documentProceeding.update({
      where: { id: record.id },
      data: { deletedAt: new Date() },
    });
  }
}

export default new ProceedingService();
