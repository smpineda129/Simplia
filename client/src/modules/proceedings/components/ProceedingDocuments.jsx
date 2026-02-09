import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CloudUpload,
  InsertDriveFile,
  Delete,
  Download,
  Description
} from '@mui/icons-material';
import { documentService } from '../../documents';
import { usePermissions } from '../../../hooks/usePermissions';

const ProceedingDocuments = ({ proceedingId, documents = [], onUpdate }) => {
  const { hasPermission } = usePermissions();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('proceedingId', proceedingId);

      // Upload files one by one or as multiple if backend supports it
      // For now, let's assume one by one or the service handles it
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      // Note: check if documentService.create supports FormData directly or needs specific structure
      // Assuming standard upload pattern
      await documentService.create(formData);

      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Error al subir el archivo. Intente nuevamente.');
    } finally {
      setUploading(false);
      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('¿Está seguro de eliminar este documento?')) return;

    try {
      await documentService.delete(docId);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Error al eliminar el documento.');
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <Description sx={{ mr: 1 }} /> Documentos
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          mb: 3,
          backgroundColor: '#fafafa',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#f0f0f0',
          },
        }}
        onClick={() => hasPermission('document.create') && fileInputRef.current?.click()}
      >
        <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
        <Typography variant="body1" gutterBottom>
          Suelta los archivos aquí, pégalos o búscalos
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Todos los documentos cargados aquí automáticamente se adjuntarán a este expediente.
        </Typography>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
          disabled={!hasPermission('document.create')}
        />
      </Box>

      {uploading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} />
          <Typography sx={{ ml: 2 }}>Subiendo archivos...</Typography>
        </Box>
      )}

      <List>
        {documents.map((doc) => (
          <ListItem
            key={doc.id}
            secondaryAction={
              <Box>
                {/* <IconButton edge="end" aria-label="download" sx={{ mr: 1 }}>
                  <Download />
                </IconButton> */}
                {hasPermission('document.delete') && (
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(doc.id)}>
                    <Delete color="error" />
                  </IconButton>
                )}
              </Box>
            }
          >
            <ListItemIcon>
              <InsertDriveFile />
            </ListItemIcon>
            <ListItemText
              primary={doc.name || doc.originalName}
              secondary={new Date(doc.createdAt).toLocaleDateString()}
            />
          </ListItem>
        ))}
        {documents.length === 0 && !uploading && (
          <Typography variant="body2" color="text.secondary" align="center">
            No hay documentos adjuntos.
          </Typography>
        )}
      </List>
    </Paper>
  );
};

export default ProceedingDocuments;
