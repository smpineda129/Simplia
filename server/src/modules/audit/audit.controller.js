import { prisma } from '../../db/prisma.js';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

// Helper to build filters
const buildWhereClause = async (req) => {
  const { startDate, endDate, type, user_id, entity } = req.query;
  const where = {};

  // Access Control Logic
  const userId = req.user.id;
  const userCompanyId = req.user.companyId;

  // Check if owner (level 1) or has specific view-all permission
  const isOwner = req.user.roles && req.user.roles.some(r => r.roleLevel === 1);
  const canViewAll = req.user.allPermissions && req.user.allPermissions.includes('action.view_all');

  if (isOwner || canViewAll) {
    // Owner or SuperAdmin: Can filter by any company or see all
    if (req.query.company_id) {
      where.companyId = BigInt(req.query.company_id);
    }
  } else {
    // Regular user / Company Admin: Forced to their company
    if (userCompanyId) {
      where.companyId = BigInt(userCompanyId);
    } else {
      // No company and not owner: only their own events
      where.user_id = BigInt(userId);
    }
  }

  // Filter by User ID (if provided)
  if (user_id) {
    // Regular users can only filter by user_id if that user is in their company (enforced by where.companyId above)
    where.user_id = BigInt(user_id);
  }

  // Date Filters
  if (startDate && endDate) {
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);

    // Only apply if both are valid dates
    if (!isNaN(sDate.getTime()) && !isNaN(eDate.getTime())) {
      where.created_at = {
        gte: sDate,
        lte: eDate,
      };
    }
  }

  if (type) {
    where.name = { contains: type };
  }

  if (entity) {
    where.actionable_type = entity;
  }

  return where;
};
const ACTION_TRANSLATIONS = {
  'Create': 'Crear',
  'Update': 'Actualizar',
  'Delete': 'Eliminar',
  'View': 'Ver',
  'Unknown': 'Desconocido'
};

const MODEL_TRANSLATIONS = {
  'User': 'Usuario',
  'Proceeding': 'Expediente',
  'Document': 'Documento',
  'Correspondence': 'Correspondencia',
  'Company': 'Empresa',
  'Area': 'Área',
  'Retention': 'Retención',
  'Role': 'Rol',
  'Permission': 'Permiso'
};

const enrichEvents = async (events) => {
  return await Promise.all(events.map(async (event) => {
    const plainEvent = JSON.parse(JSON.stringify(event, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    // 1. Fetch actor name
    try {
      const actor = await prisma.user.findUnique({
        where: { id: event.user_id },
        select: { name: true }
      });
      if (actor) plainEvent.userName = actor.name;
    } catch (e) { /* silent */ }

    // 2. Fetch target name if fields is empty
    if (!plainEvent.fields) {
      try {
        const rawModelName = event.model_type?.replace('App\\Models\\', '');
        if (rawModelName && event.model_id) {
          let prismaModelName = rawModelName.charAt(0).toLowerCase() + rawModelName.slice(1);
          if (rawModelName === 'CorrespondenceType') prismaModelName = 'correspondenceType';

          if (prisma[prismaModelName]) {
            const targetId = BigInt(event.model_id);
            const usesTitle = ['Template', 'Correspondence'].includes(rawModelName);
            const selection = usesTitle ? { title: true } : { name: true };

            const target = await prisma[prismaModelName].findUnique({
              where: { id: targetId },
              select: selection
            });

            if (target) {
              plainEvent.fields = target.name || target.title || '';
            }
          }
        }
      } catch (e) { /* silent */ }
    }

    // 3. Add translated fields
    const rawModelName = event.model_type?.replace('App\\Models\\', '');
    plainEvent.actionSpanish = ACTION_TRANSLATIONS[event.name] || event.name;
    plainEvent.modelSpanish = MODEL_TRANSLATIONS[rawModelName] || rawModelName;

    return plainEvent;
  }));
};

export const getEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where = await buildWhereClause(req);

    const [events, total] = await Promise.all([
      prisma.action_events.findMany({
        where,
        take: Number(limit),
        skip: Number(skip),
        orderBy: { created_at: 'desc' },
      }),
      prisma.action_events.count({ where }),
    ]);

    const enrichedEvents = await enrichEvents(events);

    res.json({
      success: true,
      data: enrichedEvents,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const exportExcel = async (req, res, next) => {
  try {
    const where = await buildWhereClause(req);
    const events = await prisma.action_events.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: 5000
    });

    const enrichedEvents = await enrichEvents(events);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Auditoría');

    worksheet.columns = [
      { header: 'Fecha', key: 'date', width: 20 },
      { header: 'Usuario', key: 'user', width: 25 },
      { header: 'Acción', key: 'action', width: 15 },
      { header: 'Entidad', key: 'model', width: 15 },
      { header: 'Referencia', key: 'target', width: 40 },
      { header: 'Dirección IP', key: 'ip', width: 15 },
    ];

    enrichedEvents.forEach(event => {
      worksheet.addRow({
        date: new Date(event.created_at).toLocaleString(),
        user: event.userName || `ID: ${event.user_id}`,
        action: event.actionSpanish,
        model: event.modelSpanish,
        target: event.fields || `ID: ${event.model_id}`,
        ip: event.ipAddress || 'Interna',
      });
    });

    // Formatting
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Headers para descarga directa (Streaming)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="Auditoria_${Date.now()}.xlsx"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};

export const exportPdf = async (req, res, next) => {
  try {
    const where = await buildWhereClause(req);
    const events = await prisma.action_events.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: 2000
    });

    const enrichedEvents = await enrichEvents(events);

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    // Headers para descarga directa (Streaming)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Auditoria_${Date.now()}.pdf"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    doc.pipe(res);

    // Header
    doc.fontSize(20).text('Reporte de Auditoría - Simplia', { align: 'center' });
    doc.fontSize(10).text(`Fecha de generación: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(2);

    // Table Content
    enrichedEvents.forEach((event, i) => {
      if (doc.y > 700) doc.addPage();

      const dateStr = new Date(event.created_at).toLocaleString();
      const userStr = event.userName || `ID: ${event.user_id}`;

      doc.fontSize(10).fillColor('#1a237e').text(`[${dateStr}] - ${userStr}`, { continued: true });
      doc.fillColor('#000000').text(` realizó `, { continued: true });
      doc.fillColor('#d32f2f').text(event.actionSpanish, { continued: true });
      doc.fillColor('#000000').text(` sobre `, { continued: true });
      doc.fillColor('#1976d2').text(`${event.modelSpanish}: ${event.fields || event.model_id}`);

      doc.fontSize(8).fillColor('#666666').text(`IP: ${event.ipAddress || 'N/A'}`);
      doc.moveDown(0.5);
      doc.moveTo(30, doc.y).lineTo(565, doc.y).strokeColor('#eeeeee').stroke();
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    next(error);
  }
};
