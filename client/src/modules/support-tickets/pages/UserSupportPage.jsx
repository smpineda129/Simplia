import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Visibility,
  AttachFile,
  Close,
  ConfirmationNumber,
  Schedule,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ticketService from '../services/ticketService';
import LoadingLogo from '../../../components/LoadingLogo';

const UserSupportPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    type: 'TECHNICAL_SUPPORT',
    module: '',
    priority: 'MEDIUM',
  });

  const ticketTypes = [
    { value: 'TECHNICAL_SUPPORT', label: 'Soporte Técnico' },
    { value: 'BILLING', label: 'Facturación' },
    { value: 'FEATURE_REQUEST', label: 'Solicitud de Funcionalidad' },
    { value: 'BUG_REPORT', label: 'Reporte de Error' },
    { value: 'OTHER', label: 'Otro' },
  ];

  const modules = [
    'Usuarios', 'Empresas', 'Expedientes', 'Correspondencia',
    'Documentos', 'Retenciones', 'Almacenes', 'Plantillas', 'Otro'
  ];

  const priorities = [
    { value: 'LOW', label: 'Baja', color: 'info' },
    { value: 'MEDIUM', label: 'Media', color: 'warning' },
    { value: 'HIGH', label: 'Alta', color: 'error' },
    { value: 'URGENT', label: 'Urgente', color: 'error' },
  ];

  const statusLabels = {
    OPEN: { label: 'Abierto', color: 'warning' },
    IN_PROGRESS: { label: 'En Proceso', color: 'info' },
    WAITING_RESPONSE: { label: 'Esperando Respuesta', color: 'default' },
    RESOLVED: { label: 'Resuelto', color: 'success' },
    CLOSED: { label: 'Cerrado', color: 'default' },
    CANCELLED: { label: 'Cancelado', color: 'error' },
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getMyTickets();
      setTickets(response.data);
    } catch (error) {
      console.error('Error loading tickets:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar tickets',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      subject: '',
      description: '',
      type: 'TECHNICAL_SUPPORT',
      module: '',
      priority: 'MEDIUM',
    });
    setImagePreview(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  const handleSubmit = async () => {
    try {
      await ticketService.create({
        ...formData,
        imageUrl: imagePreview,
      });
      
      setSnackbar({
        open: true,
        message: 'Ticket creado exitosamente',
        severity: 'success',
      });
      
      handleCloseDialog();
      loadTickets();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al crear ticket',
        severity: 'error',
      });
    }
  };

  const handleViewTicket = (ticketId) => {
    navigate(`/support/tickets/${ticketId}`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const openTickets = tickets.filter(t => ['OPEN', 'IN_PROGRESS', 'WAITING_RESPONSE'].includes(t.status));
  const resolvedTickets = tickets.filter(t => ['RESOLVED', 'CLOSED'].includes(t.status));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <LoadingLogo size={120} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Mis Tickets de Soporte
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona tus solicitudes de soporte y consulta su estado
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenDialog}
          size="large"
        >
          Crear Ticket
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ bgcolor: 'warning.light', p: 1.5, borderRadius: 2 }}>
                  <ConfirmationNumber sx={{ color: 'warning.dark', fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {openTickets.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tickets Abiertos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ bgcolor: 'success.light', p: 1.5, borderRadius: 2 }}>
                  <CheckCircle sx={{ color: 'success.dark', fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {resolvedTickets.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tickets Resueltos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ bgcolor: 'info.light', p: 1.5, borderRadius: 2 }}>
                  <Schedule sx={{ color: 'info.dark', fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {tickets.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total de Tickets
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tickets Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Historial de Tickets
          </Typography>
          
          {tickets.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <ConfirmationNumber sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tienes tickets de soporte
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Crea tu primer ticket para obtener ayuda de nuestro equipo
              </Typography>
              <Button variant="contained" startIcon={<Add />} onClick={handleOpenDialog}>
                Crear Primer Ticket
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ticket</TableCell>
                    <TableCell>Asunto</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Prioridad</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="primary">
                          {ticket.ticketNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                          {ticket.subject}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {ticketTypes.find(t => t.value === ticket.type)?.label || ticket.type}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusLabels[ticket.status]?.label}
                          color={statusLabels[ticket.status]?.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={priorities.find(p => p.value === ticket.priority)?.label}
                          color={priorities.find(p => p.value === ticket.priority)?.color}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {formatDate(ticket.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver Detalles">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewTicket(ticket.id)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Create Ticket Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              Crear Nuevo Ticket de Soporte
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                required
                label="Tipo de Ticket"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                {ticketTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Módulo Relacionado"
                name="module"
                value={formData.module}
                onChange={handleChange}
              >
                {modules.map((module) => (
                  <MenuItem key={module} value={module}>
                    {module}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Asunto"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Describe brevemente el problema"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={6}
                label="Descripción Detallada"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Proporciona todos los detalles relevantes sobre tu problema o solicitud"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<AttachFile />}
                fullWidth
              >
                Adjuntar Imagen (Opcional)
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {imagePreview && (
                <Box sx={{ mt: 2, position: 'relative' }}>
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
                    style={{ width: '100%', maxHeight: 300, objectFit: 'contain' }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.subject || !formData.description}
          >
            Crear Ticket
          </Button>
        </DialogActions>
      </Dialog>

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

export default UserSupportPage;
