import proceedingService from './proceeding.service.js';

class ProceedingController {
  async getAll(req, res) {
    try {
      const { search, retentionLineId, page, limit } = req.query;
      let { companyId } = req.query;

      // Enforce company scope
      if (req.user.companyId) {
        companyId = req.user.companyId;
      }

      const result = await proceedingService.getAll({ search, companyId, retentionLineId, page, limit });

      res.json({
        success: true,
        data: result.proceedings,
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
      const proceeding = await proceedingService.getById(req.params.id);

      res.json({
        success: true,
        data: proceeding,
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
      const proceeding = await proceedingService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Expediente creado exitosamente',
        data: proceeding,
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
      const proceeding = await proceedingService.update(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Expediente actualizado exitosamente',
        data: proceeding,
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
      await proceedingService.delete(req.params.id);

      res.json({
        success: true,
        message: 'Expediente eliminado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new ProceedingController();
