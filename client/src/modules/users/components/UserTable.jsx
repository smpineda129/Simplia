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
  const { hasPermission } = usePermissions();
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

  const canImpersonate = (targetUser) => {
    if (!currentUser || !targetUser) return false;
    if (globalIsImpersonating) return false; // No permitir personificar si ya se está personificando
    if (currentUser.id === targetUser.id) return false;

    // Debe tener el permiso
    if (!hasPermission('user.impersonate')) {
      return false;
    }

    // Helper para obtener el nivel más bajo (más privilegiado) de un usuario
    const getLowestLevel = (u) => {
      let levels = [];

      // 1. Revisar roles en array (objetos con roleLevel o role_level)
      if (u.roles && Array.isArray(u.roles)) {
        u.roles.forEach(r => {
          const level = typeof r === 'object' ? (r.roleLevel ?? r.role_level) : null;
          if (level !== null && level !== undefined) levels.push(level);
        });
      }

      // 2. Revisar rol directo en string
      if (u.role === 'Owner') levels.push(1);
      else if (u.role === 'ADMIN') levels.push(2);
      else if (u.role) levels.push(999);

      if (levels.length === 0) return 999;
      return Math.min(...levels);
    };

    const currentUserLevel = getLowestLevel(currentUser);
    const targetUserLevel = getLowestLevel(targetUser);

    // Un Owner (1) puede personificar a cualquiera que no sea Owner (o si tiene nivel inferior)
    if (currentUserLevel === 1 && (targetUserLevel > 1 || targetUser.role !== 'Owner')) {
      return true;
    }

    // El usuario actual debe tener un nivel estrictamente menor (más privilegiado)
    return currentUserLevel < targetUserLevel;
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
                {canImpersonate(user) && (
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
