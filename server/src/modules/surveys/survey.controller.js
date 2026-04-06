import surveyService from './survey.service.js';

class SurveyController {
  // ===== SURVEYS =====

  async create(req, res) {
    try {
      const survey = await surveyService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Encuesta creada exitosamente',
        data: survey,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAll(req, res) {
    try {
      const result = await surveyService.getAll(req.query);
      res.json({
        success: true,
        data: result.data,
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
      const survey = await surveyService.getById(req.params.id);
      res.json({
        success: true,
        data: survey,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const survey = await surveyService.update(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Encuesta actualizada exitosamente',
        data: survey,
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
      await surveyService.delete(req.params.id);
      res.json({
        success: true,
        message: 'Encuesta eliminada exitosamente',
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
      const stats = await surveyService.getStats();
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async generateIndividualPresentation(req, res) {
    try {
      const buffer = await surveyService.generateIndividualPresentation(req.params.id);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
      res.setHeader('Content-Disposition', `attachment; filename=diagnostico_${Date.now()}.pptx`);
      res.send(buffer);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ===== SURVEY DEFINITIONS =====

  async getActiveDefinition(req, res) {
    try {
      const definition = await surveyService.getActiveDefinition(req.params.name);
      res.json({
        success: true,
        data: definition,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createOrUpdateDefinition(req, res) {
    try {
      const definition = await surveyService.createOrUpdateDefinition(req.body);
      res.status(201).json({
        success: true,
        message: 'Definición guardada exitosamente',
        data: definition,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllDefinitions(req, res) {
    try {
      const definitions = await surveyService.getAllDefinitions();
      res.json({
        success: true,
        data: definitions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getDefinitionById(req, res) {
    try {
      const definition = await surveyService.getDefinitionById(req.params.id);
      res.json({
        success: true,
        data: definition,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteDefinition(req, res) {
    try {
      await surveyService.deleteDefinition(req.params.id);
      res.json({
        success: true,
        message: 'Definición eliminada exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new SurveyController();
