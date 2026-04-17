import documentService from './document.service.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3, { BUCKET } from '../../config/storage.js';
import { prisma } from '../../db/prisma.js';

class DocumentController {
  async getAll(req, res) {
    try {
      // Enforce company scope
      if (req.user.companyId) {
        req.query.companyId = req.user.companyId;
      }

      const { search, companyId, proceedingId, correspondenceId, page, limit } = req.query;
      const result = await documentService.getAll({ search, companyId, proceedingId, correspondenceId, page, limit });

      res.json({
        success: true,
        data: result.documents,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const document = await documentService.getById(req.params.id);

      res.json({
        success: true,
        data: document,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const userId = req.user.userId;
      const document = await documentService.create(req.body, userId);

      res.status(201).json({
        success: true,
        message: 'Documento creado exitosamente',
        data: document,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const document = await documentService.update(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Documento actualizado exitosamente',
        data: document,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No se proporcionó ningún archivo' });
      }

      const file = req.file;
      res.json({
        success: true,
        data: {
          url: file.location,
          key: file.key,
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await documentService.delete(req.params.id);

      res.json({
        success: true,
        message: 'Documento eliminado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getDashboard(req, res) {
    try {
      let { companyId } = req.query;
      if (req.user.companyId) companyId = req.user.companyId;
      const data = await documentService.getDashboard({ ...req.query, companyId });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async merge(req, res) {
    console.error('========================================');
    console.error('MERGE CONTROLLER - Petición recibida');
    console.error('Body:', JSON.stringify(req.body));
    console.error('========================================');
    
    try {
      const { documentIds, name } = req.body;
      
      if (!documentIds || !Array.isArray(documentIds) || documentIds.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Se requieren al menos 2 documentos para mezclar',
        });
      }

      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'El nombre del documento es requerido',
        });
      }

      const mergedDocument = await documentService.merge(documentIds, name.trim(), req.user);

      res.status(201).json({
        success: true,
        message: 'Documentos mezclados exitosamente',
        data: mergedDocument,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new DocumentController();
