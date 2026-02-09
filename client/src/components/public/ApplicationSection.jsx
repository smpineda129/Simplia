import { Box, Container, Typography, Grid, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  CheckCircle,
  Dashboard,
  CloudQueue,
  Lock,
  Devices,
  Speed,
  Group,
  Timeline,
} from '@mui/icons-material';

const ApplicationSection = () => {
  const features = [
    {
      icon: <Dashboard />,
      title: 'Panel de Control Intuitivo',
      description: 'Interfaz moderna y fácil de usar con acceso rápido a todas las funcionalidades del sistema.',
    },
    {
      icon: <CloudQueue />,
      title: 'Almacenamiento en la Nube',
      description: 'Accede a tus documentos desde cualquier lugar, en cualquier momento, con sincronización automática.',
    },
    {
      icon: <Lock />,
      title: 'Seguridad Avanzada',
      description: 'Encriptación de extremo a extremo, autenticación multifactor y control de acceso granular.',
    },
    {
      icon: <Devices />,
      title: 'Multi-dispositivo',
      description: 'Compatible con escritorio, tablet y móvil. Trabaja desde cualquier dispositivo sin limitaciones.',
    },
    {
      icon: <Speed />,
      title: 'Rendimiento Optimizado',
      description: 'Carga rápida de documentos, búsqueda instantánea y procesamiento eficiente de grandes volúmenes.',
    },
    {
      icon: <Group />,
      title: 'Colaboración en Equipo',
      description: 'Comparte documentos, asigna tareas y colabora en tiempo real con tu equipo de trabajo.',
    },
  ];

  const benefits = [
    'Reducción de costos operativos hasta un 60%',
    'Acceso instantáneo a documentos 24/7',
    'Cumplimiento normativo garantizado',
    'Auditorías automáticas y trazabilidad completa',
    'Integración con sistemas existentes',
    'Soporte técnico especializado',
  ];

  return (
    <Box
      id="aplicativo"
      sx={{
        py: 10,
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              letterSpacing: 2,
            }}
          >
            NUESTRA PLATAFORMA
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
              fontWeight: 700,
              mt: 2,
              mb: 2,
            }}
          >
            Transformación Digital y{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              Acceso Inmediato
            </Box>
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: 'auto' }}
          >
            Nuestra plataforma combina tecnología de vanguardia con una interfaz intuitiva 
            para ofrecer la mejor experiencia en gestión documental.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  p: 3,
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {feature.icon}
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Paper
          elevation={0}
          sx={{
            p: 6,
            background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            borderRadius: 4,
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                ¿Listo para optimizar su gestión documental?
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                Únete a más de 500 empresas que ya confían en nuestra plataforma 
                para gestionar sus documentos de forma eficiente y segura.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.95)' }}>
                <Typography variant="h6" color="text.primary" fontWeight={700} gutterBottom>
                  Beneficios Clave
                </Typography>
                <List dense>
                  {benefits.map((benefit, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={benefit}
                        primaryTypographyProps={{
                          color: 'text.primary',
                          fontWeight: 500,
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default ApplicationSection;
