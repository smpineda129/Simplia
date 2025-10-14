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
import { Edit, Delete, Folder } from '@mui/icons-material';

const ProceedingTable = ({ proceedings, onEdit, onDelete, page, onPageChange, pagination }) => {
  if (!proceedings || proceedings.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Folder sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <p>No hay expedientes registrados</p>
      </Paper>
    );
  }

  const handleChangePage = (event, newPage) => {
    onPageChange(newPage + 1);
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
              <TableCell>Nombre</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Empresa</TableCell>
              <TableCell>Tabla de Retención</TableCell>
              <TableCell>Fecha Inicial</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proceedings.map((proceeding) => (
              <TableRow key={proceeding.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Folder color="primary" />
                    <strong>{proceeding.name}</strong>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={proceeding.code} size="small" color="primary" variant="outlined" />
                </TableCell>
                <TableCell>
                  {proceeding.company ? (
                    <Box>
                      <div>{proceeding.company.name}</div>
                      <small style={{ color: 'gray' }}>{proceeding.company.short}</small>
                    </Box>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {proceeding.retention ? (
                    <Box>
                      <div>{proceeding.retention.name}</div>
                      <small style={{ color: 'gray' }}>{proceeding.retention.code}</small>
                    </Box>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{formatDate(proceeding.startDate)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEdit(proceeding)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(proceeding.id)}
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

export default ProceedingTable;
