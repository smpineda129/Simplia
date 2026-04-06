import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import DescriptionIcon from '@mui/icons-material/Description';
import surveyService from '../services/surveyService';
import entidadesPublicasConfig from '../config/EntidadesPublicasConfig';
import mgdaConfig from '../config/MGMAconfig';
import entidadesPrivadasConfig from '../config/surveyConfig';

const FORM_TYPE_LABELS = {
  entidades_publicas: 'Entidades Públicas',
  mgda: 'MGDA',
  entidades_privadas: 'Entidades Privadas',
};

const FORM_CONFIGS = {
  entidades_publicas: entidadesPublicasConfig,
  mgda: mgdaConfig,
  entidades_privadas: entidadesPrivadasConfig,
};

const extractElements = (elements = []) => {
  const fields = [];
  for (const el of elements) {
    if (el.type === 'html') continue;
    if (el.type === 'panel') {
      fields.push(...extractElements(el.elements));
    } else if (el.name) {
      fields.push({ name: el.name, title: el.title || el.name });
    }
  }
  return fields;
};

const getPageStructure = (config) => {
  if (!config || !config.pages) return [];
  return config.pages.map((page) => ({
    pageTitle: page.title || page.name,
    fields: extractElements(page.elements),
  }));
};

const SurveyResultsPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [surveysResponse, statsResponse] = await Promise.all([
        surveyService.getAll({ limit: 50 }),
        surveyService.getStats(),
      ]);
      setSurveys(surveysResponse.data || []);
      setStats(statsResponse.data || null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar los resultados. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta respuesta?')) {
      try {
        await surveyService.delete(id);
        fetchData();
      } catch (err) {
        console.error('Error deleting survey:', err);
        alert('Error al eliminar la respuesta');
      }
    }
  };

  const handleView = (survey) => {
    setSelectedSurvey(survey);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSurvey(null);
  };

  const handleGenerateIndividualPresentation = async (survey) => {
    try {
      const blob = await surveyService.generateIndividualPresentation(survey._id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const entityName = survey.surveyData.nombre_entidad || 'Entidad';
      link.download = `Diagnostico_${entityName.replace(/\s+/g, '_')}_${Date.now()}.pptx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating individual presentation:', err);
      alert('Error al generar la presentación individual. Por favor, intente nuevamente.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const filteredSurveys = filterType === 'all'
    ? surveys
    : surveys.filter((s) => s.formType === filterType);

  const typeCounts = Object.fromEntries(
    Object.keys(FORM_TYPE_LABELS).map((key) => [
      key,
      surveys.filter((s) => s.formType === key).length,
    ])
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Resultados de Diagnósticos
          </Typography>
          <Tooltip title="Actualizar datos">
            <IconButton onClick={fetchData} color="primary" sx={{ bgcolor: 'primary.50', '&:hover': { bgcolor: 'primary.100' } }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Stats */}
        {stats && (
          <Paper elevation={0} sx={{ p: 2.5, mb: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6} sm={3}>
                <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1 }}>
                  Total
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {stats.total}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1 }}>
                  Completadas
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {stats.completed}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1 }}>
                  Borradores
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {stats.draft}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1 }}>
                  Completado
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {stats.completionRate}%
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Filtros por tipo */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Paper
              elevation={0}
              onClick={() => setFilterType('all')}
              sx={{
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: 2,
                border: 2,
                borderColor: filterType === 'all' ? 'primary.main' : 'transparent',
                bgcolor: filterType === 'all' ? 'primary.50' : 'background.paper',
                transition: 'all 0.2s',
                '&:hover': { borderColor: 'primary.light', bgcolor: 'primary.50' },
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Todos
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {surveys.length}
              </Typography>
            </Paper>
          </Grid>
          {Object.entries(FORM_TYPE_LABELS).map(([key, label]) => (
            <Grid item xs={6} sm={3} key={key}>
              <Paper
                elevation={0}
                onClick={() => setFilterType(filterType === key ? 'all' : key)}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderRadius: 2,
                  border: 2,
                  borderColor: filterType === key ? 'primary.main' : 'transparent',
                  bgcolor: filterType === key ? 'primary.50' : 'background.paper',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: 'primary.light', bgcolor: 'primary.50' },
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {label}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {typeCounts[key]}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Tabla */}
        <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Entidad
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Tipo
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Estado
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
              {filteredSurveys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      No hay resultados disponibles
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSurveys.map((survey) => (
                  <TableRow
                    key={survey._id}
                    sx={{ '&:hover': { bgcolor: 'action.hover' }, '&:last-child td': { borderBottom: 0 } }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {survey.surveyData?.nombre_entidad || survey.surveyData?.NOMBRE_ENTIDAD || survey._id.substring(0, 8) + '...'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(survey.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={FORM_TYPE_LABELS[survey.formType] || survey.formType}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          bgcolor: survey.formType === 'entidades_publicas' ? '#e3f2fd'
                            : survey.formType === 'mgda' ? '#f3e5f5'
                            : '#e8f5e9',
                          color: survey.formType === 'entidades_publicas' ? '#1565c0'
                            : survey.formType === 'mgda' ? '#7b1fa2'
                            : '#2e7d32',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={survey.status === 'completed' ? 'Completado' : 'Borrador'}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          bgcolor: survey.status === 'completed' ? '#e8f5e9' : '#fff3e0',
                          color: survey.status === 'completed' ? '#2e7d32' : '#e65100',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {survey.completedAt ? formatDate(survey.completedAt) : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        <Tooltip title="Ver detalles">
                          <IconButton size="small" onClick={() => handleView(survey)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {survey.formType === 'entidades_privadas' && (
                          <Tooltip title="Generar Presentación">
                            <IconButton size="small" onClick={() => handleGenerateIndividualPresentation(survey)} color="primary">
                              <DescriptionIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Eliminar">
                          <IconButton size="small" onClick={() => handleDelete(survey._id)} sx={{ color: 'error.light', '&:hover': { color: 'error.main' } }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog para ver detalles */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
              Detalles de la Respuesta
            </Typography>
            {selectedSurvey && (
              <Typography variant="caption" color="text.secondary">
                ID: {selectedSurvey._id}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent dividers>
            {selectedSurvey && (() => {
              const config = FORM_CONFIGS[selectedSurvey.formType];
              const pages = getPageStructure(config);
              const data = selectedSurvey.surveyData || {};

              return (
                <Box>
                  <Chip
                    label={FORM_TYPE_LABELS[selectedSurvey.formType] || selectedSurvey.formType}
                    color="primary"
                    sx={{ mb: 3 }}
                  />

                  {pages.map((page, pageIdx) => {
                    const fieldsWithValue = page.fields.filter(
                      (f) => data[f.name] !== undefined && data[f.name] !== ''
                    );
                    if (fieldsWithValue.length === 0) return null;
                    return (
                      <Box key={pageIdx} sx={{ mb: 4 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            mb: 2,
                            color: 'primary.main',
                            fontWeight: 600,
                            borderBottom: 1,
                            borderColor: 'divider',
                            pb: 1,
                          }}
                        >
                          {page.pageTitle}
                        </Typography>
                        <Grid container spacing={2}>
                          {fieldsWithValue.map((field) => {
                            const value = data[field.name];
                            const displayValue = Array.isArray(value)
                              ? value.join(', ')
                              : typeof value === 'boolean'
                              ? value ? 'Sí' : 'No'
                              : String(value);
                            const isNumeric = typeof value === 'number';
                            const bgColor = value === 'Cumple'
                              ? '#e8f5e9'
                              : value === 'Parcial'
                              ? '#fff3e0'
                              : value === 'No cumple'
                              ? '#ffebee'
                              : undefined;
                            return (
                              <Grid item xs={12} sm={6} key={field.name}>
                                <Paper
                                  elevation={1}
                                  sx={{
                                    p: 2,
                                    ...(bgColor && { bgcolor: bgColor }),
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}
                                  >
                                    {field.title}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}
                                  >
                                    {isNumeric ? `${displayValue} puntos` : displayValue}
                                  </Typography>
                                </Paper>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>
                    );
                  })}

                  {/* Metadata */}
                  <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Fecha de creación: {formatDate(selectedSurvey.createdAt)}
                    </Typography>
                    {selectedSurvey.completedAt && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Fecha de completado: {formatDate(selectedSurvey.completedAt)}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" display="block">
                      Estado: {selectedSurvey.status}
                    </Typography>
                  </Box>
                </Box>
              );
            })()}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default SurveyResultsPage;
