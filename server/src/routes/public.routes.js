import { Router } from 'express';
import { prisma } from '../db/prisma.js';
import correspondenceTypeService from '../modules/correspondence-types/correspondenceType.service.js';
import correspondenceService from '../modules/correspondences/correspondence.service.js';
import upload from '../middlewares/upload.js';

const router = Router();

// GET /api/public/companies/:id
router.get('/companies/:id', async (req, res) => {
  try {
    const company = await prisma.company.findFirst({
      where: { id: parseInt(req.params.id), deletedAt: null },
      select: { id: true, name: true, short: true, imageUrl: true, email: true },
    });

    if (!company) {
      return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
    }

    res.json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener empresa' });
  }
});

// GET /api/public/correspondence-types?companyId=X
router.get('/correspondence-types', async (req, res) => {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ success: false, message: 'companyId es requerido' });
    }

    const result = await correspondenceTypeService.getAll({
      companyId,
      publicOnly: 'true',
      limit: 100,
    });

    res.json({ success: true, data: result.types });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener tipos de correspondencia' });
  }
});

// GET /api/public/entities/lookup?companyId=X&email=Y
router.get('/entities/lookup', async (req, res) => {
  try {
    const { companyId, email } = req.query;

    if (!companyId || !email) {
      return res.status(400).json({ success: false, message: 'companyId y email son requeridos' });
    }

    // First, search in external_users
    const externalUser = await prisma.externalUser.findFirst({
      where: {
        companyId: parseInt(companyId),
        email: { equals: email, mode: 'insensitive' },
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    if (externalUser) {
      return res.json({
        success: true,
        data: {
          id: Number(externalUser.id),
          name: externalUser.name,
          lastName: null,
          phone: externalUser.phone,
          email: externalUser.email,
          userType: 'external',
          userId: Number(externalUser.id),
        },
      });
    }

    // If not found in external_users, search in entities
    const results = await prisma.$queryRaw`
      SELECT id, name, meta
      FROM entities
      WHERE deleted_at IS NULL
        AND company_id = ${parseInt(companyId)}
        AND LOWER(meta->>'email') = LOWER(${email})
      LIMIT 1
    `;

    if (!results || results.length === 0) {
      return res.json({ success: true, data: null });
    }

    const row = results[0];
    const meta = row.meta || {};
    const entity = {
      id: row.id,
      name: row.name,
      lastName: meta.lastName || null,
      phone: meta.phone || null,
      email: meta.email || null,
      userType: null,
      userId: null,
    };

    res.json({ success: true, data: entity });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al buscar entidad' });
  }
});

// POST /api/public/documents/upload
router.post('/documents/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se proporcionó ningún archivo' });
    }

    res.json({
      success: true,
      data: {
        key: req.file.key,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error('Error al subir archivo público:', error);
    res.status(500).json({ success: false, message: 'Error al subir el archivo' });
  }
});

// POST /api/public/correspondences
router.post('/correspondences', async (req, res) => {
  try {
    const { companyId, correspondenceTypeId, senderName, senderEmail, senderPhone, title, message, attachments, userId, userType } = req.body;

    // Validaciones
    if (!companyId || isNaN(parseInt(companyId))) {
      return res.status(400).json({ success: false, message: 'companyId es requerido' });
    }
    if (!correspondenceTypeId || isNaN(parseInt(correspondenceTypeId))) {
      return res.status(400).json({ success: false, message: 'correspondenceTypeId es requerido' });
    }
    if (!senderName || senderName.trim().length < 2 || senderName.trim().length > 255) {
      return res.status(400).json({ success: false, message: 'Nombre debe tener entre 2 y 255 caracteres' });
    }
    if (!senderEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      return res.status(400).json({ success: false, message: 'Email inválido' });
    }
    if (!title || title.trim().length < 3 || title.trim().length > 255) {
      return res.status(400).json({ success: false, message: 'Asunto debe tener entre 3 y 255 caracteres' });
    }

    // Verificar empresa activa
    const company = await prisma.company.findFirst({
      where: { id: parseInt(companyId), deletedAt: null },
    });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
    }

    // Verificar tipo de correspondencia
    const corrType = await prisma.correspondenceType.findFirst({
      where: { id: parseInt(correspondenceTypeId), companyId: parseInt(companyId), deletedAt: null, public: true },
    });
    if (!corrType) {
      return res.status(404).json({ success: false, message: 'Tipo de correspondencia no encontrado' });
    }

    // Generar radicado
    const incomingRadicado = await correspondenceService.generateRadicado(parseInt(correspondenceTypeId));

    // Obtener primer usuario de la empresa como creador
    const systemUser = await prisma.user.findFirst({
      where: { companyId: parseInt(companyId), deletedAt: null },
      orderBy: { id: 'asc' },
    });
    const systemUserId = systemUser?.id;
    if (!systemUserId) {
      return res.status(500).json({ success: false, message: 'No hay usuarios en la empresa' });
    }

    // Construir comments estructurado
    const commentsData = JSON.stringify({
      senderName: senderName.trim(),
      senderEmail: senderEmail.trim(),
      senderPhone: senderPhone?.trim() || '',
      message: message?.trim() || '',
    });

    const correspondence = await prisma.correspondence.create({
      data: {
        title: title.trim(),
        companyId: parseInt(companyId),
        correspondenceTypeId: parseInt(correspondenceTypeId),
        comments: commentsData,
        user_type: userType || 'external',
        user_id: userId ? Number(userId) : null,
        type: 'incoming',
        in_settled: incomingRadicado,
        status: 'registered',
        sender_id: BigInt(systemUserId),
        recipient_id: null,
        createdAt: new Date(),
      },
    });

    // Create document records for attachments
    if (Array.isArray(attachments) && attachments.length > 0) {
      try {
        for (const attachment of attachments) {
          const doc = await prisma.document.create({
            data: {
              name: attachment.name,
              file: attachment.key,
              file_original_name: attachment.name,
              medium: 'digital',
              companyId: BigInt(companyId),
            },
          });

          await prisma.correspondence_document.create({
            data: {
              correspondence_id: correspondence.id,
              document_id: doc.id,
            },
          });
        }
      } catch (docError) {
        console.error('Error al crear documentos:', docError);
        console.error('Attachment data:', attachments);
        throw new Error(`Error al asociar documentos: ${docError.message}`);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Correspondencia radicada exitosamente',
      data: {
        id: correspondence.id,
        radicado: correspondence.in_settled,
      },
    });
  } catch (error) {
    console.error('Error al crear correspondencia pública:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ success: false, message: error.message || 'Error al radicar correspondencia' });
  }
});

export default router;
