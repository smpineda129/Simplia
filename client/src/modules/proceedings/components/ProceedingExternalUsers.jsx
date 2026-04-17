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
  Share,
  Delete,
  Search,
  Add
} from '@mui/icons-material';
import { usePermissions } from '../../../hooks/usePermissions';
import proceedingService from '../services/proceedingService';
import entityService from '../../entities/services/entityService';
import RichTextEditor from '../../../components/RichTextEditor';

const ProceedingExternalUsers = ({ proceedingId, users = [], onUpdate }) => {
  const { hasPermission } = usePermissions();
  const [openSearch, setOpenSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [customMessage, setCustomMessage] = useState('');

  const handleSearch = async () => {
    if (!searchTerm) return;
    setSearching(true);
    try {
      const response = await entityService.getAll({ search: searchTerm, limit: 10 });
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Error searching external users:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setCustomMessage('');
  };

  const handleConfirmShare = async () => {
    if (!selectedUser) return;
    try {
      await proceedingService.shareWithUser(proceedingId, selectedUser.id, customMessage);
      setOpenSearch(false);
      setSearchTerm('');
      setSearchResults([]);
      setSelectedUser(null);
      setCustomMessage('');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error sharing with user:', error);
      alert(error.response?.data?.message || 'Error al compartir con usuario.');
    }
  };

  const handleCancelShare = () => {
    setSelectedUser(null);
    setCustomMessage('');
  };

  const handleDetach = async (userId) => {
    if (!window.confirm('¿Dejar de compartir con este usuario?')) return;
    try {
      await proceedingService.unshareWithUser(proceedingId, userId);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error unsharing with user:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <Share sx={{ mr: 1 }} /> Compartido con
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar usuario externo..."
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
        {hasPermission('proceeding.share') && (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Add />}
            sx={{ mt: 1 }}
            onClick={() => setOpenSearch(true)}
          >
            Compartir con usuario externo
          </Button>
        )}
      </Box>

      <List>
        {users.map((user) => (
          <ListItem
            key={user.id}
            secondaryAction={
              hasPermission('proceeding.share') && (
                <IconButton edge="end" onClick={() => handleDetach(user.id)}>
                  <Delete color="error" />
                </IconButton>
              )
            }
          >
            <ListItemIcon>
              <Share />
            </ListItemIcon>
            <ListItemText
              primary={`${user.name}${user.lastName ? ` ${user.lastName}` : ''}`}
              secondary={[user.email, user.phone, user.city].filter(Boolean).join(' · ')}
            />
          </ListItem>
        ))}
        {users.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center">
            No hay usuarios externos con acceso a este expediente.
          </Typography>
        )}
      </List>

      <Dialog open={openSearch} onClose={() => setOpenSearch(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Mensaje personalizado (opcional)' : 'Buscar Usuario Externo'}
        </DialogTitle>
        <DialogContent>
          {!selectedUser ? (
            <>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, mt: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Nombre, email, DNI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button variant="contained" onClick={handleSearch} disabled={searching}>
                  Buscar
                </Button>
              </Box>
              <List>
                {searchResults.map((user) => (
                  <ListItem key={user.id}>
                    <ListItemIcon>
                      <Share />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${user.name}${user.lastName ? ` ${user.lastName}` : ''}`}
                      secondary={user.email}
                    />
                    <Button size="small" variant="outlined" onClick={() => handleSelectUser(user)}>
                      Seleccionar
                    </Button>
                  </ListItem>
                ))}
                {searchResults.length === 0 && searchTerm && !searching && (
                  <Typography align="center" color="text.secondary">
                    No se encontraron resultados
                  </Typography>
                )}
              </List>
            </>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Compartiendo con: <strong>{selectedUser.name}{selectedUser.lastName ? ` ${selectedUser.lastName}` : ''}</strong> ({selectedUser.email})
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Mensaje personalizado (opcional)
              </Typography>
              <RichTextEditor
                value={customMessage}
                onChange={setCustomMessage}
                placeholder="Escribe un mensaje personalizado para incluir en el email de notificación..."
                height="200px"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedUser ? (
            <>
              <Button onClick={handleCancelShare}>Atrás</Button>
              <Button variant="contained" onClick={handleConfirmShare}>
                Compartir
              </Button>
            </>
          ) : (
            <Button onClick={() => setOpenSearch(false)}>Cerrar</Button>
          )}
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProceedingExternalUsers;
