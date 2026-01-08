import retentionService from './retention.service.js';

class RetentionController {
  async getAll(req, res) {
    try {
      // Enforce company scope
      if (req.user.companyId) {
        req.query.companyId = req.user.companyId;
      }

      const { search, companyId, areaId, page, limit } = req.query;
      const result = await retentionService.getAll({ search, companyId, areaId, page, limit });

      res.json({
        success: true,
        data: result.retentions,
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
      const retention = await retentionService.getById(req.params.id);

      res.json({
        success: true,
        data: retention,
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
      const retention = await retentionService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Tabla de retención creada exitosamente',
        data: retention,
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
      const retention = await retentionService.update(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Tabla de retención actualizada exitosamente',
        data: retention,
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
      await retentionService.delete(req.params.id);

      res.json({
        success: true,
        message: 'Tabla de retención eliminada exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Retention Lines
  async createLine(req, res) {
    try {
      const line = await retentionService.createLine(req.params.id, req.body);

      res.status(201).json({
        success: true,
        message: 'Línea de retención creada exitosamente',
        data: line,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateLine(req, res) {
    try {
      const line = await retentionService.updateLine(req.params.lineId, req.body);

      res.json({
        success: true,
        message: 'Línea de retención actualizada exitosamente',
        data: line,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteLine(req, res) {
    try {
      await retentionService.deleteLine(req.params.lineId);

      res.json({
        success: true,
        message: 'Línea de retención eliminada exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new RetentionController();
