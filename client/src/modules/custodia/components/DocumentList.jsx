import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

const FILE_ICONS = {
  'application/pdf': <PictureAsPdfIcon fontSize="small" sx={{ color: '#e53935' }} />,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <DescriptionIcon fontSize="small" sx={{ color: '#1565c0' }} />,
  'text/plain': <TextSnippetIcon fontSize="small" sx={{ color: '#616161' }} />,
  'text/csv': <TextSnippetIcon fontSize="small" sx={{ color: '#2e7d32' }} />,
};

const STATUS_CONFIG = {
  uploaded: { label: 'Subido', color: '#e3f2fd', textColor: '#1565c0' },
  processing: { label: 'Procesando', color: '#fff3e0', textColor: '#e65100' },
  ready: { label: 'Listo', color: '#e8f5e9', textColor: '#2e7d32' },
  error: { label: 'Error', color: '#ffebee', textColor: '#c62828' },
};

const DocumentList = ({ documents = [], onDelete, onDownload, loading }) => {
  const [search, setSearch] = useState('');

  const filteredDocs = documents.filter((doc) =>
    doc.fileName?.toLowerCase().includes(search.toLowerCase())
  );

  const formatFileSize = (bytes) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = (doc) => {
    if (window.confirm(`¿Eliminar "${doc.fileName}"? Se borrarán también los datos procesados.`)) {
      if (onDelete) onDelete(doc._id);
    }
  };

  return (
    <Box>
      {/* Search */}
      <TextField
        size="small"
        placeholder="Buscar documento..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2, width: 320 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Documento
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Tamaño
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Estado
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Chunks
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Fecha
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }} align="right">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDocs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <InsertDriveFileIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {documents.length === 0
                      ? 'No hay documentos subidos. Suba su primer documento para comenzar.'
                      : 'No se encontraron documentos con esa búsqueda.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredDocs.map((doc) => {
                const status = STATUS_CONFIG[doc.status] || STATUS_CONFIG.uploaded;
                return (
                  <TableRow
                    key={doc._id}
                    sx={{ '&:hover': { bgcolor: 'action.hover' }, '&:last-child td': { borderBottom: 0 } }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {FILE_ICONS[doc.mimeType] || <InsertDriveFileIcon fontSize="small" color="action" />}
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {doc.fileName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {doc.mimeType?.split('/').pop()?.toUpperCase() || ''}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatFileSize(doc.fileSize)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={status.label}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          bgcolor: status.color,
                          color: status.textColor,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {doc.totalChunks ?? '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDate(doc.createdAt)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        <Tooltip title="Descargar">
                          <IconButton size="small" onClick={() => onDownload && onDownload(doc._id, doc.fileName)}>
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(doc)}
                            sx={{ color: 'error.light', '&:hover': { color: 'error.main' } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DocumentList;
