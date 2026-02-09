import { Box, Container, Typography, Grid, Paper, Avatar, Rating } from '@mui/material';
import {
  Business,
  AccountBalance,
  LocalHospital,
  School,
  Gavel,
  Store,
} from '@mui/icons-material';

const ClientsSection = () => {
  const industries = [
    { icon: <Business />, name: 'Banca y Finanzas', color: '#1976d2' },
    { icon: <AccountBalance />, name: 'Sector Público', color: '#388e3c' },
    { icon: <LocalHospital />, name: 'Salud', color: '#d32f2f' },
    { icon: <School />, name: 'Educación', color: '#f57c00' },
    { icon: <Gavel />, name: 'Legal', color: '#7b1fa2' },
    { icon: <Store />, name: 'Retail', color: '#0288d1' },
  ];

  const testimonials = [
    {
      name: 'María González',
      position: 'Directora de Operaciones',
      company: 'Banco Nacional de Crédito',
      rating: 5,
      text: 'GDI ha transformado completamente nuestra gestión documental. La reducción de tiempos de búsqueda ha sido del 80% y el cumplimiento normativo está garantizado.',
    },
    {
      name: 'Carlos Rodríguez',
      position: 'Gerente de TI',
      company: 'Firma Legal Rivera & Asociados',
      rating: 5,
      text: 'La seguridad y trazabilidad que ofrece GDI es incomparable. Ahora podemos auditar cada acción sobre nuestros documentos legales con total confianza.',
    },
    {
      name: 'Ana Martínez',
      position: 'Coordinadora Administrativa',
      company: 'Hospital San José',
      rating: 5,
      text: 'Excelente plataforma. El acceso rápido a historiales médicos ha mejorado significativamente la atención a nuestros pacientes. Muy recomendable.',
    },
  ];

  return (
    <Box
      id="clientes"
      sx={{
        py: 10,
        bgcolor: 'grey.50',
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              letterSpacing: 2,
            }}
          >
            CONFIANZA EMPRESARIAL
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
              fontWeight: 700,
              mt: 2,
              mb: 2,
            }}
          >
            Confianza de{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              Nivel Empresarial
            </Box>
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: 'auto' }}
          >
            Empresas líderes en diversos sectores confían en nuestra plataforma 
            para gestionar sus documentos más críticos.
          </Typography>
        </Box>

        <Box sx={{ mb: 8 }}>
          <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
            Sectores Especializados
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
            Adaptamos nuestras soluciones a las necesidades específicas de cada industria
          </Typography>
          
          <Grid container spacing={3}>
            {industries.map((industry, index) => (
              <Grid item xs={6} sm={4} md={2} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    border: 1,
                    borderColor: 'divider',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                      borderColor: industry.color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      bgcolor: industry.color,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {industry.icon}
                  </Box>
                  <Typography variant="body2" fontWeight={600}>
                    {industry.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
            Lo que dicen los líderes
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
            Testimonios reales de profesionales que han optimizado su gestión documental
          </Typography>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    border: 1,
                    borderColor: 'divider',
                    position: 'relative',
                    '&::before': {
                      content: '"""',
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      fontSize: '4rem',
                      color: 'primary.main',
                      opacity: 0.2,
                      fontFamily: 'Georgia, serif',
                    },
                  }}
                >
                  <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" paragraph sx={{ fontStyle: 'italic' }}>
                    {testimonial.text}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 48,
                        height: 48,
                      }}
                    >
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {testimonial.position}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {testimonial.company}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default ClientsSection;
