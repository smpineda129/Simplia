import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  TextField,
  Alert,
  Snackbar,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { AccountCircle, Edit, Save, History, PhotoCamera, Palette } from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
import userService from '../services/userService';
import UserAssociations from '../components/UserAssociations';
import AuditTable from '../../audit/components/AuditTable';
import LoadingSpinner from '../../../components/LoadingSpinner';
import AvatarSelector from '../../../components/AvatarSelector';
import ThemeCustomizer from '../../../components/ThemeCustomizer';
import { getAvatarConfig } from '../../../utils/avatarUtils';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabIndex, setTabIndex] = useState(0);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    locale: '',
    signature: '',
    avatar: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        locale: user.locale || 'es',
        signature: user.signature || '',
        avatar: user.avatar || 'person',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleAvatarSelect = async (avatarId) => {
    try {
      setLoading(true);
      await userService.update(user.userId || user.id, { avatar: avatarId });

      if (updateUser) {
        updateUser({ avatar: avatarId });
      }

      setFormData({ ...formData, avatar: avatarId });
      showSnackbar('Avatar actualizado exitosamente', 'success');
    } catch (error) {
      console.error('Error updating avatar:', error);
      showSnackbar(error.response?.data?.message || 'Error al actualizar el avatar', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await userService.update(user.userId || user.id, formData);

      if (updateUser) {
        updateUser(formData);
      }

      showSnackbar('Perfil actualizado exitosamente', 'success');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showSnackbar(error.response?.data?.message || 'Error al actualizar el perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!user) {
    return <LoadingSpinner message="Cargando perfil..." />;
  }

  const currentUserId = user.userId || user.id;

  const avatarConfig = getAvatarConfig(user.avatar || formData.avatar || 'person');
  const AvatarIcon = avatarConfig.icon;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AccountCircle sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Mi Perfil
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Palette />}
          onClick={() => setThemeDialogOpen(true)}
        >
          Personalizar Tema
        </Button>
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
                <Box sx={{ position: 'relative' }}>
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
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      minWidth: 'auto',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      p: 0,
                    }}
                    onClick={() => setAvatarDialogOpen(true)}
                  >
                    <PhotoCamera />
                  </Button>
                </Box>
              </Grid>

              {/* User Info */}
              <Grid item xs={12}>
                <Typography variant="h5" align="center" gutterBottom>
                  {user.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  {(user.roles && user.roles.length > 0) ? (
                    user.roles.map((role) => {
                      const roleName = typeof role === 'object' ? role.name : role;
                      return (
                        <Chip
                          key={roleName}
                          label={roleName}
                          size="small"
                          color={roleName === 'Owner' || roleName === 'SUPER_ADMIN' ? 'error' : roleName === 'ADMIN' ? 'warning' : 'primary'}
                          variant="outlined"
                        />
                      );
                    })
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Rol: {user.role || 'Usuario'}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                  {user.email}
                </Typography>
                {user.company && (
                  <Typography variant="body2" color="text.secondary" align="center">
                    Empresa: {user.company.name}
                  </Typography>
                )}
              </Grid>

              {/* User Details (Not Editing) */}
              {!editing && (
                <>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Teléfono
                    </Typography>
                    <Typography variant="body1">
                      {user.phone || 'No especificado'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Idioma
                    </Typography>
                    <Typography variant="body1">
                      {user.locale === 'es' ? 'Español' : user.locale === 'en' ? 'English' : 'No especificado'}
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

                  <Grid item xs={12} md={6}>
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

                  {user.updatedAt && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary">
                        Última actualización
                      </Typography>
                      <Typography variant="body2">
                        {new Date(user.updatedAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Grid>
                  )}

                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => setEditing(true)}
                    >
                      Editar Perfil
                    </Button>
                  </Grid>
                </>
              )}

              {/* Form Fields */}
              {editing && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Idioma"
                      name="locale"
                      value={formData.locale}
                      onChange={handleChange}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Firma"
                      name="signature"
                      value={formData.signature}
                      onChange={handleChange}
                      placeholder="Escribe tu firma aquí..."
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Roles</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {user.roles?.map(role => {
                          const roleName = typeof role === 'object' ? role.name : role;
                          return <Chip key={roleName} label={roleName} size="small" />;
                        }) || <Chip label={user.role || 'Usuario'} size="small" />}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Empresa"
                      value={user.company?.name || 'Sin empresa asignada'}
                      disabled
                    />
                  </Grid>

                  {/* Action Buttons */}
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: user.name || '',
                          email: user.email || '',
                          phone: user.phone || '',
                          locale: user.locale || 'es',
                          signature: user.signature || '',
                          avatar: user.avatar || 'person',
                        });
                      }}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>

          {/* User Associations Section */}
          <UserAssociations userId={currentUserId} />
        </>
      )}

      {tabIndex === 1 && (
        <Paper sx={{ p: 3 }}>
          <AuditTable userId={currentUserId} />
        </Paper>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <AvatarSelector
        open={avatarDialogOpen}
        onClose={() => setAvatarDialogOpen(false)}
        currentAvatar={user.avatar || formData.avatar || 'person'}
        onSelect={handleAvatarSelect}
      />

      <ThemeCustomizer
        open={themeDialogOpen}
        onClose={() => setThemeDialogOpen(false)}
      />
    </Box>
  );
};

export default UserProfile;
