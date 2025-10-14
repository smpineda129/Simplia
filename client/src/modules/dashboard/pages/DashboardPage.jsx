import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CardActionArea,
  CircularProgress,
} from '@mui/material';
import {
  People,
  Inventory,
  Assessment,
  TrendingUp,
} from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
import { reportsService } from '../../reports';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await reportsService.getSummary();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
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

  const cards = [
    {
      title: 'Usuarios',
      value: stats?.users?.total || 0,
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#3f51b5',
      path: '/users',
    },
    {
      title: 'Items en Inventario',
      value: stats?.inventory?.totalItems || 0,
      icon: <Inventory sx={{ fontSize: 40 }} />,
      color: '#f50057',
      path: '/inventory',
    },
    {
      title: 'Valor Total',
      value: stats ? formatCurrency(stats.inventory?.totalValue || 0) : '$0',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#4caf50',
      path: '/reports',
    },
    {
      title: 'Ver Reportes',
      value: 'Completo',
      icon: <Assessment sx={{ fontSize: 40 }} />,
      color: '#ff9800',
      path: '/reports',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Bienvenido, {user?.name || user?.email}
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea
                  onClick={() => navigate(card.path)}
                  sx={{ height: '100%' }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          color: card.color,
                          mb: 2,
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom color="text.secondary">
                        {card.title}
                      </Typography>
                      <Typography variant="h4" sx={{ color: card.color }}>
                        {card.value}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default DashboardPage;
