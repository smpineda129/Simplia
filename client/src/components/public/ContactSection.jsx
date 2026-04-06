import { useState } from 'react';
import {
  Box, Container, Typography, Grid, TextField,
  Button, MenuItem, Snackbar, Alert,
} from '@mui/material';
import { LocationOn, Phone, Email, Send, AccessTime } from '@mui/icons-material';

const contactInfo = [
  {
    icon: <LocationOn sx={{ fontSize: 18 }} />,
    title: 'Sede Central',
    details: ['Cl. 105c #29, Manizales, Caldas', 'Colombia'],
  },
  {
    icon: <Phone sx={{ fontSize: 18 }} />,
    title: 'Teléfono',
    details: ['+57 317 3654726'],
  },
  {
    icon: <Email sx={{ fontSize: 18 }} />,
    title: 'Correos',
    details: ['ventas@simplia.com', 'soporte@simplia.com'],
  },
  {
    icon: <AccessTime sx={{ fontSize: 18 }} />,
    title: 'Horario',
    details: ['Lun–Vie: 9:00 – 18:00', 'Respuesta en < 2 horas'],
  },
];

const services = [
  'Custodia Documental',
  'Digitalización',
  'Organización Archivística',
  'Gestión de Archivos',
  'Consultoría Normativa',
  'Otro',
];

const EMPTY = { name: '', position: '', company: '', email: '', phone: '', service: '', message: '' };

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1.5,
    '& fieldset': { borderColor: '#E2E8F0', borderWidth: '1.5px' },
    '&:hover fieldset': { borderColor: '#94A3B8' },
    '&.Mui-focused fieldset': { borderColor: '#2563EB', borderWidth: '1.5px' },
  },
  '& .MuiInputLabel-root': { color: '#94A3B8', fontWeight: 500 },
  '& .MuiInputLabel-root.Mui-focused': { color: '#2563EB' },
};

const ContactSection = () => {
  const [formData, setFormData] = useState(EMPTY);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSnackbar({ open: true, message: 'Solicitud enviada. Te contactaremos en breve.', severity: 'success' });
    setFormData(EMPTY);
  };

  return (
    <Box id="contacto" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#ffffff' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563EB', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 1.5 }}>
            Soporte B2B & Ventas
          </Typography>
          <Typography
            component="h2"
            sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.5rem' }, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.15, mb: 2 }}
          >
            Hablemos de tu{' '}
            <Box component="span" sx={{ color: '#2563EB' }}>próximo paso</Box>
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: '1rem', maxWidth: 560, mx: 'auto', lineHeight: 1.7 }}>
            Estamos listos para optimizar tu flujo documental. Contáctanos y un experto te guiará.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Info panel */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 3,
                background: 'linear-gradient(145deg, #0F172A 0%, #1E3A5F 60%, #1D4ED8 100%)',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', mb: 1 }}>
                Información de Contacto
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', mb: 4, lineHeight: 1.65 }}>
                Nuestro equipo está disponible para responder tus preguntas y encontrar la mejor solución.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1 }}>
                {contactInfo.map((info) => (
                  <Box key={info.title} sx={{ display: 'flex', gap: 2 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: '#93C5FD',
                      }}
                    >
                      {info.icon}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.9)', mb: 0.25 }}>
                        {info.title}
                      </Typography>
                      {info.details.map((d) => (
                        <Typography key={d} sx={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.55)' }}>
                          {d}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Bottom brand */}
              <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
                  simplia
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', mt: 0.25 }}>
                  Gestión Documental Inteligente
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Form */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                border: '1px solid #E2E8F0',
                bgcolor: '#ffffff',
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '1.0625rem', color: '#0F172A', mb: 0.5 }}>
                Solicitar información
              </Typography>
              <Typography sx={{ color: '#94A3B8', fontSize: '0.875rem', mb: 3.5 }}>
                Complete el formulario y un consultor le contactará en menos de 2 horas.
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth required label="Nombre Completo" name="name" value={formData.name} onChange={handleChange} placeholder="Juan Pérez" sx={inputSx} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth required label="Cargo" name="position" value={formData.position} onChange={handleChange} placeholder="Director de Operaciones" sx={inputSx} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth required label="Empresa / Organización" name="company" value={formData.company} onChange={handleChange} placeholder="Nombre de su empresa" sx={inputSx} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth required type="email" label="Email Corporativo" name="email" value={formData.email} onChange={handleChange} placeholder="juan@empresa.com" sx={inputSx} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} placeholder="+57 300 000 0000" sx={inputSx} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth required select label="Servicio de Interés" name="service" value={formData.service} onChange={handleChange} sx={inputSx}>
                      {services.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth required multiline rows={4} label="Mensaje" name="message" value={formData.message} onChange={handleChange} placeholder="Describa brevemente sus necesidades..." sx={inputSx} />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      endIcon={<Send sx={{ fontSize: 18 }} />}
                      sx={{
                        py: 1.5,
                        bgcolor: '#2563EB',
                        fontWeight: 700,
                        borderRadius: 2,
                        boxShadow: 'none',
                        fontSize: '0.9375rem',
                        '&:hover': { bgcolor: '#1D4ED8', boxShadow: '0 8px 20px rgba(37,99,235,0.25)' },
                      }}
                    >
                      Enviar solicitud
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                      <AccessTime sx={{ fontSize: 14, color: '#CBD5E1' }} />
                      <Typography sx={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
                        Tiempo de respuesta promedio: menos de 2 horas
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactSection;
