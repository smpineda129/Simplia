import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Tabs,
  Tab,
  IconButton,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material';
import { ArrowBack, Mail, Email, Description, Add } from '@mui/icons-material';
import correspondenceService from '../services/correspondenceService';
import ThreadForm from '../components/ThreadForm';
import ThreadTable from '../components/ThreadTable';
import DocumentSection from '../components/DocumentSection';
import LoadingSpinner from '../../../components/LoadingSpinner';

const CorrespondenceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [correspondence, setCorrespondence] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openThreadModal, setOpenThreadModal] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadCorrespondence();
  }, [id]);

  const loadCorrespondence = async () => {
    try {
      setLoading(true);
      const data = await correspondenceService.getById(id);
      setCorrespondence(data);
      setThreads(data.threads || []);
    } catch (error) {
      console.error('Error loading correspondence:', error);
      showSnackbar('Error al cargar la correspondencia', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = () => {
    setSelectedThread(null);
    setOpenThreadModal(true);
  };

  const handleSaveThread = async (data) => {
    try {
      await correspondenceService.createThread(id, data);
      showSnackbar('Hilo creado exitosamente');
      setOpenThreadModal(false);
      loadCorrespondence();
    } catch (error) {
      console.error('Error saving thread:', error);
      showSnackbar(error.response?.data?.error || 'Error al guardar el hilo', 'error');
      throw error;
    }
  };

  const handleDeleteThread = async (threadId) => {
    if (!window.confirm('¿Está seguro de eliminar este hilo?')) return;

    try {
      await correspondenceService.deleteThread(id, threadId);
      showSnackbar('Hilo eliminado exitosamente');
      loadCorrespondence();
    } catch (error) {
      console.error('Error deleting thread:', error);
      showSnackbar(error.response?.data?.error || 'Error al eliminar el hilo', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
    const colors = {
      registered: 'default',
      assigned: 'info',
      in_progress: 'warning',
      responded: 'success',
      closed: 'default',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      registered: 'Registrada',
      assigned: 'Asignada',
      in_progress: 'En Progreso',
      responded: 'Respondida',
      closed: 'Cerrada',
    };
    return labels[status] || status;
  };

  if (loading) {
    return <LoadingSpinner message="Cargando correspondencia..." />;
  }

  if (!correspondence) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Correspondencia no encontrada</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/correspondences')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Mail sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Correspondencia
        </Typography>
      </Box>

      {/* Información de la Correspondencia */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              {correspondence.title}
            </Typography>
            <Chip
              label={getStatusLabel(correspondence.status)}
              color={getStatusColor(correspondence.status)}
              size="small"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Radicado de Entrada
            </Typography>
            <Typography variant="h6" gutterBottom>
              {correspondence.incomingRadicado}
            </Typography>
          </Grid>

          {correspondence.outgoingRadicado && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Radicado de Salida
              </Typography>
              <Typography variant="h6" gutterBottom>
                {correspondence.outgoingRadicado}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Empresa
            </Typography>
            <Typography variant="body1">
              {correspondence.company?.name} ({correspondence.company?.short})
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Tipo de Correspondencia
            </Typography>
            <Typography variant="body1">
              {correspondence.correspondenceType?.name}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Tipo de Destinatario
            </Typography>
            <Chip
              label={correspondence.recipientType === 'internal' ? 'Interno' : 'Externo'}
              size="small"
              color={correspondence.recipientType === 'internal' ? 'primary' : 'secondary'}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Destinatario
            </Typography>
            <Typography variant="body1">
              {correspondence.recipientName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {correspondence.recipientEmail}
            </Typography>
          </Grid>

          {correspondence.advisorCode && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Código de Asesor
              </Typography>
              <Typography variant="body1">
                {correspondence.advisorCode}
              </Typography>
            </Grid>
          )}

          {correspondence.assignedUser && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Usuario Asignado
              </Typography>
              <Typography variant="body1">
                {correspondence.assignedUser.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {correspondence.assignedUser.email}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Creado Por
            </Typography>
            <Typography variant="body1">
              {correspondence.createdByUser?.name || 'Sistema'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(correspondence.createdAt).toLocaleString()}
            </Typography>
          </Grid>

          {correspondence.comments && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Comentarios
              </Typography>
              <Typography variant="body1">
                {correspondence.comments}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Hilos de Conversación" icon={<Email />} iconPosition="start" />
          <Tab label="Documentos" icon={<Description />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Hilos de Conversación
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateThread}
            >
              Crear Hilo
            </Button>
          </Box>

          <ThreadTable
            threads={threads}
            onDelete={handleDeleteThread}
          />
        </Box>
      )}

      {activeTab === 1 && (
        <DocumentSection correspondenceId={id} />
      )}

      <ThreadForm
        open={openThreadModal}
        onClose={() => setOpenThreadModal(false)}
        onSave={handleSaveThread}
        thread={selectedThread}
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

export default CorrespondenceDetail;
