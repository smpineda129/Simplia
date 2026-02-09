import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
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
  InputAdornment,
  Avatar,
  Menu,
  ListItemIcon,
  ListItemText,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  Assignment,
  PriorityHigh,
  CheckCircle,
  Cancel,
  MoreVert,
  FileDownload,
  Warning,
  Schedule,
  Person,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ticketService from '../services/ticketService';
import LoadingLogo from '../../../components/LoadingLogo';
import notificationService from '../../notifications/services/notificationService';

const AdminTicketsPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    type: '',
    assignedToId: '',
    search: '',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'OPEN', label: 'Abierto', color: 'warning' },
    { value: 'IN_PROGRESS', label: 'En Proceso', color: 'info' },
    { value: 'WAITING_RESPONSE', label: 'Esperando Respuesta', color: 'default' },
    { value: 'RESOLVED', label: 'Resuelto', color: 'success' },
    { value: 'CLOSED', label: 'Cerrado', color: 'default' },
  ];

  const priorityOptions = [
    { value: '', label: 'Todas' },
    { value: 'LOW', label: 'Baja', color: 'info' },
    { value: 'MEDIUM', label: 'Media', color: 'warning' },
    { value: 'HIGH', label: 'Alta', color: 'error' },
    { value: 'URGENT', label: 'Urgente', color: 'error' },
  ];

  const typeOptions = [
    { value: '', label: 'Todos' },
    { value: 'PQRS', label: 'PQRS' },
    { value: 'TECHNICAL_SUPPORT', label: 'Soporte Técnico' },
    { value: 'BILLING', label: 'Facturación' },
    { value: 'FEATURE_REQUEST', label: 'Solicitud de Funcionalidad' },
    { value: 'BUG_REPORT', label: 'Reporte de Error' },
    { value: 'OTHER', label: 'Otro' },
  ];

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ticketsResponse, statsResponse] = await Promise.all([
        ticketService.getAll(filters),
        ticketService.getStats(),
      ]);
      
      setTickets(ticketsResponse.data);
      setPagination(ticketsResponse.pagination);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar datos',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();
      // Filter only users with Support role
      const supportUsers = (data.data || []).filter(user => 
        user.roles?.some(role => role.name === 'Support')
      );
      setUsers(supportUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleOpenAssignDialog = (ticket) => {
    // Close menu first but keep ticket reference
    setAnchorEl(null);
    // Then set ticket and open dialog
    setSelectedTicket(ticket);
    setSelectedUserId(ticket.assignedToId?.toString() || '');
    setAssignDialogOpen(true);
    if (users.length === 0) {
      loadUsers();
    }
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
    setSelectedTicket(null);
    setSelectedUserId('');
  };

  const handleAssignTicket = async () => {
    if (!selectedTicket) {
      setSnackbar({
        open: true,
        message: 'No hay ticket seleccionado',
        severity: 'error',
      });
      return;
    }

    try {
      await ticketService.update(selectedTicket.id, {
        assignedToId: selectedUserId || null,
      });
      
      // Notifications are created automatically in backend when ticket is assigned
      
      setSnackbar({
        open: true,
        message: 'Ticket asignado exitosamente',
        severity: 'success',
      });
      
      handleCloseAssignDialog();
      loadData();
    } catch (error) {
      console.error('Error assigning ticket:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al asignar ticket',
        severity: 'error',
      });
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
      page: 1, // Reset to first page on filter change
    });
  };

  const handlePageChange = (event, value) => {
    setFilters({
      ...filters,
      page: value,
    });
  };

  const handleMenuOpen = (event, ticket) => {
    setAnchorEl(event.currentTarget);
    setSelectedTicket(ticket);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTicket(null);
  };

  const handleViewTicket = (ticketId) => {
    navigate(`/support/tickets/${ticketId}`);
    handleMenuClose();
  };

  const handleCloseTicketFromMenu = async (ticket) => {
    if (!window.confirm(`¿Estás seguro de que deseas cerrar el ticket #${ticket.ticketNumber}?`)) {
      handleMenuClose();
      return;
    }

    try {
      await ticketService.update(ticket.id, {
        status: 'CLOSED',
      });

      setSnackbar({
        open: true,
        message: 'Ticket cerrado exitosamente',
        severity: 'success',
      });

      handleMenuClose();
      loadData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al cerrar el ticket',
        severity: 'error',
      });
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    setSnackbar({
      open: true,
      message: 'Exportación en desarrollo',
      severity: 'info',
    });
    handleMenuClose();
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

  const getStatusLabel = (status) => {
    return statusOptions.find(s => s.value === status) || { label: status, color: 'default' };
  };

  const getPriorityLabel = (priority) => {
    return priorityOptions.find(p => p.value === priority) || { label: priority, color: 'default' };
  };

  const getTypeLabel = (type) => {
    return typeOptions.find(t => t.value === type)?.label || type;
  };

  if (loading && !stats) {
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
            Gestión de Tickets de Soporte
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra y da seguimiento a las solicitudes técnicas de los clientes
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<FileDownload />}
          onClick={handleExport}
        >
          Exportar Reporte
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: 4, borderColor: 'warning.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h3" fontWeight={700} color="warning.main">
                    {stats?.open || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tickets Abiertos
                  </Typography>
                  {stats?.highPriority > 0 && (
                    <Chip
                      label={`${stats.highPriority} requieren atención urgente`}
                      size="small"
                      color="error"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>
                <Box sx={{ bgcolor: 'warning.light', p: 1, borderRadius: 1 }}>
                  <Warning sx={{ color: 'warning.dark' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: 4, borderColor: 'info.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h3" fontWeight={700} color="info.main">
                    {stats?.inProgress || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    En Proceso
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Tiempo prom. respuesta: 2h
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: 'info.light', p: 1, borderRadius: 1 }}>
                  <Schedule sx={{ color: 'info.dark' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: 4, borderColor: 'success.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h3" fontWeight={700} color="success.main">
                    {stats?.resolved || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cerrados (Mes)
                  </Typography>
                  <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                    98% Satisfacción del cliente
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: 'success.light', p: 1, borderRadius: 1 }}>
                  <CheckCircle sx={{ color: 'success.dark' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: 4, borderColor: 'error.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h3" fontWeight={700} color="error.main">
                    {stats?.unassigned || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sin Asignar
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Requieren asignación
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: 'error.light', p: 1, borderRadius: 1 }}>
                  <Person sx={{ color: 'error.dark' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar por ID, asunto o cliente..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                select
                size="small"
                label="Prioridad"
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                {priorityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                select
                size="small"
                label="Categoría"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                {typeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                select
                size="small"
                label="Estado"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Mostrando {tickets.length} de {pagination.total} resultados
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID TICKET</TableCell>
                <TableCell>ASUNTO</TableCell>
                <TableCell>CATEGORÍA</TableCell>
                <TableCell>PRIORIDAD</TableCell>
                <TableCell>ESTADO</TableCell>
                <TableCell>AGENTE</TableCell>
                <TableCell>ACTUALIZADO</TableCell>
                <TableCell align="center">ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <LoadingLogo size={100} />
                  </TableCell>
                </TableRow>
              ) : tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Typography variant="body2" color="text.secondary">
                      No se encontraron tickets con los filtros aplicados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow key={ticket.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="primary">
                        #{ticket.ticketNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ticket.isAnonymous ? 'PQRS Anónimo' : ticket.user?.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>
                        {ticket.subject}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ticket.isAnonymous ? ticket.contactEmail : ticket.company?.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {getTypeLabel(ticket.type)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? <PriorityHigh /> : undefined}
                        label={getPriorityLabel(ticket.priority).label}
                        color={getPriorityLabel(ticket.priority).color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(ticket.status).label}
                        color={getStatusLabel(ticket.status).color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {ticket.assignedTo ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            src={ticket.assignedTo.avatar}
                            sx={{ width: 24, height: 24 }}
                          >
                            {ticket.assignedTo.name[0]}
                          </Avatar>
                          <Typography variant="caption">
                            {ticket.assignedTo.name.split(' ')[0]}
                          </Typography>
                        </Box>
                      ) : (
                        <Chip label="Sin asignar" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {formatDate(ticket.updatedAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewTicket(ticket.id)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, ticket)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewTicket(selectedTicket?.id)}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ver Detalles</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleOpenAssignDialog(selectedTicket)}>
          <ListItemIcon>
            <Assignment fontSize="small" />
          </ListItemIcon>
          <ListItemText>Asignar</ListItemText>
        </MenuItem>
        {selectedTicket?.status !== 'CLOSED' && selectedTicket?.status !== 'CANCELLED' && (
          <MenuItem onClick={() => handleCloseTicketFromMenu(selectedTicket)}>
            <ListItemIcon>
              <CheckCircle fontSize="small" />
            </ListItemIcon>
            <ListItemText>Cerrar Ticket</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onClose={handleCloseAssignDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Asignar Ticket</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Ticket: <strong>#{selectedTicket?.ticketNumber}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {selectedTicket?.subject}
            </Typography>
            
            <TextField
              fullWidth
              select
              label="Asignar a"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <MenuItem value="">
                <em>Sin asignar</em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id.toString()}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={user.avatar} sx={{ width: 24, height: 24 }}>
                      {user.name[0]}
                    </Avatar>
                    {user.name} ({user.email})
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDialog}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleAssignTicket}>
            Asignar
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

export default AdminTicketsPage;
