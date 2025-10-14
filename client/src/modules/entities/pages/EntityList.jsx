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
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add, Search, Group } from '@mui/icons-material';
import entityService from '../services/entityService';
import { companyService } from '../../companies';
import EntityModalForm from '../components/EntityModalForm';

const EntityList = () => {
  const [entities, setEntities] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    loadCompanies();
    loadCategories();
  }, []);

  useEffect(() => {
    loadEntities();
  }, [page, search, selectedCompany, selectedCategory]);

  const loadCompanies = async () => {
    try {
      const response = await companyService.getAll({ limit: 100 });
      setCompanies(response.data);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await entityService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const loadEntities = async () => {
    try {
      setLoading(true);
      const response = await entityService.getAll({
        search,
        companyId: selectedCompany,
        categoryId: selectedCategory,
        page,
        limit: 10,
      });
      setEntities(response.data);
    } catch (error) {
      showSnackbar('Error al cargar entidades', 'error');
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

  const [selectedEntity, setSelectedEntity] = useState(null);

  const handleCreate = () => {
    setSelectedEntity(null);
    setOpenModal(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedEntity) {
        await entityService.update(selectedEntity.id, data);
        showSnackbar('Entidad actualizada exitosamente', 'success');
      } else {
        await entityService.create(data);
        showSnackbar('Entidad creada exitosamente', 'success');
      }
      setOpenModal(false);
      loadEntities();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al guardar entidad', 'error');
      throw error;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Entidades / Terceros</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Nueva Entidad
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Buscar entidades..."
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
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              label="Categoría"
            >
              <MenuItem value="">Todas</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
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
      ) : entities.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Group sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography>No hay entidades registradas</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {entities.map((entity) => (
            <Grid item xs={12} sm={6} md={4} key={entity.id}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Group color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">{entity.name}</Typography>
                </Box>
                <Chip 
                  label={entity.category?.name} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                {entity.email && (
                  <Typography variant="body2" color="text.secondary">
                    📧 {entity.email}
                  </Typography>
                )}
                {entity.phone && (
                  <Typography variant="body2" color="text.secondary">
                    📞 {entity.phone}
                  </Typography>
                )}
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {entity.company?.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <EntityModalForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        entity={selectedEntity}
        companies={companies}
        categories={categories}
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

export default EntityList;
