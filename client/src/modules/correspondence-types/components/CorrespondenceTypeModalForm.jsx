import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@mui/material';
import { correspondenceTypeSchema } from '../schemas/correspondenceTypeSchema';
import areaService from '../../areas/services/areaService';

const CorrespondenceTypeModalForm = ({ open, onClose, onSave, correspondenceType, companies, preselectedCompanyId }) => {
  const [error, setError] = useState('');
  const [areas, setAreas] = useState([]);

  const resolvedCompanyId = correspondenceType?.companyId || preselectedCompanyId || '';

  useEffect(() => {
    if (!open) return;
    if (!resolvedCompanyId) return;
    areaService.getAll({ companyId: resolvedCompanyId, limit: 100 }).then((res) => {
      setAreas(res.data || []);
    }).catch(() => setAreas([]));
  }, [open, resolvedCompanyId]);

  const initialValues = {
    name: correspondenceType?.name || '',
    description: correspondenceType?.description || '',
    companyId: resolvedCompanyId,
    expiration: correspondenceType?.expiration || '',
    public: correspondenceType?.public ?? true,
    areaId: correspondenceType?.areaId || '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      await onSave({
        ...values,
        expiration: values.expiration ? parseInt(values.expiration) : null,
        areaId: values.areaId || null,
      });
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
                {/* Empresa */}
                <Grid item xs={12}>
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

                {/* Nombre */}
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="name"
                    label="Nombre del Tipo *"
                    fullWidth
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>

                {/* Expiración */}
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="expiration"
                    label="Expiración (días)"
                    type="number"
                    fullWidth
                    inputProps={{ min: 1 }}
                    error={touched.expiration && Boolean(errors.expiration)}
                    helperText={(touched.expiration && errors.expiration) || 'Días antes de que la correspondencia de este tipo expire'}
                  />
                </Grid>

                {/* Descripción */}
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

                {/* Público */}
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.public}
                        onChange={(e) => setFieldValue('public', e.target.checked)}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">Público</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Visible en el portal de correspondencia externo
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>

                {/* Área */}
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    name="areaId"
                    label="Área"
                    fullWidth
                    value={values.areaId}
                    onChange={(e) => setFieldValue('areaId', e.target.value)}
                    error={touched.areaId && Boolean(errors.areaId)}
                    helperText={(touched.areaId && errors.areaId) || 'Área a la que se entregará la correspondencia'}
                  >
                    <MenuItem value="">—</MenuItem>
                    {areas.map((area) => (
                      <MenuItem key={area.id} value={area.id}>
                        {area.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose} disabled={isSubmitting}>
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

export default CorrespondenceTypeModalForm;
