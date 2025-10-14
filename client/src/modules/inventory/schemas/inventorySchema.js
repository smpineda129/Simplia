import * as Yup from 'yup';

export const inventorySchema = Yup.object({
  name: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .required('El nombre es requerido'),
  quantity: Yup.number()
    .min(0, 'La cantidad debe ser mayor o igual a 0')
    .integer('La cantidad debe ser un número entero')
    .required('La cantidad es requerida'),
  category: Yup.string()
    .required('La categoría es requerida'),
  price: Yup.number()
    .min(0, 'El precio debe ser mayor o igual a 0')
    .required('El precio es requerido'),
});
