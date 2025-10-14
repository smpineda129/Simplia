import { useState, useEffect } from 'react';
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
import { retentionSchema } from '../schemas/retentionSchema';

const RetentionModalForm = ({ open, onClose, onSave, retention, companies, areas, onCompanyChange }) => {
  const [error, setError] = useState('');
  const [filteredAreas, setFilteredAreas] = useState([]);

  const initialValues = {
    name: retention?.name || '',
    code: retention?.code || '',
    date: retention?.date ? retention.date.split('T')[0] : '',
    companyId: retention?.companyId || '',
    areaId: retention?.areaId || '',
    comments: retention?.comments || '',
  };

  useEffect(() => {
    if (initialValues.companyId) {
      loadAreasForCompany(initialValues.companyId);
    }
  }, [initialValues.companyId]);

  const loadAreasForCompany = async (companyId) => {
    if (onCompanyChange) {
      await onCompanyChange(companyId);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      await onSave(values);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la tabla de retención');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {retention ? 'Editar Tabla de Retención' : 'Nueva Tabla de Retención'}
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={retentionSchema}
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
                    onChange={(e) => {
                      setFieldValue('companyId', e.target.value);
                      setFieldValue('areaId', '');
                      loadAreasForCompany(e.target.value);
                    }}
                    error={touched.companyId && Boolean(errors.companyId)}
                    helperText={touched.companyId && errors.companyId}
                  >
                    <MenuItem value="">Seleccione una empresa</MenuItem>
                    {companies.map((company) => (
                      <MenuItem key={company.id} value={company.id}>
                        {company.name} ({company.short})
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    select
                    name="areaId"
                    label="Área *"
                    fullWidth
                    value={values.areaId}
                    onChange={(e) => setFieldValue('areaId', e.target.value)}
                    error={touched.areaId && Boolean(errors.areaId)}
                    helperText={touched.areaId && errors.areaId}
                    disabled={!values.companyId}
                  >
                    <MenuItem value="">Seleccione un área</MenuItem>
                    {areas.map((area) => (
                      <MenuItem key={area.id} value={area.id}>
                        {area.name} ({area.code})
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Field
                    as={TextField}
                    name="name"
                    label="Nombre de la Tabla de Retención *"
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

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="date"
                    label="Fecha *"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={touched.date && Boolean(errors.date)}
                    helperText={touched.date && errors.date}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="comments"
                    label="Comentarios"
                    fullWidth
                    multiline
                    rows={3}
                    error={touched.comments && Boolean(errors.comments)}
                    helperText={touched.comments && errors.comments}
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

export default RetentionModalForm;
