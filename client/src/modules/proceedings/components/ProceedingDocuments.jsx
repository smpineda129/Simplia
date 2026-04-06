import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
} from '@mui/material';
import {
  CloudUpload,
  InsertDriveFile,
  Delete,
  Visibility,
  Download,
  Close,
  OpenInNew,
  Description,
} from '@mui/icons-material';
import { usePermissions } from '../../../hooks/usePermissions';
import proceedingService from '../services/proceedingService';
import { documentService } from '../../documents';

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

// ── Preview Modal ─────────────────────────────────────────────────────────────
const PreviewModal = ({ doc, url, open, onClose, onDownload }) => {
  const name = doc?.file_original_name || doc?.name || 'Documento';
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth
      PaperProps={{ sx: { height: '90vh', display: 'flex', flexDirection: 'column' } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <InsertDriveFile color="primary" />
          <Typography variant="subtitle1" noWrap title={name}>{name}</Typography>
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
            <img src={url} alt={name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </Box>
        ) : (
          <iframe src={url} title={name} width="100%" height="100%" style={{ border: 'none', display: 'block' }} />
        )}
      </DialogContent>
    </Dialog>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const ProceedingDocuments = ({ proceedingId, documents = [], onUpdate }) => {
  const { hasPermission } = usePermissions();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const fileInputRef = useRef(null);

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const fetchDocUrl = async (docId) => {
    const response = await documentService.getById(docId);
    const doc = response.data || response;
    if (!doc?.url) throw new Error('No se pudo obtener la URL del documento.');
    return doc.url;
  };

  const handleFileSelect = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      for (let i = 0; i < files.length; i++) {
        await proceedingService.uploadDocument(proceedingId, files[i]);
      }
      showSnackbar('Documento(s) subido(s) correctamente');
      if (onUpdate) onUpdate();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al subir el archivo.';
      setError(msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePreview = async (doc) => {
    try {
      setPreviewLoading(true);
      const url = await fetchDocUrl(doc.id);
      setPreviewDoc(doc);
      setPreviewUrl(url);
    } catch (err) {
      showSnackbar(err.message, 'warning');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownload = async (docId) => {
    try {
      const url = await fetchDocUrl(docId);
      window.open(url, '_blank');
    } catch (err) {
      showSnackbar(err.message, 'warning');
    }
  };

  const handleDetach = async (documentId) => {
    if (!window.confirm('¿Desvincular este documento del expediente?')) return;
    try {
      await proceedingService.detachDocument(proceedingId, documentId);
      showSnackbar('Documento desvinculado');
      if (onUpdate) onUpdate();
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Error al desvincular el documento.', 'error');
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <Description sx={{ mr: 1 }} /> Documentos
        </Typography>

        {hasPermission('document.create') && (
          <Button
            component="label"
            variant="contained"
            startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <CloudUpload />}
            disabled={uploading}
            size="small"
          >
            {uploading ? 'Subiendo...' : 'Cargar documentos'}
            <input
              type="file"
              multiple
              hidden
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  No hay documentos adjuntos.
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow key={doc.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <InsertDriveFile color="primary" fontSize="small" />
                      <Typography variant="body2" fontWeight={500}>
                        {doc.file_original_name || doc.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('es-ES') : '—'}
                  </TableCell>
                  <TableCell align="right">
                    {doc.file && isPreviewable(doc) && (
                      <Tooltip title="Vista previa">
                        <IconButton size="small" color="info" onClick={() => handlePreview(doc)} disabled={previewLoading}>
                          {previewLoading ? <CircularProgress size={16} /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    )}
                    {doc.file && (
                      <Tooltip title="Descargar">
                        <IconButton size="small" color="primary" onClick={() => handleDownload(doc.id)}>
                          <Download fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {hasPermission('document.delete') && (
                      <Tooltip title="Desvincular">
                        <IconButton size="small" color="error" onClick={() => handleDetach(doc.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
    </Paper>
  );
};

export default ProceedingDocuments;
