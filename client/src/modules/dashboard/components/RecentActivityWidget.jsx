import { 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText,
  Avatar,
  Box,
  Chip,
} from '@mui/material';
import {
  Description,
  Send,
  Folder,
  CheckCircle,
  Upload,
} from '@mui/icons-material';

const RecentActivityWidget = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    const icons = {
      document: <Description />,
      correspondence: <Send />,
      proceeding: <Folder />,
      upload: <Upload />,
      complete: <CheckCircle />,
    };
    return icons[type] || <Description />;
  };

  const getActivityColor = (type) => {
    const colors = {
      document: 'primary.main',
      correspondence: 'warning.main',
      proceeding: 'success.main',
      upload: 'info.main',
      complete: 'success.main',
    };
    return colors[type] || 'grey.500';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60); // minutos
    
    if (diff < 1) return 'Hace un momento';
    if (diff < 60) return `Hace ${diff} min`;
    if (diff < 1440) return `Hace ${Math.floor(diff / 60)} h`;
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Actividad Reciente
          </Typography>
          <Chip label={`${activities.length} eventos`} size="small" color="primary" variant="outlined" />
        </Box>
        
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {activities.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No hay actividad reciente
              </Typography>
            </Box>
          ) : (
            activities.map((activity, index) => (
              <ListItem
                key={index}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: getActivityColor(activity.type) }}>
                    {getActivityIcon(activity.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={500}>
                      {activity.title}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                        {formatTime(activity.timestamp)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentActivityWidget;
