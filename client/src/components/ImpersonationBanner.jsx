import { Box, Typography, Button, Alert } from '@mui/material';
import { ExitToApp, Person } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const ImpersonationBanner = () => {
    const { isImpersonating, user, leaveImpersonation } = useAuth();

    if (!isImpersonating) {
        return null;
    }

    const handleLeaveImpersonation = async () => {
        try {
            await leaveImpersonation();
        } catch (error) {
            console.error('Error leaving impersonation:', error);
        }
    };

    return (
        <Alert
            severity="warning"
            sx={{
                borderRadius: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1.5,
                px: 3,
            }}
            icon={<Person />}
            action={
                <Button
                    color="inherit"
                    size="small"
                    startIcon={<ExitToApp />}
                    onClick={handleLeaveImpersonation}
                    sx={{
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        },
                    }}
                >
                    Salir de Personificación
                </Button>
            }
        >
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                Estás personificando a <strong>{user?.name}</strong> ({user?.email})
            </Typography>
        </Alert>
    );
};

export default ImpersonationBanner;
