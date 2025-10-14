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
  Box,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore, Code } from '@mui/icons-material';
import { templateSchema } from '../schemas/templateSchema';

const TemplateModalForm = ({ open, onClose, onSave, template, companies, helpers }) => {
  const [error, setError] = useState('');

  const initialValues = {
    title: template?.title || '',
    description: template?.description || '',
    content: template?.content || '',
    companyId: template?.companyId || '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      await onSave(values);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la plantilla');
    } finally {
      setSubmitting(false);
    }
  };

  const insertHelper = (helper, setFieldValue, currentContent) => {
    const newContent = currentContent + ' ' + helper;
    setFieldValue('content', newContent);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {template ? 'Editar Plantilla' : 'Nueva Plantilla'}
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={templateSchema}
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
                    name="title"
                    label="Título de la Plantilla *"
                    fullWidth
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
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

                {/* Helpers disponibles */}
                <Grid item xs={12}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Code />
                        <Typography>Helpers Disponibles (Click para insertar)</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {Object.entries(helpers).map(([category, items]) => (
                          <Grid item xs={12} md={6} key={category}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {items.map((item) => (
                                <Chip
                                  key={item.key}
                                  label={item.key}
                                  size="small"
                                  onClick={() => insertHelper(item.key, setFieldValue, values.content)}
                                  sx={{ cursor: 'pointer' }}
                                  title={item.description}
                                />
                              ))}
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="content"
                    label="Contenido de la Plantilla *"
                    fullWidth
                    multiline
                    rows={12}
                    error={touched.content && Boolean(errors.content)}
                    helperText={touched.content && errors.content || 'Usa los helpers de arriba para insertar variables dinámicas'}
                    placeholder="Escribe el contenido de tu plantilla aquí. Puedes usar los helpers para insertar datos dinámicos como {nombre}, {fecha}, etc."
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

export default TemplateModalForm;
