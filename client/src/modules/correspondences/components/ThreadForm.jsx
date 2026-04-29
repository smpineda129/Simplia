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
  FormControlLabel,
  Checkbox,
  Paper,
  Divider,
} from '@mui/material';
import { AttachFile, CheckCircle, VerifiedUser, Gavel } from '@mui/icons-material';
import correspondenceService from '../services/correspondenceService';
import templateService from '../../templates/services/templateService';
import RichTextEditor from '../../../components/RichTextEditor';
import { useAuth } from '../../../hooks/useAuth';

const ThreadForm = ({ open, onClose, onSave, thread, correspondenceId, isReply, companyId }) => {
  const { user } = useAuth();
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
  const [applySignature, setApplySignature] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setMessage(thread?.message || '');
      setTaggedUsers([]);
      setError('');
      setCc('');
      setSelectedTemplateId('');
      setResponseFile(null);
      setApplySignature(false);
      setPendingPayload(null);
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
      const response = await templateService.processTemplate(templateId, { correspondenceId });
      const processed = response.data?.processedContent || '';
      setMessage(processed);
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

  const buildPayload = () => {
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
    if (isReply && applySignature) {
      payload.sign = true;
    }
    return payload;
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('El mensaje es requerido');
      return;
    }

    const payload = buildPayload();

    if (isReply && applySignature) {
      setPendingPayload(payload);
      setShowConfirmDialog(true);
      return;
    }

    await executeSubmit(payload);
  };

  const executeSubmit = async (payload) => {
    try {
      setError('');
      setSubmitting(true);
      await onSave(payload);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el hilo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmSignature = async () => {
    setShowConfirmDialog(false);
    if (pendingPayload) {
      await executeSubmit(pendingPayload);
      setPendingPayload(null);
    }
  };

  return (
    <>
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

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Mensaje *
          </Typography>
          <RichTextEditor
            value={message}
            onChange={setMessage}
            placeholder="Escribe tu mensaje aquí..."
            height="250px"
          />
        </Box>

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

        {isReply && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <FormControlLabel
              control={
                <Checkbox
                  checked={applySignature}
                  onChange={(e) => setApplySignature(e.target.checked)}
                  color="primary"
                  icon={<VerifiedUser />}
                  checkedIcon={<VerifiedUser />}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" fontWeight={500}>Aplicar firma electrónica</Typography>
                  <Gavel fontSize="small" color="action" />
                </Box>
              }
            />

            {applySignature && (
              <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'primary.50', borderColor: 'primary.200' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Datos del firmante
                </Typography>
                <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Nombre</Typography>
                    <Typography variant="body2" fontWeight={500}>{user?.name || '—'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Correo electrónico</Typography>
                    <Typography variant="body2" fontWeight={500}>{user?.email || '—'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Fecha y hora</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {new Date().toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}
                    </Typography>
                  </Box>
                </Box>
                <Alert severity="info" sx={{ mt: 1.5 }} icon={<Gavel fontSize="small" />}>
                  Al firmar, usted acepta que esta comunicación tiene validez jurídica conforme al{' '}
                  <strong>Decreto 2364 de 2012</strong>. La firma electrónica vincula su identidad al documento de forma irrevocable.
                </Alert>
              </Paper>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          startIcon={isReply && applySignature ? <VerifiedUser /> : undefined}
          color={isReply && applySignature ? 'primary' : 'primary'}
        >
          {submitting ? 'Guardando...' : isReply && applySignature ? 'Firmar y enviar' : isReply ? 'Enviar respuesta' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>

    {/* Confirmation dialog for electronic signature */}
    <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <VerifiedUser color="primary" />
        Confirmar firma electrónica
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Está a punto de firmar electrónicamente esta respuesta. Esta acción no puede revertirse.
        </Alert>
        <Typography variant="body2" gutterBottom>
          Al confirmar, se registrará su firma con los siguientes datos:
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
          <Box sx={{ display: 'grid', gap: 0.5 }}>
            <Typography variant="body2"><strong>Firmante:</strong> {user?.name}</Typography>
            <Typography variant="body2"><strong>Correo:</strong> {user?.email}</Typography>
            <Typography variant="body2"><strong>Fecha:</strong> {new Date().toLocaleString('es-ES')}</Typography>
            <Typography variant="body2"><strong>Base legal:</strong> Decreto 2364 de 2012 (Colombia)</Typography>
          </Box>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowConfirmDialog(false)}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleConfirmSignature}
          disabled={submitting}
          startIcon={<VerifiedUser />}
        >
          {submitting ? 'Firmando...' : 'Confirmar firma'}
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default ThreadForm;
