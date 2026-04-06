import { Box, Container, Typography, Grid, Chip } from '@mui/material';
import { FolderOpen, CloudUpload, Archive, Description, Search, Shield } from '@mui/icons-material';

const services = [
  {
    icon: <FolderOpen />,
    title: 'Custodia Documental',
    description: 'Almacenamiento seguro de documentos físicos y digitales con trazabilidad completa y acceso controlado.',
    features: ['Almacenamiento seguro', 'Control de acceso', 'Trazabilidad total'],
    color: '#2563EB',
  },
  {
    icon: <CloudUpload />,
    title: 'Digitalización',
    description: 'Conversión de documentos físicos a digital con tecnología OCR para búsqueda de texto completo.',
    features: ['Escaneo de alta calidad', 'OCR avanzado', 'Indexación automática'],
    color: '#6366F1',
  },
  {
    icon: <Archive />,
    title: 'Organización Archivística',
    description: 'Clasificación y organización según normativas archivísticas internacionales y mejores prácticas.',
    features: ['Clasificación profesional', 'Tablas de retención', 'Normativa ISO'],
    color: '#0EA5E9',
  },
  {
    icon: <Description />,
    title: 'Gestión de Archivos',
    description: 'Sistema completo para administrar el ciclo de vida de documentos desde su creación hasta su disposición final.',
    features: ['Ciclo de vida completo', 'Automatización', 'Reportes detallados'],
    color: '#10B981',
  },
  {
    icon: <Search />,
    title: 'Búsqueda Avanzada',
    description: 'Motor de búsqueda inteligente con filtros avanzados, búsqueda por contenido y recuperación instantánea.',
    features: ['Búsqueda full-text', 'Filtros múltiples', 'Resultados instantáneos'],
    color: '#F59E0B',
  },
  {
    icon: <Shield />,
    title: 'Consultoría Normativa',
    description: 'Asesoramiento experto en cumplimiento de normativas de gestión documental y protección de datos.',
    features: ['Auditorías', 'Cumplimiento GDPR', 'Asesoría legal'],
    color: '#EF4444',
  },
];

const ServicesSection = () => (
  <Box id="servicios" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#ffffff' }}>
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563EB', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 1.5 }}>
          Nuestros servicios
        </Typography>
        <Typography
          component="h2"
          sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.5rem' }, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.15, mb: 2 }}
        >
          Soluciones integrales de{' '}
          <Box component="span" sx={{ color: '#2563EB' }}>gestión documental</Box>
        </Typography>
        <Typography sx={{ color: '#64748B', fontSize: '1rem', maxWidth: 600, mx: 'auto', lineHeight: 1.7 }}>
          Desde la digitalización hasta la consultoría especializada, cubrimos todo el ciclo de vida de tu documentación.
        </Typography>
      </Box>

      {/* Cards */}
      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.title}>
            <Box
              sx={{
                p: 3.5,
                height: '100%',
                borderRadius: 2.5,
                border: '1px solid #E2E8F0',
                bgcolor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: service.color,
                  boxShadow: `0 8px 24px ${service.color}14`,
                  transform: 'translateY(-3px)',
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: `${service.color}12`,
                  color: service.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2.5,
                }}
              >
                {service.icon}
              </Box>

              <Typography sx={{ fontWeight: 700, fontSize: '1.0625rem', color: '#0F172A', mb: 1 }}>
                {service.title}
              </Typography>

              <Typography sx={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.65, mb: 3, flexGrow: 1 }}>
                {service.description}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {service.features.map((f) => (
                  <Chip
                    key={f}
                    label={f}
                    size="small"
                    sx={{
                      bgcolor: `${service.color}0d`,
                      color: service.color,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      border: `1px solid ${service.color}22`,
                      height: 24,
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default ServicesSection;
