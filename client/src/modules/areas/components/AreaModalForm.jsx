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
import { areaSchema } from '../schemas/areaSchema';

const AreaModalForm = ({ open, onClose, onSave, area, companies, preselectedCompanyId }) => {
  const [error, setError] = useState('');

  const initialValues = {
    name: area?.name || '',
    code: area?.code || '',
    companyId: area?.companyId || preselectedCompanyId || '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      await onSave(values);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el área');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {area ? 'Editar Área' : 'Nueva Área'}
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={areaSchema}
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
                    label="Empresa *"
                    fullWidth
                    value={values.companyId}
                    onChange={(e) => setFieldValue('companyId', e.target.value)}
                    error={touched.companyId && Boolean(errors.companyId)}
                    helperText={touched.companyId && errors.companyId}
                    disabled={!!area || !!preselectedCompanyId}
                  >
                    <MenuItem value="">Seleccione una empresa</MenuItem>
                    {companies.map((company) => (
                      <MenuItem key={company.id} value={company.id}>
                        {company.name} ({company.short})
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Field
                    as={TextField}
                    name="name"
                    label="Nombre del Área *"
                    fullWidth
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Field
                    as={TextField}
                    name="code"
                    label="Código *"
                    fullWidth
                    error={touched.code && Boolean(errors.code)}
                    helperText={touched.code && errors.code}
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

export default AreaModalForm;
