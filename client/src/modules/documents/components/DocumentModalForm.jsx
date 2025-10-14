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
import { documentSchema } from '../schemas/documentSchema';

const DocumentModalForm = ({ open, onClose, onSave, document, companies, proceedings, onCompanyChange }) => {
  const [error, setError] = useState('');

  const initialValues = {
    name: document?.name || '',
    description: document?.description || '',
    companyId: document?.companyId || '',
    proceedingId: document?.proceedingId || '',
    filePath: document?.filePath || '/uploads/placeholder.pdf',
    fileSize: document?.fileSize || 0,
    mimeType: document?.mimeType || 'application/pdf',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      await onSave(values);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el documento');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {document ? 'Editar Documento' : 'Nuevo Documento'}
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={documentSchema}
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

              <Alert severity="info" sx={{ mb: 2 }}>
                Nota: La carga de archivos requiere configuración adicional (AWS S3, multer, etc.)
              </Alert>

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
                      setFieldValue('proceedingId', '');
                      if (onCompanyChange) {
                        onCompanyChange(e.target.value);
                      }
                    }}
                    error={touched.companyId && Boolean(errors.companyId)}
                    helperText={touched.companyId && errors.companyId}
                    disabled={!!document}
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
                    name="proceedingId"
                    label="Expediente (Opcional)"
                    fullWidth
                    value={values.proceedingId}
                    onChange={(e) => setFieldValue('proceedingId', e.target.value)}
                    error={touched.proceedingId && Boolean(errors.proceedingId)}
                    helperText={touched.proceedingId && errors.proceedingId}
                    disabled={!values.companyId}
                  >
                    <MenuItem value="">Sin expediente</MenuItem>
                    {proceedings.map((proceeding) => (
                      <MenuItem key={proceeding.id} value={proceeding.id}>
                        {proceeding.name} ({proceeding.code})
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="name"
                    label="Nombre del Documento *"
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
                    rows={3}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="filePath"
                    label="Ruta del Archivo *"
                    fullWidth
                    error={touched.filePath && Boolean(errors.filePath)}
                    helperText={touched.filePath && errors.filePath}
                    placeholder="/uploads/documento.pdf"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="mimeType"
                    label="Tipo MIME *"
                    fullWidth
                    error={touched.mimeType && Boolean(errors.mimeType)}
                    helperText={touched.mimeType && errors.mimeType}
                    placeholder="application/pdf"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="fileSize"
                    label="Tamaño del Archivo (bytes) *"
                    type="number"
                    fullWidth
                    error={touched.fileSize && Boolean(errors.fileSize)}
                    helperText={touched.fileSize && errors.fileSize}
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

export default DocumentModalForm;
