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
  Typography,
  Tooltip,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
} from '@mui/material';
import { Edit, Delete, Visibility, Face, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../../hooks/usePermissions';
import { useAuth } from '../../../hooks/useAuth';
import { useState } from 'react';
import TableSkeleton from '../../../components/TableSkeleton';

const ROLE_OPTIONS = [
  { value: '', label: 'Todos los roles' },
  { value: 'Owner', label: 'Owner' },
  { value: 'CompanyAdmin', label: 'Administrador' },
  { value: 'User', label: 'Usuario' },
];

const UserTable = ({
  users, onEdit, onDelete, loading, canEdit, canDelete,
  search, onSearchChange, roleFilter, onRoleFilterChange,
  pagination, page, onPageChange,
}) => {
  const navigate = useNavigate();
  const { canImpersonateUser } = usePermissions();
  const { startImpersonation } = useAuth();
  const [impersonating, setImpersonating] = useState(null);

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'MANAGER':
        return 'warning';
      default:
        return 'default';
    }
  };


  const handleImpersonate = async (userEmail) => {
    try {
      setImpersonating(userEmail);
      await startImpersonation(userEmail);
    } catch (error) {
      console.error('Error impersonating user:', error);
      alert(error.response?.data?.message || 'Error al personificar usuario');
    } finally {
      setImpersonating(null);
    }
  };

  if (loading) {
    return <TableSkeleton rows={5} columns={5} />;
  }

  return (
    <Paper>
      {/* Filtros */}
      <Box sx={{ display: 'flex', gap: 2, p: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 260 }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Rol</InputLabel>
          <Select
            value={roleFilter}
            label="Rol"
            onChange={(e) => onRoleFilterChange(e.target.value)}
          >
            {ROLE_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {!users || users.length === 0 ? (
        <Box display="flex" justifyContent="center" p={4}>
          <Typography color="text.secondary">No hay usuarios registrados</Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Fecha de Creación</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className='max-w-[10vw]'>
                    <Chip
                      label={user.role}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell align="right">
                    {canImpersonateUser(user) && (
                      <Tooltip title="Personificar usuario">
                        <IconButton
                          aria-label="Personificar usuario"
                          color="secondary"
                          onClick={() => handleImpersonate(user.email)}
                          size="small"
                          disabled={impersonating === user.email}
                        >
                          <Face />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Ver perfil">
                      <IconButton
                        aria-label="Ver perfil"
                        color="info"
                        onClick={() => navigate(`/users/${user.id}`)}
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    {canEdit && (
                      <Tooltip title="Editar">
                        <IconButton
                          aria-label="Editar usuario"
                          color="primary"
                          onClick={() => onEdit(user)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}
                    {canDelete && (
                      <Tooltip title="Eliminar">
                        <IconButton
                          aria-label="Eliminar usuario"
                          color="error"
                          onClick={() => onDelete(user.id)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total || 0}
          page={(page || 1) - 1}
          onPageChange={(_, newPage) => onPageChange(newPage + 1)}
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

export default UserTable;
