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
} from '@mui/material';
import { Edit, Delete, Visibility, Face } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../../hooks/usePermissions';
import { useAuth } from '../../../hooks/useAuth';
import { useState } from 'react';

const UserTable = ({ users, onEdit, onDelete, loading }) => {
  const navigate = useNavigate();
  const { hasPermission, canImpersonateUser } = usePermissions();
  const { user: currentUser, startImpersonation, isImpersonating: globalIsImpersonating } = useAuth();
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


  const handleImpersonate = async (userId) => {
    try {
      setImpersonating(userId);
      await startImpersonation(userId);
      // La navegación se manejará automáticamente por el contexto
    } catch (error) {
      console.error('Error impersonating user:', error);
      alert(error.response?.data?.message || 'Error al personificar usuario');
    } finally {
      setImpersonating(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography color="text.secondary">No hay usuarios registrados</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
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
                      color="secondary"
                      onClick={() => handleImpersonate(user.id)}
                      size="small"
                      disabled={impersonating === user.id}
                    >
                      <Face />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Ver perfil">
                  <IconButton
                    color="info"
                    onClick={() => navigate(`/users/${user.id}`)}
                    size="small"
                  >
                    <Visibility />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar">
                  <IconButton
                    color="primary"
                    onClick={() => onEdit(user)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton
                    color="error"
                    onClick={() => onDelete(user.id)}
                    size="small"
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
  );
};

export default UserTable;
