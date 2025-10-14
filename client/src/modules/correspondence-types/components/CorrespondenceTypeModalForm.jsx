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
import { correspondenceTypeSchema } from '../schemas/correspondenceTypeSchema';

const CorrespondenceTypeModalForm = ({ open, onClose, onSave, correspondenceType, companies, preselectedCompanyId }) => {
  const [error, setError] = useState('');

  const initialValues = {
    name: correspondenceType?.name || '',
    description: correspondenceType?.description || '',
    companyId: correspondenceType?.companyId || preselectedCompanyId || '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      await onSave(values);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el tipo de correspondencia');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {correspondenceType ? 'Editar Tipo de Correspondencia' : 'Nuevo Tipo de Correspondencia'}
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={correspondenceTypeSchema}
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
                    onChange={(e) => {
                      setFieldValue('companyId', e.target.value);
                    }}
                    error={touched.companyId && Boolean(errors.companyId)}
                    helperText={touched.companyId && errors.companyId}
                    disabled={!!correspondenceType || !!preselectedCompanyId}
                  >
                    <MenuItem value="">Seleccione una empresa</MenuItem>
                    {companies.map((company) => (
                      <MenuItem key={company.id} value={company.id}>
                        {company.name} ({company.short})
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>


                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="name"
                    label="Nombre del Tipo *"
                    fullWidth
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="description"
                    label="Descripción"
                    fullWidth
                    multiline
                    rows={2}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
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

export default CorrespondenceTypeModalForm;
