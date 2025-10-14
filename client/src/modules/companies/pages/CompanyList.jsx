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
} from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import CompanyTable from '../components/CompanyTable';
import CompanyModalForm from '../components/CompanyModalForm';
import companyService from '../services/companyService';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadCompanies();
  }, [page, search]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyService.getAll({ search, page, limit: 10 });
      setCompanies(response.data);
      setPagination(response.pagination);
    } catch (error) {
      showSnackbar('Error al cargar empresas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCompany(null);
    setOpenModal(true);
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta empresa?')) {
      try {
        await companyService.delete(id);
        showSnackbar('Empresa eliminada exitosamente', 'success');
        loadCompanies();
      } catch (error) {
        showSnackbar('Error al eliminar empresa', 'error');
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedCompany) {
        await companyService.update(selectedCompany.id, data);
        showSnackbar('Empresa actualizada exitosamente', 'success');
      } else {
        await companyService.create(data);
        showSnackbar('Empresa creada exitosamente', 'success');
      }
      setOpenModal(false);
      loadCompanies();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al guardar empresa', 'error');
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Empresas</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Nueva Empresa
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nombre, identificador o email..."
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
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <CompanyTable
          companies={companies}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          onPageChange={setPage}
          pagination={pagination}
        />
      )}

      <CompanyModalForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        company={selectedCompany}
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

export default CompanyList;
