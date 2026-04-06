import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Container,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Solución', href: '#solucion' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Plataforma', href: '#aplicativo' },
  { label: 'Clientes', href: '#clientes' },
  { label: 'Recursos', href: '#recursos' },
  { label: 'Contacto', href: '#contacto' },
];

const PublicNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleScroll = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2.5, borderBottom: '1px solid #E2E8F0' }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: '#0F172A', letterSpacing: '-0.02em' }}>
          simplia
        </Typography>
        <IconButton onClick={() => setMobileOpen(false)} size="small">
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 0.25 }}>
            <ListItemButton
              onClick={() => handleScroll(item.href)}
              sx={{ borderRadius: 1.5, py: 1 }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500, color: '#475569' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2, borderTop: '1px solid #E2E8F0' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth/login')}
          sx={{
            py: 1.25,
            bgcolor: '#2563EB',
            fontWeight: 700,
            borderRadius: 2,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' },
          }}
        >
          {isAuthenticated ? 'Ir al Dashboard' : 'Iniciar sesión'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: scrolled ? 'rgba(255,255,255,0.95)' : '#ffffff',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid #E2E8F0' : '1px solid transparent',
          transition: 'all 0.25s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 64 }}>
            {/* Logo */}
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', mr: 4 }}
              onClick={() => handleScroll('#inicio')}
            >
              <Box
                component="img"
                src="/Horizontal_Logo.jpeg"
                alt="Simplia"
                sx={{ height: 26, objectFit: 'contain' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1 }}>
                simplia
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {isMobile ? (
              <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#475569' }}>
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    onClick={() => handleScroll(item.href)}
                    sx={{
                      color: '#475569',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      px: 1.25,
                      '&:hover': { color: '#2563EB', bgcolor: 'rgba(37,99,235,0.06)' },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                <Button
                  variant="contained"
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth/login')}
                  sx={{
                    ml: 2,
                    bgcolor: '#2563EB',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    px: 2.5,
                    py: 0.875,
                    borderRadius: 2,
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: '#1D4ED8',
                      boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                    },
                  }}
                >
                  {isAuthenticated ? 'Dashboard' : 'Iniciar sesión'}
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { borderRadius: 0 } }}
      >
        {drawer}
      </Drawer>

      <Toolbar sx={{ height: 64 }} />
    </>
  );
};

export default PublicNavbar;
