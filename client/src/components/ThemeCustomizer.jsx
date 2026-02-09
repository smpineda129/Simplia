import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { useThemeCustomization } from '../context/ThemeContext';

const COLOR_PRESETS = [
  { name: 'Azul', primary: '#1976d2', secondary: '#dc004e' },
  { name: 'Verde', primary: '#2e7d32', secondary: '#f57c00' },
  { name: 'Púrpura', primary: '#7b1fa2', secondary: '#c2185b' },
  { name: 'Naranja', primary: '#e65100', secondary: '#1976d2' },
  { name: 'Teal', primary: '#00796b', secondary: '#d32f2f' },
  { name: 'Índigo', primary: '#303f9f', secondary: '#f50057' },
  { name: 'Rosa', primary: '#c2185b', secondary: '#7b1fa2' },
  { name: 'Cian', primary: '#0097a7', secondary: '#ff6f00' },
];

const ThemeCustomizer = ({ open, onClose }) => {
  const { themeConfig, updateThemeConfig, resetTheme } = useThemeCustomization();
  const [tempConfig, setTempConfig] = useState(themeConfig);

  const handleColorSelect = (preset) => {
    setTempConfig({
      ...tempConfig,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
    });
  };

  const handleModeToggle = (event) => {
    setTempConfig({
      ...tempConfig,
      mode: event.target.checked ? 'dark' : 'light',
    });
  };

  const handleSave = () => {
    updateThemeConfig(tempConfig);
    onClose();
  };

  const handleReset = () => {
    resetTheme();
    setTempConfig({
      primaryColor: '#1976d2',
      secondaryColor: '#dc004e',
      mode: 'light',
    });
  };

  const handleCancel = () => {
    setTempConfig(themeConfig);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Personalizar Tema</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={tempConfig.mode === 'dark'}
                onChange={handleModeToggle}
              />
            }
            label="Modo Oscuro"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Esquemas de Color
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Selecciona un esquema de color para personalizar tu panel
        </Typography>

        <Grid container spacing={2}>
          {COLOR_PRESETS.map((preset) => {
            const isSelected =
              tempConfig.primaryColor === preset.primary &&
              tempConfig.secondaryColor === preset.secondary;

            return (
              <Grid item xs={6} sm={4} key={preset.name}>
                <Paper
                  elevation={isSelected ? 8 : 1}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: 2,
                    borderColor: isSelected ? 'primary.main' : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      elevation: 4,
                      borderColor: 'primary.light',
                    },
                  }}
                  onClick={() => handleColorSelect(preset)}
                >
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: preset.primary,
                        borderRadius: 1,
                      }}
                    />
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: preset.secondary,
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                  <Typography variant="caption" fontWeight={isSelected ? 'bold' : 'normal'}>
                    {preset.name}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="caption" color="text.secondary">
            Vista previa:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Box
              sx={{
                flex: 1,
                height: 60,
                bgcolor: tempConfig.primaryColor,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'white' }}>
                Primario
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                height: 60,
                bgcolor: tempConfig.secondaryColor,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'white' }}>
                Secundario
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset} color="error">
          Restablecer
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={handleCancel}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ThemeCustomizer;
