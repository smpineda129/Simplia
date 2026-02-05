import { useState, useEffect } from 'react';
import {
  Box, Button, TextField, InputAdornment, CircularProgress, Alert, Snackbar, Typography, Paper,
} from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import roleService from '../services/roleService';
import RoleTable from '../components/RoleTable';
import RoleModalForm from '../components/RoleModalForm';
import { usePermissions } from '../../../hooks/usePermissions';

const RoleList = () => {
  const { hasPermission } = usePermissions();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadRoles();
  }, [page, search]);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const result = await roleService.getAll({ page, search, limit: 10 });
      setRoles(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error loading roles:', error);
      showSnackbar('Error al cargar roles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setOpenModal(true);
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setOpenModal(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedRole) {
        await roleService.update(selectedRole.id, data);
        showSnackbar('Rol actualizado exitosamente');
      } else {
        await roleService.create(data);
        showSnackbar('Rol creado exitosamente');
      }
      setOpenModal(false);
      loadRoles();
    } catch (error) {
      console.error('Error saving role:', error);
      showSnackbar(error.response?.data?.error || 'Error al guardar rol', 'error');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este rol?')) return;

    try {
      await roleService.delete(id);
      showSnackbar('Rol eliminado exitosamente');
      loadRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      showSnackbar(error.response?.data?.error || 'Error al eliminar rol', 'error');
    }
  };

  const handleViewPermissions = (role) => {
    setSelectedRole(role);
    setOpenModal(true);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Roles
        </Typography>
        {hasPermission('role.create') && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
          >
            Crear Rol
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar..."
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <RoleTable
          roles={roles}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewPermissions={handleViewPermissions}
          page={page}
          onPageChange={handlePageChange}
          pagination={pagination}
          canEdit={hasPermission('role.update')}
          canDelete={hasPermission('role.delete')}
        />
      )}

      <RoleModalForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        role={selectedRole}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RoleList;
