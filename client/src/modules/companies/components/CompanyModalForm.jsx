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
  Box,
  Alert,
} from '@mui/material';
import { companySchema } from '../schemas/companySchema';

const CompanyModalForm = ({ open, onClose, onSave, company }) => {
  const [error, setError] = useState('');

  const initialValues = {
    name: company?.name || '',
    identifier: company?.identifier || '',
    short: company?.short || '',
    email: company?.email || '',
    codeName: company?.codeName || '',
    codeDescription: company?.codeDescription || '',
    imageUrl: company?.imageUrl || '',
    website: company?.website || '',
    watermarkUrl: company?.watermarkUrl || '',
    maxUsers: company?.maxUsers || 10,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      await onSave(values);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la empresa');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {company ? 'Editar Empresa' : 'Nueva Empresa'}
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={companySchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting }) => (
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
                    name="name"
                    label="Nombre de la Empresa *"
                    fullWidth
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="identifier"
                    label="Identificador (NIT/RUC) *"
                    fullWidth
                    error={touched.identifier && Boolean(errors.identifier)}
                    helperText={touched.identifier && errors.identifier}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="short"
                    label="Nombre Corto *"
                    fullWidth
                    error={touched.short && Boolean(errors.short)}
                    helperText={touched.short && errors.short}
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
                    name="codeName"
                    label="Código"
                    fullWidth
                    error={touched.codeName && Boolean(errors.codeName)}
                    helperText={touched.codeName && errors.codeName}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="codeDescription"
                    label="Descripción del Código"
                    fullWidth
                    error={touched.codeDescription && Boolean(errors.codeDescription)}
                    helperText={touched.codeDescription && errors.codeDescription}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="website"
                    label="Sitio Web"
                    fullWidth
                    placeholder="https://ejemplo.com"
                    error={touched.website && Boolean(errors.website)}
                    helperText={touched.website && errors.website}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="maxUsers"
                    label="Máximo de Usuarios"
                    type="number"
                    fullWidth
                    error={touched.maxUsers && Boolean(errors.maxUsers)}
                    helperText={touched.maxUsers && errors.maxUsers}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="imageUrl"
                    label="URL del Logo"
                    fullWidth
                    placeholder="https://ejemplo.com/logo.png"
                    error={touched.imageUrl && Boolean(errors.imageUrl)}
                    helperText={touched.imageUrl && errors.imageUrl}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="watermarkUrl"
                    label="URL de Marca de Agua"
                    fullWidth
                    placeholder="https://ejemplo.com/watermark.png"
                    error={touched.watermarkUrl && Boolean(errors.watermarkUrl)}
                    helperText={touched.watermarkUrl && errors.watermarkUrl}
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

export default CompanyModalForm;
