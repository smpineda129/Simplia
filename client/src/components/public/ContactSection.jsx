import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
  Send,
  AccessTime,
} from '@mui/icons-material';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const services = [
    'Custodia Documental',
    'Digitalización',
    'Organización Archivística',
    'Gestión de Archivos',
    'Consultoría Normativa',
    'Otro',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Aquí iría la lógica para enviar el formulario
    console.log('Form data:', formData);
    
    setSnackbar({
      open: true,
      message: 'Solicitud enviada exitosamente. Nos pondremos en contacto pronto.',
      severity: 'success',
    });

    // Limpiar formulario
    setFormData({
      name: '',
      position: '',
      company: '',
      email: '',
      phone: '',
      service: '',
      message: '',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const contactInfo = [
    {
      icon: <LocationOn />,
      title: 'Sede Central',
      details: [
        'Cl. 105c #29',
        'Manizales, Caldas',
        'Colombia',
      ],
    },
    {
      icon: <Phone />,
      title: 'Teléfono',
      details: [
        '+57 317 3654726',
      ],
    },
    {
      icon: <Email />,
      title: 'Correos',
      details: [
        'ventas@simplia.com',
        'soporte@simplia.com',
      ],
    },
    {
      icon: <AccessTime />,
      title: 'Horario',
      details: [
        'Lunes a Viernes: 9:00 - 18:00',
        'Tiempo de respuesta: 2 horas',
      ],
    },
  ];

  return (
    <Box
      id="contacto"
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
            SOPORTE B2B & VENTAS
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
            Conecte con{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              nuestros expertos
            </Box>
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: 'auto' }}
          >
            Estamos listos para optimizar su flujo documental. Contáctenos directamente 
            con el departamento que necesite o visítenos en nuestra sede central.
          </Typography>
        </Box>

        <Grid container spacing={6}>
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
              }}
            >
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Información de Contacto
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                Nuestro equipo está disponible para atender todas sus consultas 
                y ayudarle a encontrar la mejor solución para su empresa.
              </Typography>

              {contactInfo.map((info, index) => (
                <Box key={index} sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {info.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                      {info.title}
                    </Typography>
                  </Box>
                  {info.details.map((detail, i) => (
                    <Typography
                      key={i}
                      variant="body2"
                      sx={{ ml: 7, opacity: 0.9 }}
                    >
                      {detail}
                    </Typography>
                  ))}
                </Box>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Solicitar Información
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Complete el formulario y un consultor especializado le contactará en breve.
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Nombre Completo"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Juan Pérez"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Cargo"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      placeholder="Director de Operaciones"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Empresa / Organización"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Nombre de su empresa"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      label="Email Corporativo"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="juan@empresa.com"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+34 600 000 000"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      select
                      label="Servicio de Interés"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                    >
                      {services.map((service) => (
                        <MenuItem key={service} value={service}>
                          {service}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={4}
                      label="Mensaje"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describa brevemente sus necesidades..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      endIcon={<Send />}
                      sx={{ py: 1.5 }}
                    >
                      Enviar Solicitud
                    </Button>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}
                    >
                      <AccessTime fontSize="small" />
                      Tiempo de respuesta promedio: 2 horas
                    </Typography>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactSection;
