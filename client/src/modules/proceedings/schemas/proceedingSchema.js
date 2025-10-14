import * as Yup from 'yup';

export const proceedingSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre debe tener máximo 255 caracteres'),

  code: Yup.string()
    .required('El código es requerido')
    .min(2, 'El código debe tener al menos 2 caracteres')
    .max(255, 'El código debe tener máximo 255 caracteres'),

  startDate: Yup.date()
    .required('La fecha inicial es requerida')
    .typeError('Debe ser una fecha válida'),

  companyId: Yup.number()
    .required('La empresa es requerida')
    .positive('Debe seleccionar una empresa válida')
    .integer('Debe ser un número entero'),

  retentionLineId: Yup.number()
    .required('La línea de retención es requerida')
    .positive('Debe seleccionar una línea de retención válida')
    .integer('Debe ser un número entero'),

  companyOne: Yup.string()
    .max(255, 'Empresa Uno debe tener máximo 255 caracteres')
    .nullable(),

  companyTwo: Yup.string()
    .max(255, 'Empresa Dos debe tener máximo 255 caracteres')
    .nullable(),
});
