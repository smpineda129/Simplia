import { prisma } from '../../db/prisma.js';
import { presignKey } from '../../utils/s3Presign.js';
import { HeadObjectCommand, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3, { BUCKET } from '../../config/storage.js';
import { PDFDocument } from 'pdf-lib';
import { v4 as uuidv4 } from 'uuid';

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

    // Eliminar archivo de S3 si existe
    if (document.file) {
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: BUCKET,
          Key: document.file,
        });
        await s3.send(deleteCommand);
        console.log(`Archivo eliminado de S3: ${document.file}`);
      } catch (error) {
        console.error(`Error al eliminar archivo de S3: ${document.file}`, error);
        // Continuar con el soft delete aunque falle la eliminación de S3
      }
    }

    // Soft delete en la base de datos
    await prisma.document.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    return { message: 'Documento eliminado correctamente' };
  }

  async getDashboard(filters = {}) {
    const { companyId, startDate, endDate, retentionId } = filters;

    // Base where sin filtro de fechas para contar el total real
    const baseDocWhere = {
      deletedAt: null,
      ...(companyId && { companyId: parseInt(companyId) }),
    };

    const proceedingWhere = {
      deletedAt: null,
      ...(companyId && { companyId: parseInt(companyId) }),
      ...(retentionId && { retentionLine: { is: { retentionId: parseInt(retentionId) } } }),
    };

    if (startDate && endDate) {
      proceedingWhere.createdAt = { gte: new Date(startDate), lte: new Date(endDate) };
    }

    // Calcular fecha de hace 7 días
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Contar TODOS los documentos sin filtro de fecha
    const [totalDocuments, totalProceedings, totalCorrespondences, recentDocsCount, retentionGroups] = await Promise.all([
      prisma.document.count({ where: baseDocWhere }),
      prisma.proceeding.count({ where: proceedingWhere }),
      prisma.correspondence.count({ 
        where: { 
          deletedAt: null, 
          ...(companyId && { companyId: parseInt(companyId) }) 
        } 
      }),
      prisma.document.count({ 
        where: { 
          ...baseDocWhere,
          createdAt: { gte: sevenDaysAgo }
        } 
      }),
      prisma.proceeding.groupBy({
        by: ['retentionLineId'],
        where: { deletedAt: null, ...(companyId && { companyId: parseInt(companyId) }) },
        _count: { id: true },
      }),
    ]);

    // Growth % if date range provided
    let docGrowth = null;
    let docsInRange = 0;
    if (startDate && endDate) {
      // Contar documentos en el rango de fechas
      docsInRange = await prisma.document.count({
        where: {
          ...baseDocWhere,
          createdAt: { gte: new Date(startDate), lte: new Date(endDate) },
        },
      });

      // Calcular porcentaje: documentos en rango vs total
      // Ejemplo: 20 de 64 = (20/64) * 100 = 31%
      docGrowth = totalDocuments > 0 ? Math.round((docsInRange / totalDocuments) * 100) : 0;
    }

    // Where para obtener documentos (puede incluir filtro de fechas para la lista)
    const docWhere = {
      ...baseDocWhere,
      ...(startDate && endDate && { createdAt: { gte: new Date(startDate), lte: new Date(endDate) } }),
    };

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

    // Obtener documentos recientes con sus asociaciones
    const recentDocuments = await prisma.document.findMany({
      where: docWhere,
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        company: { select: { id: true, name: true } },
        documentProceedings: {
          where: { deletedAt: null },
          take: 1,
          include: {
            proceeding: {
              select: {
                id: true,
                name: true,
                code: true,
                retentionLineId: true,
                retentionLine: {
                  select: {
                    id: true,
                    series: true,
                    subseries: true,
                    code: true,
                    retentionId: true,
                  },
                },
              },
            },
          },
        },
        correspondence_document: {
          where: { deleted_at: null },
          take: 1,
          include: {
            correspondences: {
              select: {
                id: true,
                title: true,
                code: true,
              },
            },
          },
        },
      },
    });

    // Formatear documentos con información de asociación
    const documents = recentDocuments.map(doc => {
      const proceeding = doc.documentProceedings[0]?.proceeding;
      const correspondence = doc.correspondence_document[0]?.correspondences;
      
      return {
        id: doc.id,
        name: doc.name || doc.file_original_name,
        fileSize: doc.fileSize,
        createdAt: doc.createdAt,
        company: doc.company,
        associationType: proceeding ? 'proceeding' : correspondence ? 'correspondence' : null,
        association: proceeding ? {
          id: proceeding.id,
          name: proceeding.name,
          code: proceeding.code,
          retentionLineId: proceeding.retentionLineId,
          retentionLine: proceeding.retentionLine,
        } : correspondence ? {
          id: correspondence.id,
          title: correspondence.title,
          code: correspondence.code,
        } : null,
      };
    });

    return { totalDocuments, totalProceedings, totalCorrespondences, recentDocsCount, docGrowth, byRetention, documents };
  }

  async merge(documentIds, name, user) {
    console.log('=== INICIANDO MEZCLA DE DOCUMENTOS ===');
    console.log('IDs de documentos a mezclar:', documentIds);
    console.log('Nombre del documento resultante:', name);
    
    // Validar que todos los documentos existan y sean PDFs
    const documents = await prisma.document.findMany({
      where: {
        id: { in: documentIds.map(id => parseInt(id)) },
        deletedAt: null,
      },
      include: {
        company: { select: { short: true } },
      },
    });

    console.log(`Documentos encontrados: ${documents.length}`);
    documents.forEach(doc => {
      console.log(`- ID: ${doc.id}, Archivo: ${doc.file}, Nombre: ${doc.file_original_name}`);
    });

    if (documents.length !== documentIds.length) {
      throw new Error('Uno o más documentos no fueron encontrados');
    }

    // Verificar que todos sean PDFs
    const nonPdfDocs = documents.filter(doc => {
      const fileName = doc.file_original_name || doc.file || '';
      return !fileName.toLowerCase().endsWith('.pdf');
    });

    if (nonPdfDocs.length > 0) {
      throw new Error('Solo se pueden mezclar documentos PDF');
    }

    // Crear un nuevo PDF mezclado
    console.log('Creando nuevo PDF vacío...');
    const mergedPdf = await PDFDocument.create();
    console.log('PDF vacío creado exitosamente');

    // Descargar y mezclar cada PDF en el orden especificado
    for (const docId of documentIds) {
      // Comparar IDs como strings porque Prisma devuelve BigInt como string
      const doc = documents.find(d => d.id.toString() === docId.toString());
      if (!doc || !doc.file) {
        console.error(`Documento ${docId} no encontrado o sin archivo`);
        console.error(`Documentos disponibles:`, documents.map(d => ({ id: d.id, file: d.file })));
        continue;
      }

      try {
        console.log(`Procesando documento ${doc.id}: ${doc.file}`);
        console.log(`Bucket: ${BUCKET}, Key: ${doc.file}`);
        
        // Descargar el PDF desde S3
        const getCommand = new GetObjectCommand({
          Bucket: BUCKET,
          Key: doc.file,
        });
        const response = await s3.send(getCommand);
        
        // Convertir el stream a buffer usando el método más simple
        const streamToBuffer = async (stream) => {
          const chunks = [];
          for await (const chunk of stream) {
            chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
          }
          return Buffer.concat(chunks);
        };
        
        const pdfBuffer = await streamToBuffer(response.Body);
        console.log(`PDF descargado, tamaño: ${pdfBuffer.length} bytes`);

        if (pdfBuffer.length === 0) {
          throw new Error(`El archivo ${doc.file_original_name} está vacío`);
        }

        // Cargar el PDF
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const pageCount = pdfDoc.getPageCount();
        console.log(`PDF cargado, páginas: ${pageCount}`);
        
        if (pageCount === 0) {
          throw new Error(`El PDF ${doc.file_original_name} no tiene páginas`);
        }
        
        // Copiar todas las páginas al PDF mezclado
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
        console.log(`${pageCount} páginas agregadas al PDF mezclado`);
      } catch (error) {
        console.error(`Error al procesar documento ${doc.id}:`, error);
        console.error('Stack trace:', error.stack);
        throw new Error(`Error al procesar el documento: ${doc.file_original_name} - ${error.message}`);
      }
    }
    
    console.log(`Total de páginas en PDF mezclado: ${mergedPdf.getPageCount()}`);

    // Guardar el PDF mezclado
    const mergedPdfBytes = await mergedPdf.save();
    const mergedBuffer = Buffer.from(mergedPdfBytes);

    // Subir a S3
    const companyShort = documents[0].company?.short || 'general';
    const fileName = name.endsWith('.pdf') ? name : `${name}.pdf`;
    const s3Key = `${companyShort}/documents/${uuidv4()}-${fileName}`;

    const putCommand = new PutObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
      Body: mergedBuffer,
      ContentType: 'application/pdf',
    });

    await s3.send(putCommand);

    // Crear el nuevo documento en la base de datos
    const mergedDocument = await prisma.document.create({
      data: {
        name: fileName,
        file: s3Key,
        file_original_name: fileName,
        fileSize: mergedBuffer.length,
        filePages: mergedPdf.getPageCount(),
        medium: 'digital',
        companyId: documents[0].companyId,
        documentDate: new Date(),
        notes: `Documento creado al mezclar ${documents.length} PDFs`,
        createdAt: new Date(),
      },
    });

    return mergedDocument;
  }
}

export default new DocumentService();
