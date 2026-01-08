import areaService from './area.service.js';

class AreaController {
  async getAll(req, res) {
    try {
      // Enforce company scope
      if (req.user.companyId) {
        req.query.companyId = req.user.companyId;
      }

      const { search, companyId, page, limit } = req.query;
      const result = await areaService.getAll({ search, companyId, page, limit });

      res.json({
        success: true,
        data: result.areas,
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
      const area = await areaService.getById(req.params.id);

      res.json({
        success: true,
        data: area,
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
      const area = await areaService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Área creada exitosamente',
        data: area,
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
      const area = await areaService.update(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Área actualizada exitosamente',
        data: area,
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
      await areaService.delete(req.params.id);

      res.json({
        success: true,
        message: 'Área eliminada exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async assignUsers(req, res) {
    try {
      const { userIds } = req.body;
      const result = await areaService.assignUsers(req.params.id, userIds);

      res.json({
        success: true,
        message: result.message,
        data: { count: result.count },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async removeUser(req, res) {
    try {
      await areaService.removeUser(req.params.id, req.params.userId);

      res.json({
        success: true,
        message: 'Usuario removido del área',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new AreaController();
