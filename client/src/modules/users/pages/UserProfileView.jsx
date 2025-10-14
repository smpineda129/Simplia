import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  IconButton,
  Chip,
} from '@mui/material';
import { ArrowBack, AccountCircle, Email, Phone, Business } from '@mui/icons-material';
import userService from '../services/userService';
import LoadingSpinner from '../../../components/LoadingSpinner';

const UserProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const response = await userService.getById(id);
      setUser(response.data || response);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando perfil..." />;
  }

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Usuario no encontrado</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/users')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <AccountCircle sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Perfil de Usuario
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {/* Avatar Section */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'primary.main',
                fontSize: '3rem',
              }}
            >
              {user.name?.charAt(0) || 'U'}
            </Avatar>
          </Grid>

          {/* User Info */}
          <Grid item xs={12}>
            <Typography variant="h5" align="center" gutterBottom>
              {user.name}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Chip
                label={user.role || 'Usuario'}
                color={user.role === 'SUPER_ADMIN' ? 'error' : user.role === 'ADMIN' ? 'warning' : 'default'}
              />
            </Box>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Email color="primary" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {user.phone && (
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Phone color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Teléfono
                  </Typography>
                  <Typography variant="body1">
                    {user.phone}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {user.company && (
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Business color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Empresa
                  </Typography>
                  <Typography variant="body1">
                    {user.company.name}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary">
              Idioma
            </Typography>
            <Typography variant="body1">
              {user.locale === 'es' ? 'Español' : 'English'}
            </Typography>
          </Grid>

          {user.signature && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                Firma
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.50', mt: 1 }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {user.signature}
                </Typography>
              </Paper>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Miembro desde
            </Typography>
            <Typography variant="body2">
              {new Date(user.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserProfileView;
