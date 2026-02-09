import { Box, Typography, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../forms/LoginForm';

const LoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left Panel - Dark Sidebar with Quote */}
      {!isMobile && (
        <Grid
          item
          md={5}
          sx={{
            background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 6,
            color: 'white',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.4,
            },
          }}
        >
          {/* Logo */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box
              component="img"
              src="/Vertical_Logo.png"
              alt="GDI Logo"
              onClick={() => navigate('/')}
              sx={{
                height: 200,
                objectFit: 'contain',
                bgcolor: 'white',
                borderRadius: 2,
                p: 2,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
          </Box>

          {/* Quote */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 4,
                bgcolor: 'primary.light',
                mb: 4,
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 300,
                mb: 3,
                lineHeight: 1.4,
              }}
            >
              "Tu información, {' '}
              <Box component="span" sx={{ color: 'primary.light', fontWeight: 500 }}>
                tu activo estratégico
              </Box>
              ."
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Simplia v1.0
            </Typography>
          </Box>
        </Grid>
      )}

      {/* Right Panel - Login Form */}
      <Grid
        item
        xs={12}
        md={7}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          p: 4,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 480 }}>
          {/* Mobile Logo */}
          {isMobile && (
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Box
                component="img"
                src="/Vertical_Logo.png"
                alt="GDI Logo"
                onClick={() => navigate('/')}
                sx={{
                  height: 60,
                  objectFit: 'contain',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
            </Box>
          )}

          {/* Form Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              gutterBottom
              sx={{ color: 'text.primary' }}
            >
              Bienvenido de nuevo
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Ingrese sus credenciales para acceder al portal de gestión inteligente.
            </Typography>
          </Box>

          {/* Login Form */}
          <LoginForm />

          {/* Footer */}
          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: 1,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: 'white',
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                SSL SECURE
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: 'info.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: 'white',
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                2FA ENABLED
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center', mt: 3 }}
          >
            © 2026 Gestión Documental Inteligente. Todos los derechos reservados.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
