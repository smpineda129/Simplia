import { Box, keyframes, Typography } from '@mui/material';

const slideProgress = keyframes`
  0% { left: -45%; }
  100% { left: 105%; }
`;

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

const LoadingLogo = ({ size = 140, fullScreen = false }) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        animation: `${fadeIn} 0.4s ease both`,
      }}
    >
      {/* Logo mark + wordmark */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          component="img"
          src="/Vertical_Logo.png"
          alt="Simplia"
          sx={{
            height: size * 0.55,
            width: size * 0.55,
            objectFit: 'contain',
            animation: `${pulse} 2s ease-in-out infinite`,
          }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <Box>
          <Typography
            sx={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 800,
              fontSize: size * 0.18,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            simplia
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: size * 0.085,
              color: '#94A3B8',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              mt: 0.25,
            }}
          >
            Cargando...
          </Typography>
        </Box>
      </Box>

      {/* Progress bar */}
      <Box
        sx={{
          width: size * 1.1,
          height: 3,
          bgcolor: '#E2E8F0',
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            height: '100%',
            width: '45%',
            background: 'linear-gradient(90deg, transparent, #2563EB, transparent)',
            borderRadius: 2,
            animation: `${slideProgress} 1.4s ease-in-out infinite`,
          }}
        />
      </Box>
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#F8FAFC',
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default LoadingLogo;
