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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  Cancel,
  Visibility,
  Edit,
  Add,
} from '@mui/icons-material';
import retentionService from '../services/retentionService';
import ProceedingModalForm from '../../proceedings/components/ProceedingModalForm';
import proceedingService from '../../proceedings/services/proceedingService';
import companyService from '../../companies/services/companyService';
import { useAuth } from '../../../hooks/useAuth';

const RetentionLineDetail = () => {
  const { lineId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [line, setLine] = useState(null);
  const [proceedings, setProceedings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [showProceedingForm, setShowProceedingForm] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [retentions, setRetentions] = useState([]);

  useEffect(() => {
    loadLineDetail();
    loadProceedings();
  }, [lineId]);

  const loadLineDetail = async () => {
    try {
      setLoading(true);
      const response = await retentionService.getLineById(lineId);
      setLine(response.data);
    } catch (error) {
      console.error('Error loading retention line:', error);
      setError('Error al cargar la línea de retención');
    } finally {
      setLoading(false);
    }
  };

  const loadProceedings = async () => {
    try {
      const response = await retentionService.getLineProceedings(lineId);
      setProceedings(response.data || []);
    } catch (error) {
      console.error('Error loading proceedings:', error);
    }
  };

  const loadCompaniesAndRetentions = async () => {
    try {
      // Cargar empresas
      const companiesResponse = await companyService.getAll();
      setCompanies(companiesResponse.data || []);
      
      // Cargar retenciones
      const retentionsResponse = await retentionService.getAll();
      setRetentions(retentionsResponse.data || []);
    } catch (error) {
      console.error('Error loading companies and retentions:', error);
    }
  };

  const handleCreateProceeding = () => {
    loadCompaniesAndRetentions();
    setShowProceedingForm(true);
  };

  const handleSaveProceeding = async (values) => {
    try {
      await proceedingService.create(values);
      setShowProceedingForm(false);
      loadProceedings();
    } catch (error) {
      throw error;
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const getDispositionChips = () => {
    if (!line) return [];
    const dispositions = [];
    if (line.dispositionCt) dispositions.push({ label: 'CT', tooltip: 'Conservación Total', color: 'success' });
    if (line.dispositionE) dispositions.push({ label: 'E', tooltip: 'Eliminación', color: 'error' });
    if (line.dispositionM) dispositions.push({ label: 'M', tooltip: 'Microfilmación', color: 'info' });
    if (line.dispositionD) dispositions.push({ label: 'D', tooltip: 'Digitalización', color: 'primary' });
    if (line.dispositionS) dispositions.push({ label: 'S', tooltip: 'Selección', color: 'warning' });
    return dispositions;
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !line) {
    return (
      <Box>
        <Alert severity="error">{error || 'Línea de retención no encontrada'}</Alert>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }} startIcon={<ArrowBack />}>
          Volver
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Línea de Retención
          </Typography>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            {line.series} - {line.subseries}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Código: {line.code}
          </Typography>
        </Box>
      </Box>

      {/* Main Info Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Serie</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{line.series}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Subserie</Typography>
            <Typography variant="body1">{line.subseries || '—'}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Código</Typography>
            <Chip label={line.code} size="small" variant="outlined" />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Tabla de Retención</Typography>
            <Typography variant="body1">{line.retention?.name || '—'}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Documentos</Typography>
            <Typography variant="body1">{line.documents || '—'}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Retención Local</Typography>
            <Chip label={`${line.localRetention} años`} size="small" color="primary" />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Retención Central</Typography>
            <Chip label={`${line.centralRetention} años`} size="small" color="secondary" />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Disposición Final</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
              {getDispositionChips().map((disp, index) => (
                <Tooltip key={index} title={disp.tooltip}>
                  <Chip
                    label={disp.label}
                    size="small"
                    color={disp.color}
                    sx={{ minWidth: 50 }}
                  />
                </Tooltip>
              ))}
              {getDispositionChips().length === 0 && (
                <Chip label="Sin disposición" size="small" variant="outlined" />
              )}
            </Box>
          </Grid>

          {line.procedure && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">Procedimiento</Typography>
              <Typography variant="body1">{line.procedure}</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`Expedientes (${proceedings.length})`} />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <Box sx={{ mt: 2 }}>
        {tabIndex === 0 && (
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Expedientes Asociados
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateProceeding}
              >
                Crear Expediente
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Empresa</TableCell>
                    <TableCell>Fecha Inicio</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {proceedings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No hay expedientes asociados a esta línea de retención
                      </TableCell>
                    </TableRow>
                  ) : (
                    proceedings.map((proceeding) => (
                      <TableRow key={proceeding.id} hover>
                        <TableCell>
                          <Chip label={proceeding.code} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{proceeding.name}</TableCell>
                        <TableCell>{proceeding.company?.name || '—'}</TableCell>
                        <TableCell>{formatDate(proceeding.startDate)}</TableCell>
                        <TableCell>
                          {proceeding.endDate ? (
                            <Chip label="Cerrado" size="small" color="default" />
                          ) : (
                            <Chip label="Activo" size="small" color="success" />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Ver detalle">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => navigate(`/proceedings/${proceeding.id}`)}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>

      {/* Modal para crear expediente */}
      {showProceedingForm && (
        <ProceedingModalForm
          open={showProceedingForm}
          onClose={() => setShowProceedingForm(false)}
          onSave={handleSaveProceeding}
          proceeding={{
            retentionLineId: lineId,
            retentionLine: {
              retentionId: line?.retention?.id,
            },
            companyId: user?.companyId || '',
          }}
          companies={companies}
          retentions={retentions}
          onCompanyChange={async (companyId) => {
            try {
              const response = await retentionService.getAll({ companyId });
              setRetentions(response.data || []);
            } catch (error) {
              console.error('Error loading retentions:', error);
            }
          }}
        />
      )}
    </Box>
  );
};

export default RetentionLineDetail;
