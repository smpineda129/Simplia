import * as Yup from 'yup';

export const documentSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre debe tener máximo 255 caracteres'),

  companyId: Yup.number()
    .required('La empresa es requerida')
    .positive('Debe seleccionar una empresa válida')
    .integer('Debe ser un número entero'),

  filePath: Yup.string()
    .required('La ruta del archivo es requerida'),

  fileSize: Yup.number()
    .required('El tamaño del archivo es requerido')
    .positive('El tamaño debe ser positivo'),

  mimeType: Yup.string()
    .required('El tipo MIME es requerido'),

  description: Yup.string()
    .nullable(),

  proceedingId: Yup.number()
    .positive('Debe seleccionar un expediente válido')
    .integer('Debe ser un número entero')
    .nullable(),
});
