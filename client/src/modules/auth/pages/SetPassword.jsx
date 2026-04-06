import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, CheckCircle, Lock } from '@mui/icons-material';
import axiosInstance from '../../../api/axiosConfig';

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F8FAFC' }}>
        <Paper sx={{ p: 4, maxWidth: 420, textAlign: 'center' }}>
          <Alert severity="error">Enlace inválido. Por favor solicita un nuevo enlace al administrador.</Alert>
        </Paper>
      </Box>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/auth/set-password', { token, password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'El enlace es inválido o ha expirado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#F8FAFC',
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          p: 4,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {success ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CheckCircle sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={700} mb={1}>
              ¡Contraseña establecida!
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Tu contraseña ha sido configurada correctamente. Ya puedes iniciar sesión.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => navigate('/auth/login')}
              sx={{ borderRadius: 2 }}
            >
              Ir al inicio de sesión
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563EB 0%, #6366F1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Lock sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Typography variant="h5" fontWeight={700} mb={0.5}>
                Establece tu contraseña
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Crea una contraseña segura para acceder al sistema
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Nueva contraseña"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                helperText="Mínimo 8 caracteres"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirmar contraseña"
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                fullWidth
                required
                error={confirm.length > 0 && password !== confirm}
                helperText={confirm.length > 0 && password !== confirm ? 'Las contraseñas no coinciden' : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end" size="small">
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  mt: 1,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #2563EB 0%, #6366F1 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #1D4ED8 0%, #4F46E5 100%)' },
                }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Establecer contraseña'}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default SetPassword;
