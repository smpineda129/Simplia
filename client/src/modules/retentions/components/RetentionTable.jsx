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
import { Edit, Delete, Description, ViewList, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const RetentionTable = ({ retentions, onEdit, onDelete, page, onPageChange, pagination }) => {
  const navigate = useNavigate();

  if (!retentions || retentions.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Description sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <p>No hay tablas de retención registradas</p>
      </Paper>
    );
  }

  const handleChangePage = (event, newPage) => {
    onPageChange(newPage + 1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Empresa</TableCell>
              <TableCell>Área</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell align="center">Líneas</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {retentions.map((retention) => (
              <TableRow key={retention.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Description color="primary" />
                    <strong>{retention.name}</strong>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={retention.code} size="small" color="primary" variant="outlined" />
                </TableCell>
                <TableCell>
                  {retention.company ? (
                    <Box>
                      <div>{retention.company.name}</div>
                      <small style={{ color: 'gray' }}>{retention.company.short}</small>
                    </Box>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {retention.area ? (
                    <Chip label={retention.area.name} size="small" />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{formatDate(retention.date)}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Líneas de retención">
                    <Chip
                      icon={<ViewList />}
                      label={retention._count?.retentionLines || 0}
                      size="small"
                      color="secondary"
                    />
                  </Tooltip>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Ver Detalle">
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() => navigate(`/retentions/${retention.id}`)}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEdit(retention)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(retention.id)}
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

export default RetentionTable;
