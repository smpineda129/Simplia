import { Formik, Form, Field } from 'formik';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material';
import * as Yup from 'yup';
import { useAuth } from '../../../hooks/useAuth';

const entitySchema = Yup.object().shape({
  name: Yup.string().required('El nombre es requerido').min(2).max(255),
  lastName: Yup.string().nullable(),
  email: Yup.string().email('Debe ser un email válido').nullable(),
  dni: Yup.string().nullable(),
  phone: Yup.string().nullable(),
  state: Yup.string().nullable(),
  city: Yup.string().nullable(),
  address: Yup.string().nullable(),
});

const EntityModalForm = ({ open, onClose, onSave, entity, companies }) => {
  const { user, isOwner } = useAuth();

  const initialValues = {
    name: entity?.name || '',
    lastName: entity?.lastName || '',
    email: entity?.email || '',
    dni: entity?.dni || '',
    phone: entity?.phone || '',
    state: entity?.state || '',
    city: entity?.city || '',
    address: entity?.address || '',
    companyId: entity?.companyId?.toString() || (!isOwner ? user?.companyId?.toString() : '') || '',
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await onSave(values);
    } catch (err) {
      setFieldError('name', err.response?.data?.message || 'Error al guardar la entidad');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{entity ? 'Editar Usuario Externo' : 'Nuevo Usuario Externo'}</DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={entitySchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="name"
                    label="Nombre *"
                    fullWidth
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="lastName"
                    label="Apellido"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="email"
                    label="Correo"
                    type="email"
                    fullWidth
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="dni"
                    label="Identificación / DNI"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="phone"
                    label="Teléfono"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="state"
                    label="Departamento / Estado"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="city"
                    label="Ciudad"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="address"
                    label="Dirección"
                    fullWidth
                  />
                </Grid>

                {isOwner && (
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="companyId"
                      label="Empresa *"
                      select
                      fullWidth
                      error={touched.companyId && Boolean(errors.companyId)}
                      helperText={touched.companyId && errors.companyId}
                    >
                      <MenuItem value="">Seleccione una empresa</MenuItem>
                      {companies.map((company) => (
                        <MenuItem key={company.id} value={company.id.toString()}>
                          {company.name}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                )}
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
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

export default EntityModalForm;
