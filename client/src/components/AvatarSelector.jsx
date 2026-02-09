import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Avatar,
  Box,
  Typography,
} from '@mui/material';
import {
  Person,
  PersonOutline,
  Face,
  AccountCircle,
  SupervisedUserCircle,
  EmojiEmotions,
  SentimentSatisfied,
  TagFaces,
  Mood,
  InsertEmoticon,
  SentimentVerySatisfied,
  Psychology,
} from '@mui/icons-material';

const AVATAR_OPTIONS = [
  { id: 'person', icon: Person, color: '#1976d2', label: 'Persona' },
  { id: 'person-outline', icon: PersonOutline, color: '#2196f3', label: 'Persona Outline' },
  { id: 'face', icon: Face, color: '#03a9f4', label: 'Cara' },
  { id: 'account-circle', icon: AccountCircle, color: '#00bcd4', label: 'Cuenta' },
  { id: 'supervised', icon: SupervisedUserCircle, color: '#009688', label: 'Supervisado' },
  { id: 'emoji-emotions', icon: EmojiEmotions, color: '#4caf50', label: 'Emociones' },
  { id: 'sentiment-satisfied', icon: SentimentSatisfied, color: '#8bc34a', label: 'Satisfecho' },
  { id: 'tag-faces', icon: TagFaces, color: '#cddc39', label: 'Etiqueta' },
  { id: 'mood', icon: Mood, color: '#ffeb3b', label: 'Estado de ánimo' },
  { id: 'insert-emoticon', icon: InsertEmoticon, color: '#ffc107', label: 'Emoticón' },
  { id: 'sentiment-very-satisfied', icon: SentimentVerySatisfied, color: '#ff9800', label: 'Muy satisfecho' },
  { id: 'psychology', icon: Psychology, color: '#ff5722', label: 'Psicología' },
];

const AvatarSelector = ({ open, onClose, currentAvatar, onSelect }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || 'person');

  const handleSelect = (avatarId) => {
    setSelectedAvatar(avatarId);
  };

  const handleConfirm = () => {
    onSelect(selectedAvatar);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Seleccionar Avatar</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Elige un avatar para tu perfil
        </Typography>
        <Grid container spacing={2}>
          {AVATAR_OPTIONS.map((avatar) => {
            const IconComponent = avatar.icon;
            const isSelected = selectedAvatar === avatar.id;
            
            return (
              <Grid item xs={4} sm={3} key={avatar.id}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    p: 1,
                    borderRadius: 2,
                    border: 2,
                    borderColor: isSelected ? 'primary.main' : 'transparent',
                    bgcolor: isSelected ? 'action.selected' : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      borderColor: 'primary.light',
                    },
                  }}
                  onClick={() => handleSelect(avatar.id)}
                >
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: avatar.color,
                      mb: 1,
                    }}
                  >
                    <IconComponent sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="caption" align="center" sx={{ fontSize: '0.7rem' }}>
                    {avatar.label}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleConfirm} variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AvatarSelector;
export { AVATAR_OPTIONS };
