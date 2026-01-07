import documentService from './document.service.js';

class DocumentController {
  async getAll(req, res) {
    try {
      // Enforce company scope
      if (req.user.companyId) {
        req.query.companyId = req.user.companyId;
      }

      const { search, companyId, proceedingId, page, limit } = req.query;
      const result = await documentService.getAll({ search, companyId, proceedingId, page, limit });

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
}

export default new DocumentController();
