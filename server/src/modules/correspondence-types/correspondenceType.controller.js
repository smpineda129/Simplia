import correspondenceTypeService from './correspondenceType.service.js';

class CorrespondenceTypeController {
  async getAll(req, res) {
    try {
      // Enforce company scope
      if (req.user.companyId) {
        req.query.companyId = req.user.companyId;
      }

      const { search, companyId, areaId, publicOnly, page, limit } = req.query;
      const result = await correspondenceTypeService.getAll({ search, companyId, areaId, publicOnly, page, limit });

      res.json({
        success: true,
        data: result.types,
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
      const type = await correspondenceTypeService.getById(req.params.id);

      res.json({
        success: true,
        data: type,
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
      const type = await correspondenceTypeService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Tipo de correspondencia creado exitosamente',
        data: type,
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
      const type = await correspondenceTypeService.update(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Tipo de correspondencia actualizado exitosamente',
        data: type,
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
      await correspondenceTypeService.delete(req.params.id);

      res.json({
        success: true,
        message: 'Tipo de correspondencia eliminado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new CorrespondenceTypeController();
