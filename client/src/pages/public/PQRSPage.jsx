import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  Alert,
  Snackbar,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  Send,
  ContactSupport,
  CheckCircle,
  Close,
  AttachFile,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../../components/public/PublicNavbar';
import Footer from '../../components/public/Footer';
import ticketService from '../../modules/support-tickets/services/ticketService';

const PQRSPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    subject: '',
    description: '',
    module: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [ticketCreated, setTicketCreated] = useState(null);

  const modules = [
    'Usuarios',
    'Empresas',
    'Expedientes',
    'Correspondencia',
    'Documentos',
    'Retenciones',
    'Almacenes',
    'Plantillas',
    'Otro',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await ticketService.createAnonymous({
        ...formData,
        imageUrl: imagePreview, // In production, upload to bucket first
      });

      setTicketCreated(response.data);
      setSnackbar({
        open: true,
        message: response.message,
        severity: 'success',
      });

      // Reset form
      setFormData({
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        subject: '',
        description: '',
        module: '',
      });
      setImagePreview(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al enviar PQRS',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (ticketCreated) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <PublicNavbar />
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Card sx={{ textAlign: 'center', p: 4 }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              ¡PQRS Enviado Exitosamente!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Tu solicitud ha sido recibida y será procesada a la brevedad.
            </Typography>
            <Paper sx={{ p: 3, bgcolor: 'grey.50', mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Número de Ticket
              </Typography>
              <Typography variant="h5" fontWeight={700} color="primary">
                {ticketCreated.ticketNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Recibirás actualizaciones en: <strong>{formData.contactEmail}</strong>
              </Typography>
            </Paper>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              size="large"
            >
              Volver al Inicio
            </Button>
          </Card>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <PublicNavbar />
      
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <ContactSupport sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h3" fontWeight={700} gutterBottom>
              PQRS - Peticiones, Quejas, Reclamos y Sugerencias
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Tu opinión es importante para nosotros. Envíanos tus comentarios de forma anónima.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ pb: 8 }}>
        <Paper sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Contact Information */}
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Información de Contacto
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Proporciona tus datos para que podamos responderte
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Nombre Completo"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Correo Electrónico"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono (Opcional)"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Módulo Relacionado"
                  name="module"
                  value={formData.module}
                  onChange={handleChange}
                >
                  {modules.map((module) => (
                    <MenuItem key={module} value={module}>
                      {module}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* PQRS Details */}
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                  Detalles de tu PQRS
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Asunto"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Describe brevemente tu solicitud"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={6}
                  label="Descripción Detallada"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Proporciona todos los detalles relevantes sobre tu petición, queja, reclamo o sugerencia"
                />
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AttachFile />}
                  fullWidth
                >
                  Adjuntar Imagen (Opcional)
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                {imagePreview && (
                  <Box sx={{ mt: 2, position: 'relative' }}>
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', right: 0, top: 0, bgcolor: 'background.paper' }}
                      onClick={() => setImagePreview(null)}
                    >
                      <Close />
                    </IconButton>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '100%', maxHeight: 300, objectFit: 'contain' }}
                    />
                  </Box>
                )}
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={<Send />}
                  sx={{ py: 1.5 }}
                >
                  {loading ? 'Enviando...' : 'Enviar PQRS'}
                </Button>
              </Grid>

              {/* Info Alert */}
              <Grid item xs={12}>
                <Alert severity="info">
                  Tu PQRS será procesado de forma confidencial. Recibirás una respuesta en el correo electrónico proporcionado.
                </Alert>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>

      <Footer />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PQRSPage;
