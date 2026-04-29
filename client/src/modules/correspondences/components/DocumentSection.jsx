import { useState, useEffect, useRef } from 'react';
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
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Add, Delete, InsertDriveFile, Download, Visibility, Close, OpenInNew, CreateNewFolder, Search, FolderOpen, Folder, ExpandMore, ExpandLess, MergeType, ArrowUpward, ArrowDownward, Edit, DriveFileMove } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';
import { documentService } from '../../documents';
import correspondenceService from '../services/correspondenceService';
import { useAuth } from '../../../hooks/useAuth';
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
const DocumentSection = ({ correspondenceId, companyId: propCompanyId }) => {
  const { user } = useAuth();
  const companyId = propCompanyId || user?.companyId;
  console.log('Usuario en DocumentSection:', user);
  console.log('CompanyId del usuario:', user?.companyId);
  console.log('CompanyId de la prop:', propCompanyId);
  console.log('CompanyId final a usar:', companyId);
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingFolderIds, setUploadingFolderIds] = useState(new Set());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState('');
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  // Preview state
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);

  // Merge state
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [mergeMode, setMergeMode] = useState(false);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [mergeOrder, setMergeOrder] = useState([]);
  const [mergeDocs, setMergeDocs] = useState([]); // [{id, name, isNew}]
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
    
    const companyIdToUse = parseInt(companyId);
    console.log('CompanyId en uploadSingleFile:', companyId);
    console.log('CompanyId parseado:', companyIdToUse);
    
    if (!companyIdToUse || isNaN(companyIdToUse)) {
      throw new Error('CompanyId inválido o no disponible');
    }
    
    await documentService.create({
      name: originalName || file.name,
      file: key,
      medium: 'digital',
      companyId: companyIdToUse,
      correspondenceId: parseInt(correspondenceId),
      ...(folderId && { folderId }),
    });
  };

  const handleFileSelect = async (e, folderId = null) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (!companyId) {
      showSnackbar('Error: No se pudo obtener la empresa del usuario', 'error');
      return;
    }

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

  const handleEdit = (doc) => {
    console.log('Documento original:', doc);
    console.log('CompanyId a usar:', companyId);
    const docWithCompany = { ...doc, companyId: companyId || doc.companyId };
    console.log('Documento con companyId:', docWithCompany);
    setEditDoc(docWithCompany);
    setEditDialogOpen(true);
  };

  const handleMoveDocument = async (targetFolderId) => {
    try {
      await correspondenceService.moveDocument(correspondenceId, moveDoc.id, targetFolderId);
      showSnackbar('Documento movido exitosamente');
      setMoveDialogOpen(false);
      setMoveDoc(null);
      loadDocuments();
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
        batchSelectedDocs.map(doc => correspondenceService.moveDocument(correspondenceId, doc.id, targetFolderId))
      );
      showSnackbar(`${batchSelectedDocs.length} documento(s) movido(s) exitosamente`);
      setBatchMoveDialogOpen(false);
      setMoveMode(false);
      setBatchSelectedDocs([]);
      loadDocuments();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al mover los documentos', 'error');
    }
  };

  const handleSaveEdit = async (data) => {
    try {
      await documentService.update(editDoc.id, data);
      showSnackbar('Documento actualizado exitosamente');
      setEditDialogOpen(false);
      setEditDoc(null);
      loadDocuments();
    } catch (error) {
      throw error;
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
    const ids = selectedDocs.map(d => d.id);
    const docs = selectedDocs.map(d => ({ id: d.id, name: d.file_original_name || d.name, isNew: false }));
    setMergeOrder(ids);
    setMergeDocs(docs);
    setMergeName('Documento_Mezclado.pdf');
    setMergeDialogOpen(true);
  };

  const handleCancelMerge = () => {
    setMergeMode(false);
    setSelectedDocs([]);
    setMergeDocs([]);
  };

  const handleAddMergeFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    if (!companyId) {
      showSnackbar('Error: No se pudo obtener la empresa del usuario', 'error');
      return;
    }

    try {
      setUploadingMergeFile(true);
      const uploadResponse = await correspondenceService.uploadDocument(file);
      const { key, originalName } = uploadResponse.data;

      const created = await documentService.create({
        name: originalName || file.name,
        file: key,
        medium: 'digital',
        companyId: parseInt(companyId),
        correspondenceId: parseInt(correspondenceId),
      });
      const newDoc = created.data || created;
      const newEntry = { id: newDoc.id, name: originalName || file.name, isNew: true };
      setMergeDocs(prev => [...prev, newEntry]);
      setMergeOrder(prev => [...prev, newDoc.id]);
      showSnackbar('Archivo agregado a la mezcla');
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Error al subir el archivo', 'error');
    } finally {
      setUploadingMergeFile(false);
    }
  };

  const handleRemoveFromMerge = (index) => {
    setMergeDocs(prev => prev.filter((_, i) => i !== index));
    setMergeOrder(prev => prev.filter((_, i) => i !== index));
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

      // Vincular el documento mezclado a la correspondencia
      await correspondenceService.attachDocument(correspondenceId, mergedDoc.id);

      showSnackbar('Documentos mezclados exitosamente');
      setMergeDialogOpen(false);
      setMergeMode(false);
      setSelectedDocs([]);
      setMergeOrder([]);
      setMergeDocs([]);
      setMergeName('');
      loadDocuments();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error al mezclar documentos', 'error');
    } finally {
      setMerging(false);
    }
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
            {(mergeMode || moveMode) && <TableCell sx={{ width: 50 }}>SELECCIONAR</TableCell>}
            <TableCell>NOMBRE</TableCell>
            <TableCell sx={{ width: 90 }}>MEDIO</TableCell>
            <TableCell sx={{ width: 110 }}>FECHA</TableCell>
            <TableCell align="right" sx={{ width: 120 }}>ACCIONES</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {docs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={(mergeMode || moveMode) ? 5 : 4} align="center" sx={{ color: 'text.secondary', py: 2 }}>
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
                    <Chip label={getMediumLabel(doc.medium)} size="small" />
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
                        <Tooltip title="Editar">
                          <IconButton size="small" color="secondary" onClick={() => handleEdit(doc)}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {folders.length > 0 && !moveMode && (
                          <Tooltip title="Mover a carpeta">
                            <IconButton size="small" color="info" onClick={() => { setMoveDoc(doc); setMoveDialogOpen(true); }}>
                              <DriveFileMove fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Eliminar">
                          <IconButton size="small" color="error" onClick={() => handleDelete(doc.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
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

  const isUploadingFolder = (folderId) => uploadingFolderIds.has(folderId.toString());

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Documentos de la Correspondencia
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
              <Button
                variant="outlined"
                startIcon={<MergeType />}
                onClick={() => setMergeMode(true)}
                size="small"
              >
                Mezclar PDFs
              </Button>
              {folders.length > 0 && (
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
            </>
          )}
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

      {/* Merge Dialog */}
      <Dialog open={mergeDialogOpen} onClose={() => setMergeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Mezclar Documentos PDF</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre del documento mezclado"
            fullWidth
            value={mergeName}
            onChange={(e) => setMergeName(e.target.value)}
            sx={{ mt: 2, mb: 3 }}
            placeholder="Documento_Mezclado.pdf"
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2">
              Orden de mezcla:
            </Typography>
            <Button
              component="label"
              size="small"
              variant="outlined"
              startIcon={uploadingMergeFile ? <CircularProgress size={14} /> : <Add />}
              disabled={uploadingMergeFile || merging}
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
            {mergeDocs.map((entry, index) => (
              <ListItem
                key={`${entry.id}-${index}`}
                sx={{
                  border: '1px solid',
                  borderColor: entry.isNew ? '#4caf50' : '#e0e0e0',
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: entry.isNew ? '#f1f8e9' : '#fafafa',
                }}
              >
                <Chip
                  label={index + 1}
                  size="small"
                  color="primary"
                  sx={{ mr: 2, flexShrink: 0 }}
                />
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">{entry.name}</Typography>
                      {entry.isNew && (
                        <Chip label="Nuevo" size="small" color="success" sx={{ height: 18, fontSize: '0.65rem' }} />
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton size="small" onClick={() => handleMoveUp(index)} disabled={index === 0}>
                    <ArrowUpward fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleMoveDown(index)} disabled={index === mergeDocs.length - 1}>
                    <ArrowDownward fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleRemoveFromMerge(index)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
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
    </Box>
  );
};

export default DocumentSection;
