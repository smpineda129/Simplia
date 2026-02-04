import { useState, useEffect } from 'react';
import useDebounce from '../../../hooks/useDebounce';
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
  Card,
  CardContent,
} from '@mui/material';
import { Add, Search, TrendingUp, Assignment, CheckCircle, HourglassEmpty } from '@mui/icons-material';
import CorrespondenceTable from '../components/CorrespondenceTable';
import CorrespondenceModalForm from '../components/CorrespondenceModalForm';
import correspondenceService from '../services/correspondenceService';
import { companyService } from '../../companies';
import { correspondenceTypeService } from '../../correspondence-types';

const CorrespondenceList = () => {
  const [correspondences, setCorrespondences] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [types, setTypes] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedCorrespondence, setSelectedCorrespondence] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      loadTypes(selectedCompany);
    } else {
      setTypes([]);
    }
  }, [selectedCompany]);

  useEffect(() => {
    loadCorrespondences();
  }, [page, debouncedSearch, selectedCompany, selectedStatus]);

  useEffect(() => {
    loadStats();
  }, [selectedCompany]);

  const loadCompanies = async () => {
    try {
      const response = await companyService.getAll({ limit: 100 });
      setCompanies(response.data);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
    }
  };

  const loadTypes = async (companyId) => {
    try {
      const response = await correspondenceTypeService.getAll({ companyId, limit: 100 });
      setTypes(response.data);
    } catch (error) {
      console.error('Error al cargar tipos:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await correspondenceService.getStats({ companyId: selectedCompany });
      setStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const loadCorrespondences = async () => {
    try {
      setLoading(true);
      const response = await correspondenceService.getAll({
        search: debouncedSearch,
        companyId: selectedCompany,
        status: selectedStatus,
        page,
        limit: 10,
      });
      setCorrespondences(response.data);
      setPagination(response.pagination);
    } catch (error) {
      showSnackbar('Error al cargar correspondencias', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCorrespondence(null);
    setOpenModal(true);
  };

  const handleEdit = (correspondence) => {
    setSelectedCorrespondence(correspondence);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta correspondencia?')) {
      try {
        await correspondenceService.delete(id);
        showSnackbar('Correspondencia eliminada exitosamente', 'success');
        loadCorrespondences();
        loadStats();
      } catch (error) {
        showSnackbar('Error al eliminar correspondencia', 'error');
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedCorrespondence) {
        await correspondenceService.update(selectedCorrespondence.id, data);
        showSnackbar('Correspondencia actualizada exitosamente', 'success');
      } else {
        await correspondenceService.create(data);
        showSnackbar('Correspondencia creada exitosamente', 'success');
      }
      setOpenModal(false);
      loadCorrespondences();
      loadStats();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al guardar correspondencia', 'error');
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
        <Typography variant="h4">Correspondencia</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Nueva Correspondencia
        </Button>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total
                  </Typography>
                  <Typography variant="h4">
                    {stats.total || 0}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Registradas
                  </Typography>
                  <Typography variant="h4">
                    {stats.registered || 0}
                  </Typography>
                </Box>
                <HourglassEmpty sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Asignadas
                  </Typography>
                  <Typography variant="h4">
                    {stats.assigned || 0}
                  </Typography>
                </Box>
                <Assignment sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Cerradas
                  </Typography>
                  <Typography variant="h4">
                    {stats.closed || 0}
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            placeholder="Buscar por título, radicado o destinatario..."
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
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              label="Estado"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="registered">Registradas</MenuItem>
              <MenuItem value="assigned">Asignadas</MenuItem>
              <MenuItem value="closed">Cerradas</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <CorrespondenceTable
          correspondences={correspondences}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={loadCorrespondences}
          page={page}
          onPageChange={setPage}
          pagination={pagination}
        />
      )}

      <CorrespondenceModalForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        correspondence={selectedCorrespondence}
        companies={companies}
        types={types}
        onCompanyChange={loadTypes}
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

export default CorrespondenceList;
