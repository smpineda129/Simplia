import warehouseService from './warehouse.service.js';

class WarehouseController {
  // Warehouses
  async getAllWarehouses(req, res) {
    try {
      // Enforce company scope
      if (req.user.companyId) {
        req.query.companyId = req.user.companyId;
      }

      const { search, companyId, page, limit } = req.query;
      const result = await warehouseService.getAllWarehouses({ search, companyId, page, limit });

      res.json({
        success: true,
        data: result.warehouses,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getWarehouseById(req, res) {
    try {
      const warehouse = await warehouseService.getWarehouseById(req.params.id);

      res.json({
        success: true,
        data: warehouse,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createWarehouse(req, res) {
    try {
      const warehouse = await warehouseService.createWarehouse(req.body);

      res.status(201).json({
        success: true,
        message: 'Bodega creada exitosamente',
        data: warehouse,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateWarehouse(req, res) {
    try {
      const warehouse = await warehouseService.updateWarehouse(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Bodega actualizada exitosamente',
        data: warehouse,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteWarehouse(req, res) {
    try {
      await warehouseService.deleteWarehouse(req.params.id);

      res.json({
        success: true,
        message: 'Bodega eliminada exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Boxes
  async getAllBoxes(req, res) {
    try {
      // Enforce company scope
      if (req.user.companyId) {
        req.query.companyId = req.user.companyId;
      }

      const { search, companyId, warehouseId, page, limit } = req.query;
      const result = await warehouseService.getAllBoxes({ search, companyId, warehouseId, page, limit });

      res.json({
        success: true,
        data: result.boxes,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getBoxById(req, res) {
    try {
      const box = await warehouseService.getBoxById(req.params.id);

      res.json({
        success: true,
        data: box,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createBox(req, res) {
    try {
      const box = await warehouseService.createBox(req.body);

      res.status(201).json({
        success: true,
        message: 'Caja creada exitosamente',
        data: box,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateBox(req, res) {
    try {
      const box = await warehouseService.updateBox(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Caja actualizada exitosamente',
        data: box,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteBox(req, res) {
    try {
      await warehouseService.deleteBox(req.params.id);

      res.json({
        success: true,
        message: 'Caja eliminada exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new WarehouseController();
