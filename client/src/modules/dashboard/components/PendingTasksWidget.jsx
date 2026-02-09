import { 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Chip,
  Badge,
} from '@mui/material';
import {
  Assignment,
  Warning,
  Schedule,
  PriorityHigh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PendingTasksWidget = ({ tasks = [] }) => {
  const navigate = useNavigate();

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'info',
    };
    return colors[priority] || 'default';
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'high') return <PriorityHigh />;
    if (priority === 'medium') return <Warning />;
    return <Schedule />;
  };

  const urgentTasks = tasks.filter(t => t.priority === 'high').length;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Tareas Pendientes
          </Typography>
          {urgentTasks > 0 && (
            <Badge badgeContent={urgentTasks} color="error">
              <Chip 
                icon={<Assignment />} 
                label={`${tasks.length} total`} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
            </Badge>
          )}
        </Box>
        
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {tasks.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                ¡Todo al día! No hay tareas pendientes
              </Typography>
            </Box>
          ) : (
            tasks.map((task, index) => (
              <ListItem
                key={index}
                disablePadding
                sx={{ mb: 1 }}
              >
                <ListItemButton
                  onClick={() => task.path && navigate(task.path)}
                  sx={{
                    borderRadius: 1,
                    border: 1,
                    borderColor: task.priority === 'high' ? 'error.light' : 'divider',
                    bgcolor: task.priority === 'high' ? 'error.lighter' : 'background.paper',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Box sx={{ color: `${getPriorityColor(task.priority)}.main` }}>
                      {getPriorityIcon(task.priority)}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={500}>
                        {task.title}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {task.description}
                        </Typography>
                        <Chip
                          label={task.count}
                          size="small"
                          color={getPriorityColor(task.priority)}
                          sx={{ height: 20, fontSize: '0.7rem', ml: 'auto' }}
                        />
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default PendingTasksWidget;
