import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  MenuItem,
} from '@mui/material';
import {
  AssignmentReturn,
  Add,
  Delete,
} from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { usePermissions } from '../../../hooks/usePermissions';
import proceedingService from '../services/proceedingService';
import templateService from '../../templates/services/templateService';

const emptyForm = { reason: '', name: '', document: '', address: '' };

const ProceedingLoans = ({ proceedingId, companyId, loans = [], onUpdate }) => {
  const { hasPermission } = usePermissions();
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  useEffect(() => {
    if (openCreate && companyId) {
      loadTemplates();
    }
  }, [openCreate]);

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
      setForm(prev => ({ ...prev, reason: '' }));
      return;
    }
    try {
      const response = await templateService.getById(templateId);
      const raw = response.data?.content || '';

      // Replace date helpers client-side; keep other {helpers} visible for editing
      const today = new Date();
      const html = raw
        .replace(/\{fecha\}/g, today.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }))
        .replace(/\{dia\}/g, today.getDate())
        .replace(/\{mes\}/g, today.toLocaleString('es-ES', { month: 'long' }))
        .replace(/\{ano\}/g, today.getFullYear());

      setForm(prev => ({ ...prev, reason: html }));
    } catch (err) {
      console.error('Error loading template:', err);
    }
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const isReasonEmpty = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return !div.textContent.trim();
  };

  const handleCreate = async () => {
    if (isReasonEmpty(form.reason) || !form.name || !form.document) {
      setError('Razón, nombre y número de documento son obligatorios');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await proceedingService.createThread(proceedingId, form);
      setOpenCreate(false);
      setForm(emptyForm);
      setSelectedTemplateId('');
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al crear préstamo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (threadId) => {
    if (!window.confirm('¿Eliminar este préstamo?')) return;
    try {
      await proceedingService.deleteThread(proceedingId, threadId);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <AssignmentReturn sx={{ mr: 1 }} /> Préstamos
        </Typography>
      </Box>

      {hasPermission('proceeding.loan') && (
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Add />}
          sx={{ mb: 2 }}
          onClick={() => setOpenCreate(true)}
        >
          Crear Préstamo
        </Button>
      )}

      <List>
        {loans.map((loan) => (
          <ListItem
            key={loan.id}
            secondaryAction={
              hasPermission('proceeding.loan') && (
                <IconButton edge="end" onClick={() => handleDelete(loan.id)}>
                  <Delete color="error" />
                </IconButton>
              )
            }
          >
            <ListItemIcon>
              <AssignmentReturn />
            </ListItemIcon>
            <ListItemText
              primary={`${loan.name} — ${loan.document}`}
              secondary={
                <>
                  <span
                    style={{ display: 'block' }}
                    dangerouslySetInnerHTML={{ __html: loan.reason }}
                  />
                  {loan.address && <span style={{ display: 'block', color: '#666' }}>{loan.address}</span>}
                  <span style={{ display: 'block', color: '#999', fontSize: 11 }}>
                    {loan.fromUser?.name} · {new Date(loan.createdAt).toLocaleDateString('es-ES')}
                  </span>
                </>
              }
            />
            <Chip
              label={loan.isFinished ? 'Devuelto' : 'En préstamo'}
              color={loan.isFinished ? 'success' : 'warning'}
              size="small"
              sx={{ ml: 1 }}
            />
          </ListItem>
        ))}
        {loans.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center">
            No hay préstamos registrados.
          </Typography>
        )}
      </List>

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="md" fullWidth>
        <DialogTitle>Crear Préstamo</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {templates.length > 0 && (
              <Grid item xs={12}>
                <TextField
                  select
                  label="Usar plantilla (opcional)"
                  fullWidth
                  value={selectedTemplateId}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                >
                  <MenuItem value="">— Sin plantilla —</MenuItem>
                  {templates.map((t) => (
                    <MenuItem key={t.id} value={t.id}>{t.title}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Razón de la solicitud *
              </Typography>
              <ReactQuill
                value={form.reason}
                onChange={(val) => setForm(prev => ({ ...prev, reason: val }))}
                theme="snow"
                style={{ height: 200, marginBottom: 42 }}
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['clean'],
                  ],
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre del receptor *"
                fullWidth
                value={form.name}
                onChange={handleChange('name')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Número de documento *"
                fullWidth
                value={form.document}
                onChange={handleChange('document')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Dirección de entrega"
                fullWidth
                value={form.address}
                onChange={handleChange('address')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenCreate(false); setForm(emptyForm); setSelectedTemplateId(''); }} disabled={loading}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreate} disabled={loading}>
            {loading ? 'Guardando...' : 'Crear Préstamo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProceedingLoans;
