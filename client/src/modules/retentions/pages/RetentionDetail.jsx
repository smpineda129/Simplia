import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Divider,
} from '@mui/material';
import { ArrowBack, Add } from '@mui/icons-material';
import retentionService from '../services/retentionService';
import RetentionLineTable from '../components/RetentionLineTable';
import RetentionLineForm from '../components/RetentionLineForm';

const RetentionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [retention, setRetention] = useState(null);
  const [retentionLines, setRetentionLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadRetention();
    loadRetentionLines();
  }, [id]);

  const loadRetention = async () => {
    try {
      setLoading(true);
      const data = await retentionService.getById(id);
      setRetention(data.data);
    } catch (error) {
      console.error('Error loading retention:', error);
      showSnackbar('Error al cargar la tabla de retención', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadRetentionLines = async () => {
    try {
      const lines = await retentionService.getLines(id);
      setRetentionLines(lines);
    } catch (error) {
      console.error('Error loading retention lines:', error);
      showSnackbar('Error al cargar las líneas de retención', 'error');
    }
  };

  const handleCreateLine = () => {
    setSelectedLine(null);
    setOpenModal(true);
  };

  const handleEditLine = (line) => {
    setSelectedLine(line);
    setOpenModal(true);
  };

  const handleSaveLine = async (data) => {
    try {
      if (selectedLine) {
        await retentionService.updateLine(selectedLine.id, data);
        showSnackbar('Línea actualizada exitosamente');
      } else {
        await retentionService.createLine(id, data);
        showSnackbar('Línea creada exitosamente');
      }
      setOpenModal(false);
      loadRetentionLines();
    } catch (error) {
      console.error('Error saving line:', error);
      showSnackbar(error.response?.data?.error || 'Error al guardar la línea', 'error');
      throw error;
    }
  };

  const handleDeleteLine = async (lineId) => {
    if (!window.confirm('¿Está seguro de eliminar esta línea de retención?')) return;

    try {
      await retentionService.deleteLine(lineId);
      showSnackbar('Línea eliminada exitosamente');
      loadRetentionLines();
    } catch (error) {
      console.error('Error deleting line:', error);
      showSnackbar(error.response?.data?.error || 'Error al eliminar la línea', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!retention) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Tabla de retención no encontrada</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/retentions')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          Tabla de Retención
        </Typography>
      </Box>

      {/* Información de la Retention */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Nombre
            </Typography>
            <Typography variant="h6" gutterBottom>
              {retention.name}
            </Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Código
            </Typography>
            <Typography variant="h6" gutterBottom>
              {retention.code}
            </Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Fecha
            </Typography>
            <Typography variant="h6" gutterBottom>
              {new Date(retention.date).toLocaleDateString()}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Empresa
            </Typography>
            <Typography variant="body1">
              {retention.company?.name} ({retention.company?.short})
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Área
            </Typography>
            <Typography variant="body1">
              {retention.area?.name} ({retention.area?.code})
            </Typography>
          </Grid>

          {retention.comments && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Comentarios
              </Typography>
              <Typography variant="body1">
                {retention.comments}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Chip
              label={`${retentionLines.length} Líneas de Retención`}
              color="primary"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Sección de Líneas de Retención */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Líneas de Retención
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateLine}
        >
          Crear Línea
        </Button>
      </Box>

      <RetentionLineTable
        lines={retentionLines}
        onEdit={handleEditLine}
        onDelete={handleDeleteLine}
      />

      <RetentionLineForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSaveLine}
        line={selectedLine}
      />

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
    </Box>
  );
};

export default RetentionDetail;
