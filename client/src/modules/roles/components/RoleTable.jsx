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
                      {role.company ? (
                        <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                          {role.company.name}
                        </Box>
                      ) : (
                        <Chip label="Sistema" size="small" sx={{ mt: 0.5, height: 20, fontSize: '0.7rem', bgcolor: 'grey.100' }} />
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
                    <Tooltip title={!role.companyId ? "Los roles del sistema no se pueden editar" : "Editar"}>
                      <span>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(role)}
                          disabled={!role.companyId}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title={!role.companyId ? "Los roles del sistema no se pueden eliminar" : "Eliminar"}>
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDelete(role.id)}
                          disabled={!role.companyId}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </span>
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
