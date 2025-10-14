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
import TemplateTable from '../components/TemplateTable';
import TemplateModalForm from '../components/TemplateModalForm';
import templateService from '../services/templateService';
import { companyService } from '../../companies';

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [helpers, setHelpers] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadCompanies();
    loadHelpers();
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [page, search, selectedCompany]);

  const loadCompanies = async () => {
    try {
      const response = await companyService.getAll({ limit: 100 });
      setCompanies(response.data);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
    }
  };

  const loadHelpers = async () => {
    try {
      const response = await templateService.getHelpers();
      setHelpers(response.data);
    } catch (error) {
      console.error('Error al cargar helpers:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await templateService.getAll({
        search,
        companyId: selectedCompany,
        page,
        limit: 10,
      });
      setTemplates(response.data);
      setPagination(response.pagination);
    } catch (error) {
      showSnackbar('Error al cargar plantillas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedTemplate(null);
    setOpenModal(true);
  };

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta plantilla?')) {
      try {
        await templateService.delete(id);
        showSnackbar('Plantilla eliminada exitosamente', 'success');
        loadTemplates();
      } catch (error) {
        showSnackbar('Error al eliminar plantilla', 'error');
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedTemplate) {
        await templateService.update(selectedTemplate.id, data);
        showSnackbar('Plantilla actualizada exitosamente', 'success');
      } else {
        await templateService.create(data);
        showSnackbar('Plantilla creada exitosamente', 'success');
      }
      setOpenModal(false);
      loadTemplates();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al guardar plantilla', 'error');
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
        <Typography variant="h4">Plantillas</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Nueva Plantilla
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Buscar por título o descripción..."
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
        <TemplateTable
          templates={templates}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          onPageChange={setPage}
          pagination={pagination}
        />
      )}

      <TemplateModalForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        template={selectedTemplate}
        companies={companies}
        helpers={helpers}
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

export default TemplateList;
