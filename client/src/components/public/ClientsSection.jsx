import { Box, Container, Typography, Grid, Avatar, Rating } from '@mui/material';
import { Business, AccountBalance, LocalHospital, School, Gavel, Store } from '@mui/icons-material';

const industries = [
  { icon: <Business sx={{ fontSize: 22 }} />, name: 'Banca y Finanzas', color: '#2563EB' },
  { icon: <AccountBalance sx={{ fontSize: 22 }} />, name: 'Sector Público', color: '#10B981' },
  { icon: <LocalHospital sx={{ fontSize: 22 }} />, name: 'Salud', color: '#EF4444' },
  { icon: <School sx={{ fontSize: 22 }} />, name: 'Educación', color: '#F59E0B' },
  { icon: <Gavel sx={{ fontSize: 22 }} />, name: 'Legal', color: '#6366F1' },
  { icon: <Store sx={{ fontSize: 22 }} />, name: 'Retail', color: '#0EA5E9' },
];

const testimonials = [
  {
    name: 'María González',
    position: 'Directora de Operaciones',
    company: 'Banco Nacional de Crédito',
    rating: 5,
    text: 'Simplia ha transformado completamente nuestra gestión documental. La reducción de tiempos de búsqueda ha sido del 80% y el cumplimiento normativo está garantizado.',
    initial: 'M',
    color: '#2563EB',
  },
  {
    name: 'Carlos Rodríguez',
    position: 'Gerente de TI',
    company: 'Firma Legal Rivera & Asociados',
    rating: 5,
    text: 'La seguridad y trazabilidad que ofrece Simplia es incomparable. Podemos auditar cada acción sobre nuestros documentos legales con total confianza.',
    initial: 'C',
    color: '#6366F1',
  },
  {
    name: 'Ana Martínez',
    position: 'Coordinadora Administrativa',
    company: 'Hospital San José',
    rating: 5,
    text: 'El acceso rápido a historiales ha mejorado significativamente la atención a pacientes. La implementación fue sencilla y el soporte excelente.',
    initial: 'A',
    color: '#10B981',
  },
];

const ClientsSection = () => (
  <Box id="clientes" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#ffffff' }}>
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563EB', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 1.5 }}>
          Confianza empresarial
        </Typography>
        <Typography
          component="h2"
          sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.5rem' }, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.15, mb: 2 }}
        >
          Empresas de todos los{' '}
          <Box component="span" sx={{ color: '#2563EB' }}>sectores nos eligen</Box>
        </Typography>
        <Typography sx={{ color: '#64748B', fontSize: '1rem', maxWidth: 560, mx: 'auto', lineHeight: 1.7 }}>
          Líderes de diversas industrias confían en Simplia para gestionar sus documentos más críticos.
        </Typography>
      </Box>

      {/* Industries */}
      <Box sx={{ mb: 10 }}>
        <Grid container spacing={2} justifyContent="center">
          {industries.map((ind) => (
            <Grid item xs={6} sm={4} md={2} key={ind.name}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2.5,
                  border: '1px solid #E2E8F0',
                  bgcolor: '#ffffff',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  cursor: 'default',
                  '&:hover': {
                    borderColor: ind.color,
                    boxShadow: `0 4px 16px ${ind.color}14`,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: `${ind.color}10`,
                    color: ind.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 1.5,
                  }}
                >
                  {ind.icon}
                </Box>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                  {ind.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Testimonials */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '1.875rem' }, color: '#0F172A', letterSpacing: '-0.02em' }}>
          Lo que dicen nuestros clientes
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {testimonials.map((t) => (
          <Grid item xs={12} md={4} key={t.name}>
            <Box
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 2.5,
                border: '1px solid #E2E8F0',
                bgcolor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s',
                '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' },
              }}
            >
              <Rating value={t.rating} readOnly size="small" sx={{ mb: 2.5, '& .MuiRating-iconFilled': { color: '#F59E0B' } }} />
              <Typography sx={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, fontStyle: 'italic', flexGrow: 1, mb: 3 }}>
                "{t.text}"
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 3, borderTop: '1px solid #F1F5F9' }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: t.color, fontWeight: 700, fontSize: '0.9rem' }}>
                  {t.initial}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A' }}>{t.name}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>{t.position} · {t.company}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default ClientsSection;
