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
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Inventory,
  Delete,
  Search,
  Add
} from '@mui/icons-material';
import { usePermissions } from '../../../hooks/usePermissions';
import proceedingService from '../services/proceedingService';
import { warehouseService } from '../../warehouses';

const ProceedingBoxes = ({ proceedingId, boxes = [], onUpdate }) => {
  const { hasPermission } = usePermissions();
  const [openSearch, setOpenSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;
    setSearching(true);
    try {
      const response = await warehouseService.getBoxes({ search: searchTerm, limit: 5 });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching boxes:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleAttach = async (box) => {
    try {
      await proceedingService.attachBox(proceedingId, box.id);
      setOpenSearch(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error attaching box:', error);
      alert('Error al adjuntar caja.');
    }
  };

  const handleDetach = async (boxId) => {
    if (!window.confirm('¿Desvincular esta caja?')) return;
    try {
      await proceedingService.detachBox(proceedingId, boxId);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error detaching box:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <Inventory sx={{ mr: 1 }} /> Cajas
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar..."
          onClick={() => setOpenSearch(true)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            readOnly: true,
          }}
        />
        {hasPermission('proceeding.attach-box') && (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Add />}
            sx={{ mt: 1 }}
            onClick={() => setOpenSearch(true)}
          >
            Adjuntar Caja
          </Button>
        )}
      </Box>

      <List>
        {boxes.map((box) => (
          <ListItem
            key={box.id}
            secondaryAction={
              hasPermission('proceeding.detach-box') && (
                <IconButton edge="end" aria-label="delete" onClick={() => handleDetach(box.id)}>
                  <Delete color="error" />
                </IconButton>
              )
            }
          >
            <ListItemIcon>
              <Inventory />
            </ListItemIcon>
            <ListItemText
              primary={`Caja #${box.code || box.id}`}
              secondary={box.warehouse ? `Bodega: ${box.warehouse.name}` : ''}
            />
          </ListItem>
        ))}
        {boxes.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center">
            Ningún recurso coincide con los criterios dados.
          </Typography>
        )}
      </List>

      <Dialog open={openSearch} onClose={() => setOpenSearch(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Buscar Caja</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, mt: 1 }}>
            <TextField
              fullWidth
              placeholder="Código, nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="contained" onClick={handleSearch} disabled={searching}>
              Buscar
            </Button>
          </Box>
          <List>
            {searchResults.map((box) => (
              <ListItem key={box.id}>
                <ListItemIcon>
                   <Inventory />
                </ListItemIcon>
                <ListItemText
                    primary={box.code || `Caja #${box.id}`}
                    secondary={box.warehouse?.name}
                />
                <Button size="small" variant="outlined" onClick={() => handleAttach(box)}>
                  Adjuntar
                </Button>
              </ListItem>
            ))}
            {searchResults.length === 0 && searchTerm && !searching && (
              <Typography align="center" color="text.secondary">
                No se encontraron resultados
              </Typography>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSearch(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProceedingBoxes;
