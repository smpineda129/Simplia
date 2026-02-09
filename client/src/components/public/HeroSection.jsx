import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { 
  TrendingUp, 
  Speed, 
  Security, 
  CloudDone,
  ArrowForward 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <TrendingUp />, label: 'Optimización de Procesos' },
    { icon: <Speed />, label: 'Acceso Inmediato' },
    { icon: <Security />, label: 'Seguridad Garantizada' },
    { icon: <CloudDone />, label: 'Cloud Storage' },
  ];

  return (
    <Box
      id="inicio"
      sx={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}05 100%)`,
        pt: 8,
        pb: 8,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                letterSpacing: 2,
              }}
            >
              GESTIÓN DOCUMENTAL INTELIGENTE
            </Typography>
            
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                fontWeight: 800,
                mt: 2,
                mb: 3,
                lineHeight: 1.2,
              }}
            >
              Gestión Documental{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>
                Inteligente y Segura
              </Box>
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 600 }}
            >
              Optimizamos el flujo de trabajo de tu empresa con una plataforma completa 
              de gestión documental. Accede a tus documentos desde cualquier lugar, 
              mantén el control total y cumple con las normativas vigentes.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/auth/register')}
                sx={{ px: 4, py: 1.5 }}
              >
                Empezar Gratis
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  const element = document.querySelector('#contacto');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                sx={{ px: 4, py: 1.5 }}
              >
                Ver Demostración
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, mt: 6, flexWrap: 'wrap' }}>
              {features.map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="body2" fontWeight={500}>
                    {feature.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={8}
              sx={{
                p: 3,
                borderRadius: 4,
                background: (theme) => theme.palette.background.paper,
              }}
            >
              <Box
                sx={{
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.primary.main}10 100%)`,
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: '80%',
                    height: '80%',
                    background: 'white',
                    borderRadius: 2,
                    boxShadow: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    p: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FF5F56' }} />
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FFBD2E' }} />
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#27C93F' }} />
                  </Box>
                  
                  <Box sx={{ flex: 1, display: 'flex', gap: 2 }}>
                    {[1, 2, 3].map((i) => (
                      <Box
                        key={i}
                        sx={{
                          flex: 1,
                          background: (theme) => `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                          borderRadius: 1,
                          opacity: 0.7 + (i * 0.1),
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
