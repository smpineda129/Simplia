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

const entitySchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre debe tener máximo 255 caracteres'),
  categoryId: Yup.number()
    .required('La categoría es requerida')
    .positive('Debe seleccionar una categoría válida'),
  companyId: Yup.number()
    .required('La empresa es requerida')
    .positive('Debe seleccionar una empresa válida'),
  email: Yup.string()
    .email('Debe ser un email válido')
    .nullable(),
  phone: Yup.string()
    .nullable(),
  address: Yup.string()
    .nullable(),
});

const EntityModalForm = ({ open, onClose, onSave, entity, companies, categories }) => {
  const [error, setError] = useState('');

  const initialValues = {
    name: entity?.name || '',
    categoryId: entity?.categoryId || '',
    companyId: entity?.companyId || '',
    email: entity?.email || '',
    phone: entity?.phone || '',
    address: entity?.address || '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      await onSave(values);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la entidad');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {entity ? 'Editar Entidad' : 'Nueva Entidad'}
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={entitySchema}
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
                <Grid item xs={12} md={6}>
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
                    disabled={!!entity}
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
                    select
                    name="categoryId"
                    label="Categoría *"
                    fullWidth
                    value={values.categoryId}
                    onChange={(e) => setFieldValue('categoryId', e.target.value)}
                    error={touched.categoryId && Boolean(errors.categoryId)}
                    helperText={touched.categoryId && errors.categoryId}
                  >
                    <MenuItem value="">Seleccione una categoría</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>

                <Grid item xs={12}>
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
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="phone"
                    label="Teléfono"
                    fullWidth
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="address"
                    label="Dirección"
                    fullWidth
                    multiline
                    rows={2}
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

export default EntityModalForm;
