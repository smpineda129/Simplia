import retentionLineService from './retentionLine.service.js';

class RetentionLineController {
  async getByRetentionId(req, res) {
    try {
      const lines = await retentionLineService.getByRetentionId(req.params.retentionId);
      res.json(lines);
    } catch (error) {
      console.error('Error fetching retention lines:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const line = await retentionLineService.getById(req.params.id);
      res.json(line);
    } catch (error) {
      console.error('Error fetching retention line:', error);
      res.status(404).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const data = { ...req.body, retentionId: req.params.retentionId };
      const line = await retentionLineService.create(data);
      res.status(201).json(line);
    } catch (error) {
      console.error('Error creating retention line:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const line = await retentionLineService.update(req.params.id, req.body);
      res.json(line);
    } catch (error) {
      console.error('Error updating retention line:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await retentionLineService.delete(req.params.id);
      res.json(result);
    } catch (error) {
      console.error('Error deleting retention line:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

export default new RetentionLineController();
