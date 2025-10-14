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
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
} from '@mui/material';
import * as Yup from 'yup';

const retentionLineSchema = Yup.object().shape({
  series: Yup.string()
    .required('La serie es requerida')
    .max(255, 'Máximo 255 caracteres'),
  subseries: Yup.string()
    .required('La subserie es requerida')
    .max(255, 'Máximo 255 caracteres'),
  code: Yup.string()
    .required('El código es requerido')
    .max(255, 'Máximo 255 caracteres'),
  documents: Yup.string()
    .nullable()
    .max(1000, 'Máximo 1000 caracteres'),
  localRetention: Yup.number()
    .required('La retención local es requerida')
    .min(0, 'Debe ser mayor o igual a 0')
    .integer('Debe ser un número entero'),
  centralRetention: Yup.number()
    .required('La retención central es requerida')
    .min(0, 'Debe ser mayor o igual a 0')
    .integer('Debe ser un número entero'),
  comments: Yup.string()
    .nullable()
    .max(1000, 'Máximo 1000 caracteres'),
});

const RetentionLineForm = ({ open, onClose, onSave, line }) => {
  const [error, setError] = useState('');

  const initialValues = {
    series: line?.series || '',
    subseries: line?.subseries || '',
    code: line?.code || '',
    documents: line?.documents || '',
    localRetention: line?.localRetention || 0,
    centralRetention: line?.centralRetention || 0,
    dispositionCt: line?.dispositionCt || false,
    dispositionE: line?.dispositionE || false,
    dispositionM: line?.dispositionM || false,
    dispositionD: line?.dispositionD || false,
    dispositionS: line?.dispositionS || false,
    comments: line?.comments || '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      await onSave(values);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar la línea de retención');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {line ? 'Editar Línea de Retención' : 'Nueva Línea de Retención'}
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={retentionLineSchema}
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
                <Grid item xs={12} md={4}>
                  <Field
                    as={TextField}
                    name="series"
                    label="Serie *"
                    fullWidth
                    error={touched.series && Boolean(errors.series)}
                    helperText={touched.series && errors.series}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Field
                    as={TextField}
                    name="subseries"
                    label="Subserie *"
                    fullWidth
                    error={touched.subseries && Boolean(errors.subseries)}
                    helperText={touched.subseries && errors.subseries}
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

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="documents"
                    label="Documentos"
                    fullWidth
                    multiline
                    rows={2}
                    error={touched.documents && Boolean(errors.documents)}
                    helperText={touched.documents && errors.documents}
                    placeholder="Descripción de los documentos que incluye esta línea"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="localRetention"
                    label="Retención Local (años) *"
                    type="number"
                    fullWidth
                    error={touched.localRetention && Boolean(errors.localRetention)}
                    helperText={touched.localRetention && errors.localRetention}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="centralRetention"
                    label="Retención Central (años) *"
                    type="number"
                    fullWidth
                    error={touched.centralRetention && Boolean(errors.centralRetention)}
                    helperText={touched.centralRetention && errors.centralRetention}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                    Disposición Final
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.dispositionCt}
                          onChange={(e) => setFieldValue('dispositionCt', e.target.checked)}
                        />
                      }
                      label="CT - Conservación Total"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.dispositionE}
                          onChange={(e) => setFieldValue('dispositionE', e.target.checked)}
                        />
                      }
                      label="E - Eliminación"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.dispositionM}
                          onChange={(e) => setFieldValue('dispositionM', e.target.checked)}
                        />
                      }
                      label="M - Microfilmación"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.dispositionD}
                          onChange={(e) => setFieldValue('dispositionD', e.target.checked)}
                        />
                      }
                      label="D - Digitalización"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.dispositionS}
                          onChange={(e) => setFieldValue('dispositionS', e.target.checked)}
                        />
                      }
                      label="S - Selección"
                    />
                  </Box>
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
              <Button onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default RetentionLineForm;
