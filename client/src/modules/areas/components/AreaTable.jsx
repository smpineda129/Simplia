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
import { Edit, Delete, AccountTree, People } from '@mui/icons-material';

const AreaTable = ({ areas, onEdit, onDelete, page, onPageChange, pagination }) => {
  if (!areas || areas.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <AccountTree sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <p>No hay áreas registradas</p>
      </Paper>
    );
  }

  const handleChangePage = (event, newPage) => {
    onPageChange(newPage + 1);
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
              <TableCell align="center">Usuarios Asignados</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {areas.map((area) => (
              <TableRow key={area.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountTree color="primary" />
                    <strong>{area.name}</strong>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={area.code} size="small" color="primary" variant="outlined" />
                </TableCell>
                <TableCell>
                  {area.company ? (
                    <Box>
                      <div>{area.company.name}</div>
                      <small style={{ color: 'gray' }}>{area.company.short}</small>
                    </Box>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Usuarios asignados">
                    <Chip
                      icon={<People />}
                      label={area._count?.areaUsers || 0}
                      size="small"
                      color="secondary"
                    />
                  </Tooltip>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEdit(area)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(area.id)}
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

export default AreaTable;
