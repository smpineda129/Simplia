import { Box, Container, Typography, Grid, Link, IconButton, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LinkedIn, Instagram, Facebook, Language, Email, Phone, LocationOn } from '@mui/icons-material';

const footerSections = [
  {
    title: 'Servicios',
    links: [
      { label: 'Custodia Documental', href: '#servicios' },
      { label: 'Digitalización', href: '#servicios' },
      { label: 'Organización Archivística', href: '#servicios' },
      { label: 'Consultoría Normativa', href: '#servicios' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre Nosotros', href: '#inicio' },
      { label: 'Casos de Éxito', href: '#clientes' },
      { label: 'Blog Corporativo', href: '#recursos' },
      { label: 'Trabaja con Nosotros', href: '#contacto' },
    ],
  },
  {
    title: 'Soporte',
    links: [
      { label: 'Centro de Ayuda', href: '#recursos' },
      { label: 'Documentación', href: '#recursos' },
      { label: 'Contacto', href: '#contacto' },
      { label: 'Estado del Sistema', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidad', href: '#' },
      { label: 'Términos', href: '#' },
      { label: 'Cookies', href: '#' },
      { label: 'Cumplimiento', href: '#' },
    ],
  },
];

const socials = [
  { icon: <Instagram sx={{ fontSize: 18 }} />, href: 'https://www.instagram.com/gdinteligente/', label: 'Instagram' },
  { icon: <Facebook sx={{ fontSize: 18 }} />, href: 'https://www.facebook.com/gdinteligente', label: 'Facebook' },
  { icon: <Language sx={{ fontSize: 18 }} />, href: 'https://taplink.cc/gdinteligente', label: 'Web' },
];

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (href) => {
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      component="footer"
      sx={{ bgcolor: '#0F172A', color: '#94A3B8', pt: 8, pb: 4 }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={5}>
          {/* Brand column */}
          <Grid item xs={12} md={3.5}>
            {/* Logo / wordmark */}
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              <Box
                component="img"
                src="/Horizontal_Logo.jpeg"
                alt="Simplia"
                sx={{ height: 22, objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.9 }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
                simplia
              </Typography>
            </Box>

            <Typography sx={{ fontSize: '0.875rem', color: '#64748B', mb: 3.5, maxWidth: 280, lineHeight: 1.7 }}>
              Líderes en soluciones integrales de gestión documental, custodia y digitalización para empresas.
            </Typography>

            {/* Contact */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3.5 }}>
              {[
                { icon: <Email sx={{ fontSize: 14 }} />, text: 'soporte@simplia.com · ventas@simplia.com' },
                { icon: <Phone sx={{ fontSize: 14 }} />, text: '+57 317 3654726' },
                { icon: <LocationOn sx={{ fontSize: 14 }} />, text: 'Cl. 105c #29, Manizales, Caldas' },
              ].map((item) => (
                <Box key={item.text} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Box sx={{ color: '#475569', mt: 0.2, flexShrink: 0 }}>{item.icon}</Box>
                  <Typography sx={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.5 }}>{item.text}</Typography>
                </Box>
              ))}
            </Box>

            {/* Socials */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socials.map((s) => (
                <IconButton
                  key={s.label}
                  component="a"
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  size="small"
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: 'rgba(255,255,255,0.06)',
                    color: '#64748B',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 1.5,
                    '&:hover': { bgcolor: '#2563EB', color: '#ffffff', borderColor: '#2563EB' },
                    transition: 'all 0.15s ease',
                  }}
                >
                  {s.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Link columns */}
          {footerSections.map((section) => (
            <Grid item xs={6} sm={3} md={2.125} key={section.title}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#E2E8F0', mb: 2.5, letterSpacing: '0.03em' }}>
                {section.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {section.links.map((link) => (
                  <Box component="li" key={link.label}>
                    <Link
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
                      sx={{
                        color: '#64748B',
                        textDecoration: 'none',
                        fontSize: '0.8375rem',
                        fontWeight: 400,
                        transition: 'color 0.15s',
                        '&:hover': { color: '#2563EB' },
                      }}
                    >
                      {link.label}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 5, borderColor: 'rgba(255,255,255,0.07)' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Typography sx={{ fontSize: '0.8125rem', color: '#475569' }}>
            © {currentYear} Simplia · Gestión Documental Inteligente. Todos los derechos reservados.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {[
              { label: 'ISO 9001', sub: 'Gestión de Calidad' },
              { label: 'ISO 27001', sub: 'Seguridad de la Info.' },
            ].map((cert) => (
              <Box key={cert.label}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#E2E8F0', lineHeight: 1 }}>
                  {cert.label}
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: '#475569' }}>
                  {cert.sub}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
