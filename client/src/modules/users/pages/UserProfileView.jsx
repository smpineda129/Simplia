import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  IconButton,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { ArrowBack, AccountCircle, Email, Phone, Business, History } from '@mui/icons-material';
import userService from '../services/userService';
import UserAssociations from '../components/UserAssociations';
import AuditTable from '../../audit/components/AuditTable';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { getAvatarConfig } from '../../../utils/avatarUtils';

const UserProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

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

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
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

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Información General" />
          <Tab label="Historial de Actividad" icon={<History />} iconPosition="start" />
        </Tabs>
      </Paper>

      {tabIndex === 0 && (
        <>
          <Paper sx={{ p: 4, mb: 3 }}>
            <Grid container spacing={3}>
              {/* Avatar Section */}
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                {(() => {
                  const avatarConfig = getAvatarConfig(user.avatar || 'person');
                  const AvatarIcon = avatarConfig.icon;
                  return (
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        bgcolor: avatarConfig.color,
                        fontSize: '3rem',
                      }}
                    >
                      <AvatarIcon sx={{ fontSize: 64 }} />
                    </Avatar>
                  );
                })()}
              </Grid>

              {/* User Info */}
              <Grid item xs={12}>
                <Typography variant="h5" align="center" gutterBottom>
                  {user.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {(user.roles && user.roles.length > 0) ? (
                    user.roles.map((role) => {
                      const roleName = typeof role === 'object' ? role.name : role;
                      return (
                        <Chip
                          key={roleName}
                          label={roleName}
                          color={roleName === 'Owner' || roleName === 'SUPER_ADMIN' ? 'error' : roleName === 'ADMIN' ? 'warning' : 'primary'}
                          variant="outlined"
                        />
                      );
                    })
                  ) : (
                    <Chip label={user.role || 'Usuario'} color="default" />
                  )}
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

          {/* User Associations Section */}
          <UserAssociations userId={id} />
        </>
      )}

      {tabIndex === 1 && (
        <Paper sx={{ p: 3 }}>
          <AuditTable userId={id} />
        </Paper>
      )}
    </Box>
  );
};

export default UserProfileView;
