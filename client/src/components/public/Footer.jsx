import { Box, Container, Typography, Grid, Link, IconButton, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  LinkedIn,
  Twitter,
  Facebook,
  Instagram,
  Language,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

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

  const certifications = [
    { label: 'ISO 9001', description: 'Gestión de Calidad' },
    { label: 'ISO 27001', description: 'Seguridad de la Información' },
  ];

  const handleLinkClick = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'grey.300',
        pt: 8,
        pb: 4,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src="/Vertical_Logo.png"
              alt="GDI Logo"
              onClick={() => navigate('/')}
              sx={{
                height: 80,
                mb: 2,
                objectFit: 'contain',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
            <Typography variant="body2" sx={{ mb: 3, maxWidth: 300 }}>
              Líderes en soluciones integrales de gestión documental, custodia y 
              digitalización para empresas que valoran su información.
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Email fontSize="small" />
                <Box>
                  <Typography variant="body2">soporte@simplia.com</Typography>
                  <Typography variant="body2">ventas@simplia.com</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Phone fontSize="small" />
                <Typography variant="body2">+57 317 3654726</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2">Cl. 105c #29, Manizales, Caldas</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                component="a"
                href="https://www.instagram.com/gdinteligente/"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'grey.300',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                  },
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.facebook.com/gdinteligente"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'grey.300',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                  },
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                component="a"
                href="https://taplink.cc/gdinteligente"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'grey.300',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                  },
                }}
              >
                <Language />
              </IconButton>
            </Box>
          </Grid>

          {footerSections.map((section, index) => (
            <Grid item xs={6} sm={3} md={2} key={index}>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                color="white"
                gutterBottom
                sx={{ mb: 2 }}
              >
                {section.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {section.links.map((link, i) => (
                  <Box component="li" key={i} sx={{ mb: 1 }}>
                    <Link
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(link.href);
                      }}
                      sx={{
                        color: 'grey.400',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        '&:hover': {
                          color: 'primary.main',
                        },
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

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="grey.500">
              © {currentYear} GDI Document Management. Todos los derechos reservados.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                flexWrap: 'wrap',
              }}
            >
              {certifications.map((cert, index) => (
                <Box key={index} sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" fontWeight={700} color="white" display="block">
                    {cert.label}
                  </Typography>
                  <Typography variant="caption" color="grey.500" fontSize="0.65rem">
                    {cert.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
