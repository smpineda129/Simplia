import { Box, Container, Typography, Grid } from '@mui/material';
import { Warning, CheckCircle, Inventory, Security, Gavel } from '@mui/icons-material';

const problems = [
  {
    icon: <Warning sx={{ fontSize: 22 }} />,
    title: 'El problema',
    headline: 'Caos y desorden documental',
    description: 'Documentos dispersos en múltiples ubicaciones, pérdida de tiempo buscando información crítica.',
    points: ['Archivos en múltiples ubicaciones', 'Dificultad para encontrar documentos', 'Riesgo de pérdida de información'],
    accent: '#EF4444',
    bgLight: 'rgba(239,68,68,0.04)',
    border: 'rgba(239,68,68,0.15)',
  },
  {
    icon: <CheckCircle sx={{ fontSize: 22 }} />,
    title: 'La solución',
    headline: 'Orden y control total',
    description: 'Sistema centralizado con búsqueda inteligente, acceso instantáneo a toda tu documentación.',
    points: ['Acceso inmediato 24/7', 'Búsqueda avanzada y filtros', 'Trazabilidad y auditoría completa'],
    accent: '#10B981',
    bgLight: 'rgba(16,185,129,0.04)',
    border: 'rgba(16,185,129,0.15)',
  },
];

const solutions = [
  {
    icon: <Inventory />,
    title: 'Organización Archivística',
    description: 'Clasificación y recuperación según normativas internacionales y mejores prácticas de archivo moderno.',
  },
  {
    icon: <Security />,
    title: 'Seguridad Certificada',
    description: 'Cumplimiento ISO 27001 con encriptación de extremo a extremo, auditorías y control de acceso granular.',
  },
  {
    icon: <Gavel />,
    title: 'Cumplimiento Legal',
    description: 'Garantizamos el cumplimiento de normativas de retención documental y protección de datos personales.',
  },
];

const SolutionsSection = () => (
  <Box id="solucion" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F8FAFC' }}>
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563EB', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 1.5 }}>
          El problema vs. la solución
        </Typography>
        <Typography
          component="h2"
          sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.5rem' }, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.15, mb: 2 }}
        >
          Transformamos el caos en{' '}
          <Box component="span" sx={{ color: '#2563EB' }}>decisiones inteligentes</Box>
        </Typography>
        <Typography sx={{ color: '#64748B', fontSize: '1rem', maxWidth: 600, mx: 'auto', lineHeight: 1.7 }}>
          Dejamos atrás el desorden documental con un sistema organizado, seguro y eficiente para tu empresa.
        </Typography>
      </Box>

      {/* Problem vs Solution */}
      <Grid container spacing={3} sx={{ mb: 10 }}>
        {problems.map((item) => (
          <Grid item xs={12} md={6} key={item.title}>
            <Box
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 3,
                border: `1px solid ${item.border}`,
                bgcolor: item.bgLight,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: item.accent,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: item.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {item.title}
                </Typography>
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#0F172A', mb: 1.5 }}>
                {item.headline}
              </Typography>
              <Typography sx={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.65, mb: 3 }}>
                {item.description}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {item.points.map((pt) => (
                  <Box key={pt} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: item.accent, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>{pt}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Solutions */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' }, color: '#0F172A', letterSpacing: '-0.02em' }}>
          Nuestro enfoque archivístico
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {solutions.map((s) => (
          <Grid item xs={12} md={4} key={s.title}>
            <Box
              sx={{
                p: 3.5,
                height: '100%',
                borderRadius: 2.5,
                border: '1px solid #E2E8F0',
                bgcolor: '#ffffff',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#2563EB',
                  boxShadow: '0 8px 24px rgba(37,99,235,0.08)',
                  transform: 'translateY(-3px)',
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: 'rgba(37,99,235,0.08)',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2.5,
                }}
              >
                {s.icon}
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1.0625rem', color: '#0F172A', mb: 1 }}>
                {s.title}
              </Typography>
              <Typography sx={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.65 }}>
                {s.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default SolutionsSection;
