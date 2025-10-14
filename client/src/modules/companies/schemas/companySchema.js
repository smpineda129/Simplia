import * as Yup from 'yup';

export const companySchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(255, 'El nombre debe tener máximo 255 caracteres'),

  identifier: Yup.string()
    .required('El identificador es requerido')
    .min(3, 'El identificador debe tener al menos 3 caracteres')
    .max(255, 'El identificador debe tener máximo 255 caracteres'),

  short: Yup.string()
    .required('El nombre corto es requerido')
    .min(2, 'El nombre corto debe tener al menos 2 caracteres')
    .max(255, 'El nombre corto debe tener máximo 255 caracteres'),

  email: Yup.string()
    .email('Debe ser un email válido')
    .nullable(),

  codeName: Yup.string()
    .max(255, 'El código debe tener máximo 255 caracteres')
    .nullable(),

  codeDescription: Yup.string()
    .max(255, 'La descripción debe tener máximo 255 caracteres')
    .nullable(),

  imageUrl: Yup.string()
    .url('Debe ser una URL válida')
    .nullable(),

  website: Yup.string()
    .url('Debe ser una URL válida')
    .nullable(),

  watermarkUrl: Yup.string()
    .url('Debe ser una URL válida')
    .nullable(),

  maxUsers: Yup.number()
    .positive('Debe ser un número positivo')
    .integer('Debe ser un número entero')
    .min(1, 'Debe ser al menos 1')
    .nullable(),
});
