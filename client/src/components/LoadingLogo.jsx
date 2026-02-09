import { Box, keyframes } from '@mui/material';

const fillAnimation = keyframes`
  0% {
    clip-path: inset(100% 0 0 0);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
`;

const pulseAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
`;

const LoadingLogo = ({ size = 150, fullScreen = false }) => {
  const content = (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Base logo (grayscale) */}
      <Box
        component="img"
        src="/Vertical_Logo.png"
        alt="GDI Logo"
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: 'grayscale(100%) opacity(0.3)',
        }}
      />
      
      {/* Animated colored logo */}
      <Box
        component="img"
        src="/Vertical_Logo.png"
        alt="GDI Logo"
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          animation: `${fillAnimation} 1.5s ease-in-out infinite, ${pulseAnimation} 2s ease-in-out infinite`,
        }}
      />
    </Box>
  );

  if (fullScreen) {
    return (
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
          bgcolor: 'background.default',
          zIndex: 9999,
          gap: 3,
        }}
      >
        {content}
        <Box
          sx={{
            width: 200,
            height: 3,
            bgcolor: 'grey.200',
            borderRadius: 1.5,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '40%',
              bgcolor: 'primary.main',
              borderRadius: 1.5,
              animation: `${keyframes`
                0% { left: -40%; }
                100% { left: 100%; }
              `} 1.5s ease-in-out infinite`,
            }}
          />
        </Box>
      </Box>
    );
  }

  return content;
};

export default LoadingLogo;
