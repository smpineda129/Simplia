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
import ProceedingTable from '../components/ProceedingTable';
import ProceedingModalForm from '../components/ProceedingModalForm';
import proceedingService from '../services/proceedingService';
import { usePermissions } from '../../../hooks/usePermissions';
import { companyService } from '../../companies';
import { retentionService } from '../../retentions';

const ProceedingList = () => {
  const { hasPermission } = usePermissions();
  const [proceedings, setProceedings] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [retentions, setRetentions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedProceeding, setSelectedProceeding] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      loadRetentions(selectedCompany);
    } else {
      setRetentions([]);
    }
  }, [selectedCompany]);

  useEffect(() => {
    loadProceedings();
  }, [page, search, selectedCompany]);

  const loadCompanies = async () => {
    try {
      const response = await companyService.getAll({ limit: 100 });
      setCompanies(response.data);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
    }
  };

  const loadRetentions = async (companyId) => {
    try {
      const response = await retentionService.getAll({ companyId, limit: 100 });
      setRetentions(response.data);
    } catch (error) {
      console.error('Error al cargar retenciones:', error);
    }
  };

  const loadProceedings = async () => {
    try {
      setLoading(true);
      const response = await proceedingService.getAll({
        search,
        companyId: selectedCompany,
        page,
        limit: 10,
      });
      setProceedings(response.data);
      setPagination(response.pagination);
    } catch (error) {
      showSnackbar('Error al cargar expedientes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedProceeding(null);
    setOpenModal(true);
  };

  const handleEdit = (proceeding) => {
    setSelectedProceeding(proceeding);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este expediente?')) {
      try {
        await proceedingService.delete(id);
        showSnackbar('Expediente eliminado exitosamente', 'success');
        loadProceedings();
      } catch (error) {
        showSnackbar('Error al eliminar expediente', 'error');
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedProceeding) {
        await proceedingService.update(selectedProceeding.id, data);
        showSnackbar('Expediente actualizado exitosamente', 'success');
      } else {
        await proceedingService.create(data);
        showSnackbar('Expediente creado exitosamente', 'success');
      }
      setOpenModal(false);
      loadProceedings();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al guardar expediente', 'error');
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
        <Typography variant="h4">Expedientes</Typography>
        {hasPermission('proceeding.create') && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
          >
            Nuevo Expediente
          </Button>
        )}
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
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
        <ProceedingTable
          proceedings={proceedings}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          onPageChange={setPage}
          pagination={pagination}
          canView={hasPermission('proceeding.view')}
          canEdit={hasPermission('proceeding.update')}
          canDelete={hasPermission('proceeding.delete')}
        />
      )}

      <ProceedingModalForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        proceeding={selectedProceeding}
        companies={companies}
        retentions={retentions}
        onCompanyChange={loadRetentions}
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

export default ProceedingList;
