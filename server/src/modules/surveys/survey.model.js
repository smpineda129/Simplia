import mongoose from 'mongoose';

// Schema para respuestas de encuestas
const surveySchema = new mongoose.Schema(
  {
    formType: {
      type: String,
      required: true,
      enum: ['entidades_publicas', 'mgda', 'entidades_privadas'],
      description: 'Tipo de formulario de diagnóstico'
    },
    surveyData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      description: 'Datos completos del formulario'
    },
    status: {
      type: String,
      enum: ['draft', 'completed'],
      default: 'completed',
      description: 'Estado de la respuesta'
    },
    completedAt: {
      type: Date,
      default: null,
      description: 'Fecha de completado'
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      description: 'Metadatos adicionales'
    }
  },
  {
    timestamps: true,
    collection: 'surveys'
  }
);

// Índices
surveySchema.index({ formType: 1 });
surveySchema.index({ status: 1 });
surveySchema.index({ createdAt: -1 });

// Schema para definiciones de formularios
const surveyDefinitionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      description: 'Nombre identificador de la definición del formulario'
    },
    version: {
      type: String,
      default: '1.0.0',
      description: 'Versión de la definición'
    },
    definition: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      description: 'Definición JSON del formulario SurveyJS'
    },
    isActive: {
      type: Boolean,
      default: true,
      description: 'Indica si esta definición está activa'
    },
    description: {
      type: String,
      description: 'Descripción del formulario'
    }
  },
  {
    timestamps: true,
    collection: 'survey_definitions'
  }
);

surveyDefinitionSchema.index({ name: 1, version: 1 });
surveyDefinitionSchema.index({ isActive: 1 });

export const Survey = mongoose.model('Survey', surveySchema);
export const SurveyDefinition = mongoose.model('SurveyDefinition', surveyDefinitionSchema);
