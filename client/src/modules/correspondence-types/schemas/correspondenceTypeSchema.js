import * as Yup from 'yup';

export const correspondenceTypeSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre debe tener máximo 255 caracteres'),

  companyId: Yup.number()
    .required('La empresa es requerida')
    .positive('Debe seleccionar una empresa válida')
    .integer('Debe ser un número entero'),

  description: Yup.string()
    .max(255, 'La descripción debe tener máximo 255 caracteres')
    .nullable(),

  expiration: Yup.number()
    .positive('Debe ser un número positivo')
    .integer('Debe ser un número entero')
    .nullable(),

  areaId: Yup.number()
    .positive('Debe seleccionar un área válida')
    .integer('Debe ser un número entero')
    .nullable(),

  public: Yup.boolean(),
});
