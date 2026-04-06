import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { ArrowForward, TrendingUp, Speed, Security, CloudDone } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const stats = [
  { value: '500+', label: 'Empresas activas' },
  { value: '99.9%', label: 'Disponibilidad' },
  { value: '80%', label: 'Menos tiempo buscando' },
  { value: '60%', label: 'Reducción de costos' },
];

const features = [
  { icon: <TrendingUp sx={{ fontSize: 16 }} />, label: 'Optimización de procesos' },
  { icon: <Speed sx={{ fontSize: 16 }} />, label: 'Acceso inmediato 24/7' },
  { icon: <Security sx={{ fontSize: 16 }} />, label: 'Seguridad garantizada' },
  { icon: <CloudDone sx={{ fontSize: 16 }} />, label: 'Cloud storage' },
];

// Mini dashboard mockup SVG
const DashboardMockup = () => (
  <Box
    sx={{
      position: 'relative',
      borderRadius: 3,
      overflow: 'hidden',
      border: '1px solid #E2E8F0',
      boxShadow: '0 25px 60px rgba(15,23,42,0.12)',
      bgcolor: '#F8FAFC',
    }}
  >
    {/* Browser chrome */}
    <Box sx={{ bgcolor: '#ffffff', px: 2, py: 1.5, borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ display: 'flex', gap: 0.6 }}>
        {['#FF5F57', '#FFBD2E', '#28C840'].map((c) => (
          <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c }} />
        ))}
      </Box>
      <Box sx={{ flex: 1, bgcolor: '#F1F5F9', borderRadius: 1, height: 20, mx: 1, display: 'flex', alignItems: 'center', px: 1.5 }}>
        <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 500 }}>simplia.app/dashboard</Typography>
      </Box>
    </Box>

    {/* Dashboard content */}
    <Box sx={{ display: 'flex', height: 340 }}>
      {/* Sidebar */}
      <Box sx={{ width: 48, bgcolor: '#0F172A', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, gap: 1.5 }}>
        {[...Array(6)].map((_, i) => (
          <Box key={i} sx={{ width: 22, height: 4, borderRadius: 1, bgcolor: i === 0 ? '#2563EB' : 'rgba(255,255,255,0.15)' }} />
        ))}
      </Box>

      {/* Main area */}
      <Box sx={{ flex: 1, p: 2 }}>
        {/* Stats row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 2 }}>
          {[
            { label: 'Documentos', value: '2,847', color: '#2563EB' },
            { label: 'Expedientes', value: '143', color: '#10B981' },
            { label: 'Pendientes', value: '12', color: '#F59E0B' },
          ].map((s) => (
            <Box key={s.label} sx={{ bgcolor: '#ffffff', borderRadius: 1.5, p: 1.25, border: '1px solid #E2E8F0' }}>
              <Typography sx={{ fontSize: '0.55rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {s.label}
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: s.color, mt: 0.25 }}>
                {s.value}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Chart area */}
        <Box sx={{ bgcolor: '#ffffff', borderRadius: 1.5, p: 1.5, mb: 1.5, border: '1px solid #E2E8F0' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.75, height: 60 }}>
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  height: `${h}%`,
                  bgcolor: i === 11 ? '#2563EB' : i > 7 ? '#BFDBFE' : '#E2E8F0',
                  borderRadius: '2px 2px 0 0',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Table */}
        <Box sx={{ bgcolor: '#ffffff', borderRadius: 1.5, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <Box sx={{ bgcolor: '#F8FAFC', px: 1.5, py: 0.75, display: 'flex', gap: 2 }}>
            {['Documento', 'Estado', 'Fecha'].map((h) => (
              <Typography key={h} sx={{ fontSize: '0.5rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', flex: 1 }}>
                {h}
              </Typography>
            ))}
          </Box>
          {[
            { name: 'Contrato 2024', status: '#10B981', date: 'Hoy' },
            { name: 'Factura #831', status: '#F59E0B', date: 'Ayer' },
            { name: 'Informe Q4', status: '#2563EB', date: '15 mar' },
          ].map((row, i) => (
            <Box key={i} sx={{ px: 1.5, py: 0.75, display: 'flex', gap: 2, borderTop: '1px solid #F1F5F9' }}>
              <Typography sx={{ fontSize: '0.55rem', color: '#475569', fontWeight: 500, flex: 1 }}>{row.name}</Typography>
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: row.status }} />
              </Box>
              <Typography sx={{ fontSize: '0.55rem', color: '#94A3B8', flex: 1 }}>{row.date}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  </Box>
);

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      id="inicio"
      sx={{
        bgcolor: '#ffffff',
        pt: { xs: 8, md: 10 },
        pb: { xs: 8, md: 10 },
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          background: 'radial-gradient(ellipse at top right, rgba(37,99,235,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
          {/* Left — Copy */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.5,
                py: 0.5,
                borderRadius: 10,
                border: '1px solid #BFDBFE',
                bgcolor: 'rgba(37,99,235,0.05)',
                mb: 3,
              }}
            >
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2563EB', animation: 'pulse 2s infinite' }} />
              <Typography sx={{ fontSize: '0.775rem', fontWeight: 600, color: '#2563EB', letterSpacing: '0.04em' }}>
                GESTIÓN DOCUMENTAL INTELIGENTE
              </Typography>
            </Box>

            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.25rem', md: '3rem', lg: '3.5rem' },
                color: '#0F172A',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                mb: 2.5,
              }}
            >
              Tu documentación,{' '}
              <Box component="span" sx={{ color: '#2563EB' }}>
                ordenada y segura
              </Box>
            </Typography>

            <Typography sx={{ color: '#64748B', fontSize: { xs: '1rem', md: '1.0625rem' }, lineHeight: 1.7, mb: 4, maxWidth: 520 }}>
              Centraliza, controla y accede a todos tus documentos empresariales desde cualquier lugar.
              Cumplimiento normativo garantizado desde el primer día.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 5 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/auth/login')}
                sx={{
                  bgcolor: '#2563EB',
                  fontWeight: 700,
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: 'none',
                  fontSize: '0.9375rem',
                  '&:hover': {
                    bgcolor: '#1D4ED8',
                    boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.15s ease',
                }}
              >
                Empezar ahora
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' });
                }}
                sx={{
                  borderColor: '#E2E8F0',
                  color: '#475569',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '0.9375rem',
                  borderWidth: '1.5px',
                  '&:hover': { borderColor: '#2563EB', color: '#2563EB', borderWidth: '1.5px' },
                }}
              >
                Ver demostración
              </Button>
            </Box>

            {/* Feature badges */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {features.map((f) => (
                <Box
                  key={f.label}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    color: '#64748B',
                  }}
                >
                  <Box sx={{ color: '#2563EB' }}>{f.icon}</Box>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>{f.label}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Right — Mockup */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              {/* Decorative bg blob */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -40,
                  right: -60,
                  width: 300,
                  height: 300,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
                  zIndex: 0,
                }}
              />
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <DashboardMockup />
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Stats bar */}
        <Box
          sx={{
            mt: { xs: 8, md: 10 },
            pt: 6,
            borderTop: '1px solid #E2E8F0',
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 4,
          }}
        >
          {stats.map((s) => (
            <Box key={s.label} sx={{ textAlign: 'center' }}>
              <Typography
                sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' }, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}
              >
                {s.value}
              </Typography>
              <Typography sx={{ color: '#94A3B8', fontSize: '0.8125rem', fontWeight: 500, mt: 0.75 }}>
                {s.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
