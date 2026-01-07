import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const ForbiddenPage = () => {
    const navigate = useNavigate();

    return (
        <Card elevation={8} sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: 'error.light',
                        color: 'error.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                    }}
                >
                    <LockOutlinedIcon sx={{ fontSize: 40 }} />
                </Box>

                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                    403
                </Typography>

                <Typography variant="h5" gutterBottom color="text.primary">
                    Acceso Denegado
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                    Lo sentimos, no tienes los permisos necesarios para acceder a este recurso.
                    Si crees que esto es un error, contacta a tu administrador.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(-1)}
                    >
                        Regresar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/dashboard')}
                    >
                        Ir al Inicio
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ForbiddenPage;
