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
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack,
  Mail,
  Email,
  Description,
  Add,
  MoreVert,
  Edit,
  Delete,
  Reply,
  LocalShipping,
} from '@mui/icons-material';
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
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openReplyModal, setOpenReplyModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
      showSnackbar(error.response?.data?.error || 'Error al eliminar el hilo', 'error');
    }
  };

  const handleEdit = async (data) => {
    try {
      await correspondenceService.update(id, data);
      showSnackbar('Correspondencia actualizada');
      setOpenEditModal(false);
      loadCorrespondence();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al actualizar', 'error');
      throw error;
    }
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      await correspondenceService.delete(id);
      showSnackbar('Correspondencia eliminada');
      setOpenDeleteDialog(false);
      navigate('/correspondences');
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al eliminar', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (data) => {
    try {
      const result = await correspondenceService.respond(id, {
        response: data.message,
        cc: data.cc,
        templateId: data.templateId,
        documentKey: data.documentKey,
        documentName: data.documentName,
        sign: data.sign,
      });
      const signatureToken = result?.signatureToken;
      showSnackbar(
        signatureToken
          ? `Respuesta enviada y firmada electrónicamente (Token: ${signatureToken.slice(0, 8)}…)`
          : 'Respuesta enviada exitosamente'
      );
      setOpenReplyModal(false);
      loadCorrespondence();
    } catch (error) {
      showSnackbar(error.response?.data?.error || 'Error al responder', 'error');
      throw error;
    }
  };

  const handleMarkDelivered = async () => {
    try {
      await correspondenceService.markAsDelivered(id);
      showSnackbar('Marcada como entregada en físico');
      setMenuAnchor(null);
      loadCorrespondence();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al actualizar', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
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

  const InfoField = ({ label, children }) => (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Box sx={{ mt: 0.25 }}>{children}</Box>
    </Box>
  );

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

  const sender = correspondence.users_correspondences_sender_idTousers;
  const recipient = correspondence.users_correspondences_recipient_idTousers;
  const corrUser = correspondence.correspondenceUser;
  const corrType = correspondence.correspondenceType;
  const isExternal = correspondence.user_type === 'external';

  let parsedComments = null;
  if (isExternal && correspondence.comments) {
    try {
      parsedComments = typeof correspondence.comments === 'string'
        ? JSON.parse(correspondence.comments)
        : correspondence.comments;
    } catch {
      parsedComments = null;
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
        <IconButton onClick={() => navigate('/correspondences')} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Mail sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
          Correspondencia
        </Typography>

        {/* Quick action buttons */}
        <Button
          variant="outlined"
          startIcon={<Reply />}
          size="small"
          onClick={() => setOpenReplyModal(true)}
          disabled={correspondence.status === 'closed'}
        >
          Responder
        </Button>

        {correspondence.physical_delivered && (
          <Chip label="Entregado en físico" color="success" size="small" icon={<LocalShipping />} />
        )}

        <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
          <MoreVert />
        </IconButton>
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
          <MenuItem onClick={() => { setMenuAnchor(null); setOpenEditModal(true); }}>
            <Edit fontSize="small" sx={{ mr: 1 }} /> Editar
          </MenuItem>
          {!correspondence.physical_delivered && (
            <MenuItem onClick={handleMarkDelivered}>
              <LocalShipping fontSize="small" sx={{ mr: 1 }} /> Marcar como entregado en físico
            </MenuItem>
          )}
          <MenuItem onClick={() => { setMenuAnchor(null); setOpenDeleteDialog(true); }} sx={{ color: 'error.main' }}>
            <Delete fontSize="small" sx={{ mr: 1 }} /> Eliminar
          </MenuItem>
        </Menu>
      </Box>

      {/* Info card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">
            {correspondence.title}
          </Typography>
          <Chip
            label={getStatusLabel(correspondence.status)}
            color={getStatusColor(correspondence.status)}
            size="small"
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <InfoField label="Radicado de Entrada">
              <Typography variant="body1" fontWeight={600}>
                {correspondence.in_settled || '—'}
              </Typography>
            </InfoField>
          </Grid>

          {correspondence.out_settled && (
            <Grid item xs={12} sm={6} md={4}>
              <InfoField label="Radicado de Salida">
                <Typography variant="body1" fontWeight={600}>
                  {correspondence.out_settled}
                </Typography>
              </InfoField>
            </Grid>
          )}

          <Grid item xs={12} sm={6} md={4}>
            <InfoField label="Fecha de Registro">
              <Typography variant="body1">
                {correspondence.createdAt
                  ? new Date(correspondence.createdAt).toLocaleString('es-ES')
                  : '—'}
              </Typography>
            </InfoField>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoField label="Empresa">
              <Typography variant="body1">
                {correspondence.company?.name}
                {correspondence.company?.short && (
                  <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({correspondence.company.short})
                  </Typography>
                )}
              </Typography>
            </InfoField>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoField label="Tipo de Correspondencia">
              <Typography variant="body1">
                {corrType?.name || '—'}
              </Typography>
              {corrType?.area && (
                <Typography variant="body2" color="text.secondary">
                  Área: {corrType.area.name}
                </Typography>
              )}
            </InfoField>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoField label="Remitente / Tipo">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1">
                  {isExternal && parsedComments
                    ? parsedComments.senderName
                    : corrUser?.name || `ID: ${correspondence.user_id}`}
                </Typography>
                <Chip
                  label={isExternal ? 'Externo' : 'Interno'}
                  size="small"
                  color={isExternal ? 'secondary' : 'primary'}
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {isExternal && parsedComments
                  ? parsedComments.senderEmail
                  : corrUser?.email}
              </Typography>
              {isExternal && parsedComments?.senderPhone && (
                <Typography variant="body2" color="text.secondary">
                  {parsedComments.senderPhone}
                </Typography>
              )}
            </InfoField>
          </Grid>

          {sender && (
            <Grid item xs={12} sm={6} md={4}>
              <InfoField label="Creado por">
                <Typography variant="body1">{sender.name}</Typography>
                <Typography variant="body2" color="text.secondary">{sender.email}</Typography>
              </InfoField>
            </Grid>
          )}

          {recipient && (
            <Grid item xs={12} sm={6} md={4}>
              <InfoField label="Asignado a">
                <Typography variant="body1">{recipient.name}</Typography>
                <Typography variant="body2" color="text.secondary">{recipient.email}</Typography>
              </InfoField>
            </Grid>
          )}

          {(parsedComments?.message || (!isExternal && correspondence.comments)) && (
            <Grid item xs={12}>
              <InfoField label="Mensaje">
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {isExternal ? parsedComments.message : correspondence.comments}
                </Typography>
              </InfoField>
            </Grid>
          )}

          {Array.isArray(correspondence.attachments) && correspondence.attachments.length > 0 && (
            <Grid item xs={12}>
              <InfoField label="Documentos Adjuntos">
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                  {correspondence.attachments.map((att, i) => (
                    <Chip
                      key={i}
                      label={att.name || att.key}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </InfoField>
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

      {activeTab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Hilos de Conversación
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenThreadModal(true)}
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
        correspondenceId={id}
      />

      {/* Reply Modal */}
      <ThreadForm
        open={openReplyModal}
        onClose={() => setOpenReplyModal(false)}
        onSave={handleReply}
        correspondenceId={id}
        isReply
        companyId={correspondence?.companyId}
      />

      {/* Edit Dialog - basic inline edit */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Correspondencia</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Para editar todos los campos, use la lista de correspondencias.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cerrar</Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpenEditModal(false);
              navigate('/correspondences');
            }}
          >
            Ir a la lista
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de eliminar la correspondencia "{correspondence.title}"? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} disabled={submitting}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={submitting}>
            {submitting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CorrespondenceDetail;
