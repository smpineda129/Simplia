import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import UserTable from '../components/UserTable';
import UserModalForm from '../components/UserModalForm';
import userService from '../services/userService';
import { usePermissions } from '../../../hooks/usePermissions';
import useDebounce from '../../../hooks/useDebounce';

const UserList = () => {
  const { hasPermission } = usePermissions();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    loadUsers();
  }, [debouncedSearch, roleFilter, page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll({ search: debouncedSearch, role: roleFilter || undefined, page, limit: 10 });
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      showSnackbar('Error al cargar usuarios', 'error');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleFilterChange = (value) => {
    setRoleFilter(value);
    setPage(1);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleOpenModal = (user = null) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setOpenModal(false);
  };

  const handleSubmit = async (values) => {
    try {
      if (selectedUser) {
        // Editar
        const updateData = { ...values };
        if (!updateData.password) {
          delete updateData.password;
        }
        await userService.update(selectedUser.id, updateData);
        setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...updateData } : u));
        showSnackbar('Usuario actualizado exitosamente');
      } else {
        // Crear
        const { sendSetPasswordEmail, ...payload } = values;
        const created = await userService.create(payload);
        if (sendSetPasswordEmail && created?.data?.id) {
          try {
            await userService.sendSetPasswordEmail(created.data.id);
            showSnackbar('Usuario creado y email de invitación enviado');
          } catch {
            showSnackbar('Usuario creado (error al enviar email de invitación)', 'warning');
          }
        } else {
          showSnackbar('Usuario creado exitosamente');
        }
        if (page !== 1) setPage(1);
        else loadUsers();
      }
      handleCloseModal();
    } catch (error) {
      throw error;
    }
  };

  const handleSendSetPasswordEmail = async (userId) => {
    try {
      await userService.sendSetPasswordEmail(userId);
      showSnackbar('Email de invitación enviado exitosamente');
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al enviar email', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    try {
      await userService.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      setPagination(prev => prev ? { ...prev, total: (prev.total || 1) - 1 } : prev);
      showSnackbar('Usuario eliminado exitosamente');
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 'Error al eliminar usuario',
        'error'
      );
      console.error('Error deleting user:', error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Usuarios
        </Typography>
        {hasPermission('user.create') && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenModal()}
          >
            Nuevo Usuario
          </Button>
        )}
      </Box>

      <UserTable
        users={users}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        onSendSetPasswordEmail={handleSendSetPasswordEmail}
        loading={loading}
        canEdit={hasPermission('user.update')}
        canDelete={hasPermission('user.delete')}
        search={search}
        onSearchChange={handleSearchChange}
        roleFilter={roleFilter}
        onRoleFilterChange={handleRoleFilterChange}
        pagination={pagination}
        page={page}
        onPageChange={setPage}
      />

      <UserModalForm
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialValues={selectedUser}
        isEditing={!!selectedUser}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserList;
