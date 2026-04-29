import { useState, useRef, useEffect } from 'react';
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
  DialogActions,
  Snackbar,
  Chip,
  Collapse,
  TextField,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
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
  CreateNewFolder,
  Search,
  FolderOpen,
  Folder,
  ExpandMore,
  ExpandLess,
  Add,
  MergeType,
  ArrowUpward,
  ArrowDownward,
  Edit,
  DriveFileMove,
} from '@mui/icons-material';
import { usePermissions } from '../../../hooks/usePermissions';
import { useAuth } from '../../../hooks/useAuth';
import proceedingService from '../services/proceedingService';
import { documentService } from '../../documents';
import DocumentEditForm from '../../documents/components/DocumentEditForm';

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
const ProceedingDocuments = ({ proceedingId, documents = [], onUpdate, isClosed = false }) => {
  const { hasPermission } = usePermissions();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadingFolderIds, setUploadingFolderIds] = useState(new Set());
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [folders, setFolders] = useState([]);
  const [search, setSearch] = useState('');
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const fileInputRef = useRef(null);

  // Merge state
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [mergeMode, setMergeMode] = useState(false);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [mergeOrder, setMergeOrder] = useState([]);
  const [mergeDocs, setMergeDocs] = useState([]); // docs con metadata para el dialog
  const [mergeName, setMergeName] = useState('');
  const [merging, setMerging] = useState(false);
  const [uploadingMergeFile, setUploadingMergeFile] = useState(false);
  const mergeFileInputRef = useRef(null);

  // Edit state
  const [editDoc, setEditDoc] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Move state (single)
  const [moveDoc, setMoveDoc] = useState(null);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);

  // Move mode (batch)
  const [moveMode, setMoveMode] = useState(false);
  const [batchSelectedDocs, setBatchSelectedDocs] = useState([]);
  const [batchMoveDialogOpen, setBatchMoveDialogOpen] = useState(false);

  useEffect(() => {
    loadFolders();
  }, [proceedingId]);

  useEffect(() => {
    if (folders.length > 0) {
      setExpandedFolders(new Set(folders.map(f => f.id.toString())));
    }
  }, [folders.length]);

  const loadFolders = async () => {
    try {
      const response = await proceedingService.getFolders(proceedingId);
      setFolders(response.data || []);
    } catch {
      // ignore gracefully
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
      await proceedingService.createFolder(proceedingId, newFolderName.trim());
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
      await proceedingService.deleteFolder(proceedingId, folderId);
      showSnackbar('Carpeta eliminada');
      loadFolders();
      if (onUpdate) onUpdate();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al eliminar carpeta', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const fetchDocUrl = async (docId) => {
    const response = await documentService.getById(docId);
    const doc = response.data || response;
    if (!doc?.url) throw new Error('No se pudo obtener la URL del documento.');
    return doc.url;
  };

  const handleFileSelect = async (event, folderId = null) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    if (folderId) {
      setUploadingFolderIds(prev => new Set(prev).add(folderId.toString()));
    } else {
      setUploading(true);
    }
    
    setError('');
    let successCount = 0;
    let errorCount = 0;
    
    try {
      for (let i = 0; i < files.length; i++) {
        try {
          await proceedingService.uploadDocument(proceedingId, files[i], folderId);
          successCount++;
        } catch (err) {
          console.error('Error uploading', files[i].name, err);
          errorCount++;
        }
      }
      
      if (successCount > 0) {
        showSnackbar(
          files.length > 1
            ? `${successCount} documento(s) subido(s)${errorCount > 0 ? `, ${errorCount} con error` : ''}`
            : 'Documento subido correctamente'
        );
        if (onUpdate) onUpdate();
      } else {
        setError('Error al subir los documentos');
      }
    } finally {
      if (folderId) {
        setUploadingFolderIds(prev => {
          const next = new Set(prev);
          next.delete(folderId.toString());
          return next;
        });
      } else {
        setUploading(false);
      }
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

  const handleMoveDocument = async (targetFolderId) => {
    try {
      await proceedingService.moveDocument(proceedingId, moveDoc.id, targetFolderId);
      showSnackbar('Documento movido exitosamente');
      setMoveDialogOpen(false);
      setMoveDoc(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al mover el documento', 'error');
    }
  };

  const handleToggleBatchSelectDoc = (doc) => {
    setBatchSelectedDocs(prev => {
      const exists = prev.find(d => d.id === doc.id);
      if (exists) return prev.filter(d => d.id !== doc.id);
      return [...prev, doc];
    });
  };

  const handleCancelMoveMode = () => {
    setMoveMode(false);
    setBatchSelectedDocs([]);
  };

  const handleBatchMoveDocument = async (targetFolderId) => {
    try {
      await Promise.all(
        batchSelectedDocs.map(doc => proceedingService.moveDocument(proceedingId, doc.id, targetFolderId))
      );
      showSnackbar(`${batchSelectedDocs.length} documento(s) movido(s) exitosamente`);
      setBatchMoveDialogOpen(false);
      setMoveMode(false);
      setBatchSelectedDocs([]);
      if (onUpdate) onUpdate();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al mover los documentos', 'error');
    }
  };

  const handleEdit = (doc) => {
    setEditDoc({ ...doc, companyId: user?.companyId || doc.companyId });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async (data) => {
    try {
      await documentService.update(editDoc.id, data);
      showSnackbar('Documento actualizado exitosamente');
      setEditDialogOpen(false);
      setEditDoc(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      throw error;
    }
  };

  const isPDF = (doc) => {
    const name = doc.file_original_name || doc.name || '';
    return getFileExt(name) === 'pdf';
  };

  const handleToggleSelectDoc = (doc) => {
    if (!isPDF(doc)) {
      showSnackbar('Solo se pueden mezclar documentos PDF', 'warning');
      return;
    }
    setSelectedDocs(prev => {
      const exists = prev.find(d => d.id === doc.id);
      if (exists) {
        return prev.filter(d => d.id !== doc.id);
      } else {
        return [...prev, doc];
      }
    });
  };

  const handleStartMerge = () => {
    if (selectedDocs.length < 1) {
      showSnackbar('Selecciona al menos 1 documento PDF para mezclar', 'warning');
      return;
    }
    const initialDocs = selectedDocs.map(d => ({ id: d.id, name: d.file_original_name || d.name, isNew: false }));
    setMergeDocs(initialDocs);
    setMergeOrder(initialDocs.map(d => d.id));
    setMergeName('Documento_Mezclado.pdf');
    setMergeDialogOpen(true);
  };

  const handleAddMergeFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showSnackbar('Solo se pueden agregar archivos PDF', 'warning');
      return;
    }
    try {
      setUploadingMergeFile(true);
      const response = await proceedingService.uploadDocument(proceedingId, file);
      const newDoc = response.data;
      const entry = { id: newDoc.id, name: newDoc.file_original_name || newDoc.name || file.name, isNew: true };
      setMergeDocs(prev => [...prev, entry]);
      setMergeOrder(prev => [...prev, newDoc.id]);
    } catch (err) {
      showSnackbar('Error al subir el archivo', 'error');
    } finally {
      setUploadingMergeFile(false);
      if (mergeFileInputRef.current) mergeFileInputRef.current.value = '';
    }
  };

  const handleRemoveFromMerge = (id) => {
    setMergeDocs(prev => prev.filter(d => d.id !== id));
    setMergeOrder(prev => prev.filter(docId => docId !== id));
  };

  const handleCancelMerge = () => {
    setMergeMode(false);
    setSelectedDocs([]);
    setMergeDocs([]);
    setMergeOrder([]);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newOrder = [...mergeOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setMergeOrder(newOrder);
    const newDocs = [...mergeDocs];
    [newDocs[index - 1], newDocs[index]] = [newDocs[index], newDocs[index - 1]];
    setMergeDocs(newDocs);
  };

  const handleMoveDown = (index) => {
    if (index === mergeOrder.length - 1) return;
    const newOrder = [...mergeOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setMergeOrder(newOrder);
    const newDocs = [...mergeDocs];
    [newDocs[index], newDocs[index + 1]] = [newDocs[index + 1], newDocs[index]];
    setMergeDocs(newDocs);
  };

  const handleConfirmMerge = async () => {
    if (!mergeName.trim()) {
      showSnackbar('Ingresa un nombre para el documento mezclado', 'warning');
      return;
    }
    if (mergeOrder.length < 2) {
      showSnackbar('Se necesitan al menos 2 documentos para mezclar', 'warning');
      return;
    }
    try {
      setMerging(true);
      const response = await documentService.merge(mergeOrder, mergeName.trim());
      const mergedDoc = response.data;

      // Vincular el documento mezclado al expediente
      await proceedingService.attachDocument(proceedingId, mergedDoc.id);

      showSnackbar('Documentos mezclados exitosamente');
      setMergeDialogOpen(false);
      setMergeMode(false);
      setSelectedDocs([]);
      setMergeDocs([]);
      setMergeOrder([]);
      setMergeName('');
      if (onUpdate) onUpdate();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al mezclar documentos', 'error');
    } finally {
      setMerging(false);
    }
  };

  const matchesSearch = (doc) => {
    if (!search) return true;
    return (doc.file_original_name || doc.name || '').toLowerCase().includes(search.toLowerCase());
  };

  const docsInFolder = (folderId) =>
    documents.filter(doc => doc.folderId === folderId.toString() && matchesSearch(doc));

  const docsWithoutFolder = documents.filter(doc => !doc.folderId && matchesSearch(doc));

  const isUploadingFolder = (folderId) => uploadingFolderIds.has(folderId.toString());

  const renderDocTable = (docs, emptyMsg) => (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: '#fafafa' }}>
            {(mergeMode || moveMode) && <TableCell sx={{ width: 50 }}>SELECCIONAR</TableCell>}
            <TableCell>Nombre</TableCell>
            <TableCell sx={{ width: 110 }}>Fecha</TableCell>
            <TableCell align="right" sx={{ width: 120 }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {docs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={(mergeMode || moveMode) ? 4 : 3} align="center" sx={{ color: 'text.secondary', py: 2 }}>
                {emptyMsg}
              </TableCell>
            </TableRow>
          ) : (
            docs.map((doc) => {
              const isSelected = selectedDocs.find(d => d.id === doc.id);
              const canSelect = isPDF(doc);
              return (
                <TableRow key={doc.id} hover selected={!!isSelected}>
                  {(mergeMode || moveMode) && (
                    <TableCell>
                      <Checkbox
                        checked={moveMode ? !!batchSelectedDocs.find(d => d.id === doc.id) : !!isSelected}
                        onChange={() => moveMode ? handleToggleBatchSelectDoc(doc) : handleToggleSelectDoc(doc)}
                        disabled={mergeMode && !canSelect}
                        size="small"
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <InsertDriveFile color="primary" fontSize="small" />
                      <Typography variant="body2" fontWeight={500}>
                        {doc.file_original_name || doc.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('es-ES') : '—'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {!mergeMode && (
                      <>
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
                        <Tooltip title={isClosed ? "Expediente cerrado" : "Editar"}>
                          <span>
                            <IconButton size="small" color="secondary" onClick={() => handleEdit(doc)} disabled={isClosed}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        {folders.length > 0 && !isClosed && !moveMode && (
                          <Tooltip title="Mover a carpeta">
                            <IconButton size="small" color="info" onClick={() => { setMoveDoc(doc); setMoveDialogOpen(true); }}>
                              <DriveFileMove fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {hasPermission('document.delete') && (
                          <Tooltip title={isClosed ? "Expediente cerrado" : "Desvincular"}>
                            <span>
                              <IconButton size="small" color="error" onClick={() => handleDetach(doc.id)} disabled={isClosed}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <Description sx={{ mr: 1 }} /> Documentos
          {(mergeMode || moveMode) && (
            <Chip
              label={`${mergeMode ? selectedDocs.length : batchSelectedDocs.length} seleccionados`}
              size="small"
              color="primary"
              sx={{ ml: 2 }}
            />
          )}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {mergeMode ? (
            <>
              <Button
                variant="outlined"
                onClick={handleCancelMerge}
                size="small"
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                startIcon={<MergeType />}
                onClick={handleStartMerge}
                disabled={selectedDocs.length < 1}
                size="small"
              >
                Mezclar ({selectedDocs.length})
              </Button>
            </>
          ) : moveMode ? (
            <>
              <Button variant="outlined" onClick={handleCancelMoveMode} size="small">
                Cancelar
              </Button>
              <Button
                variant="contained"
                startIcon={<DriveFileMove />}
                onClick={() => setBatchMoveDialogOpen(true)}
                disabled={batchSelectedDocs.length === 0}
                size="small"
              >
                Mover ({batchSelectedDocs.length})
              </Button>
            </>
          ) : (
            <>
              {hasPermission('document.create') && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<MergeType />}
                    onClick={() => setMergeMode(true)}
                    size="small"
                    disabled={isClosed}
                  >
                    Mezclar PDFs
                  </Button>
                  {folders.length > 0 && !isClosed && (
                    <Button
                      variant="outlined"
                      startIcon={<DriveFileMove />}
                      onClick={() => setMoveMode(true)}
                      size="small"
                    >
                      Mover documentos
                    </Button>
                  )}
                  <Button
                    startIcon={<CreateNewFolder />}
                    onClick={() => setNewFolderOpen(true)}
                    size="small"
                    disabled={isClosed}
                  >
                    Nueva Carpeta
                  </Button>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <CloudUpload />}
                    disabled={uploading || isClosed}
                    size="small"
                  >
                    {uploading ? 'Subiendo...' : isClosed ? 'Expediente cerrado' : 'Cargar documentos'}
                    <input
                      type="file"
                      multiple
                      hidden
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                    />
                  </Button>
                </>
              )}
            </>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Search */}
      <TextField
        size="small"
        placeholder="Buscar documentos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{ startAdornment: <Search sx={{ color: 'text.secondary', mr: 0.5 }} fontSize="small" /> }}
        sx={{ mb: 2, width: 300 }}
      />

      {/* Folders */}
      {folders.map((folder) => {
        const folderId = folder.id.toString();
        const isExpanded = expandedFolders.has(folderId);
        const folderDocs = docsInFolder(folder.id);

        return (
          <Paper key={folder.id} variant="outlined" sx={{ mb: 2 }}>
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
              {hasPermission('document.delete') && (
                <Tooltip title={isClosed ? "Expediente cerrado" : "Eliminar carpeta"}>
                  <span onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      size="small"
                      color="error"
                      sx={{ ml: 1 }}
                      onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                      disabled={isClosed}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </Box>

            <Collapse in={isExpanded}>
              {renderDocTable(folderDocs, 'Carpeta vacía — agrega documentos usando el botón de abajo.')}
              {hasPermission('document.create') && (
                <Box sx={{ px: 2, py: 1, borderTop: '1px solid #f0f0f0' }}>
                  <Button
                    component="label"
                    size="small"
                    startIcon={isUploadingFolder(folder.id) ? <CircularProgress size={14} /> : <Add />}
                    disabled={isUploadingFolder(folder.id) || isClosed}
                  >
                    {isUploadingFolder(folder.id) ? 'Subiendo...' : isClosed ? 'Expediente cerrado' : 'Agregar en esta carpeta'}
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={(e) => handleFileSelect(e, folder.id)}
                    />
                  </Button>
                </Box>
              )}
            </Collapse>
          </Paper>
        );
      })}

      {/* Documents without folder */}
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
        {renderDocTable(docsWithoutFolder, 'No hay documentos. Usa "Cargar documentos" para subir uno.')}
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

      {/* Merge Dialog */}
      <Dialog open={mergeDialogOpen} onClose={() => !merging && setMergeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Mezclar Documentos PDF</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre del documento mezclado"
            fullWidth
            value={mergeName}
            onChange={(e) => setMergeName(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
            placeholder="Documento_Mezclado.pdf"
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2">
              Orden de mezcla ({mergeOrder.length} documentos):
            </Typography>
            <Button
              component="label"
              size="small"
              startIcon={uploadingMergeFile ? <CircularProgress size={14} /> : <Add />}
              disabled={uploadingMergeFile || merging}
              variant="outlined"
            >
              {uploadingMergeFile ? 'Subiendo...' : 'Agregar PDF'}
              <input
                ref={mergeFileInputRef}
                type="file"
                hidden
                accept=".pdf"
                onChange={handleAddMergeFile}
              />
            </Button>
          </Box>

          <List dense>
            {mergeOrder.map((docId, index) => {
              const doc = mergeDocs.find(d => d.id === docId);
              if (!doc) return null;
              return (
                <ListItem
                  key={`${docId}-${index}`}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: doc.isNew ? '#F0FDF4' : '#fafafa',
                  }}
                >
                  <Chip
                    label={index + 1}
                    size="small"
                    color="primary"
                    sx={{ mr: 1, flexShrink: 0 }}
                  />
                  <ListItemText
                    primary={doc.name}
                    secondary={doc.isNew ? 'Nuevo' : null}
                    primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                    secondaryTypographyProps={{ variant: 'caption', color: 'success.main' }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small" onClick={() => handleMoveUp(index)} disabled={index === 0}>
                      <ArrowUpward fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleMoveDown(index)} disabled={index === mergeOrder.length - 1}>
                      <ArrowDownward fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleRemoveFromMerge(docId)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMergeDialogOpen(false)} disabled={merging}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmMerge}
            disabled={merging || !mergeName.trim() || mergeOrder.length < 2}
            startIcon={merging ? <CircularProgress size={16} /> : <MergeType />}
          >
            {merging ? 'Mezclando...' : 'Mezclar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Batch Move Dialog */}
      <Dialog open={batchMoveDialogOpen} onClose={() => setBatchMoveDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Mover {batchSelectedDocs.length} documento(s) a carpeta</DialogTitle>
        <DialogContent>
          <List dense>
            <ListItem
              sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
              onClick={() => handleBatchMoveDocument(null)}
            >
              <ListItemText primary="Sin carpeta" secondary="Quitar de la carpeta actual" />
            </ListItem>
            {folders.map((folder) => (
              <ListItem
                key={folder.id}
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                onClick={() => handleBatchMoveDocument(folder.id)}
              >
                <ListItemText primary={folder.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBatchMoveDialogOpen(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Move Document Dialog */}
      <Dialog open={moveDialogOpen} onClose={() => { setMoveDialogOpen(false); setMoveDoc(null); }} maxWidth="xs" fullWidth>
        <DialogTitle>Mover documento a carpeta</DialogTitle>
        <DialogContent>
          <List dense>
            <ListItem
              sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
              onClick={() => handleMoveDocument(null)}
            >
              <ListItemText primary="Sin carpeta" secondary="Quitar de la carpeta actual" />
            </ListItem>
            {folders.map((folder) => (
              <ListItem
                key={folder.id}
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                onClick={() => handleMoveDocument(folder.id)}
              >
                <ListItemText primary={folder.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setMoveDialogOpen(false); setMoveDoc(null); }}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Document Dialog */}
      {editDoc && (
        <DocumentEditForm
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setEditDoc(null);
          }}
          document={editDoc}
          onSave={handleSaveEdit}
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
