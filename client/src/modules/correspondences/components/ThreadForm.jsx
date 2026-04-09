import { useState, useEffect, useRef } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { AttachFile, CheckCircle } from '@mui/icons-material';
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
  const [responseFile, setResponseFile] = useState(null); // { key, originalName }
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setMessage(thread?.message || '');
      setTaggedUsers([]);
      setError('');
      setCc('');
      setSelectedTemplateId('');
      setResponseFile(null);
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
      const response = await templateService.getAll({ limit: 100 });
      setTemplates(response.templates || response.data || []);
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
      const raw = response.data?.content || response.template?.content || '';

      // Show a plain-text preview in the message field (user can edit)
      const div = document.createElement('div');
      div.innerHTML = raw
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

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingFile(true);
      const res = await correspondenceService.uploadDocument(file);
      setResponseFile({ key: res.data.key, originalName: res.data.originalName || file.name });
    } catch (err) {
      setError('Error al subir el archivo');
    } finally {
      setUploadingFile(false);
      e.target.value = '';
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
      if (isReply && selectedTemplateId) {
        payload.templateId = selectedTemplateId;
      }
      if (isReply && responseFile) {
        payload.documentKey = responseFile.key;
        payload.documentName = responseFile.originalName;
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

        {isReply && (
          <TextField
            select
            label="Usar plantilla (opcional)"
            fullWidth
            value={selectedTemplateId}
            onChange={(e) => handleTemplateSelect(e.target.value)}
            sx={{ mb: 2 }}
            disabled={templates.length === 0}
            helperText={templates.length === 0 ? 'No hay plantillas disponibles' : ''}
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

        {isReply && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Documento adjunto (se guardará en carpeta "respuesta")
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={uploadingFile ? <CircularProgress size={14} /> : <AttachFile />}
                disabled={uploadingFile}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadingFile ? 'Subiendo...' : 'Adjuntar documento'}
              </Button>
              {responseFile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckCircle fontSize="small" color="success" />
                  <Typography variant="caption" color="success.main" noWrap sx={{ maxWidth: 220 }}>
                    {responseFile.originalName}
                  </Typography>
                  <Button size="small" onClick={() => setResponseFile(null)} sx={{ minWidth: 0, p: 0.5, color: 'text.secondary' }}>✕</Button>
                </Box>
              )}
            </Box>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
            />
          </Box>
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
