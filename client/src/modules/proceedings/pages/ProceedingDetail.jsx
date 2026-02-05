import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import { ArrowBack, Folder, Description, Business, CalendarToday, Assignment } from '@mui/icons-material';
import proceedingService from '../services/proceedingService';
import { usePermissions } from '../../../hooks/usePermissions';

import ProceedingDocuments from '../components/ProceedingDocuments';
import ProceedingEntities from '../components/ProceedingEntities';
import ProceedingBoxes from '../components/ProceedingBoxes';
import ProceedingExternalUsers from '../components/ProceedingExternalUsers';
import ProceedingLoans from '../components/ProceedingLoans';

const ProceedingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [proceeding, setProceeding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProceeding();
  }, [id]);

  const loadProceeding = async () => {
    try {
      setLoading(true);
      const response = await proceedingService.getById(id);
      setProceeding(response.data);
    } catch (error) {
      console.error('Error loading proceeding:', error);
      setError('Error al cargar el expediente');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !proceeding) {
    return (
      <Box>
        <Alert severity="error">{error || 'Expediente no encontrado'}</Alert>
        <Button onClick={() => navigate('/proceedings')} sx={{ mt: 2 }} startIcon={<ArrowBack />}>
          Volver a Expedientes
        </Button>
      </Box>
    );
  }

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toISOString().split('T')[0];
  };

  return (
    <Box>
      {/* Header with Code and ID */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/proceedings')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Código / Nombre
            </Typography>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                {proceeding.name} - {proceeding.code}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                ID: {proceeding.id}
            </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: Details */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Nombre</Typography>
                    <Typography variant="body1">{proceeding.name}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Empresa Uno</Typography>
                    <Typography variant="body1">{proceeding.company?.name || '—'}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Empresa Dos / Anotaciones</Typography>
                    <Typography variant="body1">{proceeding.description || '—'}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Fecha inicial</Typography>
                    <Typography variant="body1">{formatDate(proceeding.startDate)}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Tabla de retención</Typography>
                    <Typography variant="body1">{proceeding.retention?.name || '—'}</Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Estado / Préstamo</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        <Chip
                            label={proceeding.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                            color={proceeding.status === 'ACTIVE' ? 'success' : 'default'}
                            size="small"
                        />
                        {/* Placeholder for Loan Status */}
                        <Chip
                            label="En custodia"
                            color="info"
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                </Grid>
            </Grid>
          </Paper>

          {/* Documents Section */}
          <ProceedingDocuments
            proceedingId={proceeding.id}
            documents={proceeding.documents}
            onUpdate={loadProceeding}
          />
        </Grid>

        {/* Right Column: Relations */}
        <Grid item xs={12} md={5}>
            {/* Entities */}
            <ProceedingEntities
                proceedingId={proceeding.id}
                entities={proceeding.entities}
                onUpdate={loadProceeding}
            />

            {/* Boxes */}
            <ProceedingBoxes
                proceedingId={proceeding.id}
                boxes={proceeding.boxes}
                onUpdate={loadProceeding}
            />

            {/* External Users / Shared With */}
            <ProceedingExternalUsers
                proceedingId={proceeding.id}
                users={proceeding.sharedWith}
                onUpdate={loadProceeding}
            />

            {/* Loans */}
            <ProceedingLoans
                proceedingId={proceeding.id}
                loans={proceeding.loans}
                onUpdate={loadProceeding}
            />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProceedingDetail;
