import { 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Box,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const QuickAccessWidget = ({ actions = [] }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          Accesos Rápidos
        </Typography>
        
        <Grid container spacing={2}>
          {actions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate(action.path)}
                sx={{
                  height: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  borderColor: action.color,
                  color: action.color,
                  '&:hover': {
                    borderColor: action.color,
                    bgcolor: `${action.color}10`,
                  },
                }}
              >
                <Box sx={{ fontSize: 32, color: action.color }}>
                  {action.icon}
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {action.title}
                </Typography>
                {action.badge && (
                  <Typography variant="caption" color="text.secondary">
                    {action.badge}
                  </Typography>
                )}
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickAccessWidget;
