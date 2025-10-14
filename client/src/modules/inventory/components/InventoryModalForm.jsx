import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { inventorySchema } from '../schemas/inventorySchema';

const InventoryModalForm = ({ open, onClose, onSubmit, initialValues, isEditing }) => {
  const [error, setError] = useState('');

  const defaultValues = {
    name: '',
    quantity: 0,
    category: '',
    price: 0,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      await onSubmit(values);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? 'Editar Item' : 'Nuevo Item'}
      </DialogTitle>
      <Formik
        initialValues={initialValues || defaultValues}
        validationSchema={inventorySchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {error && <Alert severity="error">{error}</Alert>}

                <Field
                  as={TextField}
                  name="name"
                  label="Nombre del Producto"
                  fullWidth
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />

                <Field
                  as={TextField}
                  name="category"
                  label="Categoría"
                  fullWidth
                  error={touched.category && Boolean(errors.category)}
                  helperText={touched.category && errors.category}
                />

                <Field
                  as={TextField}
                  name="quantity"
                  label="Cantidad"
                  type="number"
                  fullWidth
                  error={touched.quantity && Boolean(errors.quantity)}
                  helperText={touched.quantity && errors.quantity}
                />

                <Field
                  as={TextField}
                  name="price"
                  label="Precio"
                  type="number"
                  fullWidth
                  inputProps={{ step: '0.01' }}
                  error={touched.price && Boolean(errors.price)}
                  helperText={touched.price && errors.price}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancelar</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default InventoryModalForm;
