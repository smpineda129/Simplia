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
import { correspondenceSchema } from '../schemas/correspondenceSchema';

const CorrespondenceModalForm = ({ open, onClose, onSave, correspondence, companies, types, onCompanyChange }) => {
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  const initialValues = {
    title: correspondence?.title || '',
    companyId: correspondence?.companyId || '',
    correspondenceTypeId: correspondence?.correspondenceTypeId || '',
    recipientType: correspondence?.recipientType || 'external',
    recipientName: correspondence?.recipientName || '',
    recipientEmail: correspondence?.recipientEmail || '',
    advisorCode: correspondence?.advisorCode || '',
    assignedUserId: correspondence?.assignedUserId || '',
    comments: correspondence?.comments || '',
  };

  useEffect(() => {
    if (initialValues.companyId) {
      loadTypesForCompany(initialValues.companyId);
    }
  }, [initialValues.companyId]);

  const loadTypesForCompany = async (companyId) => {
    if (onCompanyChange) {
      await onCompanyChange(companyId);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      await onSave(values);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la correspondencia');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {correspondence ? 'Editar Correspondencia' : 'Nueva Correspondencia'}
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={correspondenceSchema}
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
                      setFieldValue('correspondenceTypeId', '');
                      loadTypesForCompany(e.target.value);
                    }}
                    error={touched.companyId && Boolean(errors.companyId)}
                    helperText={touched.companyId && errors.companyId}
                    disabled={!!correspondence}
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
                    name="correspondenceTypeId"
                    label="Tipo de Correspondencia *"
                    fullWidth
                    value={values.correspondenceTypeId}
                    onChange={(e) => setFieldValue('correspondenceTypeId', e.target.value)}
                    error={touched.correspondenceTypeId && Boolean(errors.correspondenceTypeId)}
                    helperText={touched.correspondenceTypeId && errors.correspondenceTypeId}
                    disabled={!values.companyId || !!correspondence}
                  >
                    <MenuItem value="">Seleccione un tipo</MenuItem>
                    {types.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="title"
                    label="Título *"
                    fullWidth
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    select
                    name="recipientType"
                    label="Tipo de Destinatario *"
                    fullWidth
                    value={values.recipientType}
                    onChange={(e) => setFieldValue('recipientType', e.target.value)}
                    error={touched.recipientType && Boolean(errors.recipientType)}
                    helperText={touched.recipientType && errors.recipientType}
                  >
                    <MenuItem value="internal">Interno</MenuItem>
                    <MenuItem value="external">Externo</MenuItem>
                  </Field>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="recipientName"
                    label="Nombre del Destinatario *"
                    fullWidth
                    error={touched.recipientName && Boolean(errors.recipientName)}
                    helperText={touched.recipientName && errors.recipientName}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="recipientEmail"
                    label="Email del Destinatario *"
                    type="email"
                    fullWidth
                    error={touched.recipientEmail && Boolean(errors.recipientEmail)}
                    helperText={touched.recipientEmail && errors.recipientEmail}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="advisorCode"
                    label="Código de Asesor"
                    fullWidth
                    error={touched.advisorCode && Boolean(errors.advisorCode)}
                    helperText={touched.advisorCode && errors.advisorCode}
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

export default CorrespondenceModalForm;
