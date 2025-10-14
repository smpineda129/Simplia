import * as Yup from 'yup';

export const retentionSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre debe tener máximo 255 caracteres'),

  code: Yup.string()
    .required('El código es requerido')
    .min(2, 'El código debe tener al menos 2 caracteres')
    .max(255, 'El código debe tener máximo 255 caracteres'),

  date: Yup.date()
    .required('La fecha es requerida')
    .typeError('Debe ser una fecha válida'),

  companyId: Yup.number()
    .required('La empresa es requerida')
    .positive('Debe seleccionar una empresa válida')
    .integer('Debe ser un número entero'),

  areaId: Yup.number()
    .required('El área es requerida')
    .positive('Debe seleccionar un área válida')
    .integer('Debe ser un número entero'),

  comments: Yup.string()
    .max(255, 'Los comentarios deben tener máximo 255 caracteres')
    .nullable(),
});

export const retentionLineSchema = Yup.object().shape({
  series: Yup.string()
    .required('La serie es requerida')
    .min(2, 'La serie debe tener al menos 2 caracteres')
    .max(255, 'La serie debe tener máximo 255 caracteres'),

  subseries: Yup.string()
    .required('La subserie es requerida')
    .min(2, 'La subserie debe tener al menos 2 caracteres')
    .max(255, 'La subserie debe tener máximo 255 caracteres'),

  code: Yup.string()
    .required('El código es requerido')
    .min(2, 'El código debe tener al menos 2 caracteres')
    .max(255, 'El código debe tener máximo 255 caracteres'),

  localRetention: Yup.number()
    .required('El tiempo de retención local es requerido')
    .min(0, 'Debe ser un número positivo')
    .integer('Debe ser un número entero'),

  centralRetention: Yup.number()
    .required('El tiempo de retención central es requerido')
    .min(0, 'Debe ser un número positivo')
    .integer('Debe ser un número entero'),

  documents: Yup.string()
    .nullable(),

  dispositionCt: Yup.boolean(),
  dispositionE: Yup.boolean(),
  dispositionM: Yup.boolean(),
  dispositionD: Yup.boolean(),
  dispositionS: Yup.boolean(),

  comments: Yup.string()
    .nullable(),
});
