import { Card, CardContent, Typography, Box } from '@mui/material';
import LoginForm from '../forms/LoginForm';

const LoginPage = () => {
  return (
    <Card elevation={8}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Bienvenido
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Inicia sesión para continuar
          </Typography>
        </Box>
        <LoginForm />
      </CardContent>
    </Card>
  );
};

export default LoginPage;
