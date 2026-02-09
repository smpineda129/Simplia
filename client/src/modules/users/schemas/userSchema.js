import * as Yup from 'yup';

export const userSchema = Yup.object({
  name: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .required('El nombre es requerido'),
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es requerido'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .when('$isEditing', {
      is: false,
      then: (schema) => schema.required('La contraseña es requerida'),
      otherwise: (schema) => schema.notRequired(),
    }),
  role: Yup.string()
    .oneOf(['USER', 'ADMIN', 'MANAGER'], 'Rol inválido')
    .required('El rol es requerido'),
  companyId: Yup.number().nullable().optional(),
});
