import { prisma } from '../../db/prisma.js';
import { presignKey } from '../../utils/s3Presign.js';
import { HeadObjectCommand } from '@aws-sdk/client-s3';
import s3, { BUCKET } from '../../config/storage.js';

class DocumentService {
  async getAll(filters = {}) {
    const { search, companyId, proceedingId, correspondenceId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    let where = {
      deletedAt: null,
      ...(companyId && { companyId: parseInt(companyId) }),
      ...(search && {
        name: { contains: search, mode: 'insensitive' },
      }),
    };

    // Filter by correspondenceId via junction table
    let correspondenceLinks = null;
    if (correspondenceId) {
      correspondenceLinks = await prisma.correspondence_document.findMany({
        where: { correspondence_id: BigInt(correspondenceId), deleted_at: null },
        select: { document_id: true, folder_id: true },
      });
      const docIds = correspondenceLinks.map(l => l.document_id);
      where = { ...where, id: { in: docIds } };
    }

    // Filter by proceedingId via junction table
    if (proceedingId) {
      const linked = await prisma.documentProceeding.findMany({
        where: { proceedingId: parseInt(proceedingId) },
        select: { documentId: true },
      });
      const docIds = linked.map(l => l.documentId);
      where = { ...where, id: { in: docIds } };
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          file: true,
          file_original_name: true,
          fileSize: true,
          medium: true,
          documentDate: true,
          createdAt: true,
          companyId: true,
          company: { select: { id: true, name: true, short: true } },
        },
      }),
      prisma.document.count({ where }),
    ]);

    // Attach folderId to each document when querying by correspondenceId
    const enriched = correspondenceLinks
      ? documents.map(doc => {
          const link = correspondenceLinks.find(l => l.document_id === doc.id);
          return { ...doc, folderId: link?.folder_id ? link.folder_id.toString() : null };
        })
      : documents;

    return {
      documents: enriched,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id) {
    const document = await prisma.document.findFirst({
      where: { id: parseInt(id), deletedAt: null },
      include: {
        company: { select: { id: true, name: true, short: true } },
      },
    });

    if (!document) {
      throw new Error('Documento no encontrado');
    }

    // Generate pre-signed URL if file exists in S3
    let url = null;
    let fileExists = false;
    if (document.file) {
      try {
        await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: document.file }));
        fileExists = true;
      } catch (err) {
        const httpStatus = err.$metadata?.httpStatusCode;
        if (httpStatus === 403 || err.name === 'AccessDenied') {
          // Can't verify existence but try to generate URL anyway
          fileExists = true;
        }
        // 404 / NoSuchKey: file does not exist — fileExists remains false
      }
      if (fileExists) {
        try {
          url = await presignKey(document.file);
        } catch (_) {}
      }
    }

    return { ...document, url, fileExists };
  }

  async create(data, userId) {
    const document = await prisma.document.create({
      data: {
        name: data.name,
        file: data.file || null,
        file_original_name: data.file_original_name || data.name || null,
        fileSize: data.fileSize ? parseFloat(data.fileSize) : null,
        medium: data.medium || 'digital',
        companyId: parseInt(data.companyId),
        documentDate: data.documentDate ? new Date(data.documentDate) : new Date(),
        notes: data.notes || null,
        createdAt: new Date(),
      },
    });

    // Link to correspondence if provided
    if (data.correspondenceId) {
      await prisma.correspondence_document.create({
        data: {
          correspondence_id: parseInt(data.correspondenceId),
          document_id: document.id,
          ...(data.folderId && { folder_id: BigInt(data.folderId) }),
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    }

    return document;
  }

  async update(id, data) {
    const document = await prisma.document.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!document) {
      throw new Error('Documento no encontrado');
    }

    return prisma.document.update({
      where: { id: parseInt(id) },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });
  }

  async delete(id) {
    const document = await prisma.document.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!document) {
      throw new Error('Documento no encontrado');
    }

    await prisma.document.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    return { message: 'Documento eliminado correctamente' };
  }

  async getDashboard(filters = {}) {
    const { companyId, startDate, endDate, retentionId } = filters;

    const docWhere = {
      deletedAt: null,
      ...(companyId && { companyId: parseInt(companyId) }),
    };

    if (startDate && endDate) {
      docWhere.createdAt = { gte: new Date(startDate), lte: new Date(endDate) };
    }

    const proceedingWhere = {
      deletedAt: null,
      ...(companyId && { companyId: parseInt(companyId) }),
      ...(retentionId && { retentionLine: { is: { retentionId: parseInt(retentionId) } } }),
    };

    if (startDate && endDate) {
      proceedingWhere.createdAt = { gte: new Date(startDate), lte: new Date(endDate) };
    }

    const [totalDocuments, totalProceedings, retentionGroups] = await Promise.all([
      prisma.document.count({ where: docWhere }),
      prisma.proceeding.count({ where: proceedingWhere }),
      prisma.proceeding.groupBy({
        by: ['retentionLineId'],
        where: { deletedAt: null, ...(companyId && { companyId: parseInt(companyId) }) },
        _count: { id: true },
      }),
    ]);

    // Growth % if date range provided
    let docGrowth = null;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const periodMs = end - start;
      const prevStart = new Date(start - periodMs);
      const prevEnd = new Date(start);

      const prevCount = await prisma.document.count({
        where: {
          ...docWhere,
          createdAt: { gte: prevStart, lte: prevEnd },
        },
      });

      docGrowth = prevCount === 0 ? null : Math.round(((totalDocuments - prevCount) / prevCount) * 100);
    }

    // Enrich retention groups
    const retentionLineIds = retentionGroups
      .filter(g => g.retentionLineId)
      .map(g => g.retentionLineId);

    const retentionLines = await prisma.retentionLine.findMany({
      where: { id: { in: retentionLineIds } },
      select: { id: true, series: true, code: true, retention: { select: { name: true } } },
    });

    const byRetention = retentionGroups.map(g => {
      const line = retentionLines.find(r => r.id === g.retentionLineId);
      return {
        retentionLineId: g.retentionLineId,
        name: line ? `${line.code} – ${line.series}` : 'Sin retención',
        retentionName: line?.retention?.name || '',
        count: g._count.id,
      };
    }).sort((a, b) => b.count - a.count);

    return { totalDocuments, totalProceedings, docGrowth, byRetention };
  }
}

export default new DocumentService();
