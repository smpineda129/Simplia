import { body } from 'express-validator';

export const createSurveyValidation = [
  body('formType')
    .isString()
    .isIn(['entidades_publicas', 'mgda', 'entidades_privadas'])
    .withMessage('Tipo de formulario inválido'),
  body('surveyData')
    .isObject()
    .withMessage('Los datos del formulario son requeridos'),
  body('status')
    .optional()
    .isIn(['draft', 'completed'])
    .withMessage('Estado inválido'),
];

export const updateSurveyValidation = [
  body('surveyData')
    .optional()
    .isObject()
    .withMessage('Los datos del formulario deben ser un objeto'),
  body('status')
    .optional()
    .isIn(['draft', 'completed'])
    .withMessage('Estado inválido'),
];

export const createSurveyDefinitionValidation = [
  body('name')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido'),
  body('definition')
    .isObject()
    .withMessage('La definición del formulario es requerida'),
  body('version')
    .optional()
    .isString(),
  body('isActive')
    .optional()
    .isBoolean(),
  body('description')
    .optional()
    .isString(),
];
