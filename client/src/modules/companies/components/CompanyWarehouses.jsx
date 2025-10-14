import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  Paper,
  Typography,
  IconButton,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { Add, Edit, Delete, Warehouse as WarehouseIcon, Inventory } from '@mui/icons-material';
import { warehouseService } from '../../warehouses';
import WarehouseModalForm from '../../warehouses/components/WarehouseModalForm';
import { companyService } from '../index';

const CompanyWarehouses = ({ companyId }) => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    loadWarehouses();
    loadCompanies();
  }, [companyId]);

  const loadCompanies = async () => {
    try {
      const response = await companyService.getAll({ limit: 100 });
      setCompanies(response.data);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
    }
  };

  const loadWarehouses = async () => {
    try {
      setLoading(true);
      const response = await warehouseService.getAll({ companyId, limit: 100 });
      setWarehouses(response.data);
    } catch (error) {
      showSnackbar('Error al cargar bodegas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedWarehouse(null);
    setOpenModal(true);
  };

  const handleEdit = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setOpenModal(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedWarehouse) {
        await warehouseService.update(selectedWarehouse.id, data);
        showSnackbar('Bodega actualizada exitosamente', 'success');
      } else {
        await warehouseService.create({ ...data, companyId: parseInt(companyId) });
        showSnackbar('Bodega creada exitosamente', 'success');
      }
      setOpenModal(false);
      loadWarehouses();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al guardar bodega', 'error');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta bodega?')) {
      try {
        await warehouseService.delete(id);
        showSnackbar('Bodega eliminada exitosamente', 'success');
        loadWarehouses();
      } catch (error) {
        showSnackbar('Error al eliminar bodega', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Bodegas de Archivo</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Nueva Bodega
        </Button>
      </Box>

      {warehouses.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <WarehouseIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography>No hay bodegas registradas</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {warehouses.map((warehouse) => (
            <Grid item xs={12} sm={6} md={4} key={warehouse.id}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <WarehouseIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">{warehouse.name}</Typography>
                  </Box>
                  <Box>
                    <IconButton size="small" onClick={() => handleEdit(warehouse)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(warehouse.id)} color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Chip
                  label={warehouse.code}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                {warehouse.address && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    📍 {warehouse.address}
                  </Typography>
                )}
                <Chip
                  label={`${warehouse._count?.boxes || 0} cajas`}
                  size="small"
                  color="info"
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <WarehouseModalForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        warehouse={selectedWarehouse}
        companies={companies}
        preselectedCompanyId={companyId}
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

export default CompanyWarehouses;
