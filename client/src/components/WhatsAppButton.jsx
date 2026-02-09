import { Fab, Tooltip } from '@mui/material';
import { WhatsApp } from '@mui/icons-material';

const WhatsAppButton = ({ phoneNumber = '+573173654726' }) => {
  const handleClick = () => {
    const message = encodeURIComponent('Hola, me gustaría obtener más información sobre sus servicios.');
    window.open(`https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${message}`, '_blank');
  };

  return (
    <Tooltip title="Chatea con nosotros" placement="left">
      <Fab
        color="success"
        onClick={handleClick}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          bgcolor: '#25D366',
          '&:hover': {
            bgcolor: '#128C7E',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
        }}
      >
        <WhatsApp sx={{ fontSize: 32 }} />
      </Fab>
    </Tooltip>
  );
};

export default WhatsAppButton;
