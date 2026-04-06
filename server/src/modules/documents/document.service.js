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
    if (correspondenceId) {
      const linked = await prisma.correspondence_document.findMany({
        where: { correspondence_id: BigInt(correspondenceId) },
        select: { document_id: true },
      });
      const docIds = linked.map(l => l.document_id);
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

    return {
      documents,
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
}

export default new DocumentService();
