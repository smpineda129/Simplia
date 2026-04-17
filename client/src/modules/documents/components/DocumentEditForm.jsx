import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  IconButton,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const MEDIUM_OPTIONS = [
  { value: 'digital', label: 'Digital' },
  { value: 'fisico', label: 'Físico' },
  { value: 'CD', label: 'CD' },
  { value: 'DVD', label: 'DVD' },
  { value: 'USB', label: 'USB' },
  { value: 'microfilm', label: 'Microfilm' },
  { value: 'microfichas', label: 'Microfichas' },
];

const DocumentEditForm = ({ open, onClose, document, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    documentDate: '',
    medium: 'digital',
    notes: '',
    meta: [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (document) {
      console.log('Documento recibido en formulario:', document);
      console.log('documentDate del documento:', document.documentDate);
      
      const metaArray = document.meta 
        ? (Array.isArray(document.meta) 
            ? document.meta 
            : Object.entries(document.meta).map(([key, value]) => ({ key, value })))
        : [];

      let formattedDate = '';
      if (document.documentDate) {
        try {
          const date = new Date(document.documentDate);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split('T')[0];
          }
        } catch (e) {
          console.error('Error al formatear fecha:', e);
        }
      }

      console.log('Fecha formateada:', formattedDate);

      setFormData({
        name: document.name || document.file_original_name || '',
        documentDate: formattedDate,
        medium: document.medium || 'digital',
        notes: document.notes || '',
        meta: metaArray,
      });
    }
  }, [document]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddMetaField = () => {
    setFormData(prev => ({
      ...prev,
      meta: [...prev.meta, { key: '', value: '' }],
    }));
  };

  const handleMetaChange = (index, field, value) => {
    setFormData(prev => {
      const newMeta = [...prev.meta];
      newMeta[index][field] = value;
      return { ...prev, meta: newMeta };
    });
  };

  const handleRemoveMetaField = (index) => {
    setFormData(prev => ({
      ...prev,
      meta: prev.meta.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (!document.companyId) {
      setError('El documento no tiene empresa asociada');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const metaObject = formData.meta.reduce((acc, item) => {
        if (item.key.trim()) {
          acc[item.key.trim()] = item.value;
        }
        return acc;
      }, {});

      const companyId = parseInt(document.companyId);
      
      if (isNaN(companyId)) {
        setError('ID de empresa inválido');
        return;
      }

      const dataToSave = {
        name: formData.name.trim(),
        documentDate: formData.documentDate || null,
        medium: formData.medium,
        notes: formData.notes.trim() || null,
        meta: Object.keys(metaObject).length > 0 ? metaObject : null,
        companyId: companyId,
      };

      console.log('Datos a enviar:', dataToSave);
      await onSave(dataToSave);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el documento');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Actualizar Documento: {document?.id} - {document?.file_original_name || document?.name}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              helperText="Si este campo es vacío por defecto tomará el nombre del archivo"
              error={!!error && !formData.name.trim()}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Fecha inicial"
              type="date"
              fullWidth
              value={formData.documentDate}
              onChange={(e) => handleChange('documentDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              helperText="Fecha en la que el documento fue originalmente creado"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Soporte"
              fullWidth
              value={formData.medium}
              onChange={(e) => handleChange('medium', e.target.value)}
              helperText="Medio o formato en el que se encuentra el documento original"
            >
              {MEDIUM_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Información adicional
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddMetaField}
              >
                Añadir fila
              </Button>
            </Box>

            {formData.meta.map((item, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={5}>
                  <TextField
                    label="CLAVE"
                    fullWidth
                    size="small"
                    value={item.key}
                    onChange={(e) => handleMetaChange(index, 'key', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="VALOR"
                    fullWidth
                    size="small"
                    value={item.value}
                    onChange={(e) => handleMetaChange(index, 'value', e.target.value)}
                  />
                </Grid>
                <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveMetaField(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Información contenida en el documento
            </Typography>
            <TextField
              label="Notas"
              fullWidth
              multiline
              rows={4}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              helperText="Cualquier información adicional que quiera incluir sobre el documento puede hacerlo acá, esta podrá ser buscada."
            />
          </Grid>
        </Grid>

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentEditForm;
