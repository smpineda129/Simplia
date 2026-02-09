import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Grid,
  Box,
} from '@mui/material';
import {
  People,
  Business,
  Folder,
  Send,
} from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
import { usePermissions } from '../../../hooks/usePermissions';
import StatCard from '../components/StatCard';
import QuickAccessWidget from '../components/QuickAccessWidget';
import LoadingLogo from '../../../components/LoadingLogo';
import { dashboardService } from '../services/dashboardService';

const DashboardPage = () => {
  const { user, isOwner } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!permission) return true;
    if (!user?.allPermissions) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return user.allPermissions.includes(permission);
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const statsData = await dashboardService.getStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'Usuarios',
      icon: <People />,
      color: '#3f51b5',
      path: '/users',
      permission: 'user.view',
    },
    {
      title: 'Empresas',
      icon: <Business />,
      color: '#f50057',
      path: isOwner ? '/companies' : `/companies/${user?.companyId}`,
      permission: 'company.view',
    },
    {
      title: 'Expedientes',
      icon: <Folder />,
      color: '#4caf50',
      path: '/proceedings',
      permission: 'proceeding.view',
    },
    {
      title: 'Correspondencia',
      icon: <Send />,
      color: '#ff9800',
      path: '/correspondences',
      permission: 'correspondence.view',
    },
  ].filter(action => hasPermission(action.permission));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <LoadingLogo size={120} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bienvenido, {user?.name || user?.email}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Usuarios"
            value={stats?.users.total.toLocaleString()}
            icon={<People sx={{ fontSize: 32 }} />}
            color="#3f51b5"
            subtitle={stats?.users.subtitle}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Empresas"
            value={stats?.companies.total}
            icon={<Business sx={{ fontSize: 32 }} />}
            color="#f50057"
            subtitle={stats?.companies.subtitle}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Expedientes"
            value={stats?.proceedings.total}
            icon={<Folder sx={{ fontSize: 32 }} />}
            color="#4caf50"
            subtitle={stats?.proceedings.subtitle}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Correspondencia"
            value={stats?.correspondence.total}
            icon={<Send sx={{ fontSize: 32 }} />}
            color="#ff9800"
            subtitle={stats?.correspondence.subtitle}
          />
        </Grid>
      </Grid>

      {/* Quick Access */}
      <QuickAccessWidget actions={quickActions} />
    </Box>
  );
};

export default DashboardPage;
