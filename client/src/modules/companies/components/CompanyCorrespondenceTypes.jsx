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
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete, Mail } from '@mui/icons-material';
import { correspondenceTypeService } from '../../correspondence-types';
import CorrespondenceTypeModalForm from '../../correspondence-types/components/CorrespondenceTypeModalForm';
import { companyService } from '../index';

const CompanyCorrespondenceTypes = ({ companyId }) => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    loadTypes();
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

  const loadTypes = async () => {
    try {
      setLoading(true);
      const response = await correspondenceTypeService.getAll({ companyId, limit: 100 });
      setTypes(response.data);
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

  const handleSave = async (data) => {
    try {
      if (selectedType) {
        await correspondenceTypeService.update(selectedType.id, data);
        showSnackbar('Tipo actualizado exitosamente', 'success');
      } else {
        await correspondenceTypeService.create({ ...data, companyId: parseInt(companyId) });
        showSnackbar('Tipo creado exitosamente', 'success');
      }
      setOpenModal(false);
      loadTypes();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al guardar tipo', 'error');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este tipo de correspondencia?')) {
      try {
        await correspondenceTypeService.delete(id);
        showSnackbar('Tipo eliminado exitosamente', 'success');
        loadTypes();
      } catch (error) {
        showSnackbar('Error al eliminar tipo', 'error');
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
        <Typography variant="h6">Tipos de Correspondencia</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Nuevo Tipo
        </Button>
      </Box>

      {types.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Mail sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography>No hay tipos de correspondencia registrados</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {types.map((type) => (
            <Grid item xs={12} sm={6} md={4} key={type.id}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Mail color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">{type.name}</Typography>
                  </Box>
                  <Box>
                    <IconButton size="small" onClick={() => handleEdit(type)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(type.id)} color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                {type.description && (
                  <Typography variant="body2" color="text.secondary">
                    {type.description}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <CorrespondenceTypeModalForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        correspondenceType={selectedType}
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

export default CompanyCorrespondenceTypes;
