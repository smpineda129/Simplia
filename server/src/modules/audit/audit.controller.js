import { prisma } from '../../db/prisma.js';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

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

  const whereJson = JSON.stringify(where, (k, v) => typeof v === 'bigint' ? v.toString() : v);
  console.log(`[Audit Controller] Filter: ${whereJson}`);
  return where;
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
    console.log(`[Audit Controller] Found ${total} events for query`);

    // Manual serialization for BigInt
    const safeEvents = JSON.parse(JSON.stringify(events, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    res.json({
      success: true,
      data: safeEvents,
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

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Auditoría');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Fecha', key: 'created_at', width: 20 },
      { header: 'Evento', key: 'name', width: 30 },
      { header: 'Usuario ID', key: 'user_id', width: 15 },
      { header: 'Modelo', key: 'model_type', width: 20 },
      { header: 'Modelo ID', key: 'model_id', width: 15 },
      { header: 'IP', key: 'ip', width: 15 },
      { header: 'User Agent', key: 'ua', width: 30 },
    ];

    events.forEach(event => {
      worksheet.addRow({
        id: event.id.toString(),
        created_at: event.created_at,
        name: event.name,
        user_id: event.user_id.toString(),
        model_type: event.model_type,
        model_id: event.model_id ? event.model_id.toString() : '',
        ip: event.ipAddress || '',
        ua: event.userAgent || ''
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=audit-report.xlsx');

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
      take: 1000
    });

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=audit-report.pdf');

    doc.pipe(res);

    doc.fontSize(18).text('Reporte de Auditoría', { align: 'center' });
    doc.moveDown();

    events.forEach(event => {
      doc.fontSize(12).text(`[${event.created_at?.toISOString()}] ${event.name}`);
      doc.fontSize(10).text(`User: ${event.user_id.toString()} | IP: ${event.ipAddress || 'N/A'} | Target: ${event.target_type} #${event.target_id.toString()}`);
      if (event.userAgent) {
        doc.fontSize(8).text(`UA: ${event.userAgent}`);
      }
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    next(error);
  }
};
