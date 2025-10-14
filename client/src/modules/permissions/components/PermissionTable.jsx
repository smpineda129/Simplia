import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Tooltip, Chip, TablePagination, Box, Stack,
} from '@mui/material';
import { Visibility, CheckCircle, Cancel } from '@mui/icons-material';

const PermissionTable = ({ permissions, page, onPageChange, pagination }) => {
  const handleChangePage = (event, newPage) => {
    onPageChange(newPage + 1);
  };

  const getRoleChipColor = (roleLevel) => {
    if (roleLevel <= 2) return 'success';
    if (roleLevel <= 4) return 'primary';
    return 'default';
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>NOMBRE</TableCell>
              <TableCell>PERMISO</TableCell>
              <TableCell align="center">ROLES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No se encontraron permisos
                </TableCell>
              </TableRow>
            ) : (
              permissions.map((permission) => (
                <TableRow key={permission.id} hover>
                  <TableCell>
                    <Box>
                      <Box sx={{ fontWeight: 500 }}>
                        {permission.name.split('.').map((part, index) => (
                          <span key={index}>
                            {index > 0 && ' › '}
                            {part}
                          </span>
                        ))}
                      </Box>
                      {permission.permissionLevel && (
                        <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', mt: 0.5 }}>
                          Nivel: {permission.permissionLevel}
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        color: 'primary.main',
                        bgcolor: 'action.hover',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        display: 'inline-block',
                      }}
                    >
                      {permission.name}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {permission.roleHasPermissions && permission.roleHasPermissions.length > 0 ? (
                      <Stack direction="row" spacing={0.5} justifyContent="center" flexWrap="wrap">
                        {permission.roleHasPermissions.slice(0, 3).map((rp) => (
                          <Chip
                            key={rp.role.id}
                            label={rp.role.name}
                            size="small"
                            color={getRoleChipColor(rp.role.roleLevel)}
                            icon={<CheckCircle />}
                            sx={{ mb: 0.5 }}
                          />
                        ))}
                        {permission.roleHasPermissions.length > 3 && (
                          <Chip
                            label={`+${permission.roleHasPermissions.length - 3}`}
                            size="small"
                            variant="outlined"
                            sx={{ mb: 0.5 }}
                          />
                        )}
                      </Stack>
                    ) : (
                      <Chip
                        label="Sin roles"
                        size="small"
                        icon={<Cancel />}
                        color="default"
                        variant="outlined"
                      />
                    )}
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
          rowsPerPageOptions={[50]}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      )}
    </Paper>
  );
};

export default PermissionTable;
