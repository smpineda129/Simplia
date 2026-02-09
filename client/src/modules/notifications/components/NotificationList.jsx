import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Chip,
  CircularProgress,
  Pagination,
  Divider,
  FormControlLabel,
  Switch,
  Tooltip,
} from '@mui/material';
import {
  Mail,
  AssignmentInd,
  Edit,
  Reply,
  CheckCircle,
  Chat,
  Info,
  Delete,
  DoneAll,
  DeleteSweep,
  Circle,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import useNotifications from '../hooks/useNotifications';

const ICON_MAP = {
  mail: Mail,
  assignment_ind: AssignmentInd,
  edit: Edit,
  reply: Reply,
  check_circle: CheckCircle,
  chat: Chat,
  info: Info,
};

const NotificationList = () => {
  const navigate = useNavigate();
  const [unreadOnly, setUnreadOnly] = useState(false);
  const {
    notifications,
    unreadCount,
    loading,
    pagination,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotifications({ autoFetch: false });

  useEffect(() => {
    fetchNotifications({ unreadOnly });
  }, [unreadOnly]);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    
    if (notification.data?.url) {
      navigate(notification.data.url);
    }
  };

  const handlePageChange = (event, page) => {
    fetchNotifications({ page, unreadOnly });
  };

  const getIcon = (iconName) => {
    const IconComponent = ICON_MAP[iconName] || Info;
    return <IconComponent />;
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM 'a las' HH:mm", { locale: es });
    } catch {
      return '';
    }
  };

  const getModuleColor = (module) => {
    const colors = {
      correspondences: 'primary',
      proceedings: 'secondary',
      documents: 'info',
      system: 'default',
    };
    return colors[module] || 'default';
  };

  const getModuleLabel = (module) => {
    const labels = {
      correspondences: 'Correspondencia',
      proceedings: 'Expedientes',
      documents: 'Documentos',
      system: 'Sistema',
    };
    return labels[module] || module;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Notificaciones
          </Typography>
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} sin leer`}
              color="primary"
              size="small"
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={unreadOnly}
                onChange={(e) => setUnreadOnly(e.target.checked)}
                size="small"
              />
            }
            label="Solo no leídas"
          />
          {unreadCount > 0 && (
            <Tooltip title="Marcar todas como leídas">
              <Button
                variant="outlined"
                size="small"
                startIcon={<DoneAll />}
                onClick={markAllAsRead}
              >
                Marcar todas
              </Button>
            </Tooltip>
          )}
          {notifications.length > 0 && (
            <Tooltip title="Eliminar todas">
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<DeleteSweep />}
                onClick={deleteAllNotifications}
              >
                Eliminar todas
              </Button>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Paper elevation={1}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay notificaciones
            </Typography>
            <Typography color="text.disabled">
              {unreadOnly
                ? 'No tienes notificaciones sin leer'
                : 'Las notificaciones aparecerán aquí cuando ocurran eventos importantes'}
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => (
              <Box key={notification.id}>
                <ListItem
                  button
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    py: 2,
                    bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                    '&:hover': {
                      bgcolor: notification.isRead ? 'action.hover' : 'action.selected',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: notification.isRead ? 'action.disabledBackground' : 'primary.light',
                        color: notification.isRead ? 'text.secondary' : 'primary.main',
                      }}
                    >
                      {getIcon(notification.data?.icon)}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: notification.isRead ? 400 : 600 }}
                        >
                          {notification.data?.title || 'Notificación'}
                        </Typography>
                        {!notification.isRead && (
                          <Circle sx={{ fontSize: 10, color: 'primary.main' }} />
                        )}
                        <Chip
                          label={getModuleLabel(notification.data?.module)}
                          size="small"
                          color={getModuleColor(notification.data?.module)}
                          variant="outlined"
                          sx={{ ml: 'auto', height: 24 }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {notification.data?.message}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {formatDate(notification.createdAt)}
                        </Typography>
                        {notification.data?.radicado && (
                          <Chip
                            label={notification.data.radicado}
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Eliminar">
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}

        {pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default NotificationList;
