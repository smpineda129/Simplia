import * as Yup from 'yup';

export const templateSchema = Yup.object().shape({
  title: Yup.string()
    .required('El título es requerido')
    .min(2, 'El título debe tener al menos 2 caracteres')
    .max(255, 'El título debe tener máximo 255 caracteres'),

  companyId: Yup.number()
    .required('La empresa es requerida')
    .positive('Debe seleccionar una empresa válida')
    .integer('Debe ser un número entero'),

  description: Yup.string()
    .max(255, 'La descripción debe tener máximo 255 caracteres')
    .nullable(),

  content: Yup.string()
    .required('El contenido es requerido')
    .min(10, 'El contenido debe tener al menos 10 caracteres'),
});
