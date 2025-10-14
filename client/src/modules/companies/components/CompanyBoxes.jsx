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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add, Edit, Delete, Inventory } from '@mui/icons-material';
import boxService from '../../warehouses/services/boxService';
import { warehouseService } from '../../warehouses';
import BoxModalForm from '../../warehouses/components/BoxModalForm';

const CompanyBoxes = ({ companyId }) => {
  const [boxes, setBoxes] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadWarehouses();
  }, [companyId]);

  useEffect(() => {
    loadBoxes();
  }, [companyId, selectedWarehouse]);

  const loadWarehouses = async () => {
    try {
      const response = await warehouseService.getAll({ companyId, limit: 100 });
      setWarehouses(response.data);
    } catch (error) {
      console.error('Error al cargar bodegas:', error);
    }
  };

  const loadBoxes = async () => {
    try {
      setLoading(true);
      const response = await boxService.getAll({ 
        companyId, 
        warehouseId: selectedWarehouse,
        limit: 100 
      });
      setBoxes(response.data);
    } catch (error) {
      showSnackbar('Error al cargar cajas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedBox(null);
    setOpenModal(true);
  };

  const handleEdit = (box) => {
    setSelectedBox(box);
    setOpenModal(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedBox) {
        await boxService.update(selectedBox.id, data);
        showSnackbar('Caja actualizada exitosamente', 'success');
      } else {
        await boxService.create({ ...data, companyId: parseInt(companyId) });
        showSnackbar('Caja creada exitosamente', 'success');
      }
      setOpenModal(false);
      loadBoxes();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al guardar caja', 'error');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta caja?')) {
      try {
        await boxService.delete(id);
        showSnackbar('Caja eliminada exitosamente', 'success');
        loadBoxes();
      } catch (error) {
        showSnackbar('Error al eliminar caja', 'error');
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
        <Typography variant="h6">Cajas de Archivo</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filtrar por Bodega</InputLabel>
            <Select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              label="Filtrar por Bodega"
            >
              <MenuItem value="">Todas las bodegas</MenuItem>
              {warehouses.map((warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
            Nueva Caja
          </Button>
        </Box>
      </Box>

      {boxes.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Inventory sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography>No hay cajas registradas</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {boxes.map((box) => (
            <Grid item xs={12} sm={6} md={4} key={box.id}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Inventory color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">{box.code}</Typography>
                  </Box>
                  <Box>
                    <IconButton size="small" onClick={() => handleEdit(box)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(box.id)} color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  📦 {box.warehouse?.name}
                </Typography>

                {(box.island || box.shelf || box.level) && (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {box.island && (
                      <Chip label={`Isla: ${box.island}`} size="small" variant="outlined" />
                    )}
                    {box.shelf && (
                      <Chip label={`Est: ${box.shelf}`} size="small" variant="outlined" />
                    )}
                    {box.level && (
                      <Chip label={`Nivel: ${box.level}`} size="small" variant="outlined" />
                    )}
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <BoxModalForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        box={selectedBox}
        warehouses={warehouses}
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

export default CompanyBoxes;
