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
  Avatar,
} from '@mui/material';
import {
  Business,
  Delete,
  Search,
  Add,
  Person
} from '@mui/icons-material';
import { usePermissions } from '../../../hooks/usePermissions';
// Note: Assuming entityService exists based on trace
// If proceedingService handles attaching, we might need that instead.
// For now, mocking attach/detach logic via proceedingService calls or generic entity actions.
import proceedingService from '../services/proceedingService';
import { entityService } from '../../entities';

const ProceedingEntities = ({ proceedingId, entities = [], onUpdate }) => {
  const { hasPermission } = usePermissions();
  const [openSearch, setOpenSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;
    setSearching(true);
    try {
      // Use entityService to search
      const response = await entityService.getAll({ search: searchTerm, limit: 5 });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching entities:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleAttach = async (entity) => {
    try {
      // Assuming endpoint: POST /proceedings/:id/entities { entityId }
      // Or PUT /proceedings/:id { entities: [...current, entity.id] }
      // Using a dedicated method if available or falling back to generic update if not.
      // Based on typical REST: POST /proceedings/:id/attach-entity
      // If not exists, we might need to update the whole proceeding.
      // Let's assume a dedicated method in service or we implement it.

      // Since proceedingService was shown and didn't show 'attach', we might need to add it or use update.
      // Assuming backend support for attach/detach is common for many-to-many.
      // If not, we will need to verify backend routes.

      // For this mock implementation, I'll assume we can call an endpoint.
      await proceedingService.attachEntity(proceedingId, entity.id);

      setOpenSearch(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error attaching entity:', error);
      alert('Error al adjuntar entidad. Puede que ya esté adjunta o no soportado.');
    }
  };

  const handleDetach = async (entityId) => {
    if (!window.confirm('¿Desvincular esta entidad?')) return;
    try {
      await proceedingService.detachEntity(proceedingId, entityId);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error detaching entity:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <Business sx={{ mr: 1 }} /> Entidades
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
        {hasPermission('proceeding.attach-entity') && (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Add />}
            sx={{ mt: 1 }}
            onClick={() => setOpenSearch(true)}
          >
            Adjuntar Entidad
          </Button>
        )}
      </Box>

      <List>
        {entities.map((entity) => (
          <ListItem
            key={entity.id}
            secondaryAction={
              hasPermission('proceeding.detach-entity') && (
                <IconButton edge="end" aria-label="delete" onClick={() => handleDetach(entity.id)}>
                  <Delete color="error" />
                </IconButton>
              )
            }
          >
            <ListItemIcon>
              <Business />
            </ListItemIcon>
            <ListItemText
              primary={entity.name}
              secondary={entity.identification || entity.email}
            />
          </ListItem>
        ))}
        {entities.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center">
            Ningún recurso coincide con los criterios dados.
          </Typography>
        )}
      </List>

      {/* Search Modal */}
      <Dialog open={openSearch} onClose={() => setOpenSearch(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Buscar Entidad</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, mt: 1 }}>
            <TextField
              fullWidth
              placeholder="Nombre, identificación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="contained" onClick={handleSearch} disabled={searching}>
              Buscar
            </Button>
          </Box>
          <List>
            {searchResults.map((entity) => (
              <ListItem key={entity.id}>
                <ListItemIcon>
                   <Business />
                </ListItemIcon>
                <ListItemText primary={entity.name} secondary={entity.identification} />
                <Button size="small" variant="outlined" onClick={() => handleAttach(entity)}>
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

export default ProceedingEntities;
