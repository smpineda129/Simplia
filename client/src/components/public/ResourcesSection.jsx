import { Box, Container, Typography, Grid, Button } from '@mui/material';
import { Article, VideoLibrary, MenuBook, Download, ArrowForward } from '@mui/icons-material';

const resources = [
  {
    type: 'Guía',
    icon: <MenuBook sx={{ fontSize: 28 }} />,
    title: 'Guía Completa de Gestión Documental',
    description: 'Aprende las mejores prácticas para implementar un sistema de gestión documental efectivo en tu organización.',
    meta: '45 páginas · PDF · Gratis',
    color: '#2563EB',
  },
  {
    type: 'Whitepaper',
    icon: <Article sx={{ fontSize: 28 }} />,
    title: 'Transformación Digital en Archivos',
    description: 'Descubre cómo la digitalización puede reducir costos y mejorar la eficiencia operativa de tu empresa.',
    meta: '28 páginas · PDF · Gratis',
    color: '#10B981',
  },
  {
    type: 'Video',
    icon: <VideoLibrary sx={{ fontSize: 28 }} />,
    title: 'Demo en Vivo de la Plataforma',
    description: 'Mira una demostración completa de todas las funcionalidades y capacidades de Simplia.',
    meta: '15 min · Video · Gratis',
    color: '#6366F1',
  },
  {
    type: 'Caso de Éxito',
    icon: <Article sx={{ fontSize: 28 }} />,
    title: 'Banco Nacional: ROI del 60%',
    description: 'Conoce cómo una institución financiera optimizó su gestión documental y redujo costos operativos.',
    meta: '12 páginas · PDF · Gratis',
    color: '#F59E0B',
  },
  {
    type: 'Checklist',
    icon: <Download sx={{ fontSize: 28 }} />,
    title: 'Checklist de Cumplimiento Normativo',
    description: 'Verifica que tu organización cumple con todas las normativas de gestión documental y protección de datos.',
    meta: '8 páginas · PDF · Gratis',
    color: '#EF4444',
  },
  {
    type: 'Infografía',
    icon: <Article sx={{ fontSize: 28 }} />,
    title: 'ROI de la Gestión Documental Digital',
    description: 'Visualiza el retorno de inversión y los beneficios tangibles de implementar un sistema de gestión documental.',
    meta: '1 página · PDF · Gratis',
    color: '#0EA5E9',
  },
];

const ResourcesSection = () => (
  <Box id="recursos" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F8FAFC' }}>
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563EB', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 1.5 }}>
          Recursos gratuitos
        </Typography>
        <Typography
          component="h2"
          sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.5rem' }, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.15, mb: 2 }}
        >
          Aprende y{' '}
          <Box component="span" sx={{ color: '#2563EB' }}>optimiza</Box>
        </Typography>
        <Typography sx={{ color: '#64748B', fontSize: '1rem', maxWidth: 560, mx: 'auto', lineHeight: 1.7 }}>
          Accede a nuestra biblioteca de recursos con guías, casos de éxito y herramientas para mejorar tu gestión.
        </Typography>
      </Box>

      {/* Resource cards */}
      <Grid container spacing={3}>
        {resources.map((r) => (
          <Grid item xs={12} sm={6} md={4} key={r.title}>
            <Box
              sx={{
                height: '100%',
                borderRadius: 2.5,
                border: '1px solid #E2E8F0',
                bgcolor: '#ffffff',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: r.color,
                  boxShadow: `0 8px 24px ${r.color}12`,
                  transform: 'translateY(-3px)',
                },
              }}
            >
              {/* Card header */}
              <Box
                sx={{
                  px: 3,
                  py: 3,
                  bgcolor: `${r.color}08`,
                  borderBottom: `1px solid ${r.color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box sx={{ color: r.color }}>{r.icon}</Box>
                <Box
                  sx={{
                    px: 1.25,
                    py: 0.35,
                    borderRadius: 1,
                    bgcolor: r.color,
                    display: 'inline-block',
                  }}
                >
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.04em' }}>
                    {r.type.toUpperCase()}
                  </Typography>
                </Box>
              </Box>

              {/* Card body */}
              <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0F172A', mb: 1, lineHeight: 1.4 }}>
                  {r.title}
                </Typography>
                <Typography sx={{ color: '#64748B', fontSize: '0.8375rem', lineHeight: 1.65, mb: 2.5, flexGrow: 1 }}>
                  {r.description}
                </Typography>
                <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 500, mb: 2.5 }}>
                  {r.meta}
                </Typography>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                  fullWidth
                  sx={{
                    borderColor: r.color,
                    color: r.color,
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    borderRadius: 1.5,
                    borderWidth: '1.5px',
                    py: 0.875,
                    '&:hover': {
                      borderWidth: '1.5px',
                      borderColor: r.color,
                      bgcolor: `${r.color}08`,
                    },
                  }}
                >
                  Descargar recurso
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Bottom CTA */}
      <Box
        sx={{
          mt: 8,
          p: { xs: 3, md: 5 },
          textAlign: 'center',
          borderRadius: 3,
          border: '1px solid #E2E8F0',
          bgcolor: '#ffffff',
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#0F172A', mb: 1 }}>
          ¿Necesitas más información?
        </Typography>
        <Typography sx={{ color: '#64748B', mb: 3, fontSize: '0.9rem' }}>
          Nuestro equipo está listo para ayudarte a encontrar la solución perfecta para tu empresa.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' })}
          sx={{
            bgcolor: '#2563EB',
            fontWeight: 700,
            px: 4,
            py: 1.375,
            borderRadius: 2,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#1D4ED8', boxShadow: '0 8px 20px rgba(37,99,235,0.25)' },
          }}
        >
          Hablar con un experto
        </Button>
      </Box>
    </Container>
  </Box>
);

export default ResourcesSection;
