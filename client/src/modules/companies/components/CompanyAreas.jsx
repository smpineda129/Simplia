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
  Chip,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete, AccountTree } from '@mui/icons-material';
import { areaService } from '../../areas';
import AreaModalForm from '../../areas/components/AreaModalForm';
import { companyService } from '../index';

const CompanyAreas = ({ companyId }) => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    loadAreas();
    loadCompanies();
  }, [companyId]);

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
      const response = await areaService.getAll({ companyId, limit: 100 });
      setAreas(response.data);
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

  const handleSave = async (data) => {
    try {
      if (selectedArea) {
        await areaService.update(selectedArea.id, data);
        showSnackbar('Área actualizada exitosamente', 'success');
      } else {
        await areaService.create({ ...data, companyId: parseInt(companyId) });
        showSnackbar('Área creada exitosamente', 'success');
      }
      setOpenModal(false);
      loadAreas();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al guardar área', 'error');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta área?')) {
      try {
        await areaService.delete(id);
        showSnackbar('Área eliminada exitosamente', 'success');
        loadAreas();
      } catch (error) {
        showSnackbar('Error al eliminar área', 'error');
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
        <Typography variant="h6">Áreas de la Empresa</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Nueva Área
        </Button>
      </Box>

      {areas.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <AccountTree sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography>No hay áreas registradas</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {areas.map((area) => (
            <Grid item xs={12} sm={6} md={4} key={area.id}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <AccountTree color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">{area.name}</Typography>
                  </Box>
                  <Box>
                    <IconButton size="small" onClick={() => handleEdit(area)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(area.id)} color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                {area.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {area.description}
                  </Typography>
                )}
                <Chip
                  label={`${area._count?.users || 0} usuarios`}
                  size="small"
                  color="info"
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <AreaModalForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        area={selectedArea}
        companies={companies}
        preselectedCompanyId={companyId}
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

export default CompanyAreas;
