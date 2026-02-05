import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Fade,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Visibility,
  Download,
  PictureAsPdf,
  History,
  Terminal,
  Person,
  Language,
  Fingerprint,
} from '@mui/icons-material';
import auditService from '../audit.service';
import LoadingSpinner from '../../../components/LoadingSpinner';

const ACTION_TRANSLATIONS = {
  'Create': 'Crear',
  'Update': 'Actualizar',
  'Delete': 'Eliminar',
  'View': 'Ver',
  'Unknown': 'Desconocido'
};

const MODEL_TRANSLATIONS = {
  'User': 'Usuario',
  'Proceeding': 'Expediente',
  'Document': 'Documento',
  'Correspondence': 'Correspondencia',
  'Company': 'Empresa',
  'Area': 'Área',
  'Retention': 'Retención',
  'Role': 'Rol',
  'Permission': 'Permiso'
};

const AuditTable = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadEvents();
  }, [userId, page, rowsPerPage]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        user_id: userId,
      };
      const response = await auditService.getEvents(params);
      setEvents(response.data);
      setTotal(response.meta.total);
    } catch (error) {
      console.error('Error loading audit events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    if (exporting) return;

    try {
      setExporting(true);
      const params = { user_id: userId };
      const blob = type === 'excel' ? await auditService.exportExcel(params) : await auditService.exportPdf(params);

      if (blob) {
        // Crear URL del objeto Blob
        const url = window.URL.createObjectURL(blob);
        const extension = type === 'excel' ? 'xlsx' : 'pdf';
        const filename = `Auditoria_Simplia_${new Date().getTime()}.${extension}`;

        // Usar un enlace temporal para asegurar la descarga nativa
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

        // Limpieza segura (esperar un poco para que el navegador inicie la descarga)
        setTimeout(() => {
          if (document.body.contains(link)) document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 5000);
      }
    } catch (error) {
      alert(`Error al generar reporte: ${error.message}`);
    } finally {
      setExporting(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getActionStyles = (name) => {
    if (name.includes('Create')) return {
      bg: 'linear-gradient(45deg, #43a047 30%, #66bb6a 90%)',
      color: 'white'
    };
    if (name.includes('Update')) return {
      bg: 'linear-gradient(45deg, #fb8c00 30%, #ffb74d 90%)',
      color: 'white'
    };
    if (name.includes('Delete')) return {
      bg: 'linear-gradient(45deg, #e53935 30%, #ef5350 90%)',
      color: 'white'
    };
    if (name.includes('View')) return {
      bg: 'linear-gradient(45deg, #1e88e5 30%, #42a5f5 90%)',
      color: 'white'
    };
    return { bg: '#9e9e9e', color: 'white' };
  };

  const formatModelName = (modelType) => {
    if (!modelType) return 'N/A';
    const rawName = modelType.replace('App\\Models\\', '');
    return MODEL_TRANSLATIONS[rawName] || rawName;
  };

  const formatActionName = (name) => {
    return ACTION_TRANSLATIONS[name] || name;
  };

  if (loading && events.length === 0) {
    return <LoadingSpinner message="Cargando historial de actividades..." />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'secondary.light', width: 40, height: 40 }}>
            <History />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1.2, fontWeight: 700 }}>
              Audit Log
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Rastreo detallado de interacciones y cambios
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PictureAsPdf />}
            onClick={() => handleExport('pdf')}
            disabled={exporting}
            sx={{ borderRadius: 2, borderColor: 'error.light', color: 'error.main' }}
          >
            {exporting ? 'Generando...' : 'PDF'}
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download />}
            onClick={() => handleExport('excel')}
            disabled={exporting}
            sx={{ borderRadius: 2, borderColor: 'success.light', color: 'success.main' }}
          >
            {exporting ? 'Generando...' : 'Excel'}
          </Button>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          background: '#ffffff',
        }}
      >
        <Table size="medium">
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(245, 245, 245, 0.5)' }}>
              <TableCell sx={{ fontWeight: 600 }}>Fecha y Hora</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Acción</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Entidad</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Referencia</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Conexión</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.length > 0 ? (
              events.map((event, index) => {
                const styles = getActionStyles(event.name);
                return (
                  <TableRow
                    key={event.id}
                    hover
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      bgcolor: index % 2 === 0 ? 'transparent' : 'rgba(252, 252, 252, 0.5)',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {new Date(event.created_at).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(event.created_at).toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={formatActionName(event.name)}
                        size="small"
                        sx={{
                          background: styles.bg,
                          color: styles.color,
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Terminal fontSize="inherit" sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ color: 'primary.dark', fontWeight: 600 }}>
                          {formatModelName(event.model_type)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {event.fields || `ID: #${event.model_id}`}
                      </Typography>
                      {event.fields && (
                        <Typography variant="caption" color="text.secondary">
                          Referencia: #{event.model_id}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={event.userAgent}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Language fontSize="inherit" color="disabled" />
                          <Typography variant="caption" color="text.secondary">
                            {event.ipAddress || 'Unknown'}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => setSelectedEvent(event)}
                        sx={{
                          color: 'primary.main',
                          bgcolor: 'primary.50',
                          '&:hover': { bgcolor: 'primary.100' }
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Box sx={{ py: 8, opacity: 0.6 }}>
                    <History sx={{ fontSize: 48, color: 'disabled.main', mb: 1, display: 'block', mx: 'auto' }} />
                    <Typography variant="body2">No se encontraron registros de actividad</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mt: 1 }}
      />

      {/* Modern Detail Dialog */}
      <Dialog
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{
          sx: { borderRadius: 4, backgroundImage: 'none' }
        }}
      >
        <DialogTitle sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Terminal />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                Detalles del Evento
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Referencia Sistema: #{selectedEvent?.id}
              </Typography>
            </Box>
          </Box>
          {selectedEvent && (
            <Chip
              label={formatActionName(selectedEvent.name)}
              sx={{
                background: getActionStyles(selectedEvent.name).bg,
                color: 'white',
                fontWeight: 700
              }}
            />
          )}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 4, bgcolor: '#fcfcfc' }}>
          {selectedEvent && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="overline" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Fingerprint fontSize="inherit" /> Identificación
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                      {selectedEvent.fields || 'Sin nombre'}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Entidad</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatModelName(selectedEvent.model_type)}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">ID Registro</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>#{selectedEvent.model_id}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Language fontSize="inherit" /> Contexto
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                    <Typography variant="caption" color="text.secondary">Dirección IP</Typography>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>{selectedEvent.ipAddress || 'No disponible'}</Typography>
                    <Typography variant="caption" color="text.secondary">Agente de Usuario</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontFamily: 'monospace' }}>
                      {selectedEvent.userAgent}
                    </Typography>
                  </Paper>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ height: '100%' }}>
                  <Typography variant="overline" color="text.secondary">Metadatos Cronológicos</Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      height: 'calc(100% - 24px)',
                      borderRadius: 2,
                      bgcolor: 'primary.50',
                      border: '1px dashed',
                      borderColor: 'primary.light',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" color="primary.main" sx={{ fontWeight: 800 }}>
                        {new Date(selectedEvent.created_at).getDate()}
                      </Typography>
                      <Typography variant="h6" color="primary.dark" sx={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                        {new Date(selectedEvent.created_at).toLocaleString('default', { month: 'long' })}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {new Date(selectedEvent.created_at).getFullYear()}
                      </Typography>
                      <Divider sx={{ my: 2, borderColor: 'primary.light', opacity: 0.3 }} />
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {new Date(selectedEvent.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </Grid>

              {(selectedEvent.changes || selectedEvent.original) && (
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="overline" color="text.secondary">Payload de Datos</Typography>
                    <Grid container spacing={2}>
                      {selectedEvent.changes && (
                        <Grid item xs={12} md={selectedEvent.original ? 6 : 12}>
                          <Typography variant="caption" sx={{ ml: 1, fontWeight: 600, color: 'success.main' }}>
                            {selectedEvent.name === 'View' ? 'Data Context' : 'Nuevos Cambios'}
                          </Typography>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: '#1e293b',
                              color: '#fff',
                              maxHeight: 300,
                              overflow: 'auto'
                            }}
                          >
                            <pre style={{ margin: 0, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                              {JSON.stringify(JSON.parse(selectedEvent.changes), null, 2)}
                            </pre>
                          </Paper>
                        </Grid>
                      )}
                      {selectedEvent.original && (
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" sx={{ ml: 1, fontWeight: 600, color: 'error.main' }}>
                            Estado Anterior
                          </Typography>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: '#334155',
                              color: '#cbd5e1',
                              maxHeight: 300,
                              overflow: 'auto',
                              opacity: 0.9
                            }}
                          >
                            <pre style={{ margin: 0, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                              {JSON.stringify(JSON.parse(selectedEvent.original), null, 2)}
                            </pre>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5, bgcolor: '#fcfcfc' }}>
          <Button
            onClick={() => setSelectedEvent(null)}
            variant="contained"
            disableElevation
            sx={{ borderRadius: 2, px: 4 }}
          >
            Cerrar Vista
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuditTable;
