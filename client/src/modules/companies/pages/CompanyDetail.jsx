import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Snackbar,
} from '@mui/material';
import { ArrowBack, Business, AccountTree, Mail, Warehouse, Inventory, ReplayCircleFilled, OpenInNew, ContentCopy } from '@mui/icons-material';
import { companyService } from '../index';
import CompanyAreas from '../components/CompanyAreas';
import CompanyCorrespondenceTypes from '../components/CompanyCorrespondenceTypes';
import CompanyWarehouses from '../components/CompanyWarehouses';
import CompanyBoxes from '../components/CompanyBoxes';
import LoadingLogo from '../../../components/LoadingLogo';
import { useAuth } from '../../../hooks/useAuth';

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isOwner } = useAuth();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [copySnackbar, setCopySnackbar] = useState(false);

  useEffect(() => {
    loadCompany();
  }, [id]);

  const loadCompany = async () => {
    try {
      setLoading(true);
      const response = await companyService.getById(id);
      setCompany(response.data);
    } catch (error) {
      setError('Error al cargar la empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <LoadingLogo size={120} />
      </Box>
    );
  }

  if (error || !company) {
    return (
      <Box>
        <Alert severity="error">{error || 'Empresa no encontrada'}</Alert>
        <Button onClick={() => navigate('/companies')} sx={{ mt: 2 }}>
          Volver a Empresas
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        {isOwner && (
          <IconButton onClick={() => navigate('/companies')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
        )}
        <Business sx={{ mr: 1, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4">{company.name}</Typography>
      </Box>

      {/* Company Info Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Identificador
            </Typography>
            <Typography variant="body1" gutterBottom>
              {company.identifier}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Código Corto
            </Typography>
            <Typography variant="body1" gutterBottom>
              {company.short}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1" gutterBottom>
              {company.email || 'No especificado'}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Sitio Web
            </Typography>
            <Typography variant="body1" gutterBottom>
              {company.website || 'No especificado'}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Máximo de Usuarios
            </Typography>
            <Chip label={company.maxUsers} color="primary" size="small" />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Estado
            </Typography>
            <Chip
              label={company.isActive ? 'Activa' : 'Inactiva'}
              color={company.isActive ? 'success' : 'default'}
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Portal de Correspondencia */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <OpenInNew sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={600}>
            Portal de Correspondencia
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enlace público para que usuarios externos radiquen correspondencia en esta empresa.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography
            variant="body2"
            sx={{
              flex: 1,
              minWidth: 0,
              bgcolor: 'grey.100',
              px: 2,
              py: 1,
              borderRadius: 1,
              fontFamily: 'monospace',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {`${window.location.origin}/correspondence/${company.id}/company`}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ContentCopy />}
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/correspondence/${company.id}/company`);
              setCopySnackbar(true);
            }}
          >
            Copiar
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<OpenInNew />}
            href={`/correspondence/${company.id}/company`}
            target="_blank"
          >
            Abrir portal
          </Button>
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<AccountTree />} label="Áreas" iconPosition="start" />
          <Tab icon={<Mail />} label="Tipos de Correspondencia" iconPosition="start" />
          <Tab icon={<Warehouse />} label="Bodegas" iconPosition="start" />
          <Tab icon={<Inventory />} label="Cajas" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {currentTab === 0 && <CompanyAreas companyId={company.id} />}
        {currentTab === 1 && <CompanyCorrespondenceTypes companyId={company.id} />}
        {currentTab === 2 && <CompanyWarehouses companyId={company.id} />}
        {currentTab === 3 && <CompanyBoxes companyId={company.id} />}
      </Box>

      <Snackbar
        open={copySnackbar}
        autoHideDuration={3000}
        onClose={() => setCopySnackbar(false)}
        message="Enlace copiado al portapapeles"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default CompanyDetail;
