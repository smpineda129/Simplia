import { Box, Container, Typography, Grid, Paper, Button, Chip } from '@mui/material';
import {
  Article,
  VideoLibrary,
  MenuBook,
  Download,
  ArrowForward,
} from '@mui/icons-material';

const ResourcesSection = () => {
  const resources = [
    {
      type: 'Guía',
      icon: <MenuBook />,
      title: 'Guía Completa de Gestión Documental',
      description: 'Aprende las mejores prácticas para implementar un sistema de gestión documental efectivo en tu organización.',
      tags: ['PDF', '45 páginas', 'Gratis'],
      color: '#1976d2',
    },
    {
      type: 'Whitepaper',
      icon: <Article />,
      title: 'Transformación Digital en la Gestión de Archivos',
      description: 'Descubre cómo la digitalización puede reducir costos y mejorar la eficiencia operativa de tu empresa.',
      tags: ['PDF', '28 páginas', 'Gratis'],
      color: '#388e3c',
    },
    {
      type: 'Video',
      icon: <VideoLibrary />,
      title: 'Demo en Vivo de la Plataforma',
      description: 'Mira una demostración completa de todas las funcionalidades y capacidades de nuestra plataforma.',
      tags: ['Video', '15 min', 'Gratis'],
      color: '#d32f2f',
    },
    {
      type: 'Caso de Éxito',
      icon: <Article />,
      title: 'Banco Nacional: Reducción de Costos del 60%',
      description: 'Conoce cómo una institución financiera optimizó su gestión documental y redujo costos operativos significativamente.',
      tags: ['PDF', '12 páginas', 'Gratis'],
      color: '#f57c00',
    },
    {
      type: 'Checklist',
      icon: <Download />,
      title: 'Checklist de Cumplimiento Normativo',
      description: 'Verifica que tu organización cumple con todas las normativas de gestión documental y protección de datos.',
      tags: ['PDF', '8 páginas', 'Gratis'],
      color: '#7b1fa2',
    },
    {
      type: 'Infografía',
      icon: <Article />,
      title: 'ROI de la Gestión Documental Digital',
      description: 'Visualiza el retorno de inversión y los beneficios tangibles de implementar un sistema de gestión documental.',
      tags: ['PDF', '1 página', 'Gratis'],
      color: '#0288d1',
    },
  ];

  return (
    <Box
      id="recursos"
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
            RECURSOS GRATUITOS
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
            Aprende y{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              Optimiza
            </Box>
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: 'auto' }}
          >
            Accede a nuestra biblioteca de recursos gratuitos con guías, casos de éxito, 
            whitepapers y herramientas para mejorar tu gestión documental.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {resources.map((resource, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  border: 1,
                  borderColor: 'divider',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                    borderColor: resource.color,
                  },
                }}
              >
                <Box
                  sx={{
                    height: 120,
                    bgcolor: resource.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <Box sx={{ fontSize: 64 }}>
                    {resource.icon}
                  </Box>
                </Box>
                
                <Box sx={{ p: 3 }}>
                  <Chip
                    label={resource.type}
                    size="small"
                    sx={{
                      mb: 2,
                      bgcolor: resource.color,
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {resource.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {resource.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                    {resource.tags.map((tag, i) => (
                      <Chip
                        key={i}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>

                  <Button
                    variant="outlined"
                    endIcon={<ArrowForward />}
                    fullWidth
                    sx={{
                      borderColor: resource.color,
                      color: resource.color,
                      '&:hover': {
                        borderColor: resource.color,
                        bgcolor: `${resource.color}10`,
                      },
                    }}
                  >
                    Descargar Recurso
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            ¿Necesitas más información?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Nuestro equipo está listo para ayudarte a encontrar la solución perfecta para tu empresa
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              const element = document.querySelector('#contacto');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            sx={{ px: 4, py: 1.5 }}
          >
            Contactar con un Experto
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ResourcesSection;
