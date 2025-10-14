import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Tooltip, Chip, TablePagination, Box,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';

const RoleTable = ({ roles, onEdit, onDelete, onViewPermissions, page, onPageChange, pagination }) => {
  const handleChangePage = (event, newPage) => {
    onPageChange(newPage + 1);
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>NOMBRE</TableCell>
              <TableCell align="center">NIVEL DE ROL</TableCell>
              <TableCell align="center">PERMISOS</TableCell>
              <TableCell align="right">ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No se encontraron roles
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow key={role.id} hover>
                  <TableCell>
                    <Box>
                      <Box sx={{ fontWeight: 500 }}>{role.name}</Box>
                      {role.company && (
                        <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                          {role.company.name}
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={role.roleLevel || 'N/A'}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver permisos">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => onViewPermissions(role)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Chip
                      label={role.roleHasPermissions?.length || 0}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(role)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(role.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total}
          page={page - 1}
          onPageChange={handleChangePage}
          rowsPerPage={pagination.limit}
          rowsPerPageOptions={[10]}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      )}
    </Paper>
  );
};

export default RoleTable;
