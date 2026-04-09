import { useState, useRef } from 'react';
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
  CircularProgress,
  Typography,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import axiosInstance from '../../../api/axiosConfig';
import { companySchema } from '../schemas/companySchema';

const CompanyModalForm = ({ open, onClose, onSave, company }) => {
  const [error, setError] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingWatermark, setUploadingWatermark] = useState(false);
  const logoInputRef = useRef(null);
  const watermarkInputRef = useRef(null);

  const uploadImage = async (file, fieldName, setValues, values) => {
    const setter = fieldName === 'imageUrl' ? setUploadingLogo : setUploadingWatermark;
    setter(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axiosInstance.post('/companies/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setValues({ ...values, [fieldName]: res.data.data.key });
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      setter(false);
    }
  };

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
      console.error('Error completo:', err.response?.data);
      const errorMessage = err.response?.data?.message || 'Error al guardar la empresa';
      const validationErrors = err.response?.data?.errors;
      
      if (validationErrors && validationErrors.length > 0) {
        const errorList = validationErrors.map(e => e.msg || e.message).join(', ');
        setError(`${errorMessage}: ${errorList}`);
      } else {
        setError(errorMessage);
      }
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
        {({ errors, touched, isSubmitting, values, setValues }) => (
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

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Logo</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={uploadingLogo ? <CircularProgress size={16} /> : <CloudUpload />}
                        disabled={uploadingLogo}
                        onClick={() => logoInputRef.current?.click()}
                        size="small"
                      >
                        Subir Logo
                      </Button>
                      {values.imageUrl && (
                        <Typography variant="caption" color="success.main" noWrap sx={{ maxWidth: 180 }}>
                          ✓ {values.imageUrl.split('/').pop()}
                        </Typography>
                      )}
                    </Box>
                    <input
                      type="file"
                      ref={logoInputRef}
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0], 'imageUrl', setValues, values)}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Marca de Agua</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={uploadingWatermark ? <CircularProgress size={16} /> : <CloudUpload />}
                        disabled={uploadingWatermark}
                        onClick={() => watermarkInputRef.current?.click()}
                        size="small"
                      >
                        Subir Marca de Agua
                      </Button>
                      {values.watermarkUrl && (
                        <Typography variant="caption" color="success.main" noWrap sx={{ maxWidth: 180 }}>
                          ✓ {values.watermarkUrl.split('/').pop()}
                        </Typography>
                      )}
                    </Box>
                    <input
                      type="file"
                      ref={watermarkInputRef}
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0], 'watermarkUrl', setValues, values)}
                    />
                  </Box>
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
