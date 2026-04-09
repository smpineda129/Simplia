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
import { Add, Delete, InsertDriveFile, Download, Visibility, Close, OpenInNew, CreateNewFolder, Search, FolderOpen, Folder, ExpandMore, ExpandLess } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';
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
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingFolderIds, setUploadingFolderIds] = useState(new Set());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState('');
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  // Track expanded/collapsed folders — all expanded by default
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  // Preview state
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    loadDocuments();
    loadFolders();
  }, [correspondenceId]);

  // Auto-expand all folders when they load
  useEffect(() => {
    if (folders.length > 0) {
      setExpandedFolders(new Set(folders.map(f => f.id.toString())));
    }
  }, [folders.length]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentService.getAll({ correspondenceId, limit: 200 });
      setDocuments(response.data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      showSnackbar('Error al cargar los documentos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const response = await correspondenceService.getFolders(correspondenceId);
      setFolders(response.data || []);
    } catch {
      // ignore gracefully — folders feature may not be available
    }
  };

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      const key = folderId.toString();
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await correspondenceService.createFolder(correspondenceId, newFolderName.trim());
      showSnackbar('Carpeta creada exitosamente');
      setNewFolderName('');
      setNewFolderOpen(false);
      loadFolders();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al crear carpeta', 'error');
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm('¿Eliminar esta carpeta? Los documentos dentro quedarán sin carpeta.')) return;
    try {
      await correspondenceService.deleteFolder(correspondenceId, folderId);
      showSnackbar('Carpeta eliminada');
      loadFolders();
      loadDocuments();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al eliminar carpeta', 'error');
    }
  };

  const fetchDocUrl = async (docId) => {
    const response = await documentService.getById(docId);
    const doc = response.data || response;
    if (!doc?.url) {
      if (doc?.fileExists === false) throw new Error('El archivo no está disponible en el almacenamiento.');
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

  // Upload one file and return success/failure
  const uploadSingleFile = async (file, folderId) => {
    const uploadResponse = await correspondenceService.uploadDocument(file);
    const { key, originalName } = uploadResponse.data;
    await documentService.create({
      name: originalName || file.name,
      file: key,
      medium: 'digital',
      companyId: user?.companyId,
      correspondenceId: parseInt(correspondenceId),
      ...(folderId && { folderId }),
    });
  };

  const handleFileSelect = async (e, folderId = null) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (folderId) {
      setUploadingFolderIds(prev => new Set(prev).add(folderId.toString()));
    } else {
      setUploading(true);
    }

    let successCount = 0;
    let errorCount = 0;

    // Upload files sequentially to avoid race conditions
    for (const file of files) {
      try {
        await uploadSingleFile(file, folderId);
        successCount++;
      } catch (err) {
        console.error('Error uploading', file.name, err);
        errorCount++;
      }
    }

    if (folderId) {
      setUploadingFolderIds(prev => {
        const next = new Set(prev);
        next.delete(folderId.toString());
        return next;
      });
    } else {
      setUploading(false);
    }

    if (successCount > 0) {
      showSnackbar(
        files.length > 1
          ? `${successCount} documento(s) agregado(s)${errorCount > 0 ? `, ${errorCount} con error` : ''}`
          : 'Documento agregado exitosamente'
      );
      loadDocuments();
    } else {
      showSnackbar('Error al subir los documentos', 'error');
    }

    e.target.value = '';
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

  // Filter docs by search
  const matchesSearch = (doc) => {
    if (!search) return true;
    return (doc.file_original_name || doc.name || '').toLowerCase().includes(search.toLowerCase());
  };

  // Split: docs in a specific folder vs docs with no folder
  const docsInFolder = (folderId) =>
    documents.filter(doc => doc.folderId === folderId.toString() && matchesSearch(doc));

  const docsWithoutFolder = documents.filter(doc => !doc.folderId && matchesSearch(doc));

  const renderDocTable = (docs, emptyMsg) => (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: '#fafafa' }}>
            <TableCell>NOMBRE</TableCell>
            <TableCell sx={{ width: 90 }}>MEDIO</TableCell>
            <TableCell sx={{ width: 110 }}>FECHA</TableCell>
            <TableCell align="right" sx={{ width: 120 }}>ACCIONES</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {docs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', py: 2 }}>
                {emptyMsg}
              </TableCell>
            </TableRow>
          ) : (
            docs.map((doc) => (
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
                  <Chip label={getMediumLabel(doc.medium)} size="small" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('es-ES') : '—'}
                  </Typography>
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
                  <Tooltip title="Eliminar">
                    <IconButton size="small" color="error" onClick={() => handleDelete(doc.id)}>
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
  );

  const isUploadingFolder = (folderId) => uploadingFolderIds.has(folderId.toString());

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Documentos de la Correspondencia
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<CreateNewFolder />}
            onClick={() => setNewFolderOpen(true)}
            size="small"
          >
            Nueva Carpeta
          </Button>
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
              multiple
              onChange={(e) => handleFileSelect(e)}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            />
          </Button>
        </Box>
      </Box>

      {/* Search */}
      <TextField
        size="small"
        placeholder="Buscar documentos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{ startAdornment: <Search sx={{ color: 'text.secondary', mr: 0.5 }} fontSize="small" /> }}
        sx={{ mb: 2, width: 300 }}
      />

      {/* ── Folders ── */}
      {folders.map((folder) => {
        const folderId = folder.id.toString();
        const isExpanded = expandedFolders.has(folderId);
        const folderDocs = docsInFolder(folder.id);

        return (
          <Paper key={folder.id} variant="outlined" sx={{ mb: 2 }}>
            {/* Folder header — clickable to collapse */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1,
                cursor: 'pointer',
                bgcolor: isExpanded ? '#FFF8E1' : '#FAFAFA',
                borderRadius: 1,
                '&:hover': { bgcolor: '#FFF3CD' },
              }}
              onClick={() => toggleFolder(folder.id)}
            >
              {isExpanded
                ? <FolderOpen sx={{ color: '#F59E0B', mr: 1 }} />
                : <Folder sx={{ color: '#F59E0B', mr: 1 }} />}
              <Typography variant="subtitle1" fontWeight={600} sx={{ flex: 1 }}>
                {folder.name}
              </Typography>
              <Chip
                label={folderDocs.length}
                size="small"
                sx={{ mr: 1, bgcolor: '#F59E0B20', color: '#92400E', fontWeight: 600 }}
              />
              {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              {/* Stop propagation so delete doesn't toggle */}
              <Tooltip title="Eliminar carpeta" onClick={(e) => e.stopPropagation()}>
                <IconButton
                  size="small"
                  color="error"
                  sx={{ ml: 1 }}
                  onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Collapsible content */}
            <Collapse in={isExpanded}>
              {renderDocTable(folderDocs, 'Carpeta vacía — agrega documentos usando el botón de abajo.')}
              {/* Upload dentro de la carpeta */}
              <Box sx={{ px: 2, py: 1, borderTop: '1px solid #f0f0f0' }}>
                <Button
                  component="label"
                  size="small"
                  startIcon={isUploadingFolder(folder.id) ? <CircularProgress size={14} /> : <Add />}
                  disabled={isUploadingFolder(folder.id)}
                >
                  {isUploadingFolder(folder.id) ? 'Subiendo...' : 'Agregar en esta carpeta'}
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={(e) => handleFileSelect(e, folder.id)}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  />
                </Button>
              </Box>
            </Collapse>
          </Paper>
        );
      })}

      {/* ── Documents without folder ── */}
      <Paper variant="outlined">
        <Box sx={{ px: 2, py: 1, bgcolor: '#FAFAFA', borderRadius: 1 }}>
          <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
            {folders.length > 0 ? 'Sin carpeta' : 'Documentos'}
            <Chip
              label={docsWithoutFolder.length}
              size="small"
              sx={{ ml: 1, bgcolor: '#E5E7EB', color: '#374151', fontWeight: 600 }}
            />
          </Typography>
        </Box>
        {renderDocTable(docsWithoutFolder, 'No hay documentos. Usa "Agregar Documento" para subir uno.')}
      </Paper>

      {/* Preview Modal */}
      {previewDoc && previewUrl && (
        <PreviewModal
          doc={previewDoc}
          url={previewUrl}
          open={Boolean(previewDoc && previewUrl)}
          onClose={() => { setPreviewDoc(null); setPreviewUrl(''); }}
          onDownload={() => handleDownload(previewDoc.id)}
        />
      )}

      {/* New Folder Dialog */}
      <Dialog open={newFolderOpen} onClose={() => setNewFolderOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Nueva Carpeta</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Nombre de la carpeta"
            fullWidth
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setNewFolderOpen(false); setNewFolderName(''); }}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
            Crear
          </Button>
        </DialogActions>
      </Dialog>

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
