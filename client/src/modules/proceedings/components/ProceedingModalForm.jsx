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
import { proceedingSchema } from '../schemas/proceedingSchema';
import { retentionService } from '../../retentions';

const ProceedingModalForm = ({ open, onClose, onSave, proceeding, companies, retentions, onCompanyChange }) => {
  const [error, setError] = useState('');
  const [retentionLines, setRetentionLines] = useState([]);
  const [selectedRetention, setSelectedRetention] = useState('');

  const initialValues = {
    name: proceeding?.name || '',
    code: proceeding?.code || '',
    startDate: proceeding?.startDate ? proceeding.startDate.split('T')[0] : '',
    companyId: proceeding?.companyId || '',
    retentionId: proceeding?.retentionLine?.retentionId || '',
    retentionLineId: proceeding?.retentionLineId || '',
    companyOne: proceeding?.companyOne || '',
    companyTwo: proceeding?.companyTwo || '',
  };

  useEffect(() => {
    if (initialValues.companyId) {
      loadRetentionsForCompany(initialValues.companyId);
    }
  }, [initialValues.companyId]);

  useEffect(() => {
    if (initialValues.retentionId) {
      loadRetentionLines(initialValues.retentionId);
      setSelectedRetention(initialValues.retentionId);
    }
  }, [initialValues.retentionId]);

  const loadRetentionsForCompany = async (companyId) => {
    if (onCompanyChange) {
      await onCompanyChange(companyId);
    }
  };

  const loadRetentionLines = async (retentionId) => {
    try {
      const lines = await retentionService.getLines(retentionId);
      setRetentionLines(lines);
    } catch (error) {
      console.error('Error loading retention lines:', error);
      setRetentionLines([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      await onSave(values);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el expediente');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {proceeding ? 'Editar Expediente' : 'Nuevo Expediente'}
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={proceedingSchema}
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
                      setFieldValue('retentionLineId', '');
                      setSelectedRetention('');
                      setRetentionLines([]);
                      loadRetentionsForCompany(e.target.value);
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
                  <TextField
                    select
                    label="Tabla de Retención *"
                    fullWidth
                    value={selectedRetention}
                    onChange={(e) => {
                      setSelectedRetention(e.target.value);
                      setFieldValue('retentionLineId', '');
                      loadRetentionLines(e.target.value);
                    }}
                    disabled={!values.companyId}
                  >
                    <MenuItem value="">Seleccione una tabla de retención</MenuItem>
                    {retentions.map((retention) => (
                      <MenuItem key={retention.id} value={retention.id}>
                        {retention.name} ({retention.code})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    select
                    name="retentionLineId"
                    label="Línea de Retención *"
                    fullWidth
                    value={values.retentionLineId}
                    onChange={(e) => setFieldValue('retentionLineId', e.target.value)}
                    error={touched.retentionLineId && Boolean(errors.retentionLineId)}
                    helperText={touched.retentionLineId && errors.retentionLineId}
                    disabled={!selectedRetention}
                  >
                    <MenuItem value="">Seleccione una línea de retención</MenuItem>
                    {retentionLines.map((line) => (
                      <MenuItem key={line.id} value={line.id}>
                        {line.series} - {line.subseries} ({line.code})
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Field
                    as={TextField}
                    name="name"
                    label="Nombre del Expediente *"
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

                <Grid item xs={12} md={4}>
                  <Field
                    as={TextField}
                    name="startDate"
                    label="Fecha Inicial *"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={touched.startDate && Boolean(errors.startDate)}
                    helperText={touched.startDate && errors.startDate}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Field
                    as={TextField}
                    name="companyOne"
                    label="Empresa Uno"
                    fullWidth
                    error={touched.companyOne && Boolean(errors.companyOne)}
                    helperText={touched.companyOne && errors.companyOne}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Field
                    as={TextField}
                    name="companyTwo"
                    label="Empresa Dos"
                    fullWidth
                    error={touched.companyTwo && Boolean(errors.companyTwo)}
                    helperText={touched.companyTwo && errors.companyTwo}
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

export default ProceedingModalForm;
