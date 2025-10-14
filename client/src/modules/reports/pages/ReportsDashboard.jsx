import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People,
  Inventory,
  AttachMoney,
  Warning,
} from '@mui/icons-material';
import ReportsGrid from '../components/ReportsGrid';
import CategoryChart from '../components/CategoryChart';
import RoleChart from '../components/RoleChart';
import reportsService from '../services/reportsService';

const ReportsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await reportsService.getSummary();
      setSummary(response.data);
    } catch (err) {
      setError('Error al cargar el resumen');
      console.error('Error loading summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!summary) {
    return null;
  }

  const cards = [
    {
      title: 'Total Usuarios',
      value: summary.users.total,
      subtitle: 'Usuarios registrados',
      icon: <People fontSize="large" />,
      color: 'primary',
    },
    {
      title: 'Items en Inventario',
      value: summary.inventory.totalItems,
      subtitle: 'Productos diferentes',
      icon: <Inventory fontSize="large" />,
      color: 'secondary',
    },
    {
      title: 'Valor Total',
      value: formatCurrency(summary.inventory.totalValue),
      subtitle: 'Valor del inventario',
      icon: <AttachMoney fontSize="large" />,
      color: 'success',
    },
    {
      title: 'Stock Bajo',
      value: summary.inventory.lowStockItems,
      subtitle: 'Items con menos de 10 unidades',
      icon: <Warning fontSize="large" />,
      color: 'warning',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard de Reportes
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Última actualización: {new Date(summary.timestamp).toLocaleString('es-ES')}
      </Typography>

      {/* Cards de resumen */}
      <Box sx={{ mb: 4 }}>
        <ReportsGrid cards={cards} />
      </Box>

      {/* Gráficos */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <RoleChart
            data={summary.users.byRole}
            title="Distribución de Usuarios por Rol"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CategoryChart
            data={summary.inventory.byCategory}
            title="Inventario por Categoría"
          />
        </Grid>

        {/* Tabla de estadísticas adicionales */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Estadísticas Detalladas
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Stock Total
                  </Typography>
                  <Typography variant="h5">
                    {summary.inventory.totalQuantity}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Categorías
                  </Typography>
                  <Typography variant="h5">
                    {summary.inventory.byCategory.length}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Usuarios Admin
                  </Typography>
                  <Typography variant="h5">
                    {summary.users.byRole.find(r => r.role === 'ADMIN')?.count || 0}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Usuarios Regulares
                  </Typography>
                  <Typography variant="h5">
                    {summary.users.byRole.find(r => r.role === 'USER')?.count || 0}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsDashboard;
