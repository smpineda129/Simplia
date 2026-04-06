import * as Yup from 'yup';

export const correspondenceSchema = Yup.object().shape({
  title: Yup.string()
    .required('El título es requerido')
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(255, 'El título debe tener máximo 255 caracteres'),

  user_type: Yup.string()
    .required('El tipo de usuario es requerido')
    .oneOf(['internal', 'external'], 'Debe ser internal o external'),

  user_id: Yup.number()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .required('El usuario es requerido')
    .positive('Debe seleccionar un usuario válido')
    .integer('Debe ser un número entero'),

  correspondenceTypeId: Yup.number()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .positive('Debe seleccionar un tipo válido')
    .integer('Debe ser un número entero')
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
