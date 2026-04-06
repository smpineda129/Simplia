import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Tabs,
  Tab,
  Paper,
  Grid,
  Chip,
  Alert,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import ChatIcon from '@mui/icons-material/Chat';
import BarChartIcon from '@mui/icons-material/BarChart';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import StorageIcon from '@mui/icons-material/Storage';
import DocumentUpload from '../components/DocumentUpload';
import DocumentList from '../components/DocumentList';
import ChatInterface from '../components/ChatInterface';
import custodiaService from '../services/custodiaService';

const TabPanel = ({ children, value, index }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ pt: 3 }}>
    {value === index && children}
  </Box>
);

const CustodiaPage = () => {
  const [tab, setTab] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendReady, setBackendReady] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await custodiaService.getDocuments();
      setDocuments(response.data || []);
      setBackendReady(true);
    } catch (err) {
      console.warn('Backend custodia no disponible:', err.message);
      setDocuments([]);
      setBackendReady(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await custodiaService.getStats();
      setStats(response.data || null);
    } catch {
      setStats(null);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchStats();
  }, []);

  const handleDelete = async (id) => {
    try {
      await custodiaService.deleteDocument(id);
      fetchDocuments();
      fetchStats();
    } catch (err) {
      alert('Error al eliminar el documento');
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      const blob = await custodiaService.downloadDocument(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error al descargar el documento');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <StorageIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Custodia Digital
            </Typography>
            <Chip label="Beta" size="small" color="warning" sx={{ fontWeight: 600 }} />
          </Box>
          <Typography variant="body1" color="text.secondary">
            Suba documentos y consulte información con inteligencia artificial en lenguaje natural.
          </Typography>
        </Box>

        {!backendReady && (
          <Alert severity="info" sx={{ mb: 3 }}>
            El backend de Custodia Digital aún no está implementado. Esta es una vista previa de la interfaz.
            Las funcionalidades estarán disponibles cuando se complete la integración con S3, OpenAI y MongoDB Vector Search.
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Paper elevation={0} sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: '#e3f2fd' }}>
              <FolderIcon sx={{ fontSize: 28, color: '#1565c0', mb: 0.5 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1565c0' }}>
                {stats?.totalDocuments ?? documents.length}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Documentos
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper elevation={0} sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: '#e8f5e9' }}>
              <StorageIcon sx={{ fontSize: 28, color: '#2e7d32', mb: 0.5 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                {stats?.totalChunks ?? 0}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Fragmentos Indexados
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper elevation={0} sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: '#f3e5f5' }}>
              <ChatIcon sx={{ fontSize: 28, color: '#7b1fa2', mb: 0.5 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#7b1fa2' }}>
                {stats?.totalQueries ?? 0}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Consultas Realizadas
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper elevation={0} sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: '#fff3e0' }}>
              <SmartToyIcon sx={{ fontSize: 28, color: '#e65100', mb: 0.5 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#e65100' }}>
                {stats?.documentsReady ?? 0}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Listos para Consulta
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              px: 2,
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', minHeight: 52 },
            }}
          >
            <Tab icon={<CloudUploadIcon />} iconPosition="start" label="Subir Documentos" />
            <Tab icon={<FolderIcon />} iconPosition="start" label="Mis Documentos" />
            <Tab icon={<ChatIcon />} iconPosition="start" label="Consultar con IA" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* Tab 0: Upload */}
            <TabPanel value={tab} index={0}>
              <DocumentUpload
                onUploadComplete={() => {
                  fetchDocuments();
                  fetchStats();
                }}
              />
            </TabPanel>

            {/* Tab 1: Document List */}
            <TabPanel value={tab} index={1}>
              <DocumentList
                documents={documents}
                onDelete={handleDelete}
                onDownload={handleDownload}
                loading={loading}
              />
            </TabPanel>

            {/* Tab 2: Chat */}
            <TabPanel value={tab} index={2}>
              <ChatInterface />
            </TabPanel>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CustodiaPage;
