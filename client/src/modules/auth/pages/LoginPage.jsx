import { Box, Typography, useMediaQuery, useTheme, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Description, Lock, BarChart, Folder } from '@mui/icons-material';
import LoginForm from '../forms/LoginForm';

// Geometric SVG background
const AbstractBg = () => (
  <svg
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    viewBox="0 0 480 720"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
  >
    <circle cx="400" cy="100" r="200" fill="rgba(255,255,255,0.04)" />
    <circle cx="50" cy="600" r="220" fill="rgba(255,255,255,0.04)" />
    <circle cx="400" cy="100" r="260" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
    <circle cx="400" cy="100" r="320" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
    {Array.from({ length: 5 }).map((_, r) =>
      Array.from({ length: 7 }).map((_, c) => (
        <circle key={`${r}-${c}`} cx={40 + c * 65} cy={160 + r * 90} r="1.5" fill="rgba(255,255,255,0.1)" />
      ))
    )}
    <line x1="0" y1="720" x2="480" y2="0" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
  </svg>
);

const features = [
  { icon: <Description sx={{ fontSize: 15, color: '#93C5FD' }} />, label: 'Gestión documental inteligente' },
  { icon: <Lock sx={{ fontSize: 15, color: '#93C5FD' }} />, label: 'Control de acceso por roles' },
  { icon: <BarChart sx={{ fontSize: 15, color: '#93C5FD' }} />, label: 'Diagnósticos y reportes en tiempo real' },
];

const LoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100vw',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* ── Left panel ── */}
      {!isMobile && (
        <Box
          sx={{
            width: '38%',
            flexShrink: 0,
            position: 'relative',
            background: 'linear-gradient(155deg, #0F172A 0%, #1a3054 45%, #1D4ED8 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 5,
            overflow: 'hidden',
          }}
        >
          <AbstractBg />

          {/* Brand */}
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Typography
              sx={{ color: '#ffffff', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.03em', lineHeight: 1 }}
            >
              simplia
            </Typography>
          </Box>

          {/* Center content */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              sx={{
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1.6rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
                mb: 1.5,
              }}
            >
              Tu documentación,<br />ordenada y segura.
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: 1.65, mb: 4 }}>
              Centraliza, controla y accede a todos tus documentos empresariales desde cualquier lugar.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {features.map((f) => (
                <Box
                  key={f.label}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 2,
                    py: 1.25,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.09)',
                  }}
                >
                  {f.icon}
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8375rem', fontWeight: 500 }}>
                    {f.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Quote */}
          <Box sx={{ position: 'relative', zIndex: 1, borderLeft: '3px solid rgba(96,165,250,0.5)', pl: 2 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 300, fontSize: '1rem', lineHeight: 1.55, mb: 0.75, fontStyle: 'italic' }}>
              "Tu información,{' '}
              <Box component="span" sx={{ fontWeight: 700, fontStyle: 'normal', color: '#60A5FA' }}>
                tu activo estratégico
              </Box>."
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.07em' }}>
              SIMPLIA v1.0
            </Typography>
          </Box>
        </Box>
      )}

      {/* ── Right panel ── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#ffffff',
          px: { xs: 3, sm: 6, md: 8 },
          py: 5,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile brand */}
          {isMobile && (
            <Box sx={{ mb: 5, cursor: 'pointer' }} onClick={() => navigate('/')}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: '#0F172A', letterSpacing: '-0.02em' }}>
                simplia
              </Typography>
            </Box>
          )}

          {/* Header */}
          <Box sx={{ mb: 5 }}>
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.75rem', md: '2.125rem' },
                color: '#0F172A',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                mb: 1,
              }}
            >
              Bienvenido de nuevo
            </Typography>
            <Typography sx={{ color: '#64748B', fontSize: '0.9375rem', lineHeight: 1.6 }}>
              Ingresa tus credenciales para acceder al portal.
            </Typography>
          </Box>

          {/* Form */}
          <LoginForm />

          {/* External Portal Link */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link
              href="/external/portal"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                color: '#2563EB',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              <Folder sx={{ fontSize: 18 }} />
              Acceder al Portal de Expedientes
            </Link>
          </Box>

          {/* Trust badges */}
          <Box
            sx={{
              mt: 5,
              pt: 4,
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
            }}
          >
            {[
              { dot: '#10B981', label: 'SSL SECURE' },
              { dot: '#2563EB', label: '2FA ENABLED' },
            ].map(({ dot, label }) => (
              <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.875 }}>
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: dot, boxShadow: `0 0 0 3px ${dot}22` }} />
                <Typography sx={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.07em' }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>

          <Typography sx={{ textAlign: 'center', mt: 2.5, color: '#CBD5E1', fontSize: '0.75rem' }}>
            © 2026 Simplia · Gestión Documental Inteligente
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
