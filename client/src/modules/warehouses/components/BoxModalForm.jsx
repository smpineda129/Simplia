import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert,
  MenuItem,
} from '@mui/material';
import * as Yup from 'yup';

const boxSchema = Yup.object().shape({
  code: Yup.string()
    .required('El código es requerido')
    .min(1, 'El código debe tener al menos 1 carácter')
    .max(50, 'El código debe tener máximo 50 caracteres'),
  warehouseId: Yup.number()
    .required('La bodega es requerida')
    .positive('Debe seleccionar una bodega válida'),
  island: Yup.string()
    .nullable(),
  shelf: Yup.string()
    .nullable(),
  level: Yup.string()
    .nullable(),
});

const BoxModalForm = ({ open, onClose, onSave, box, warehouses, preselectedWarehouseId }) => {
  const [error, setError] = useState('');

  const initialValues = {
    code: box?.code || '',
    warehouseId: box?.warehouseId || preselectedWarehouseId || '',
    island: box?.island || '',
    shelf: box?.shelf || '',
    level: box?.level || '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      await onSave(values);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la caja');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {box ? 'Editar Caja' : 'Nueva Caja'}
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={boxSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting, values, setFieldValue }) => (
          <Form>
            <DialogContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    select
                    name="warehouseId"
                    label="Bodega *"
                    fullWidth
                    value={values.warehouseId}
                    onChange={(e) => setFieldValue('warehouseId', e.target.value)}
                    error={touched.warehouseId && Boolean(errors.warehouseId)}
                    helperText={touched.warehouseId && errors.warehouseId}
                    disabled={!!box || !!preselectedWarehouseId}
                  >
                    <MenuItem value="">Seleccione una bodega</MenuItem>
                    {warehouses.map((warehouse) => (
                      <MenuItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name} ({warehouse.code})
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="code"
                    label="Código de Caja *"
                    fullWidth
                    error={touched.code && Boolean(errors.code)}
                    helperText={touched.code && errors.code}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Field
                    as={TextField}
                    name="island"
                    label="Isla"
                    fullWidth
                    error={touched.island && Boolean(errors.island)}
                    helperText={touched.island && errors.island}
                    placeholder="Ej: A, B, C"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Field
                    as={TextField}
                    name="shelf"
                    label="Estantería"
                    fullWidth
                    error={touched.shelf && Boolean(errors.shelf)}
                    helperText={touched.shelf && errors.shelf}
                    placeholder="Ej: 1, 2, 3"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Field
                    as={TextField}
                    name="level"
                    label="Estante"
                    fullWidth
                    error={touched.level && Boolean(errors.level)}
                    helperText={touched.level && errors.level}
                    placeholder="Ej: A, B, C"
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
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

export default BoxModalForm;
