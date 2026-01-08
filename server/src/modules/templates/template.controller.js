import templateService from './template.service.js';

class TemplateController {
  async getHelpers(req, res) {
    try {
      const helpers = templateService.getAvailableHelpers();

      res.json({
        success: true,
        data: helpers,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAll(req, res) {
    try {
      // Enforce company scope
      if (req.user.companyId) {
        req.query.companyId = req.user.companyId;
      }

      const { search, companyId, page, limit } = req.query;
      const result = await templateService.getAll({ search, companyId, page, limit });

      res.json({
        success: true,
        data: result.templates,
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
      const template = await templateService.getById(req.params.id);

      res.json({
        success: true,
        data: template,
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
      const template = await templateService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Plantilla creada exitosamente',
        data: template,
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
      const template = await templateService.update(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Plantilla actualizada exitosamente',
        data: template,
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
      await templateService.delete(req.params.id);

      res.json({
        success: true,
        message: 'Plantilla eliminada exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async processTemplate(req, res) {
    try {
      const result = await templateService.processTemplate(req.params.id, req.body);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new TemplateController();
