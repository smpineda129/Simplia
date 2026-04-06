import { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Alert,
  IconButton,
  Chip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import custodiaService from '../services/custodiaService';

const ACCEPTED_TYPES = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'text/plain': '.txt',
  'text/csv': '.csv',
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const DocumentUpload = ({ onUploadComplete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validateFile = (file) => {
    if (!Object.keys(ACCEPTED_TYPES).includes(file.type)) {
      return 'Tipo de archivo no soportado. Use PDF, DOCX, TXT o CSV.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'El archivo excede el tamaño máximo de 50MB.';
    }
    return null;
  };

  const handleFile = useCallback((file) => {
    setError(null);
    setSuccess(false);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      await custodiaService.uploadDocument(selectedFile, setProgress);
      setSuccess(true);
      setSelectedFile(null);
      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      console.error('Error uploading:', err);
      setError(err.response?.data?.message || 'Error al subir el archivo. El backend aún no está implementado.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
    setSuccess(false);
    setProgress(0);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(false)}>
          Documento subido exitosamente. El procesamiento comenzará automáticamente.
        </Alert>
      )}

      {/* Drag & Drop Zone */}
      <Paper
        elevation={0}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && document.getElementById('custodia-file-input').click()}
        sx={{
          p: 4,
          textAlign: 'center',
          cursor: uploading ? 'default' : 'pointer',
          borderRadius: 3,
          border: 2,
          borderStyle: 'dashed',
          borderColor: dragActive ? 'primary.main' : 'divider',
          bgcolor: dragActive ? 'primary.50' : 'background.paper',
          transition: 'all 0.2s',
          '&:hover': !uploading ? {
            borderColor: 'primary.light',
            bgcolor: 'grey.50',
          } : {},
        }}
      >
        <input
          id="custodia-file-input"
          type="file"
          hidden
          accept=".pdf,.docx,.txt,.csv"
          onChange={handleInputChange}
          disabled={uploading}
        />

        {!selectedFile ? (
          <Box>
            <CloudUploadIcon sx={{ fontSize: 56, color: 'primary.light', mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Arrastre un archivo aquí o haga clic para seleccionar
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Formatos soportados: PDF, DOCX, TXT, CSV — Máximo 50MB
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              {Object.values(ACCEPTED_TYPES).map((ext) => (
                <Chip key={ext} label={ext.toUpperCase()} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>
        ) : (
          <Box onClick={(e) => e.stopPropagation()}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <InsertDriveFileIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(selectedFile.size)}
                </Typography>
              </Box>
              {!uploading && (
                <IconButton size="small" onClick={handleRemoveFile}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            {uploading && (
              <Box sx={{ width: '100%', mb: 2 }}>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {progress}% subido
                </Typography>
              </Box>
            )}

            {!uploading && (
              <Box
                component="button"
                onClick={handleUpload}
                sx={{
                  px: 4,
                  py: 1.2,
                  bgcolor: 'primary.main',
                  color: 'white',
                  border: 'none',
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                Subir Documento
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default DocumentUpload;
