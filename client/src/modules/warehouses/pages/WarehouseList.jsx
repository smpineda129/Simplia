import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Alert,
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add, Search, Warehouse as WarehouseIcon } from '@mui/icons-material';
import warehouseService from '../services/warehouseService';
import { companyService } from '../../companies';
import WarehouseModalForm from '../components/WarehouseModalForm';
import LoadingLogo from '../../../components/LoadingLogo';

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    loadWarehouses();
  }, [page, search, selectedCompany]);

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
      const response = await warehouseService.getAll({
        search,
        companyId: selectedCompany,
        page,
        limit: 10,
      });
      setWarehouses(response.data);
    } catch (error) {
      showSnackbar('Error al cargar bodegas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const handleCreate = () => {
    setSelectedWarehouse(null);
    setOpenModal(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedWarehouse) {
        await warehouseService.update(selectedWarehouse.id, data);
        showSnackbar('Bodega actualizada exitosamente', 'success');
      } else {
        await warehouseService.create(data);
        showSnackbar('Bodega creada exitosamente', 'success');
      }
      setOpenModal(false);
      loadWarehouses();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al guardar bodega', 'error');
      throw error;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Bodegas de Archivo</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Nueva Bodega
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Buscar bodegas..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Empresa</InputLabel>
            <Select
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setPage(1);
              }}
              label="Empresa"
            >
              <MenuItem value="">Todas</MenuItem>
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <LoadingLogo size={120} />
        </Box>
      ) : warehouses.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <WarehouseIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography>No hay bodegas registradas</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {warehouses.map((warehouse) => (
            <Grid item xs={12} sm={6} md={4} key={warehouse.id}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WarehouseIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">{warehouse.name}</Typography>
                </Box>
                <Chip 
                  label={warehouse.code} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                {warehouse.address && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    📍 {warehouse.address}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="caption">
                    {warehouse.company?.name}
                  </Typography>
                  <Chip 
                    label={`${warehouse._count?.boxes || 0} cajas`} 
                    size="small" 
                    color="info"
                  />
                </Box>
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

export default WarehouseList;
