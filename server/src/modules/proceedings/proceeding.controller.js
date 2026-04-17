import proceedingService from './proceeding.service.js';

class ProceedingController {
  async getAll(req, res) {
    try {
      const { search, retentionLineId, retentionId, page, limit } = req.query;
      let { companyId } = req.query;

      if (req.user.companyId) {
        companyId = req.user.companyId;
      }

      const result = await proceedingService.getAll({ search, companyId, retentionLineId, retentionId, page, limit });

      res.json({
        success: true,
        data: result.proceedings,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const proceeding = await proceedingService.getById(req.params.id);
      res.json({ success: true, data: proceeding });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async create(req, res) {
    try {
      const proceeding = await proceedingService.create(req.body);
      res.status(201).json({ success: true, message: 'Expediente creado exitosamente', data: proceeding });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const proceeding = await proceedingService.update(req.params.id, req.body);
      res.json({ success: true, message: 'Expediente actualizado exitosamente', data: proceeding });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await proceedingService.delete(req.params.id);
      res.json({ success: true, message: 'Expediente eliminado exitosamente' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ─── Boxes ────────────────────────────────────────────────────────────────

  async attachBox(req, res) {
    try {
      const record = await proceedingService.attachBox(req.params.id, req.body.boxId);
      res.status(201).json({ success: true, data: record });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async detachBox(req, res) {
    try {
      await proceedingService.detachBox(req.params.id, req.params.boxId);
      res.json({ success: true, message: 'Caja desvinculada correctamente' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ─── External Users ───────────────────────────────────────────────────────

  async shareWithUser(req, res) {
    console.log('[ProceedingController] shareWithUser called', {
      proceedingId: req.params.id,
      externalUserId: req.body.externalUserId,
      hasCustomMessage: !!req.body.customMessage,
    });
    try {
      const record = await proceedingService.shareWithUser(
        req.params.id, 
        req.body.externalUserId,
        req.body.customMessage
      );
      console.log('[ProceedingController] shareWithUser success');
      res.status(201).json({ 
        success: true, 
        data: record,
        message: 'Usuario agregado exitosamente',
        emailError: record.emailError || null
      });
    } catch (error) {
      console.error('[ProceedingController] shareWithUser error:', error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async unshareWithUser(req, res) {
    try {
      await proceedingService.unshareWithUser(req.params.id, req.params.userId);
      res.json({ success: true, message: 'Acceso revocado correctamente' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ─── Threads (Loans) ──────────────────────────────────────────────────────

  async createThread(req, res) {
    try {
      const thread = await proceedingService.createThread(req.params.id, req.body, req.user.id);
      res.status(201).json({ success: true, data: thread });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteThread(req, res) {
    try {
      await proceedingService.deleteThread(req.params.id, req.params.threadId);
      res.json({ success: true, message: 'Préstamo eliminado correctamente' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ─── Documents ────────────────────────────────────────────────────────────

  async uploadDocument(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No se recibió ningún archivo' });
      }
      const document = await proceedingService.uploadAndAttachDocument(req.params.id, req.file);
      res.status(201).json({ success: true, data: document });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async attachDocument(req, res) {
    try {
      const record = await proceedingService.attachDocument(req.params.id, req.body.documentId);
      res.status(201).json({ success: true, data: record });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async detachDocument(req, res) {
    try {
      await proceedingService.detachDocument(req.params.id, req.params.documentId);
      res.json({ success: true, message: 'Documento desvinculado correctamente' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async exportExcel(req, res) {
    try {
      let { companyId } = req.query;
      if (req.user.companyId) companyId = req.user.companyId;
      await proceedingService.exportExcel({ ...req.query, companyId }, res);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new ProceedingController();
