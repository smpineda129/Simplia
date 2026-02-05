import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import { ArrowBack, Folder, Description, Business, CalendarToday, Label } from '@mui/icons-material';
import proceedingService from '../services/proceedingService';
import { usePermissions } from '../../../hooks/usePermissions';

const ProceedingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [proceeding, setProceeding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProceeding();
  }, [id]);

  const loadProceeding = async () => {
    try {
      setLoading(true);
      const response = await proceedingService.getById(id);
      setProceeding(response.data);
    } catch (error) {
      console.error('Error loading proceeding:', error);
      setError('Error al cargar el expediente');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !proceeding) {
    return (
      <Box>
        <Alert severity="error">{error || 'Expediente no encontrado'}</Alert>
        <Button onClick={() => navigate('/proceedings')} sx={{ mt: 2 }} startIcon={<ArrowBack />}>
          Volver a Expedientes
        </Button>
      </Box>
    );
  }

  const formatDate = (date) => {
    if (!date) return 'No definida';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/proceedings')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Folder sx={{ mr: 1, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          {proceeding.name}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Info */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Description sx={{ mr: 1 }} /> Información General
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Código</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{proceeding.code}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Estado</Typography>
                <Chip
                  label={proceeding.status || 'Activo'}
                  color={proceeding.status === 'INACTIVE' ? 'default' : 'success'}
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Descripción</Typography>
                <Typography variant="body1">
                  {proceeding.description || 'Sin descripción'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Fecha Inicio</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarToday fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body1">{formatDate(proceeding.startDate)}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Fecha Fin</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarToday fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body1">{formatDate(proceeding.endDate)}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Sidebar Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Business sx={{ mr: 1 }} /> Contexto
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Empresa</Typography>
              <Typography variant="body1">
                {proceeding.company?.name || 'No asignada'}
              </Typography>
              {proceeding.company?.short && (
                <Typography variant="caption" color="text.secondary">
                  ({proceeding.company.short})
                </Typography>
              )}
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Tabla de Retención</Typography>
              <Typography variant="body1">
                {proceeding.retention?.name || 'No asignada'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProceedingDetail;
