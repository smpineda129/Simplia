import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  TablePagination,
  Tooltip,
} from '@mui/material';
import { Edit, Delete, Visibility, Mail } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CorrespondenceTable = ({ correspondences, onEdit, onDelete, page, onPageChange, pagination }) => {
  const navigate = useNavigate();

  if (!correspondences || correspondences.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Mail sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <p>No hay correspondencias registradas</p>
      </Paper>
    );
  }

  const handleChangePage = (event, newPage) => {
    onPageChange(newPage + 1);
  };

  const getStatusColor = (status) => {
    const colors = {
      registered: 'warning',
      assigned: 'info',
      closed: 'success',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      registered: 'Registrada',
      assigned: 'Asignada',
      closed: 'Cerrada',
    };
    return labels[status] || status;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES');
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Radicado</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Destinatario</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Asignado a</TableCell>
              <TableCell>Hilos</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {correspondences.map((correspondence) => (
              <TableRow key={correspondence.id} hover>
                <TableCell>
                  <Box>
                    <Chip 
                      label={correspondence.incomingRadicado} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    {correspondence.outgoingRadicado && (
                      <Chip 
                        label={correspondence.outgoingRadicado} 
                        size="small" 
                        color="success" 
                        variant="outlined"
                        sx={{ ml: 0.5 }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <strong>{correspondence.title}</strong>
                </TableCell>
                <TableCell>
                  <Box>
                    <div>{correspondence.recipientName}</div>
                    <small style={{ color: 'gray' }}>{correspondence.recipientEmail}</small>
                  </Box>
                </TableCell>
                <TableCell>
                  {correspondence.correspondenceType?.name || '-'}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getStatusLabel(correspondence.status)} 
                    size="small" 
                    color={getStatusColor(correspondence.status)}
                  />
                </TableCell>
                <TableCell>
                  {correspondence.assignedUser ? (
                    <Box>
                      <div>{correspondence.assignedUser.name}</div>
                      <small style={{ color: 'gray' }}>{correspondence.assignedUser.email}</small>
                    </Box>
                  ) : (
                    <Chip label="Sin asignar" size="small" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={correspondence._count?.threads || 0} 
                    size="small" 
                    color={correspondence._count?.threads > 0 ? 'primary' : 'default'}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Ver detalle">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/correspondences/${correspondence.id}`)}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEdit(correspondence)}
                      disabled={correspondence.status === 'closed'}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(correspondence.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total || 0}
          page={(page || 1) - 1}
          onPageChange={handleChangePage}
          rowsPerPage={pagination.limit || 10}
          rowsPerPageOptions={[10]}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      )}
    </Paper>
  );
};

export default CorrespondenceTable;
