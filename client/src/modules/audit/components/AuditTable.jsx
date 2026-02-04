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
} from '@mui/material';
import { Visibility, Description, Download } from '@mui/icons-material';
import auditService from '../audit.service';
import LoadingSpinner from '../../../../components/LoadingSpinner';

const AuditTable = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getActionColor = (name) => {
    if (name.includes('Create')) return 'success';
    if (name.includes('Update')) return 'warning';
    if (name.includes('Delete')) return 'error';
    if (name.includes('View')) return 'info';
    return 'default';
  };

  const formatModelName = (modelType) => {
    return modelType.replace('App\\Models\\', '');
  };

  if (loading && events.length === 0) {
    return <LoadingSpinner message="Cargando historial..." />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Historial de Actividades</Typography>
        <Box>
          <Tooltip title="Exportar Excel">
            <IconButton onClick={() => window.open(`/api/audit/export/excel?user_id=${userId}`)}>
              <Download color="success" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell>Fecha</TableCell>
              <TableCell>Acción</TableCell>
              <TableCell>Entidad</TableCell>
              <TableCell>ID Entidad</TableCell>
              <TableCell>IP</TableCell>
              <TableCell align="right">Detalle</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.length > 0 ? (
              events.map((event) => (
                <TableRow key={event.id} hover>
                  <TableCell>
                    {new Date(event.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={event.name}
                      color={getActionColor(event.name)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{formatModelName(event.model_type)}</TableCell>
                  <TableCell>#{event.model_id}</TableCell>
                  <TableCell>
                    <Typography variant="caption">{event.ipAddress}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Ver detalles">
                      <IconButton size="small" onClick={() => setSelectedEvent(event)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" sx={{ py: 3, color: 'text.secondary' }}>
                    No hay registros de actividad
                  </Typography>
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
      />

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalle del Evento #{selectedEvent?.id}
        </DialogTitle>
        <DialogContent dividers>
          {selectedEvent && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Fecha</Typography>
                <Typography variant="body2">{new Date(selectedEvent.created_at).toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">IP / Agente</Typography>
                <Typography variant="body2">{selectedEvent.ipAddress}</Typography>
                <Typography variant="caption" color="text.secondary">{selectedEvent.userAgent}</Typography>
              </Grid>

              {selectedEvent.changes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>Cambios (JSON)</Typography>
                  <Paper variant="outlined" sx={{ p: 1, bgcolor: 'grey.50', maxHeight: 200, overflow: 'auto' }}>
                    <pre style={{ margin: 0, fontSize: '0.8rem' }}>
                      {JSON.stringify(JSON.parse(selectedEvent.changes), null, 2)}
                    </pre>
                  </Paper>
                </Grid>
              )}

              {selectedEvent.original && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>Original (JSON)</Typography>
                  <Paper variant="outlined" sx={{ p: 1, bgcolor: 'grey.50', maxHeight: 200, overflow: 'auto' }}>
                    <pre style={{ margin: 0, fontSize: '0.8rem' }}>
                      {JSON.stringify(JSON.parse(selectedEvent.original), null, 2)}
                    </pre>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedEvent(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuditTable;
