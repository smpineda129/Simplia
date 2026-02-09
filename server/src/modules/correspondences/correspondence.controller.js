import correspondenceService from './correspondence.service.js';

class CorrespondenceController {
  async getAll(req, res) {
    try {
      const { search, status, correspondenceTypeId, page, limit } = req.query;
      let { companyId } = req.query;

      // Enforce company scope
      if (req.user.companyId) {
        companyId = req.user.companyId;
      }

      const result = await correspondenceService.getAll({
        search, companyId, status, correspondenceTypeId, page, limit
      });

      res.json({
        success: true,
        data: result.correspondences,
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
      const correspondence = await correspondenceService.getById(req.params.id);

      res.json({
        success: true,
        data: correspondence,
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
      const userId = req.user.userId; // Del middleware de autenticación
      const correspondence = await correspondenceService.create(req.body, userId);

      res.status(201).json({
        success: true,
        message: 'Correspondencia creada exitosamente',
        data: correspondence,
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
      const correspondence = await correspondenceService.update(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Correspondencia actualizada exitosamente',
        data: correspondence,
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
      await correspondenceService.delete(req.params.id);

      res.json({
        success: true,
        message: 'Correspondencia eliminada exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createThread(req, res) {
    try {
      const userId = req.user.userId;
      const thread = await correspondenceService.createThread(req.params.id, req.body, userId);

      res.status(201).json({
        success: true,
        message: 'Mensaje agregado exitosamente',
        data: thread,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async respond(req, res) {
    try {
      const userId = req.user.userId;
      const correspondence = await correspondenceService.respond(req.params.id, req.body, userId);

      res.json({
        success: true,
        message: 'Respuesta enviada exitosamente',
        data: correspondence,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async markAsDelivered(req, res) {
    try {
      const correspondence = await correspondenceService.markAsDelivered(req.params.id);

      res.json({
        success: true,
        message: 'Marcado como entregado físicamente',
        data: correspondence,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getStats(req, res) {
    try {
      const { companyId } = req.query;
      const stats = await correspondenceService.getStats(companyId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new CorrespondenceController();
