import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CardActionArea,
} from '@mui/material';
import {
  People,
  Business,
  Folder,
  Send,
} from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Usuarios',
      value: 'Gestionar',
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#3f51b5',
      path: '/users',
    },
    {
      title: 'Empresas',
      value: 'Ver todas',
      icon: <Business sx={{ fontSize: 40 }} />,
      color: '#f50057',
      path: '/companies',
    },
    {
      title: 'Expedientes',
      value: 'Gestionar',
      icon: <Folder sx={{ fontSize: 40 }} />,
      color: '#4caf50',
      path: '/proceedings',
    },
    {
      title: 'Correspondencia',
      value: 'Ver todas',
      icon: <Send sx={{ fontSize: 40 }} />,
      color: '#ff9800',
      path: '/correspondences',
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
    </Box>
  );
};

export default DashboardPage;
