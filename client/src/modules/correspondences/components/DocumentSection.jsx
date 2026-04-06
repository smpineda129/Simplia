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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add, Delete, InsertDriveFile, Download, Visibility, Close, OpenInNew } from '@mui/icons-material';
import { documentService } from '../../documents';
import correspondenceService from '../services/correspondenceService';
import { useAuth } from '../../../hooks/useAuth';

const PREVIEWABLE_TYPES = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp'];

const getFileExt = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
};

const isPreviewable = (doc) => {
  const name = doc.file_original_name || doc.name || doc.file || '';
  return PREVIEWABLE_TYPES.includes(getFileExt(name));
};

const isImage = (doc) => {
  const name = doc.file_original_name || doc.name || doc.file || '';
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(getFileExt(name));
};

// ── Preview Modal ────────────────────────────────────────────────────────────
const PreviewModal = ({ doc, url, open, onClose, onDownload }) => {
  const name = doc?.file_original_name || doc?.name || 'Documento';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth
      PaperProps={{ sx: { height: '90vh', display: 'flex', flexDirection: 'column' } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <InsertDriveFile color="primary" />
          <Typography variant="subtitle1" noWrap title={name}>
            {name}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
          <Tooltip title="Abrir en nueva pestaña">
            <IconButton size="small" onClick={() => window.open(url, '_blank')}>
              <OpenInNew fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Descargar">
            <IconButton size="small" onClick={onDownload}>
              <Download fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cerrar">
            <IconButton size="small" onClick={onClose}>
              <Close fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ flex: 1, p: 0, overflow: 'hidden' }}>
        {isImage(doc) ? (
          <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#111', p: 2 }}>
            <img
              src={url}
              alt={name}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </Box>
        ) : (
          <iframe
            src={url}
            title={name}
            width="100%"
            height="100%"
            style={{ border: 'none', display: 'block' }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────
const DocumentSection = ({ correspondenceId }) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Preview state
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    loadDocuments();
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

  const fetchDocUrl = async (docId) => {
    const response = await documentService.getById(docId);
    const doc = response.data || response;
    if (!doc?.url) {
      if (doc?.fileExists === false) {
        throw new Error('El archivo no está disponible en el almacenamiento.');
      }
      throw new Error('No se pudo obtener la URL del documento.');
    }
    return doc.url;
  };

  const handlePreview = async (doc) => {
    try {
      setPreviewLoading(true);
      const url = await fetchDocUrl(doc.id);
      setPreviewDoc(doc);
      setPreviewUrl(url);
    } catch (error) {
      showSnackbar(error.message, 'warning');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownload = async (docId) => {
    try {
      const url = await fetchDocUrl(docId);
      window.open(url, '_blank');
    } catch (error) {
      showSnackbar(error.message, 'warning');
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadResponse = await correspondenceService.uploadDocument(file);
      const { key, originalName } = uploadResponse.data;

      await documentService.create({
        name: originalName || file.name,
        file: key,
        medium: 'digital',
        companyId: user?.companyId,
        correspondenceId: parseInt(correspondenceId),
      });

      showSnackbar('Documento agregado exitosamente');
      loadDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      showSnackbar(error.response?.data?.message || 'Error al subir el documento', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('¿Está seguro de eliminar este documento?')) return;

    try {
      await documentService.delete(docId);
      showSnackbar('Documento eliminado exitosamente');
      loadDocuments();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al eliminar el documento', 'error');
    }
  };

  const getMediumLabel = (medium) => {
    if (!medium) return 'digital';
    const num = Number(medium);
    if (!isNaN(num)) return num >= 1 ? 'digital' : 'físico';
    return medium;
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
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
          component="label"
          variant="contained"
          startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <Add />}
          disabled={uploading}
        >
          {uploading ? 'Subiendo...' : 'Agregar Documento'}
          <input
            type="file"
            hidden
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          />
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>NOMBRE</TableCell>
                <TableCell>MEDIO</TableCell>
                <TableCell>FECHA</TableCell>
                <TableCell align="right">ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No hay documentos. Haz clic en "Agregar Documento" para subir uno.
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => (
                  <TableRow key={doc.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InsertDriveFile color="primary" />
                        <Typography variant="body2" fontWeight={500}>
                          {doc.file_original_name || doc.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={getMediumLabel(doc.medium)} size="small" />
                    </TableCell>
                    <TableCell>
                      {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('es-ES') : '—'}
                    </TableCell>
                    <TableCell align="right">
                      {doc.file && isPreviewable(doc) && (
                        <Tooltip title="Vista previa">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handlePreview(doc)}
                            disabled={previewLoading}
                          >
                            {previewLoading ? <CircularProgress size={16} /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      )}
                      {doc.file && (
                        <Tooltip title="Descargar">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleDownload(doc.id)}
                          >
                            <Download fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
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

      {previewDoc && previewUrl && (
        <PreviewModal
          doc={previewDoc}
          url={previewUrl}
          open={Boolean(previewDoc && previewUrl)}
          onClose={() => { setPreviewDoc(null); setPreviewUrl(''); }}
          onDownload={() => handleDownload(previewDoc.id)}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DocumentSection;
