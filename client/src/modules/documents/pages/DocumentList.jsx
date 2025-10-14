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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add, Search, InsertDriveFile } from '@mui/icons-material';
import documentService from '../services/documentService';
import { companyService } from '../../companies';
import { proceedingService } from '../../proceedings';
import DocumentModalForm from '../components/DocumentModalForm';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [proceedings, setProceedings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openModal, setOpenModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [page, search, selectedCompany]);

  const loadCompanies = async () => {
    try {
      const response = await companyService.getAll({ limit: 100 });
      setCompanies(response.data);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
    }
  };

  const loadProceedings = async (companyId) => {
    try {
      const response = await proceedingService.getAll({ companyId, limit: 100 });
      setProceedings(response.data);
    } catch (error) {
      console.error('Error al cargar expedientes:', error);
    }
  };

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentService.getAll({
        search,
        companyId: selectedCompany,
        page,
        limit: 10,
      });
      setDocuments(response.data);
    } catch (error) {
      showSnackbar('Error al cargar documentos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedDocument(null);
    setOpenModal(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedDocument) {
        await documentService.update(selectedDocument.id, data);
        showSnackbar('Documento actualizado exitosamente', 'success');
      } else {
        await documentService.create(data);
        showSnackbar('Documento creado exitosamente', 'success');
      }
      setOpenModal(false);
      loadDocuments();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al guardar documento', 'error');
      throw error;
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Documentos</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Nuevo Documento
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Buscar documentos..."
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
      ) : documents.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <InsertDriveFile sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography>No hay documentos registrados</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {documents.map((doc) => (
            <Grid item xs={12} sm={6} md={4} key={doc.id}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <InsertDriveFile color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" noWrap>{doc.name}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {doc.description || 'Sin descripción'}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Tamaño: {formatFileSize(doc.fileSize)}
                </Typography>
                <Typography variant="caption" display="block">
                  Empresa: {doc.company?.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <DocumentModalForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        document={selectedDocument}
        companies={companies}
        proceedings={proceedings}
        onCompanyChange={loadProceedings}
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

export default DocumentList;
