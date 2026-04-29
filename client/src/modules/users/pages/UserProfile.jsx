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
  Autocomplete,
} from '@mui/material';
import { AccountCircle, Edit, Save, History, PhotoCamera, Palette, CloudUpload } from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
import userService from '../services/userService';
import companyService from '../../companies/services/companyService';
import UserAssociations from '../components/UserAssociations';
import AuditTable from '../../audit/components/AuditTable';
import LoadingSpinner from '../../../components/LoadingSpinner';
import AvatarSelector from '../../../components/AvatarSelector';
import ThemeCustomizer from '../../../components/ThemeCustomizer';
import { getAvatarConfig, isAvatarUrl } from '../../../utils/avatarUtils';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabIndex, setTabIndex] = useState(0);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingSignature, setUploadingSignature] = useState(false);
  const [signatureImagePreview, setSignatureImagePreview] = useState(null);
  // Presigned display URLs (separate from formData which stores S3 keys)
  const [displayUrls, setDisplayUrls] = useState({ avatar: null, signature: null });
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    locale: '',
    signature: '',
    avatar: '',
    companyId: '',
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
        companyId: user.companyId || user.company?.id || '',
      });
    }
  }, [user]);

  useEffect(() => {
    const userIsOwner = user?.roles?.some((r) => (typeof r === 'object' ? r.name : r) === 'Owner') || user?.role === 'Owner';
    if (userIsOwner) {
      companyService.getAll().then((res) => {
        const list = res.data || res;
        setCompanies(Array.isArray(list) ? list : []);
      }).catch(() => {});
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

  const handleAvatarFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingAvatar(true);
      const res = await userService.uploadAvatar(user.userId || user.id, file);
      const { key, url } = res.data;
      // Store key in auth context and formData, presigned URL only for display
      if (updateUser) updateUser({ avatar: key });
      setFormData((prev) => ({ ...prev, avatar: key }));
      setDisplayUrls((prev) => ({ ...prev, avatar: url }));
      showSnackbar('Foto de perfil actualizada', 'success');
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al subir la foto', 'error');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handleSignatureFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSignatureImagePreview({ file, preview: URL.createObjectURL(file) });
  };

  const handleSignatureImageUpload = async () => {
    if (!signatureImagePreview?.file) return;
    try {
      setUploadingSignature(true);
      const res = await userService.uploadSignature(user.userId || user.id, signatureImagePreview.file);
      const { key, url } = res.data;
      // Store key in auth context and formData, presigned URL only for display
      if (updateUser) updateUser({ signature: key });
      setFormData((prev) => ({ ...prev, signature: key }));
      setDisplayUrls((prev) => ({ ...prev, signature: url }));
      setSignatureImagePreview(null);
      showSnackbar('Firma actualizada', 'success');
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al subir la firma', 'error');
    } finally {
      setUploadingSignature(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await userService.update(user.userId || user.id, formData);

      if (updateUser) {
        const selectedCompany = companies.find((c) => String(c.id) === String(formData.companyId)) || user.company;
        updateUser({ ...formData, company: selectedCompany });
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
  const isOwner = user.roles?.some((r) => (typeof r === 'object' ? r.name : r) === 'Owner') || user.role === 'Owner';

  // Use the fresh presigned display URL if available, otherwise fall back to user.avatar
  const currentAvatar = displayUrls.avatar || user.avatar || formData.avatar || 'person';
  const avatarIsUrl = isAvatarUrl(currentAvatar);
  const avatarConfig = avatarIsUrl ? null : getAvatarConfig(currentAvatar);
  const AvatarIcon = avatarConfig?.icon;

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
            <Grid container spacing={4}>
              {/* Left Column: Avatar, Roles, Signature */}
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  textAlign: 'center',
                  p: 3,
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider',
                  height: '100%'
                }}>
                  {/* Avatar */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Box sx={{ position: 'relative' }}>
                      <Avatar
                        src={avatarIsUrl ? currentAvatar : undefined}
                        sx={{
                          width: 120,
                          height: 120,
                          bgcolor: avatarIsUrl ? 'grey.200' : avatarConfig?.color,
                          fontSize: '3rem',
                          boxShadow: 3,
                        }}
                      >
                        {!avatarIsUrl && AvatarIcon && <AvatarIcon sx={{ fontSize: 64 }} />}
                      </Avatar>
                      {/* Upload real photo */}
                      <input
                        id="avatar-file-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        hidden
                        onChange={handleAvatarFileUpload}
                      />
                      <Button
                        component="label"
                        htmlFor="avatar-file-input"
                        variant="contained"
                        size="small"
                        disabled={uploadingAvatar}
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: -44,
                          minWidth: 'auto',
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          p: 0,
                          boxShadow: 2,
                        }}
                        title="Subir foto"
                      >
                        <CloudUpload sx={{ fontSize: 20 }} />
                      </Button>
                      {/* Select icon avatar */}
                      <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          minWidth: 'auto',
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          p: 0,
                          boxShadow: 2,
                        }}
                        onClick={() => setAvatarDialogOpen(true)}
                        title="Elegir ícono"
                      >
                        <PhotoCamera sx={{ fontSize: 20 }} />
                      </Button>
                    </Box>
                  </Box>

                  {/* User Name */}
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                  
                  {/* Roles */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {(user.roles && user.roles.length > 0) ? (
                      user.roles.map((role) => {
                        const roleName = typeof role === 'object' ? role.name : role;
                        return (
                          <Chip
                            key={roleName}
                            label={roleName}
                            size="small"
                            color={roleName === 'Owner' || roleName === 'SUPER_ADMIN' ? 'error' : roleName === 'ADMIN' ? 'warning' : 'primary'}
                          />
                        );
                      })
                    ) : (
                      <Chip 
                        label={user.role || 'Usuario'} 
                        size="small" 
                        color="primary"
                      />
                    )}
                  </Box>
                  
                  {/* Email */}
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {user.email}
                  </Typography>
                  
                  {/* Company */}
                  {user.company && (
                    <Chip 
                      label={`${user.company.name}`} 
                      size="small" 
                      variant="outlined"
                      sx={{ mt: 1, mb: 3 }}
                    />
                  )}

                  {/* Signature */}
                  {!editing && user.signature && (
                    <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider', textAlign: 'left' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1.5 }}>
                        Firma
                      </Typography>
                      <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                        {isAvatarUrl(displayUrls.signature || user.signature) ? (
                          <Box
                            component="img"
                            src={displayUrls.signature || user.signature}
                            alt="Firma"
                            sx={{ maxHeight: 100, maxWidth: '100%', objectFit: 'contain' }}
                          />
                        ) : (
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                            {user.signature}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Right Column: Information Fields */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={3}>

              {/* User Details (Not Editing) */}
              {!editing && (
                <>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2.5, bgcolor: 'white', borderRadius: 1, border: 1, borderColor: 'divider', height: '100%' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}>
                        Teléfono
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                        {user.phone || 'No especificado'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2.5, bgcolor: 'white', borderRadius: 1, border: 1, borderColor: 'divider', height: '100%' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}>
                        Idioma
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                        {user.locale === 'es' ? 'Español' : user.locale === 'en' ? 'English' : 'No especificado'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2.5, bgcolor: 'white', borderRadius: 1, border: 1, borderColor: 'divider', height: '100%' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}>
                        Miembro desde
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                        {new Date(user.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Box>
                  </Grid>

                  {user.updatedAt && (
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2.5, bgcolor: 'white', borderRadius: 1, border: 1, borderColor: 'divider', height: '100%' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}>
                          Última actualización
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                          {new Date(user.updatedAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<Edit />}
                      onClick={() => setEditing(true)}
                      size="large"
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
                      label="Firma (texto)"
                      name="signature"
                      value={isAvatarUrl(formData.signature) ? '' : formData.signature}
                      onChange={handleChange}
                      placeholder="Escribe tu firma aquí..."
                      disabled={isAvatarUrl(formData.signature)}
                      helperText={isAvatarUrl(formData.signature) ? 'Actualmente se usa una imagen como firma' : ''}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      Firma como imagen
                    </Typography>
                    {isAvatarUrl(displayUrls.signature || formData.signature) && (
                      <Box sx={{ mb: 1 }}>
                        <Box
                          component="img"
                          src={displayUrls.signature || formData.signature}
                          alt="Firma actual"
                          sx={{ maxHeight: 80, maxWidth: '100%', objectFit: 'contain', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}
                        />
                      </Box>
                    )}
                    {signatureImagePreview && (
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">Vista previa:</Typography>
                        <Box
                          component="img"
                          src={signatureImagePreview.preview}
                          alt="Vista previa firma"
                          sx={{ maxHeight: 80, maxWidth: '100%', objectFit: 'contain', border: '1px solid', borderColor: 'primary.main', borderRadius: 1, p: 1, display: 'block', mt: 0.5 }}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CloudUpload />}
                          onClick={handleSignatureImageUpload}
                          disabled={uploadingSignature}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {uploadingSignature ? 'Subiendo...' : 'Subir firma'}
                        </Button>
                        <Button size="small" onClick={() => setSignatureImagePreview(null)} disabled={uploadingSignature} sx={{ mt: 1 }}>
                          Cancelar
                        </Button>
                      </Box>
                    )}
                    {!signatureImagePreview && (
                      <>
                        <input
                          id="signature-file-input"
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          hidden
                          onChange={handleSignatureFileSelect}
                        />
                        <Button
                          component="label"
                          htmlFor="signature-file-input"
                          variant="outlined"
                          size="small"
                          startIcon={<CloudUpload />}
                        >
                          Seleccionar imagen de firma
                        </Button>
                      </>
                    )}
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
                    {isOwner ? (
                      <Autocomplete
                        options={companies}
                        getOptionLabel={(option) => option.name || ''}
                        value={companies.find((c) => String(c.id) === String(formData.companyId)) || null}
                        onChange={(_, selected) => {
                          setFormData((prev) => ({ ...prev, companyId: selected ? String(selected.id) : '' }));
                        }}
                        filterOptions={(options, { inputValue }) =>
                          options.filter((o) =>
                            o.name.toLowerCase().includes(inputValue.toLowerCase())
                          )
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Empresa"
                            helperText="Escribe para filtrar empresas"
                          />
                        )}
                        noOptionsText="Sin resultados"
                        isOptionEqualToValue={(option, value) => String(option.id) === String(value.id)}
                      />
                    ) : (
                      <TextField
                        fullWidth
                        label="Empresa"
                        value={user.company?.name || 'Sin empresa asignada'}
                        disabled
                      />
                    )}
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
                          companyId: user.companyId || user.company?.id || '',
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
              </Grid>
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
        currentAvatar={avatarIsUrl ? 'person' : (user.avatar || formData.avatar || 'person')}
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
