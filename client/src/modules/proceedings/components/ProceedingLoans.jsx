import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import {
  AssignmentReturn,
  Add
} from '@mui/icons-material';
import { usePermissions } from '../../../hooks/usePermissions';
// Placeholder for loan service - check if it exists or use proceedingService
import proceedingService from '../services/proceedingService';

const ProceedingLoans = ({ proceedingId, loans = [], onUpdate }) => {
  const { hasPermission } = usePermissions();
  const [openCreate, setOpenCreate] = useState(false);
  // Simple form state for loan
  const [loanData, setLoanData] = useState({ userId: '', notes: '', returnDate: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    // This is a placeholder implementation.
    // In a real scenario, we'd need to select a user, set dates, etc.
    // Assuming a 'createLoan' endpoint exists on proceedingService

    setLoading(true);
    setError('');
    try {
        // Mock call - replace with actual service call
        // await proceedingService.createLoan(proceedingId, loanData);
        // For now, just alert
        alert('Funcionalidad de crear préstamo pendiente de integración con backend.');
        setOpenCreate(false);
        if (onUpdate) onUpdate();
    } catch (err) {
        console.error(err);
        setError('Error al crear préstamo');
    } finally {
        setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <AssignmentReturn sx={{ mr: 1 }} /> Préstamos
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
            fullWidth
            size="small"
            placeholder="Buscar..."
            disabled
            InputProps={{ readOnly: true }}
        />
        {hasPermission('proceeding.loan') && (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Add />}
            sx={{ mt: 1 }}
            onClick={() => setOpenCreate(true)}
          >
            Crear Préstamo
          </Button>
        )}
      </Box>

      <List>
        {loans.map((loan) => (
          <ListItem key={loan.id}>
            <ListItemIcon>
              <AssignmentReturn />
            </ListItemIcon>
            <ListItemText
              primary={`Préstamo #${loan.id}`}
              secondary={
                <>
                  <Typography variant="caption" component="span">
                    {loan.user?.name || 'Usuario desconocido'}
                  </Typography>
                  <br />
                  <Typography variant="caption" component="span">
                     Fecha: {new Date(loan.loanDate).toLocaleDateString()}
                  </Typography>
                </>
              }
            />
            <Chip
                label={loan.status}
                color={loan.status === 'ACTIVE' ? 'warning' : 'success'}
                size="small"
            />
          </ListItem>
        ))}
        {loans.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center">
            Ningún recurso coincide con los criterios dados.
          </Typography>
        )}
      </List>

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Crear Préstamo</DialogTitle>
        <DialogContent>
            <Alert severity="info" sx={{ mt: 1 }}>
                Esta funcionalidad requiere integración con el módulo de usuarios y préstamos.
            </Alert>
            {/* Form fields would go here */}
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenCreate(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleCreate} disabled={loading}>
                Crear
            </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProceedingLoans;
