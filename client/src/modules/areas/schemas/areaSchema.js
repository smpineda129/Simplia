import * as Yup from 'yup';

export const areaSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre debe tener máximo 255 caracteres'),

  code: Yup.string()
    .required('El código es requerido')
    .min(2, 'El código debe tener al menos 2 caracteres')
    .max(255, 'El código debe tener máximo 255 caracteres'),

  companyId: Yup.number()
    .required('La empresa es requerida')
    .positive('Debe seleccionar una empresa válida')
    .integer('Debe ser un número entero'),
});
