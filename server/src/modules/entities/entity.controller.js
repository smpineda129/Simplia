import entityService from './entity.service.js';

class EntityController {
  async getAll(req, res) {
    try {
      // Enforce company scope
      if (req.user.companyId) {
        req.query.companyId = req.user.companyId;
      }

      const { search, companyId, categoryId, page, limit } = req.query;
      const result = await entityService.getAll({ search, companyId, categoryId, page, limit });

      res.json({
        success: true,
        data: result.entities,
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
      const entity = await entityService.getById(req.params.id);

      res.json({
        success: true,
        data: entity,
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
      const entity = await entityService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Entidad creada exitosamente',
        data: entity,
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
      const entity = await entityService.update(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Entidad actualizada exitosamente',
        data: entity,
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
      await entityService.delete(req.params.id);

      res.json({
        success: true,
        message: 'Entidad eliminada exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllCategories(req, res) {
    try {
      const { companyId } = req.query;
      const categories = await entityService.getAllCategories(companyId);

      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createCategory(req, res) {
    try {
      const category = await entityService.createCategory(req.body);

      res.status(201).json({
        success: true,
        message: 'Categoría creada exitosamente',
        data: category,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new EntityController();
