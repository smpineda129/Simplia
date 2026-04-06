import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  Card,
  CardContent,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Send, CheckCircle, Inbox, AttachFile, Delete } from '@mui/icons-material';
import PublicNavbar from '../../components/public/PublicNavbar';
import Footer from '../../components/public/Footer';
import {
  getPublicCompany,
  getPublicCorrespondenceTypes,
  lookupEntityByEmail,
  submitPublicCorrespondence,
  uploadPublicDocument,
} from '../../api/publicApi';

const CorrespondencePortalPage = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [correspondenceTypes, setCorrespondenceTypes] = useState([]);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [companyError, setCompanyError] = useState('');

  const [formData, setFormData] = useState({
    senderEmail: '',
    senderName: '',
    senderPhone: '',
    correspondenceTypeId: '',
    title: '',
    message: '',
    userId: null,
    userType: null,
  });
  const [emailFound, setEmailFound] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [companyRes, typesRes] = await Promise.all([
          getPublicCompany(companyId),
          getPublicCorrespondenceTypes(companyId),
        ]);
        setCompany(companyRes.data.data);
        setCorrespondenceTypes(typesRes.data.data || []);
      } catch {
        setCompanyError('No se pudo cargar la información de la empresa.');
      } finally {
        setLoadingCompany(false);
      }
    };
    load();
  }, [companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailBlur = async () => {
    const email = formData.senderEmail.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    setLookingUp(true);
    setEmailFound(false);
    try {
      const res = await lookupEntityByEmail(companyId, email);
      const entity = res.data.data;
      if (entity) {
        const fullName = entity.lastName
          ? `${entity.name} ${entity.lastName}`
          : entity.name;
        setFormData((prev) => ({
          ...prev,
          senderName: fullName || prev.senderName,
          senderPhone: entity.phone || prev.senderPhone,
          userId: entity.userId || null,
          userType: entity.userType || null,
        }));
        setEmailFound(true);
      } else {
        setFormData((prev) => ({
          ...prev,
          userId: null,
          userType: null,
        }));
      }
    } catch {
      // silently ignore lookup errors
    } finally {
      setLookingUp(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await uploadPublicDocument(file);
      const { key, originalName } = response.data.data || response.data;
      setUploadedFiles(prev => [...prev, { key, name: originalName || file.name }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al subir el archivo');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await submitPublicCorrespondence({
        companyId: parseInt(companyId),
        correspondenceTypeId: parseInt(formData.correspondenceTypeId),
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        senderPhone: formData.senderPhone,
        title: formData.title,
        message: formData.message,
        attachments: uploadedFiles,
        userId: formData.userId,
        userType: formData.userType,
      });
      setSubmitted(res.data.data);
      setUploadedFiles([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al radicar la correspondencia. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCompany) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <PublicNavbar />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (companyError || !company) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <PublicNavbar />
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Alert severity="error">{companyError || 'Empresa no encontrada'}</Alert>
        </Container>
        <Footer />
      </Box>
    );
  }

  if (submitted) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <PublicNavbar />
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Card sx={{ textAlign: 'center', p: 4 }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              ¡Correspondencia Radicada!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Tu correspondencia ha sido registrada exitosamente en <strong>{company.name}</strong>.
            </Typography>
            <Paper sx={{ p: 3, bgcolor: 'grey.50', mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Número de Radicado
              </Typography>
              <Typography variant="h5" fontWeight={700} color="primary">
                {submitted.radicado}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Guarda este número para hacer seguimiento de tu correspondencia.
              </Typography>
            </Paper>
            <Button variant="contained" onClick={() => {
              setSubmitted(null);
              setFormData({
                senderEmail: '',
                senderName: '',
                senderPhone: '',
                correspondenceTypeId: '',
                title: '',
                message: '',
                userId: null,
                userType: null,
              });
              setUploadedFiles([]);
            }} size="large">
              Radicar otra correspondencia
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

      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6, mb: 5 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Inbox sx={{ fontSize: 56, mb: 1.5 }} />
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Portal de Correspondencia
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {company.name}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.75, mt: 1 }}>
              Radica tu correspondencia de forma rápida y segura
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ pb: 8 }}>
        <Paper sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Sender info */}
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Datos del Remitente
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ingresa tu email para autocompletar tus datos si ya estás registrado
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Correo Electrónico"
                  name="senderEmail"
                  value={formData.senderEmail}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  InputProps={{
                    endAdornment: lookingUp ? <CircularProgress size={18} /> : null,
                  }}
                />
                {emailFound && (
                  <Chip
                    label="Datos encontrados"
                    color="success"
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Nombre Completo"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleChange}
                  inputProps={{ minLength: 2, maxLength: 255 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono (Opcional)"
                  name="senderPhone"
                  value={formData.senderPhone}
                  onChange={handleChange}
                />
              </Grid>

              {/* Correspondence details */}
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 1 }}>
                  Detalles de la Correspondencia
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Tipo de Correspondencia"
                  name="correspondenceTypeId"
                  value={formData.correspondenceTypeId}
                  onChange={handleChange}
                >
                  {correspondenceTypes.length === 0 ? (
                    <MenuItem disabled value="">
                      No hay tipos disponibles
                    </MenuItem>
                  ) : (
                    correspondenceTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Asunto"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  inputProps={{ minLength: 3, maxLength: 255 }}
                  placeholder="Describe brevemente el asunto"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Mensaje (Opcional)"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Proporciona más detalles sobre tu correspondencia"
                />
              </Grid>

              {/* File Upload Section */}
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 1 }}>
                  Documentos Adjuntos (Opcional)
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <AttachFile />}
                  disabled={uploading}
                  sx={{ mb: 2 }}
                >
                  {uploading ? 'Subiendo...' : 'Adjuntar Archivo'}
                  <input
                    type="file"
                    hidden
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  />
                </Button>
                {uploadedFiles.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    {uploadedFiles.map((file, index) => (
                      <Chip
                        key={index}
                        label={file.name}
                        onDelete={() => handleRemoveFile(index)}
                        deleteIcon={<Delete />}
                        sx={{ mr: 1, mb: 1 }}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </Grid>

              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading || correspondenceTypes.length === 0}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                  sx={{ py: 1.5 }}
                >
                  {loading ? 'Radicando...' : 'Radicar Correspondencia'}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info">
                  Al radicar tu correspondencia recibirás un número de radicado para hacer seguimiento.
                </Alert>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default CorrespondencePortalPage;
