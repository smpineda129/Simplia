import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { userSchema } from '../schemas/userSchema';
import { useAuth } from '../../../hooks/useAuth';
import companyService from '../../companies/services/companyService';

const UserModalForm = ({ open, onClose, onSubmit, initialValues, isEditing }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { user, isOwner } = useAuth();
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    if (open && isOwner) {
      loadCompanies();
    }
  }, [open, isOwner]);

  const loadCompanies = async () => {
    try {
      const response = await companyService.getAll({ limit: 100 }); // Adjust limit as needed
      setCompanies(response.data);
    } catch (err) {
      console.error('Error loading companies', err);
    }
  };

  const defaultValues = {
    name: '',
    email: '',
    password: '',
    role: 'USER',
    companyId: '',
  };

  const formInitialValues = initialValues
    ? {
      ...initialValues,
      companyId: initialValues.companyId || '',
      password: '',
    }
    : defaultValues;

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      // Convert empty string companyId back to null for API
      const payload = { ...values };
      if (payload.companyId === '') {
        payload.companyId = null;
      }

      await onSubmit(payload);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar usuario');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
      </DialogTitle>
      <Formik
        initialValues={formInitialValues}
        validationSchema={userSchema}
        context={{ isEditing }}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {error && <Alert severity="error">{error}</Alert>}

                <Field
                  as={TextField}
                  name="name"
                  label="Nombre"
                  fullWidth
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />

                <Field
                  as={TextField}
                  name="email"
                  label="Correo Electrónico"
                  type="email"
                  fullWidth
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />

                <Field
                  as={TextField}
                  name="password"
                  label={isEditing ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Field
                  as={TextField}
                  name="role"
                  label="Rol"
                  select
                  fullWidth
                  error={touched.role && Boolean(errors.role)}
                  helperText={touched.role && errors.role}
                >
                  <MenuItem value="USER">Usuario</MenuItem>
                  <MenuItem value="MANAGER">Gerente</MenuItem>
                  <MenuItem value="ADMIN">Administrador</MenuItem>
                </Field>

                {isOwner && (
                  <Field
                    as={TextField}
                    name="companyId"
                    label="Empresa"
                    select
                    fullWidth
                    error={touched.companyId && Boolean(errors.companyId)}
                    helperText={touched.companyId && errors.companyId}
                  >
                    <MenuItem value="">
                      <em>Ninguna</em>
                    </MenuItem>
                    {companies.map((company) => (
                      <MenuItem key={company.id} value={company.id}>
                        {company.name}
                      </MenuItem>
                    ))}
                  </Field>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancelar</Button>
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

export default UserModalForm;
