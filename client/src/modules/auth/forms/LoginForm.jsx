import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Link,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, ArrowForward } from '@mui/icons-material';
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
      initialValues={{ email: '', password: '', rememberMe: false }}
      validationSchema={loginSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting, values, setFieldValue }) => (
        <Form>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

            <Box>
              <Typography variant="body2" fontWeight={500} gutterBottom sx={{ mb: 1 }}>
                Correo corporativo
              </Typography>
              <Field
                as={TextField}
                name="email"
                type="email"
                fullWidth
                placeholder="nombre@empresa.com"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                autoComplete="email"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Email sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper',
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="body2" fontWeight={500} gutterBottom sx={{ mb: 1 }}>
                Contraseña
              </Typography>
              <Field
                as={TextField}
                name="password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                placeholder="••••••••"
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
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper',
                  },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.rememberMe}
                    onChange={(e) => setFieldValue('rememberMe', e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    Recordarme
                  </Typography>
                }
              />
              <Link
                href="#"
                underline="hover"
                variant="body2"
                sx={{ color: 'primary.main', fontWeight: 500 }}
              >
                ¿Olvidó su contraseña?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isSubmitting}
              endIcon={isSubmitting ? null : <ArrowForward />}
              sx={{
                py: 1.625,
                fontSize: '0.9375rem',
                fontWeight: 700,
                borderRadius: 2,
                bgcolor: '#2563EB',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#1D4ED8',
                  boxShadow: '0 8px 20px rgba(37,99,235,0.3)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                  boxShadow: 'none',
                },
                transition: 'all 0.15s ease',
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
