import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Autocomplete,
  Chip,
  Box,
  Typography,
  MenuItem,
} from '@mui/material';
import correspondenceService from '../services/correspondenceService';
import templateService from '../../templates/services/templateService';

const ThreadForm = ({ open, onClose, onSave, thread, correspondenceId, isReply, companyId }) => {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [cc, setCc] = useState('');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  useEffect(() => {
    if (open) {
      setMessage(thread?.message || '');
      setTaggedUsers([]);
      setError('');
      setCc('');
      setSelectedTemplateId('');
      loadUsers();
      if (isReply) loadTemplates();
    }
  }, [open]);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await correspondenceService.getCompanyUsers('internal');
      setUserOptions(response.data || []);
    } catch (err) {
      console.error('Error loading users for mentions:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const params = companyId ? { companyId } : {};
      const response = await templateService.getAll(params);
      setTemplates(response.data || []);
    } catch (err) {
      console.error('Error loading templates:', err);
    }
  };

  const handleTemplateSelect = async (templateId) => {
    setSelectedTemplateId(templateId);
    if (!templateId) {
      setMessage('');
      return;
    }
    try {
      const response = await templateService.getById(templateId);
      const raw = response.data?.content || '';

      const today = new Date();
      const withDates = raw
        .replace(/\{fecha\}/g, today.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }))
        .replace(/\{dia\}/g, today.getDate())
        .replace(/\{mes\}/g, today.toLocaleString('es-ES', { month: 'long' }))
        .replace(/\{ano\}/g, today.getFullYear());

      const div = document.createElement('div');
      div.innerHTML = withDates
        .replace(/<img[^>]*>/gi, '')
        .replace(/<\/p>/gi, '\n')
        .replace(/<\/h[1-6]>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/li>/gi, '\n')
        .replace(/<\/div>/gi, '\n');

      setMessage(div.textContent.replace(/\n{3,}/g, '\n\n').trim());
    } catch (err) {
      console.error('Error loading template:', err);
    }
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('El mensaje es requerido');
      return;
    }

    try {
      setError('');
      setSubmitting(true);
      const payload = {
        message: message.trim(),
        taggedUserIds: taggedUsers.map(u => Number(u.id)),
      };
      if (isReply && cc) {
        payload.cc = cc.split(',').map(e => e.trim()).filter(Boolean);
      }
      await onSave(payload);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el hilo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isReply ? 'Responder al usuario' : thread ? 'Editar Hilo' : 'Nuevo Hilo de Conversación'}
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isReply && templates.length > 0 && (
          <TextField
            select
            label="Usar plantilla (opcional)"
            fullWidth
            value={selectedTemplateId}
            onChange={(e) => handleTemplateSelect(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="">— Sin plantilla —</MenuItem>
            {templates.map((t) => (
              <MenuItem key={t.id} value={t.id}>{t.title}</MenuItem>
            ))}
          </TextField>
        )}

        <TextField
          label="Mensaje *"
          fullWidth
          multiline
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe tu mensaje aquí..."
          sx={{ mb: 2 }}
        />

        {isReply && (
          <TextField
            label="CC (correos separados por coma)"
            fullWidth
            value={cc}
            onChange={(e) => setCc(e.target.value)}
            placeholder="email1@example.com, email2@example.com"
            sx={{ mb: 2 }}
          />
        )}

        {!isReply && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Mencionar usuarios (opcional)
            </Typography>
            <Autocomplete
              multiple
              options={userOptions}
              getOptionLabel={(option) => `${option.name} (${option.email})`}
              value={taggedUsers}
              onChange={(_, newValue) => setTaggedUsers(newValue)}
              loading={loadingUsers}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    size="small"
                    {...getTagProps({ index })}
                    key={option.id}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Seleccionar usuarios para mencionar..."
                  size="small"
                />
              )}
              isOptionEqualToValue={(option, value) => String(option.id) === String(value.id)}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Guardando...' : isReply ? 'Enviar respuesta' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ThreadForm;
