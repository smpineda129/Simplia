import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginSchema } from '../schemas/loginSchema';
import { useAuth } from '../../../hooks/useAuth';

const LoginForm = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      await login(values);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={loginSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <Field
              as={TextField}
              name="email"
              label="Correo Electrónico"
              type="email"
              fullWidth
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              autoComplete="email"
            />

            <Field
              as={TextField}
              name="password"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              autoComplete="current-password"
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

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isSubmitting}
              sx={{ mt: 2 }}
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
