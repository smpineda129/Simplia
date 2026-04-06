import { Box, Container, Typography, Grid } from '@mui/material';
import { CheckCircle, Dashboard, CloudQueue, Lock, Devices, Speed, Group } from '@mui/icons-material';

const features = [
  { icon: <Dashboard />, title: 'Panel Intuitivo', description: 'Interfaz moderna con acceso rápido a todas las funcionalidades del sistema desde el primer clic.' },
  { icon: <CloudQueue />, title: 'Cloud Nativo', description: 'Accede a tus documentos desde cualquier lugar y dispositivo con sincronización en tiempo real.' },
  { icon: <Lock />, title: 'Seguridad Avanzada', description: 'Encriptación extremo a extremo, autenticación multifactor y control de acceso granular por roles.' },
  { icon: <Devices />, title: 'Multi-dispositivo', description: 'Funciona perfecto en escritorio, tablet y móvil. Sin instalaciones, solo tu navegador.' },
  { icon: <Speed />, title: 'Alto Rendimiento', description: 'Carga ultrarrápida, búsqueda instantánea y procesamiento eficiente de grandes volúmenes.' },
  { icon: <Group />, title: 'Colaboración', description: 'Comparte documentos, asigna permisos y trabaja en equipo con control total de cada acción.' },
];

const benefits = [
  'Reducción de costos operativos hasta un 60%',
  'Acceso instantáneo a documentos 24/7',
  'Cumplimiento normativo garantizado',
  'Auditorías automáticas y trazabilidad completa',
  'Integración con sistemas existentes',
  'Soporte técnico especializado incluido',
];

const ApplicationSection = () => (
  <Box id="aplicativo" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F8FAFC' }}>
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563EB', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 1.5 }}>
          Nuestra plataforma
        </Typography>
        <Typography
          component="h2"
          sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.5rem' }, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.15, mb: 2 }}
        >
          Tecnología diseñada para{' '}
          <Box component="span" sx={{ color: '#2563EB' }}>tu equipo</Box>
        </Typography>
        <Typography sx={{ color: '#64748B', fontSize: '1rem', maxWidth: 600, mx: 'auto', lineHeight: 1.7 }}>
          Combinamos tecnología de vanguardia con una interfaz intuitiva para la mejor experiencia en gestión documental.
        </Typography>
      </Box>

      {/* Features grid */}
      <Grid container spacing={3} sx={{ mb: 8 }}>
        {features.map((f) => (
          <Grid item xs={12} sm={6} md={4} key={f.title}>
            <Box
              sx={{
                display: 'flex',
                gap: 2.5,
                p: 3,
                borderRadius: 2.5,
                border: '1px solid #E2E8F0',
                bgcolor: '#ffffff',
                height: '100%',
                transition: 'all 0.2s',
                '&:hover': { borderColor: '#BFDBFE', boxShadow: '0 4px 16px rgba(37,99,235,0.07)' },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: 'rgba(37,99,235,0.08)',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0F172A', mb: 0.5 }}>
                  {f.title}
                </Typography>
                <Typography sx={{ color: '#64748B', fontSize: '0.8375rem', lineHeight: 1.6 }}>
                  {f.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* CTA Banner */}
      <Box
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1D4ED8 100%)',
          p: { xs: 4, md: 6 },
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' }, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.2, mb: 1.5 }}
            >
              ¿Listo para optimizar tu gestión documental?
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9375rem', lineHeight: 1.65 }}>
              Más de 500 empresas ya gestionan sus documentos con Simplia. Empieza hoy sin compromisos.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 2.5,
                p: 3,
              }}
            >
              <Typography sx={{ fontWeight: 700, color: '#ffffff', mb: 2, fontSize: '0.9375rem' }}>
                Beneficios clave
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {benefits.map((b) => (
                  <Box key={b} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                    <CheckCircle sx={{ fontSize: 16, color: '#34D399', mt: 0.25, flexShrink: 0 }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', fontWeight: 500 }}>
                      {b}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  </Box>
);

export default ApplicationSection;
