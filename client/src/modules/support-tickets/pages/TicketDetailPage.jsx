import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  TextField,
  Grid,
  Paper,
  Avatar,
  Divider,
  Alert,
  Snackbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  ArrowBack,
  Send,
  AttachFile,
  Close,
  History,
  Person,
  Business,
  CalendarToday,
  Category,
  PriorityHigh,
} from '@mui/icons-material';
import ticketService from '../services/ticketService';
import LoadingLogo from '../../../components/LoadingLogo';

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const statusLabels = {
    OPEN: { label: 'Abierto', color: 'warning' },
    IN_PROGRESS: { label: 'En Proceso', color: 'info' },
    WAITING_RESPONSE: { label: 'Esperando Respuesta', color: 'default' },
    RESOLVED: { label: 'Resuelto', color: 'success' },
    CLOSED: { label: 'Cerrado', color: 'default' },
    CANCELLED: { label: 'Cancelado', color: 'error' },
  };

  const priorityLabels = {
    LOW: { label: 'Baja', color: 'info' },
    MEDIUM: { label: 'Media', color: 'warning' },
    HIGH: { label: 'Alta', color: 'error' },
    URGENT: { label: 'Urgente', color: 'error' },
  };

  useEffect(() => {
    loadTicket();
  }, [id]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getById(id);
      setTicket(response.data);
    } catch (error) {
      console.error('Error loading ticket:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar el ticket',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      await ticketService.addComment(id, {
        comment,
        isInternal: false,
        attachmentUrl: imagePreview,
      });

      setSnackbar({
        open: true,
        message: 'Comentario agregado exitosamente',
        severity: 'success',
      });

      setComment('');
      setImagePreview(null);
      loadTicket();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al agregar comentario',
        severity: 'error',
      });
    }
  };

  const handleCloseTicket = async () => {
    if (!window.confirm('¿Estás seguro de que deseas cerrar este ticket?')) {
      return;
    }

    try {
      await ticketService.update(id, {
        status: 'CLOSED',
      });

      setSnackbar({
        open: true,
        message: 'Ticket cerrado exitosamente',
        severity: 'success',
      });

      loadTicket();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al cerrar el ticket',
        severity: 'error',
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <LoadingLogo size={120} />
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Ticket no encontrado
        </Typography>
        <Button onClick={() => navigate('/support')} sx={{ mt: 2 }}>
          Volver a Mis Tickets
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={() => navigate('/support')}>
          <ArrowBack />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight={700}>
            Ticket #{ticket.ticketNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {ticket.subject}
          </Typography>
        </Box>
        <Chip
          label={statusLabels[ticket.status]?.label}
          color={statusLabels[ticket.status]?.color}
        />
        <Chip
          label={priorityLabels[ticket.priority]?.label}
          color={priorityLabels[ticket.priority]?.color}
          variant="outlined"
        />
        {ticket.status !== 'CLOSED' && ticket.status !== 'CANCELLED' && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<Close />}
            onClick={handleCloseTicket}
          >
            Cerrar Ticket
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Ticket Details */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Descripción
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                {ticket.description}
              </Typography>
              
              {ticket.imageUrl && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={ticket.imageUrl}
                    alt="Adjunto"
                    style={{ maxWidth: '100%', borderRadius: 8 }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Comments */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Comentarios ({ticket.comments?.length || 0})
              </Typography>
              
              {ticket.comments && ticket.comments.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {ticket.comments.map((comment, index) => (
                    <Paper
                      key={comment.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        bgcolor: comment.isInternal ? 'warning.lighter' : 'background.paper',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Avatar src={comment.user?.avatar} sx={{ width: 32, height: 32 }}>
                          {comment.user?.name?.[0]}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {comment.user?.name || 'Usuario'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(comment.createdAt)}
                          </Typography>
                        </Box>
                        {comment.isInternal && (
                          <Chip label="Interno" size="small" color="warning" />
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {comment.comment}
                      </Typography>
                      {comment.attachmentUrl && (
                        <Box sx={{ mt: 1 }}>
                          <img
                            src={comment.attachmentUrl}
                            alt="Adjunto"
                            style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 4 }}
                          />
                        </Box>
                      )}
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  No hay comentarios aún
                </Typography>
              )}

              {/* Add Comment */}
              {ticket.status !== 'CLOSED' && ticket.status !== 'CANCELLED' && (
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Agregar Comentario
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Escribe tu comentario..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  
                  {imagePreview && (
                    <Box sx={{ position: 'relative', mb: 2 }}>
                      <IconButton
                        size="small"
                        sx={{ position: 'absolute', right: 0, top: 0, bgcolor: 'background.paper' }}
                        onClick={() => setImagePreview(null)}
                      >
                        <Close />
                      </IconButton>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }}
                      />
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<AttachFile />}
                    >
                      Adjuntar
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Send />}
                      onClick={handleAddComment}
                      disabled={!comment.trim()}
                    >
                      Enviar Comentario
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Ticket Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Información del Ticket
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Category fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Tipo
                    </Typography>
                    <Typography variant="body2">
                      {ticket.type}
                    </Typography>
                  </Box>
                </Box>

                {ticket.module && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Category fontSize="small" color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Módulo
                      </Typography>
                      <Typography variant="body2">
                        {ticket.module}
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Creado
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(ticket.createdAt)}
                    </Typography>
                  </Box>
                </Box>

                {ticket.assignedTo && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person fontSize="small" color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Asignado a
                      </Typography>
                      <Typography variant="body2">
                        {ticket.assignedTo.name}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {ticket.company && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business fontSize="small" color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Empresa
                      </Typography>
                      <Typography variant="body2">
                        {ticket.company.name}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* History */}
          {ticket.history && ticket.history.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <History fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Historial
                </Typography>
                
                <List sx={{ mt: 2 }}>
                  {ticket.history.map((item, index) => (
                    <ListItem
                      key={item.id}
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        borderLeft: 2,
                        borderColor: 'primary.main',
                        pl: 2,
                        mb: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={600}>
                          {item.action}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(item.createdAt).toLocaleDateString('es-ES', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                      </Box>
                      {item.newValue && (
                        <Typography variant="caption" color="text.secondary">
                          {item.newValue}
                        </Typography>
                      )}
                      {item.user && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                          por {item.user.name}
                        </Typography>
                      )}
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TicketDetailPage;
