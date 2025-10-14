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

const warehouseSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre debe tener máximo 255 caracteres'),
  code: Yup.string()
    .required('El código es requerido')
    .min(1, 'El código debe tener al menos 1 carácter')
    .max(50, 'El código debe tener máximo 50 caracteres'),
  companyId: Yup.number()
    .required('La empresa es requerida')
    .positive('Debe seleccionar una empresa válida'),
  address: Yup.string()
    .nullable(),
});

const WarehouseModalForm = ({ open, onClose, onSave, warehouse, companies, preselectedCompanyId }) => {
  const [error, setError] = useState('');

  const initialValues = {
    name: warehouse?.name || '',
    code: warehouse?.code || '',
    companyId: warehouse?.companyId || preselectedCompanyId || '',
    address: warehouse?.address || '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      await onSave(values);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la bodega');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {warehouse ? 'Editar Bodega' : 'Nueva Bodega'}
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={warehouseSchema}
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
                    name="companyId"
                    label="Empresa *"
                    fullWidth
                    value={values.companyId}
                    onChange={(e) => setFieldValue('companyId', e.target.value)}
                    error={touched.companyId && Boolean(errors.companyId)}
                    helperText={touched.companyId && errors.companyId}
                    disabled={!!warehouse || !!preselectedCompanyId}
                  >
                    <MenuItem value="">Seleccione una empresa</MenuItem>
                    {companies.map((company) => (
                      <MenuItem key={company.id} value={company.id}>
                        {company.name}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="name"
                    label="Nombre *"
                    fullWidth
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="code"
                    label="Código *"
                    fullWidth
                    error={touched.code && Boolean(errors.code)}
                    helperText={touched.code && errors.code}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="address"
                    label="Dirección"
                    fullWidth
                    multiline
                    rows={3}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
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

export default WarehouseModalForm;
