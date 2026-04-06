import { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DescriptionIcon from '@mui/icons-material/Description';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SurveyComponent from '../components/SurveyComponent';
import entidadesPublicasConfig from '../config/EntidadesPublicasConfig';
import mgdaConfig from '../config/MGMAconfig';
import entidadesPrivadasConfig from '../config/surveyConfig';

const FORM_OPTIONS = [
  {
    id: 'entidades_publicas',
    title: 'Diagnóstico Integral de Archivos – Entidades Públicas',
    description: 'Formulario de diagnóstico documental para entidades del sector público, basado en la normatividad archivística colombiana.',
    icon: <AccountBalanceIcon sx={{ fontSize: 48 }} />,
    config: entidadesPublicasConfig,
    color: '#1565c0',
    bgColor: '#e3f2fd',
  },
  {
    id: 'mgda',
    title: 'Modelo de Gestión Documental y Administración de Archivos (MGDA)',
    description: 'Evaluación del modelo de gestión documental y administración de archivos institucional.',
    icon: <DescriptionIcon sx={{ fontSize: 48 }} />,
    config: mgdaConfig,
    color: '#7b1fa2',
    bgColor: '#f3e5f5',
  },
  {
    id: 'entidades_privadas',
    title: 'Diagnóstico Integral de Archivos – Entidades Privadas',
    description: 'Formulario de diagnóstico documental para entidades del sector privado con generación de presentación.',
    icon: <BusinessIcon sx={{ fontSize: 48 }} />,
    config: entidadesPrivadasConfig,
    color: '#2e7d32',
    bgColor: '#e8f5e9',
  },
];

const SurveyPage = () => {
  const [selectedForm, setSelectedForm] = useState(null);

  if (selectedForm) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => setSelectedForm(null)}
            sx={{ mb: 2 }}
          >
            Volver a la selección
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            {selectedForm.title}
          </Typography>
          <SurveyComponent
            config={selectedForm.config}
            formType={selectedForm.id}
            onComplete={() => {}}
          />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Instrumentos de Diagnóstico
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Seleccione el tipo de formulario de diagnóstico que desea diligenciar.
        </Typography>

        <Grid container spacing={3}>
          {FORM_OPTIONS.map((form) => (
            <Grid item xs={12} md={4} key={form.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  border: 2,
                  borderColor: 'transparent',
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: form.color,
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => setSelectedForm(form)}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: form.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: form.color,
                    mb: 2,
                  }}
                >
                  {form.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {form.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  {form.description}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: form.color,
                    color: form.color,
                    '&:hover': {
                      bgcolor: form.bgColor,
                      borderColor: form.color,
                    },
                  }}
                >
                  Iniciar Diagnóstico
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default SurveyPage;
