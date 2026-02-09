import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import {
  Warning,
  CheckCircle,
  Speed,
  Security,
  Inventory,
  Gavel,
} from '@mui/icons-material';

const SolutionsSection = () => {
  const problems = [
    {
      icon: <Warning />,
      title: 'Caos y Desorden',
      description: 'Documentos dispersos en múltiples ubicaciones, pérdida de tiempo buscando información crítica.',
      points: [
        'Archivos en múltiples ubicaciones',
        'Dificultad para encontrar documentos',
      ],
    },
    {
      icon: <Speed />,
      title: 'Orden y Control',
      description: 'Sistema centralizado con búsqueda inteligente, acceso instantáneo a toda tu documentación.',
      points: [
        'Acceso inmediato 24/7',
        'Búsqueda avanzada y filtros',
      ],
    },
  ];

  const solutions = [
    {
      icon: <Inventory />,
      title: 'Organización Archivística',
      description: 'Aplicamos principios de archivo moderno, facilitando la clasificación y recuperación de documentos según normativas internacionales.',
    },
    {
      icon: <Security />,
      title: 'Seguridad Certificada',
      description: 'Cumplimiento de estándares ISO 27001 para protección de datos, con encriptación de extremo a extremo y auditorías completas.',
    },
    {
      icon: <Gavel />,
      title: 'Cumplimiento Legal',
      description: 'Garantizamos el cumplimiento de normativas de retención documental y protección de datos personales (GDPR, LOPD).',
    },
  ];

  return (
    <Box
      id="solucion"
      sx={{
        py: 10,
        bgcolor: 'background.default',
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
            EL PROBLEMA VS. LA SOLUCIÓN
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
            Transformamos datos en{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              decisiones inteligentes
            </Box>
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: 'auto' }}
          >
            Dejamos atrás el caos documental y te ofrecemos un sistema organizado, 
            seguro y eficiente para gestionar toda tu información empresarial.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {problems.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  border: 1,
                  borderColor: index === 0 ? 'error.light' : 'success.light',
                  bgcolor: index === 0 ? 'error.lighter' : 'success.lighter',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: index === 0 ? 'error.main' : 'success.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {item.title}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {item.description}
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {item.points.map((point, i) => (
                    <Typography
                      component="li"
                      key={i}
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {point}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Organización Archivística
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Aplicamos principios de archivo moderno, facilitando la clasificación y recuperación 
            de documentos según las mejores prácticas y normativas internacionales.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {solutions.map((solution, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  border: 1,
                  borderColor: 'divider',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 4,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  {solution.icon}
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {solution.title}
                </Typography>
                <Typography color="text.secondary">
                  {solution.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default SolutionsSection;
