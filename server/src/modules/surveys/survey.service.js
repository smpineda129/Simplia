import { Survey, SurveyDefinition } from './survey.model.js';
import PptxGenJS from 'pptxgenjs';
import { DiagnosticCalculator } from './services/pptx/calculators/diagnosticCalculator.js';
import { createPortada, createTituloSlide, createContextualizacion, createObjetivos, createMetodologia, createQueSeEvaluo, createParaTenerEnCuenta, createSeparator } from './services/pptx/generators/staticSlides.js';
import { createResultadoGlobal, createEstadoPorcentual, createSeccionBarChart, createInformeSeccion, createPlanAccion, createCierre } from './services/pptx/generators/dynamicSlides.js';
import { generateRecommendations, formatDateSpanish } from './services/pptx/generators/helpers.js';

class SurveyService {
  // ===== SURVEYS =====

  async create(data) {
    const survey = new Survey({
      formType: data.formType,
      surveyData: data.surveyData,
      status: data.status || 'completed',
      completedAt: data.status === 'completed' ? new Date() : null,
      metadata: data.metadata || {},
    });
    return await survey.save();
  }

  async getAll(filters = {}) {
    const { formType, status, page = 1, limit = 50 } = filters;
    const query = {};

    if (formType) query.formType = formType;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [surveys, total] = await Promise.all([
      Survey.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Survey.countDocuments(query),
    ]);

    return {
      data: surveys,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id) {
    const survey = await Survey.findById(id).lean();
    if (!survey) throw new Error('Encuesta no encontrada');
    return survey;
  }

  async update(id, data) {
    const survey = await Survey.findById(id);
    if (!survey) throw new Error('Encuesta no encontrada');

    if (data.surveyData) survey.surveyData = data.surveyData;
    if (data.status) {
      survey.status = data.status;
      if (data.status === 'completed' && !survey.completedAt) {
        survey.completedAt = new Date();
      }
    }
    if (data.metadata) survey.metadata = { ...survey.metadata, ...data.metadata };

    return await survey.save();
  }

  async delete(id) {
    const survey = await Survey.findByIdAndDelete(id);
    if (!survey) throw new Error('Encuesta no encontrada');
    return { message: 'Encuesta eliminada correctamente' };
  }

  async getStats() {
    const [total, completed, draft, byType] = await Promise.all([
      Survey.countDocuments(),
      Survey.countDocuments({ status: 'completed' }),
      Survey.countDocuments({ status: 'draft' }),
      Survey.aggregate([
        { $group: { _id: '$formType', count: { $sum: 1 } } },
      ]),
    ]);

    return {
      total,
      completed,
      draft,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0,
      byType: byType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };
  }

  // ===== PPTX GENERATION =====

  async generateIndividualPresentation(id) {
    const survey = await Survey.findById(id).lean();
    if (!survey) throw new Error('Encuesta no encontrada');
    if (survey.formType !== 'entidades_privadas') {
      throw new Error('La generación de presentaciones solo está disponible para entidades privadas');
    }

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';

    const entityName = survey.surveyData.nombre_entidad || 'Entidad';
    const date = formatDateSpanish(survey.completedAt || survey.createdAt);

    const calculator = new DiagnosticCalculator(survey.surveyData);
    const globalResult = calculator.calculateGlobal();

    // Slides estáticos
    createPortada(pptx, entityName, date);
    createTituloSlide(pptx);
    createContextualizacion(pptx);
    createObjetivos(pptx);
    createMetodologia(pptx);
    createQueSeEvaluo(pptx);
    createParaTenerEnCuenta(pptx);

    // Separador
    createSeparator(pptx, 'Informe Diagnóstico');

    // Slides dinámicos
    createResultadoGlobal(pptx, globalResult);
    createEstadoPorcentual(pptx, globalResult);

    // Secciones detalladas
    const sections = [
      { title: 'Aspectos Administrativos', prefix: ['1_', '2_', '3_', '4_'], stats: globalResult.bySection.admin },
      { title: 'Función Archivística', prefix: ['5_', '6_', '7_'], stats: globalResult.bySection.func },
      { title: 'Preservación Documental', prefix: ['8_'], stats: globalResult.bySection.pres },
    ];

    for (const section of sections) {
      createSeccionBarChart(pptx, section.title, section.stats, section.stats.porcentaje);

      let allItems = [];
      for (const prefix of section.prefix) {
        allItems = allItems.concat(calculator.generateAllItemsBySection(prefix));
      }
      if (allItems.length > 0) {
        createInformeSeccion(pptx, section.title, allItems, section.stats.porcentaje);
      }
    }

    // Plan de acción
    const recommendations = generateRecommendations(globalResult);
    createPlanAccion(pptx, recommendations);

    // Cierre
    createCierre(pptx, entityName);

    const buffer = await pptx.write({ outputType: 'nodebuffer' });
    return buffer;
  }

  // ===== SURVEY DEFINITIONS =====

  async getActiveDefinition(name) {
    const definition = await SurveyDefinition.findOne({ name, isActive: true }).lean();
    if (!definition) throw new Error('Definición no encontrada');
    return definition;
  }

  async createOrUpdateDefinition(data) {
    const existing = await SurveyDefinition.findOne({ name: data.name });
    if (existing) {
      existing.definition = data.definition;
      if (data.version) existing.version = data.version;
      if (data.description) existing.description = data.description;
      if (data.isActive !== undefined) existing.isActive = data.isActive;
      return await existing.save();
    }
    const definition = new SurveyDefinition(data);
    return await definition.save();
  }

  async getAllDefinitions() {
    return await SurveyDefinition.find().sort({ createdAt: -1 }).lean();
  }

  async getDefinitionById(id) {
    const definition = await SurveyDefinition.findById(id).lean();
    if (!definition) throw new Error('Definición no encontrada');
    return definition;
  }

  async deleteDefinition(id) {
    const definition = await SurveyDefinition.findByIdAndDelete(id);
    if (!definition) throw new Error('Definición no encontrada');
    return { message: 'Definición eliminada correctamente' };
  }
}

export default new SurveyService();
