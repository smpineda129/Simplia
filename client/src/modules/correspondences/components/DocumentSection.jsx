import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete, InsertDriveFile, Download } from '@mui/icons-material';
import { documentService } from '../../documents';
import DocumentModalForm from '../../documents/components/DocumentModalForm';

const DocumentSection = ({ correspondenceId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [companies, setCompanies] = useState([]);
  const [proceedings, setProceedings] = useState([]);

  useEffect(() => {
    loadDocuments();
    loadCompanies();
  }, [correspondenceId]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentService.getAll({ correspondenceId, limit: 100 });
      setDocuments(response.data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      showSnackbar('Error al cargar los documentos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCompanies = async () => {
    try {
      const { companyService } = await import('../../companies');
      const response = await companyService.getAll({ limit: 100 });
      setCompanies(response.data || []);
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const loadProceedings = async (companyId) => {
    try {
      const { proceedingService } = await import('../../proceedings');
      const response = await proceedingService.getAll({ companyId, limit: 100 });
      setProceedings(response.data || []);
    } catch (error) {
      console.error('Error loading proceedings:', error);
    }
  };

  const handleCreate = () => {
    setSelectedDocument(null);
    setOpenModal(true);
  };

  const handleEdit = (document) => {
    setSelectedDocument(document);
    setOpenModal(true);
  };

  const handleSave = async (data) => {
    try {
      // Agregar correspondenceId a los datos
      const documentData = {
        ...data,
        correspondenceId: parseInt(correspondenceId),
      };

      if (selectedDocument) {
        await documentService.update(selectedDocument.id, documentData);
        showSnackbar('Documento actualizado exitosamente');
      } else {
        await documentService.create(documentData);
        showSnackbar('Documento creado exitosamente');
      }
      setOpenModal(false);
      loadDocuments();
    } catch (error) {
      console.error('Error saving document:', error);
      showSnackbar(error.response?.data?.message || 'Error al guardar el documento', 'error');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este documento?')) return;

    try {
      await documentService.delete(id);
      showSnackbar('Documento eliminado exitosamente');
      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      showSnackbar(error.response?.data?.message || 'Error al eliminar el documento', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Documentos de la Correspondencia
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Agregar Documento
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>NOMBRE</TableCell>
                <TableCell>TIPO</TableCell>
                <TableCell>EXPEDIENTE</TableCell>
                <TableCell>FECHA</TableCell>
                <TableCell align="right">ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay documentos. Haz clic en "Agregar Documento" para crear uno.
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => (
                  <TableRow key={doc.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InsertDriveFile color="primary" />
                        <strong>{doc.name}</strong>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={doc.type || 'Documento'} size="small" />
                    </TableCell>
                    <TableCell>
                      {doc.proceeding?.name || '-'}
                    </TableCell>
                    <TableCell>
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(doc)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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

export default DocumentSection;
