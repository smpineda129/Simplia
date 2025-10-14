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
import CorrespondenceTypeTable from '../components/CorrespondenceTypeTable';
import CorrespondenceTypeModalForm from '../components/CorrespondenceTypeModalForm';
import correspondenceTypeService from '../services/correspondenceTypeService';
import { companyService } from '../../companies';
import { areaService } from '../../areas';

const CorrespondenceTypeList = () => {
  const [types, setTypes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      loadAreas(selectedCompany);
    } else {
      setAreas([]);
    }
  }, [selectedCompany]);

  useEffect(() => {
    loadTypes();
  }, [page, search, selectedCompany]);

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

  const loadTypes = async () => {
    try {
      setLoading(true);
      const response = await correspondenceTypeService.getAll({
        search,
        companyId: selectedCompany,
        page,
        limit: 10,
      });
      setTypes(response.data);
      setPagination(response.pagination);
    } catch (error) {
      showSnackbar('Error al cargar tipos de correspondencia', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedType(null);
    setOpenModal(true);
  };

  const handleEdit = (type) => {
    setSelectedType(type);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este tipo de correspondencia?')) {
      try {
        await correspondenceTypeService.delete(id);
        showSnackbar('Tipo de correspondencia eliminado exitosamente', 'success');
        loadTypes();
      } catch (error) {
        showSnackbar('Error al eliminar tipo de correspondencia', 'error');
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedType) {
        await correspondenceTypeService.update(selectedType.id, data);
        showSnackbar('Tipo de correspondencia actualizado exitosamente', 'success');
      } else {
        await correspondenceTypeService.create(data);
        showSnackbar('Tipo de correspondencia creado exitosamente', 'success');
      }
      setOpenModal(false);
      loadTypes();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al guardar tipo de correspondencia', 'error');
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
        <Typography variant="h4">Tipos de Correspondencia</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Nuevo Tipo
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Buscar por nombre o descripción..."
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
          <CircularProgress />
        </Box>
      ) : (
        <CorrespondenceTypeTable
          types={types}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          onPageChange={setPage}
          pagination={pagination}
        />
      )}

      <CorrespondenceTypeModalForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        type={selectedType}
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

export default CorrespondenceTypeList;
