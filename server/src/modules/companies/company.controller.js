import companyService from './company.service.js';

class CompanyController {
  async getAll(req, res) {
    try {
      // Enforce company scope for non-owners
      const isOwner = req.user.roles.includes('Owner');
      if (!isOwner && req.user.companyId) {
        req.query.id = req.user.companyId;
      }

      const { search, page, limit, id } = req.query;
      const result = await companyService.getAll({ search, page, limit, id });

      res.json({
        success: true,
        data: result.companies,
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
      const company = await companyService.getById(req.params.id);

      res.json({
        success: true,
        data: company,
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
      const company = await companyService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Empresa creada exitosamente',
        data: company,
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
      const company = await companyService.update(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Empresa actualizada exitosamente',
        data: company,
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
      await companyService.delete(req.params.id);

      res.json({
        success: true,
        message: 'Empresa eliminada exitosamente',
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
      const stats = await companyService.getStats(req.params.id);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new CompanyController();
