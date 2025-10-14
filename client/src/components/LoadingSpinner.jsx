import { Box, CircularProgress, Typography, Fade } from '@mui/material';

const LoadingSpinner = ({ message = 'Cargando...', fullScreen = false, size = 40 }) => {
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
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 9999,
            backdropFilter: 'blur(4px)',
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography
            variant="body1"
            sx={{
              mt: 2,
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
        <CircularProgress size={size} thickness={4} />
        {message && (
          <Typography
            variant="body2"
            sx={{
              mt: 2,
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
