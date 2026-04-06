import { useState, useCallback } from 'react';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/survey-core.min.css';
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  Button,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import surveyService from '../services/surveyService';

const SurveyComponent = ({ config, formType, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);

  const handleComplete = useCallback(async (sender) => {
    setLoading(true);
    setError(null);

    try {
      const surveyData = sender.data;
      await surveyService.create({
        formType,
        surveyData,
        status: 'completed',
      });
      setCompleted(true);
      if (onComplete) onComplete();
    } catch (err) {
      console.error('Error al enviar encuesta:', err);
      setError('Error al enviar los datos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [formType, onComplete]);

  if (completed) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          gap: 2,
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main' }} />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Formulario enviado exitosamente
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Los datos han sido guardados correctamente.
        </Typography>
        <Button
          variant="contained"
          onClick={() => setCompleted(false)}
          sx={{ mt: 2 }}
        >
          Llenar otro formulario
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const survey = new Model(config);

  survey.locale = 'es';
  survey.completeText = 'Enviar';
  survey.pageNextText = 'Siguiente';
  survey.pagePrevText = 'Anterior';
  survey.showProgressBar = 'top';
  survey.progressBarType = 'pages';

  survey.onComplete.add(handleComplete);

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <Survey model={survey} />
    </Box>
  );
};

export default SurveyComponent;
