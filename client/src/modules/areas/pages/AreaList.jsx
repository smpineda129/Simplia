import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import AreaTable from '../components/AreaTable';
import AreaModalForm from '../components/AreaModalForm';
import areaService from '../services/areaService';
import { companyService } from '../../companies';

const AreaList = () => {
  const [areas, setAreas] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    loadAreas();
  }, [page, search, selectedCompany]);

  const loadCompanies = async () => {
    try {
      const response = await companyService.getAll({ limit: 100 });
      setCompanies(response.data);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
    }
  };

  const loadAreas = async () => {
    try {
      setLoading(true);
      const response = await areaService.getAll({
        search,
        companyId: selectedCompany,
        page,
        limit: 10,
      });
      setAreas(response.data);
      setPagination(response.pagination);
    } catch (error) {
      showSnackbar('Error al cargar áreas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedArea(null);
    setOpenModal(true);
  };

  const handleEdit = (area) => {
    setSelectedArea(area);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta área?')) {
      try {
        await areaService.delete(id);
        showSnackbar('Área eliminada exitosamente', 'success');
        loadAreas();
      } catch (error) {
        showSnackbar('Error al eliminar área', 'error');
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedArea) {
        await areaService.update(selectedArea.id, data);
        showSnackbar('Área actualizada exitosamente', 'success');
      } else {
        await areaService.create(data);
        showSnackbar('Área creada exitosamente', 'success');
      }
      setOpenModal(false);
      loadAreas();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al guardar área', 'error');
      throw error;
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
    setPage(1);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Áreas / Departamentos</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Nueva Área
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nombre o código..."
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
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Empresa</InputLabel>
          <Select
            value={selectedCompany}
            onChange={handleCompanyChange}
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
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <AreaTable
          areas={areas}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          onPageChange={setPage}
          pagination={pagination}
        />
      )}

      <AreaModalForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        area={selectedArea}
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

export default AreaList;
