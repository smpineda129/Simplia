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
  FormControlLabel,
  Checkbox,
  Divider,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff, Email } from '@mui/icons-material';
import { userSchema } from '../schemas/userSchema';
import { useAuth } from '../../../hooks/useAuth';
import companyService from '../../companies/services/companyService';
import roleService from '../../roles/services/roleService';

const UserModalForm = ({ open, onClose, onSubmit, initialValues, isEditing }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [sendInvite, setSendInvite] = useState(false);
  const { user, isOwner } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (open) {
      loadRoles();
      if (isOwner) {
        loadCompanies();
      }
    }
  }, [open, isOwner]);

  const loadCompanies = async () => {
    try {
      const response = await companyService.getAll({ limit: 100 });
      setCompanies(response.data);
    } catch (err) {
      console.error('Error loading companies', err);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await roleService.getAll({ limit: 100 });
      setRoles(response.data || []);
    } catch (err) {
      console.error('Error loading roles', err);
    }
  };

  const defaultValues = {
    name: '',
    email: '',
    password: '',
    role: '',
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
      const payload = { ...values };
      if (payload.companyId === '') payload.companyId = null;

      if (payload.role) {
        payload.roleId = parseInt(payload.role);
        delete payload.role;
      }

      // If send invite: set random password, flag for post-create email
      if (!isEditing && sendInvite) {
        payload.password = Math.random().toString(36).slice(-10) + 'A1!';
        payload.sendSetPasswordEmail = true;
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

                {!isEditing && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={sendInvite}
                        onChange={(e) => setSendInvite(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Email fontSize="small" color="primary" />
                        <Typography variant="body2">
                          Enviar email para que el usuario establezca su contraseña
                        </Typography>
                      </Box>
                    }
                  />
                )}

                {(!sendInvite || isEditing) && (
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
                )}

                <Field
                  as={TextField}
                  name="role"
                  label="Rol"
                  select
                  fullWidth
                  error={touched.role && Boolean(errors.role)}
                  helperText={touched.role && errors.role}
                >
                  <MenuItem value="">
                    <em>Seleccionar rol</em>
                  </MenuItem>
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      <em>Cargando roles...</em>
                    </MenuItem>
                  )}
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
