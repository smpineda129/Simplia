import { Box, Container, Typography, Grid, Paper, Chip } from '@mui/material';
import {
  FolderOpen,
  CloudUpload,
  Archive,
  Description,
  Search,
  Shield,
} from '@mui/icons-material';

const ServicesSection = () => {
  const services = [
    {
      icon: <FolderOpen />,
      title: 'Custodia Documental',
      description: 'Almacenamiento seguro de documentos físicos y digitales con trazabilidad completa y acceso controlado.',
      features: ['Almacenamiento seguro', 'Control de acceso', 'Trazabilidad total'],
    },
    {
      icon: <CloudUpload />,
      title: 'Digitalización',
      description: 'Conversión de documentos físicos a formato digital con tecnología OCR para búsqueda de texto completo.',
      features: ['Escaneo de alta calidad', 'OCR avanzado', 'Indexación automática'],
    },
    {
      icon: <Archive />,
      title: 'Organización Archivística',
      description: 'Clasificación y organización según normativas archivísticas internacionales y mejores prácticas.',
      features: ['Clasificación profesional', 'Tablas de retención', 'Normativa ISO'],
    },
    {
      icon: <Description />,
      title: 'Gestión de Archivos',
      description: 'Sistema completo para administrar el ciclo de vida de documentos desde su creación hasta su disposición final.',
      features: ['Ciclo de vida completo', 'Automatización', 'Reportes detallados'],
    },
    {
      icon: <Search />,
      title: 'Búsqueda Avanzada',
      description: 'Motor de búsqueda inteligente con filtros avanzados, búsqueda por contenido y recuperación instantánea.',
      features: ['Búsqueda full-text', 'Filtros múltiples', 'Resultados instantáneos'],
    },
    {
      icon: <Shield />,
      title: 'Consultoría Normativa',
      description: 'Asesoramiento experto en cumplimiento de normativas de gestión documental y protección de datos.',
      features: ['Auditorías', 'Cumplimiento GDPR', 'Asesoría legal'],
    },
  ];

  return (
    <Box
      id="servicios"
      sx={{
        py: 10,
        bgcolor: 'grey.50',
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
            NUESTROS SERVICIOS
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
            Soluciones Integrales de{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              Gestión Documental
            </Box>
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: 'auto' }}
          >
            Ofrecemos servicios completos para optimizar la gestión de documentos 
            en tu organización, desde la digitalización hasta la consultoría especializada.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  {service.icon}
                </Box>
                
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {service.title}
                </Typography>
                
                <Typography color="text.secondary" paragraph>
                  {service.description}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {service.features.map((feature, i) => (
                    <Chip
                      key={i}
                      label={feature}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: 'primary.main', color: 'primary.main' }}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ServicesSection;
