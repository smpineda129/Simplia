import * as Yup from 'yup';

export const correspondenceSchema = Yup.object().shape({
  title: Yup.string()
    .required('El título es requerido')
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(255, 'El título debe tener máximo 255 caracteres'),

  companyId: Yup.number()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .required('La empresa es requerida')
    .positive('Debe seleccionar una empresa válida')
    .integer('Debe ser un número entero'),

  correspondenceTypeId: Yup.number()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .required('El tipo de correspondencia es requerido')
    .positive('Debe seleccionar un tipo válido')
    .integer('Debe ser un número entero'),

  recipientType: Yup.string()
    .required('El tipo de destinatario es requerido')
    .oneOf(['internal', 'external'], 'Debe ser internal o external'),

  recipientName: Yup.string()
    .required('El nombre del destinatario es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre debe tener máximo 255 caracteres'),

  recipientEmail: Yup.string()
    .required('El email del destinatario es requerido')
    .email('Debe ser un email válido'),

  advisorCode: Yup.string()
    .max(255, 'El código debe tener máximo 255 caracteres')
    .nullable(),

  assignedUserId: Yup.number()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .positive('Debe seleccionar un usuario válido')
    .integer('Debe ser un número entero')
    .nullable(),

  comments: Yup.string()
    .nullable(),
});

export const respondSchema = Yup.object().shape({
  response: Yup.string()
    .required('La respuesta es requerida')
    .min(10, 'La respuesta debe tener al menos 10 caracteres'),
});
