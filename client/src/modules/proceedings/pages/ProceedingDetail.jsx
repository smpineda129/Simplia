import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack,
  Description,
  Inventory,
  Share,
  AssignmentReturn,
  MoreVert,
  Close,
} from '@mui/icons-material';
import proceedingService from '../services/proceedingService';
import { usePermissions } from '../../../hooks/usePermissions';

import ProceedingDocuments from '../components/ProceedingDocuments';
import ProceedingBoxes from '../components/ProceedingBoxes';
import ProceedingExternalUsers from '../components/ProceedingExternalUsers';
import ProceedingLoans from '../components/ProceedingLoans';

const LOAN_LABELS = {
  custody: 'En custodia',
  loan: 'En préstamo',
  returned: 'Devuelto',
};

const LOAN_COLORS = {
  custody: 'info',
  loan: 'warning',
  returned: 'success',
};

const ProceedingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [proceeding, setProceeding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);

  useEffect(() => {
    loadProceeding();
  }, [id]);

  const loadProceeding = async () => {
    try {
      setLoading(true);
      const response = await proceedingService.getById(id);
      setProceeding(response.data);
    } catch (error) {
      console.error('Error loading proceeding:', error);
      setError('Error al cargar el expediente');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleCloseProceeding = async () => {
    if (!window.confirm('¿Cerrar este expediente? Se establecerá la fecha de cierre a hoy.')) return;
    try {
      await proceedingService.update(id, { endDate: new Date().toISOString().split('T')[0] });
      loadProceeding();
      setMenuAnchor(null);
    } catch (err) {
      console.error('Error closing proceeding:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !proceeding) {
    return (
      <Box>
        <Alert severity="error">{error || 'Expediente no encontrado'}</Alert>
        <Button onClick={() => navigate('/proceedings')} sx={{ mt: 2 }} startIcon={<ArrowBack />}>
          Volver a Expedientes
        </Button>
      </Box>
    );
  }

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toISOString().split('T')[0];
  };

  const loanStatus = proceeding.loan || 'custody';

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
        <IconButton onClick={() => navigate('/proceedings')} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Código / Nombre
          </Typography>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            {proceeding.name} - {proceeding.code}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {proceeding.id}
          </Typography>
        </Box>

        {/* Quick actions menu */}
        <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
          <MoreVert />
        </IconButton>
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
          <MenuItem onClick={() => { setMenuAnchor(null); setTabIndex(2); }}>
            <Share fontSize="small" sx={{ mr: 1 }} /> Compartir expediente
          </MenuItem>
          <MenuItem onClick={() => { setMenuAnchor(null); setTabIndex(3); }}>
            <AssignmentReturn fontSize="small" sx={{ mr: 1 }} /> Solicitar expediente en físico
          </MenuItem>
          <MenuItem onClick={handleCloseProceeding} disabled={!!proceeding.endDate}>
            <Close fontSize="small" sx={{ mr: 1 }} /> Cerrar expediente
          </MenuItem>
        </Menu>
      </Box>

      {/* Main Info Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Nombre</Typography>
            <Typography variant="body1">{proceeding.name}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Empresa</Typography>
            <Typography variant="body1">{proceeding.company?.name || '—'}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Anotaciones</Typography>
            <Typography variant="body1">{proceeding.description || proceeding.companyTwo || '—'}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Fecha inicial</Typography>
            <Typography variant="body1">{formatDate(proceeding.startDate)}</Typography>
          </Grid>

          {proceeding.endDate && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Fecha de cierre</Typography>
              <Typography variant="body1">{formatDate(proceeding.endDate)}</Typography>
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Tabla de retención</Typography>
            <Typography variant="body1">
              {proceeding.retentionLine?.retention?.name || '—'}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Estado</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Chip
                label={LOAN_LABELS[loanStatus] || loanStatus}
                color={LOAN_COLORS[loanStatus] || 'default'}
                size="small"
              />
              {proceeding.endDate && (
                <Chip label="Cerrado" color="default" size="small" />
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Documentos" icon={<Description />} iconPosition="start" />
          <Tab label="Cajas" icon={<Inventory />} iconPosition="start" />
          <Tab label="Compartido con" icon={<Share />} iconPosition="start" />
          <Tab label="Préstamos" icon={<AssignmentReturn />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <Box sx={{ mt: 2 }}>
        {tabIndex === 0 && (
          <ProceedingDocuments
            proceedingId={proceeding.id}
            documents={proceeding.documents}
            onUpdate={loadProceeding}
            isClosed={!!proceeding.endDate}
          />
        )}

        {tabIndex === 1 && (
          <ProceedingBoxes
            proceedingId={proceeding.id}
            companyId={proceeding.companyId}
            boxes={proceeding.boxes}
            onUpdate={loadProceeding}
          />
        )}

        {tabIndex === 2 && (
          <ProceedingExternalUsers
            proceedingId={proceeding.id}
            users={proceeding.sharedWith}
            onUpdate={loadProceeding}
          />
        )}

        {tabIndex === 3 && (
          <ProceedingLoans
            proceedingId={proceeding.id}
            companyId={proceeding.companyId}
            loans={proceeding.loans}
            onUpdate={loadProceeding}
          />
        )}
      </Box>
    </Box>
  );
};

export default ProceedingDetail;
