import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Button,
  InputAdornment,
  TablePagination,
  Divider,
} from '@mui/material';
import { 
  Description, 
  Folder, 
  TrendingUp, 
  TrendingDown,
  Visibility,
  Article,
  FolderOpen,
  TableChart,
  Search,
  FilterAltOff,
  Email,
  Schedule,
} from '@mui/icons-material';
import axiosInstance from '../../../api/axiosConfig';
import { useAuth } from '../../../hooks/useAuth';

const DocumentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [retentions, setRetentions] = useState([]);
  const [retentionId, setRetentionId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadRetentions();
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [startDate, endDate, retentionId]);

  const loadRetentions = async () => {
    try {
      const params = user?.companyId ? { companyId: user.companyId, limit: 100 } : { limit: 100 };
      const res = await axiosInstance.get('/retentions', { params });
      setRetentions(res.data?.data || []);
    } catch {
      // ignore
    }
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (retentionId) params.retentionId = retentionId;
      const res = await axiosInstance.get('/documents/dashboard', { params });
      setData(res.data?.data || null);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '—';
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(2)} MB`;
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('es-ES');
  };

  const handleNavigateToAssociation = (doc) => {
    if (doc.associationType === 'proceeding') {
      navigate(`/proceedings/${doc.association.id}`);
    } else if (doc.associationType === 'correspondence') {
      navigate(`/correspondences/${doc.association.id}`);
    }
  };

  const handleNavigateToRetentionLine = (retentionLineId) => {
    if (retentionLineId) {
      navigate(`/retentions/lines/${retentionLineId}`);
    }
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setRetentionId('');
    setSearchTerm('');
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredDocuments = data?.documents?.filter(doc => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      doc.name?.toLowerCase().includes(search) ||
      doc.association?.code?.toLowerCase().includes(search) ||
      doc.association?.name?.toLowerCase().includes(search) ||
      doc.association?.title?.toLowerCase().includes(search)
    );
  }) || [];

  const paginatedDocuments = filteredDocuments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const kpiCards = data
    ? [
        {
          title: 'Total Documentos',
          value: data.totalDocuments,
          icon: <Description sx={{ fontSize: 40, color: 'primary.main' }} />,
          growth: data.docGrowth,
          subtitle: startDate && endDate ? `${data.docGrowth}% en el rango seleccionado` : null,
        },
        {
          title: 'Total Expedientes',
          value: data.totalProceedings,
          icon: <Folder sx={{ fontSize: 40, color: 'secondary.main' }} />,
          growth: null,
        },
        {
          title: 'Total Correspondencias',
          value: data.totalCorrespondences,
          icon: <Email sx={{ fontSize: 40, color: 'info.main' }} />,
          growth: null,
        },
      ]
    : [];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard de Documentos
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Filtros</Typography>
          <Button
            startIcon={<FilterAltOff />}
            onClick={handleResetFilters}
            variant="outlined"
            size="small"
          >
            Limpiar Filtros
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              label="Fecha Inicio"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Fecha Fin"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Retención"
              select
              fullWidth
              value={retentionId}
              onChange={(e) => setRetentionId(e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              {retentions.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Buscar documentos"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              placeholder="Nombre, código..."
            />
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : data ? (
        <>
          {/* KPI Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {kpiCards.map((kpi) => (
              <Grid item xs={12} md={6} lg={4} key={kpi.title}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography color="text.secondary" variant="body2" gutterBottom>
                          {kpi.title}
                        </Typography>
                        <Typography variant="h3" fontWeight={700}>
                          {kpi.value?.toLocaleString()}
                        </Typography>
                        {kpi.growth !== null && kpi.growth !== undefined && (
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              icon={<TrendingUp />}
                              label={`${kpi.growth}%`}
                              color="info"
                              size="small"
                            />
                            {kpi.subtitle && (
                              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                {kpi.subtitle}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Box>
                      {kpi.icon}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Documents Table */}
          {filteredDocuments.length > 0 && (
            <Paper sx={{ mb: 3 }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Documentos ({filteredDocuments.length})
                </Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Tamaño</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Asociado a</TableCell>
                      <TableCell>Línea de Retención</TableCell>
                      <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedDocuments.map((doc) => (
                      <TableRow key={doc.id} hover>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                        <TableCell>{formatDate(doc.createdAt)}</TableCell>
                        <TableCell>
                          {doc.associationType === 'proceeding' ? (
                            <Chip
                              icon={<FolderOpen fontSize="small" />}
                              label={`Exp: ${doc.association.code}`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ) : doc.associationType === 'correspondence' ? (
                            <Chip
                              icon={<Article fontSize="small" />}
                              label={`Corr: ${doc.association.code || doc.association.title}`}
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                          ) : (
                            <Chip label="Sin asociar" size="small" variant="outlined" />
                          )}
                        </TableCell>
                        <TableCell>
                          {doc.association?.retentionLine ? (
                            <Chip
                              icon={<TableChart fontSize="small" />}
                              label={`${doc.association.retentionLine.series} - ${doc.association.retentionLine.code}`}
                              size="small"
                              color="info"
                              variant="outlined"
                            />
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {doc.associationType && (
                            <Tooltip title={doc.associationType === 'proceeding' ? 'Ver Expediente' : 'Ver Correspondencia'}>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleNavigateToAssociation(doc)}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {doc.association?.retentionLineId && (
                            <Tooltip title="Ver Línea de Retención">
                              <IconButton
                                size="small"
                                color="info"
                                onClick={() => handleNavigateToRetentionLine(doc.association.retentionLineId)}
                              >
                                <TableChart fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={filteredDocuments.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Filas por página:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
              />
            </Paper>
          )}

        </>
      ) : null}
    </Box>
  );
};

export default DocumentDashboard;
