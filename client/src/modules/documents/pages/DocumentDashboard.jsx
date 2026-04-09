import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Description, Folder, TrendingUp, TrendingDown } from '@mui/icons-material';
import axiosInstance from '../../../api/axiosConfig';
import { useAuth } from '../../../hooks/useAuth';

const DocumentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [retentions, setRetentions] = useState([]);
  const [retentionId, setRetentionId] = useState('');

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

  const kpiCards = data
    ? [
        {
          title: 'Total Documentos',
          value: data.totalDocuments,
          icon: <Description sx={{ fontSize: 40, color: 'primary.main' }} />,
          growth: data.docGrowth,
        },
        {
          title: 'Total Expedientes',
          value: data.totalProceedings,
          icon: <Folder sx={{ fontSize: 40, color: 'secondary.main' }} />,
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
      <Grid container spacing={2} sx={{ mb: 3 }}>
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
      </Grid>

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
                          <Chip
                            icon={kpi.growth >= 0 ? <TrendingUp /> : <TrendingDown />}
                            label={`${kpi.growth >= 0 ? '+' : ''}${kpi.growth}% vs período anterior`}
                            color={kpi.growth >= 0 ? 'success' : 'error'}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </Box>
                      {kpi.icon}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* By Retention Table */}
          {data.byRetention?.length > 0 && (
            <Paper>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Expedientes por Retención
                </Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Serie / Código</TableCell>
                      <TableCell>Retención</TableCell>
                      <TableCell align="right">Expedientes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.byRetention.map((row, i) => (
                      <TableRow key={i} hover>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.retentionName}</TableCell>
                        <TableCell align="right">{row.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </>
      ) : null}
    </Box>
  );
};

export default DocumentDashboard;
