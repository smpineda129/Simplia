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
  Grid,
} from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import RetentionTable from '../components/RetentionTable';
import RetentionModalForm from '../components/RetentionModalForm';
import retentionService from '../services/retentionService';
import { companyService } from '../../companies';
import { areaService } from '../../areas';

const RetentionList = () => {
  const [retentions, setRetentions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedRetention, setSelectedRetention] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      loadAreas(selectedCompany);
    } else {
      setAreas([]);
      setSelectedArea('');
    }
  }, [selectedCompany]);

  useEffect(() => {
    loadRetentions();
  }, [page, search, selectedCompany, selectedArea]);

  const loadCompanies = async () => {
    try {
      const response = await companyService.getAll({ limit: 100 });
      setCompanies(response.data);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
    }
  };

  const loadAreas = async (companyId) => {
    try {
      const response = await areaService.getAll({ companyId, limit: 100 });
      setAreas(response.data);
    } catch (error) {
      console.error('Error al cargar áreas:', error);
    }
  };

  const loadRetentions = async () => {
    try {
      setLoading(true);
      const response = await retentionService.getAll({
        search,
        companyId: selectedCompany,
        areaId: selectedArea,
        page,
        limit: 10,
      });
      setRetentions(response.data);
      setPagination(response.pagination);
    } catch (error) {
      showSnackbar('Error al cargar tablas de retención', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedRetention(null);
    setOpenModal(true);
  };

  const handleEdit = (retention) => {
    setSelectedRetention(retention);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta tabla de retención?')) {
      try {
        await retentionService.delete(id);
        showSnackbar('Tabla de retención eliminada exitosamente', 'success');
        loadRetentions();
      } catch (error) {
        showSnackbar('Error al eliminar tabla de retención', 'error');
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedRetention) {
        await retentionService.update(selectedRetention.id, data);
        showSnackbar('Tabla de retención actualizada exitosamente', 'success');
      } else {
        await retentionService.create(data);
        showSnackbar('Tabla de retención creada exitosamente', 'success');
      }
      setOpenModal(false);
      loadRetentions();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al guardar tabla de retención', 'error');
      throw error;
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Tablas de Retención</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Nueva Tabla de Retención
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Buscar por nombre o código..."
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
        <Grid item xs={12} md={3}>
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
        <Grid item xs={12} md={3}>
          <FormControl fullWidth disabled={!selectedCompany}>
            <InputLabel>Área</InputLabel>
            <Select
              value={selectedArea}
              onChange={(e) => {
                setSelectedArea(e.target.value);
                setPage(1);
              }}
              label="Área"
            >
              <MenuItem value="">Todas</MenuItem>
              {areas.map((area) => (
                <MenuItem key={area.id} value={area.id}>
                  {area.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <RetentionTable
          retentions={retentions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          onPageChange={setPage}
          pagination={pagination}
        />
      )}

      <RetentionModalForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        retention={selectedRetention}
        companies={companies}
        areas={areas}
        onCompanyChange={loadAreas}
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

export default RetentionList;
