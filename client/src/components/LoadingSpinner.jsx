import { Box, Typography, Fade } from '@mui/material';
import LoadingLogo from './LoadingLogo';

const LoadingSpinner = ({ message = 'Cargando...', fullScreen = false, size = 120 }) => {
  if (fullScreen) {
    return (
      <Fade in timeout={300}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.default',
            zIndex: 9999,
          }}
        >
          <LoadingLogo size={size} />
          <Typography
            variant="body1"
            sx={{
              mt: 4,
              color: 'text.secondary',
              fontWeight: 500,
            }}
          >
            {message}
          </Typography>
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          width: '100%',
          py: 4,
        }}
      >
        <LoadingLogo size={size * 0.8} />
        {message && (
          <Typography
            variant="body2"
            sx={{
              mt: 3,
              color: 'text.secondary',
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Fade>
  );
};

export default LoadingSpinner;
