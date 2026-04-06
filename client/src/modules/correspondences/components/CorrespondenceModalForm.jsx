import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import correspondenceService from '../services/correspondenceService';
import { useAuth } from '../../../hooks/useAuth';
import axiosInstance from '../../../api/axiosConfig';

const CorrespondenceModalForm = ({ open, onClose, onSave, correspondence, companies, types, onCompanyChange }) => {
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [userType, setUserType] = useState('internal');
  const [userId, setUserId] = useState('');
  const [correspondenceTypeId, setCorrespondenceTypeId] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [comments, setComments] = useState('');

  // Loaded lists
  const [userOptions, setUserOptions] = useState([]);
  const [areaUsers, setAreaUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingAreaUsers, setLoadingAreaUsers] = useState(false);
  const [localTypes, setLocalTypes] = useState([]);

  // Determine effective companyId
  const effectiveCompanyId = user?.companyId || companyId;

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  useEffect(() => {
    if (effectiveCompanyId && userType) {
      loadUsers();
    }
  }, [effectiveCompanyId, userType]);

  useEffect(() => {
    if (correspondenceTypeId) {
      loadAreaUsers(correspondenceTypeId);
    } else {
      setAreaUsers([]);
      setAssignedUserId('');
    }
  }, [correspondenceTypeId]);

  useEffect(() => {
    if (effectiveCompanyId) {
      loadTypes(effectiveCompanyId);
    }
  }, [effectiveCompanyId]);

  const loadTypes = async (cId) => {
    try {
      const response = await axiosInstance.get('/correspondence-types', { params: { companyId: cId, limit: 100 } });
      setLocalTypes(response.data?.data || []);
    } catch (err) {
      console.error('Error loading types:', err);
    }
  };

  const resetForm = () => {
    setTitle(correspondence?.title || '');
    setCompanyId('');
    
    // Set user type and user ID from correspondence
    const corrUserType = correspondence?.user_type || 'internal';
    setUserType(corrUserType);
    setUserId(correspondence?.user_id?.toString() || '');
    
    setCorrespondenceTypeId(correspondence?.correspondenceTypeId?.toString() || '');
    setAssignedUserId(correspondence?.recipient_id?.toString() || '');
    
    let commentsValue = correspondence?.comments || '';
    if (correspondence?.user_type === 'external' && commentsValue) {
      try {
        const parsed = typeof commentsValue === 'string' ? JSON.parse(commentsValue) : commentsValue;
        commentsValue = parsed.message || '';
      } catch {
        commentsValue = '';
      }
    }
    setComments(commentsValue);
    setError('');
    setUserOptions([]);
    setAreaUsers([]);
  };

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      // Don't clear userId when editing - only clear when creating new
      if (!correspondence) {
        setUserId('');
      }
      const response = await correspondenceService.getCompanyUsers(
        userType,
        user?.companyId ? null : companyId
      );
      setUserOptions(response.data || []);
    } catch (err) {
      console.error('Error loading users:', err);
      setUserOptions([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadAreaUsers = async (typeId) => {
    try {
      setLoadingAreaUsers(true);
      setAssignedUserId('');
      const response = await correspondenceService.getAreaUsers(typeId);
      setAreaUsers(response.data || []);
    } catch (err) {
      console.error('Error loading area users:', err);
      setAreaUsers([]);
    } finally {
      setLoadingAreaUsers(false);
    }
  };

  const handleSubmit = async () => {
    setError('');

    if (!title.trim() || title.length < 3) {
      setError('El título debe tener al menos 3 caracteres');
      return;
    }
    if (!userType) {
      setError('El tipo de usuario es requerido');
      return;
    }
    if (!userId) {
      setError('Debe seleccionar un usuario');
      return;
    }
    if (!effectiveCompanyId) {
      setError('La empresa es requerida');
      return;
    }

    const payload = {
      title: title.trim(),
      companyId: effectiveCompanyId,
      user_type: userType,
      user_id: parseInt(userId),
      correspondenceTypeId: correspondenceTypeId ? parseInt(correspondenceTypeId) : null,
      assignedUserId: assignedUserId ? parseInt(assignedUserId) : null,
      comments: comments.trim() || null,
    };

    try {
      setSubmitting(true);
      await onSave(payload);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la correspondencia');
    } finally {
      setSubmitting(false);
    }
  };

  const showCompanySelector = !user?.companyId;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {correspondence ? 'Editar Correspondencia' : 'Nueva Correspondencia'}
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 0 }}>
          {/* Company selector for SUPER_ADMIN */}
          {showCompanySelector && (
            <Grid item xs={12}>
              <TextField
                select
                label="Empresa *"
                fullWidth
                value={companyId}
                onChange={(e) => {
                  setCompanyId(e.target.value);
                  setCorrespondenceTypeId('');
                  setAssignedUserId('');
                  if (onCompanyChange) onCompanyChange(e.target.value);
                }}
              >
                <MenuItem value="">Seleccione una empresa</MenuItem>
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}

          {/* Title */}
          <Grid item xs={12}>
            <TextField
              label="Título *"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>

          {/* User type */}
          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Tipo de Usuario *"
              fullWidth
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <MenuItem value="internal">Interno</MenuItem>
              <MenuItem value="external">Externo</MenuItem>
            </TextField>
          </Grid>

          {/* User selector */}
          <Grid item xs={12} md={8}>
            <TextField
              select
              label="Usuario *"
              fullWidth
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={loadingUsers || (!effectiveCompanyId)}
              InputProps={{
                endAdornment: loadingUsers ? <CircularProgress size={16} /> : null,
              }}
            >
              <MenuItem value="">Seleccione un usuario</MenuItem>
              {userOptions.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name} — {u.email}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Correspondence type */}
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Tipo de Correspondencia"
              fullWidth
              value={correspondenceTypeId}
              onChange={(e) => setCorrespondenceTypeId(e.target.value)}
              disabled={!effectiveCompanyId}
            >
              <MenuItem value="">Sin tipo</MenuItem>
              {localTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Assigned user (from area) */}
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Asignado"
              fullWidth
              value={assignedUserId}
              onChange={(e) => setAssignedUserId(e.target.value)}
              disabled={loadingAreaUsers || areaUsers.length === 0}
              InputProps={{
                endAdornment: loadingAreaUsers ? <CircularProgress size={16} /> : null,
              }}
              helperText={correspondenceTypeId && !loadingAreaUsers && areaUsers.length === 0
                ? 'El tipo seleccionado no tiene área o usuarios asignados'
                : ''}
            >
              <MenuItem value="">Sin asignar</MenuItem>
              {areaUsers.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name} — {u.email}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Comments */}
          <Grid item xs={12}>
            <TextField
              label="Comentarios"
              fullWidth
              multiline
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CorrespondenceModalForm;
