import { prisma } from '../../db/prisma.js';
import emailService from '../../utils/emailService.js';
import { proceedingSharedEmailTemplate } from '../../templates/proceedingSharedEmail.js';
import ExcelJS from 'exceljs';

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
              select: {
                id: true,
                name: true,
                file: true,
                createdAt: true,
                file_original_name: true,
                documentDate: true,
                medium: true,
                notes: true,
                meta: true,
                companyId: true,
                fileSize: true,
              },
            },
            folder: {
              select: { id: true, name: true },
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
        folderId: dp.folderId ? dp.folderId.toString() : null,
        folderName: dp.folder?.name || null,
      })),
      sharedWith: proceeding.externalUserProceedings.map(eup => ({
        ...eup.externalUser,
        externalUserProceedingId: eup.id,
      })),
      loans: proceeding.proceedingThreads,
    };
  }

  async create(data) {
    // Generar código automáticamente
    const companyId = parseInt(data.companyId);
    
    // Obtener el último expediente de la empresa para generar el código secuencial
    const lastProceeding = await prisma.proceeding.findFirst({
      where: { companyId },
      orderBy: { id: 'desc' },
      select: { code: true },
    });

    // Generar código: formato "EXP-{año}-{secuencial}"
    const year = new Date().getFullYear();
    let sequential = 1;
    
    if (lastProceeding?.code) {
      // Extraer el número secuencial del último código
      const match = lastProceeding.code.match(/EXP-\d{4}-(\d+)/);
      if (match) {
        sequential = parseInt(match[1]) + 1;
      }
    }
    
    const generatedCode = `EXP-${year}-${sequential.toString().padStart(4, '0')}`;

    const proceeding = await prisma.proceeding.create({
      data: {
        name: data.name,
        code: generatedCode,
        startDate: new Date(data.startDate),
        companyOne: data.companyOne,
        companyTwo: data.companyTwo,
        companyId,
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

  async shareWithUser(proceedingId, externalUserId, customMessage = '') {
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
      hasCustomMessage: !!customMessage,
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
          logoUrl: `${clientUrl}/Horizontal_Logo.jpeg`,
          customMessage: customMessage || '',
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
    // Get proceeding data to replace helpers
    const proceeding = await prisma.proceeding.findFirst({
      where: { id: parseInt(proceedingId), deletedAt: null },
      include: {
        company: { select: { name: true } },
      },
    });

    if (!proceeding) {
      throw new Error('Expediente no encontrado');
    }

    // Get logged-in user data for all personal helpers
    const loggedUser = await prisma.user.findUnique({
      where: { id: BigInt(userId) },
      select: { id: true, name: true, email: true, phone: true },
    });

    // Process helpers in the reason field
    let processedReason = data.reason || '';
    
    console.log('[ProceedingService] Original reason:', processedReason.substring(0, 200));
    
    // Split logged user name into parts
    const nameParts = (loggedUser?.name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    console.log('[ProceedingService] User data:', {
      firstName,
      lastName,
      phone: loggedUser?.phone,
      email: loggedUser?.email,
      proceedingCode: proceeding.code
    });

    // Replace all helpers with logged-in user data (case insensitive, handle HTML entities)
    processedReason = processedReason
      .replace(/\{radicado_entrada\}/gi, proceeding.code || '')
      .replace(/\{radicado_salida\}/gi, proceeding.code || '')
      .replace(/\{nombre\}/gi, firstName)
      .replace(/\{apellido\}/gi, lastName)
      .replace(/\{dni\}/gi, loggedUser?.phone || '')
      .replace(/\{correo\}/gi, loggedUser?.email || '')
      .replace(/\{firma\}/gi, loggedUser?.name || '')
      .replace(/\{mi_nombre\}/gi, firstName)
      .replace(/\{mi_correo\}/gi, loggedUser?.email || '')
      .replace(/\{mi_cargo\}/gi, '');

    console.log('[ProceedingService] Processed reason:', processedReason.substring(0, 200));

    const thread = await prisma.proceedingThread.create({
      data: {
        proceedingId: parseInt(proceedingId),
        fromId: BigInt(userId),
        reason: processedReason,
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

  async uploadAndAttachDocument(proceedingId, file, folderId = null) {
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
        documentDate: new Date(),
        createdAt: new Date(),
      },
    });

    await prisma.documentProceeding.create({
      data: {
        proceedingId: parseInt(proceedingId),
        documentId: document.id,
        ...(folderId && { folderId: parseInt(folderId) }),
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

  // ─── Folders ──────────────────────────────────────────────────────────────

  async getFolders(proceedingId) {
    return prisma.proceedingFolder.findMany({
      where: { proceedingId: parseInt(proceedingId), deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createFolder(proceedingId, name) {
    const proceeding = await prisma.proceeding.findFirst({
      where: { id: parseInt(proceedingId), deletedAt: null },
    });
    if (!proceeding) throw new Error('Expediente no encontrado');

    return prisma.proceedingFolder.create({
      data: {
        proceedingId: parseInt(proceedingId),
        name,
        createdAt: new Date(),
      },
    });
  }

  async moveDocumentToFolder(proceedingId, documentId, folderId) {
    await prisma.documentProceeding.updateMany({
      where: { proceedingId: parseInt(proceedingId), documentId: BigInt(documentId), deletedAt: null },
      data: { folderId: folderId ? parseInt(folderId) : null },
    });
  }

  async deleteFolder(proceedingId, folderId) {
    const folder = await prisma.proceedingFolder.findFirst({
      where: { id: parseInt(folderId), proceedingId: parseInt(proceedingId), deletedAt: null },
    });
    if (!folder) throw new Error('Carpeta no encontrada');

    // Desvincular documentos de la carpeta (quitar folderId)
    await prisma.documentProceeding.updateMany({
      where: { folderId: parseInt(folderId), deletedAt: null },
      data: { folderId: null },
    });

    return prisma.proceedingFolder.update({
      where: { id: parseInt(folderId) },
      data: { deletedAt: new Date() },
    });
  }

  // ─── Export Excel ──────────────────────────────────────────────────────────

  async exportExcel(filters = {}, res) {
    const { startDate, endDate, companyId, search } = filters;

    const where = {
      deletedAt: null,
      ...(companyId && { companyId: parseInt(companyId) }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(startDate && endDate && {
        startDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
    };

    const proceedings = await prisma.proceeding.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 5000,
      include: {
        company: { select: { name: true } },
        retentionLine: {
          select: {
            code: true,
            series: true,
            subseries: true,
            retention: { select: { name: true } },
          },
        },
        documentProceedings: {
          where: { deletedAt: null },
          include: {
            document: { select: { name: true } },
          },
        },
      },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventario Expedientes');

    worksheet.columns = [
      { header: 'Código Expediente', key: 'code', width: 20 },
      { header: 'Nombre Expediente', key: 'name', width: 40 },
      { header: 'Código Serie', key: 'retentionCode', width: 18 },
      { header: 'Documento', key: 'document', width: 50 },
      { header: 'Fecha Inicio', key: 'startDate', width: 15 },
      { header: 'Fecha Fin', key: 'endDate', width: 15 },
      { header: 'Estado Préstamo', key: 'loan', width: 18 },
      { header: 'Empresa', key: 'company', width: 25 },
    ];

    proceedings.forEach(p => {
      const commonFields = {
        code: p.code,
        name: p.name,
        retentionCode: p.retentionLine?.code || '',
        startDate: p.startDate ? new Date(p.startDate).toLocaleDateString('es-ES') : '',
        endDate: p.endDate ? new Date(p.endDate).toLocaleDateString('es-ES') : '',
        loan: p.loan || 'custody',
        company: p.company?.name || '',
      };

      const docs = p.documentProceedings.filter(dp => dp.document);
      if (docs.length === 0) {
        worksheet.addRow({ ...commonFields, document: '' });
      } else {
        docs.forEach(dp => {
          worksheet.addRow({ ...commonFields, document: dp.document.name || '' });
        });
      }
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="Expedientes_${Date.now()}.xlsx"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    await workbook.xlsx.write(res);
    res.end();
  }
}

export default new ProceedingService();
