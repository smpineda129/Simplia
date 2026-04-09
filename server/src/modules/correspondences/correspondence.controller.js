import correspondenceService from './correspondence.service.js';

class CorrespondenceController {
  async getAll(req, res) {
    try {
      const { search, status, correspondenceTypeId, page, limit } = req.query;
      let { companyId } = req.query;

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
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const correspondence = await correspondenceService.getById(req.params.id);
      res.json({ success: true, data: correspondence });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async create(req, res) {
    try {
      const userId = req.user.id;
      // Inject companyId from auth context if user has one
      const data = {
        ...req.body,
        companyId: req.user.companyId ? req.user.companyId : req.body.companyId,
      };
      const correspondence = await correspondenceService.create(data, userId);

      res.status(201).json({
        success: true,
        message: 'Correspondencia creada exitosamente',
        data: correspondence,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
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
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await correspondenceService.delete(req.params.id);
      res.json({ success: true, message: 'Correspondencia eliminada exitosamente' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async createThread(req, res) {
    try {
      const userId = req.user.id;
      const thread = await correspondenceService.createThread(req.params.id, req.body, userId);

      res.status(201).json({
        success: true,
        message: 'Mensaje agregado exitosamente',
        data: thread,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteThread(req, res) {
    try {
      await correspondenceService.deleteThread(req.params.id, req.params.threadId);
      res.json({ success: true, message: 'Hilo eliminado exitosamente' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async respond(req, res) {
    try {
      const userId = req.user.id;
      const correspondence = await correspondenceService.respond(req.params.id, req.body, userId);

      res.json({
        success: true,
        message: 'Respuesta enviada exitosamente',
        data: correspondence,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
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
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getStats(req, res) {
    try {
      const companyId = req.user.companyId || req.query.companyId;
      const stats = await correspondenceService.getStats(companyId);
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAreaUsers(req, res) {
    try {
      const { correspondenceTypeId } = req.query;
      if (!correspondenceTypeId) {
        return res.status(400).json({ success: false, message: 'correspondenceTypeId es requerido' });
      }
      const users = await correspondenceService.getAreaUsers(correspondenceTypeId);
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getCompanyUsers(req, res) {
    try {
      let { companyId, type = 'internal' } = req.query;
      if (req.user.companyId) {
        companyId = req.user.companyId;
      }
      if (!companyId) {
        return res.status(400).json({ success: false, message: 'companyId es requerido' });
      }
      const users = await correspondenceService.getCompanyUsers(companyId, type);
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async exportExcel(req, res) {
    try {
      let { companyId } = req.query;
      if (req.user.companyId) companyId = req.user.companyId;
      await correspondenceService.exportExcel({ ...req.query, companyId }, res);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createFolder(req, res) {
    try {
      const folder = await correspondenceService.createFolder(req.params.id, req.body.name);
      res.status(201).json({ success: true, data: folder });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getFolders(req, res) {
    try {
      const folders = await correspondenceService.getFolders(req.params.id);
      res.json({ success: true, data: folders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteFolder(req, res) {
    try {
      await correspondenceService.deleteFolder(req.params.id, req.params.folderId);
      res.json({ success: true, message: 'Carpeta eliminada correctamente' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default new CorrespondenceController();
