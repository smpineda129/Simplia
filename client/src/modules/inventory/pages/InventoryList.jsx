import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Snackbar,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import InventoryTable from '../components/InventoryTable';
import InventoryModalForm from '../components/InventoryModalForm';
import inventoryService from '../services/inventoryService';

const InventoryList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async (search = '') => {
    try {
      setLoading(true);
      const params = search ? { search } : {};
      const response = await inventoryService.getAll(params);
      setItems(response.data);
    } catch (error) {
      showSnackbar('Error al cargar items', 'error');
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenModal = (item = null) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setOpenModal(false);
  };

  const handleSubmit = async (values) => {
    try {
      if (selectedItem) {
        await inventoryService.update(selectedItem.id, values);
        showSnackbar('Item actualizado exitosamente');
      } else {
        await inventoryService.create(values);
        showSnackbar('Item creado exitosamente');
      }
      loadItems();
      handleCloseModal();
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
      return;
    }

    try {
      await inventoryService.delete(id);
      showSnackbar('Item eliminado exitosamente');
      loadItems();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 'Error al eliminar item',
        'error'
      );
      console.error('Error deleting item:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadItems(searchTerm);
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
          Inventario
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
        >
          Nuevo Item
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </form>
      </Box>

      <Paper sx={{ p: 0 }}>
        <InventoryTable
          items={items}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          loading={loading}
        />
      </Paper>

      <InventoryModalForm
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialValues={selectedItem}
        isEditing={!!selectedItem}
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

export default InventoryList;
