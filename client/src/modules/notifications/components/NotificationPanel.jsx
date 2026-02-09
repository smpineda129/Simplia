import { useState } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Popover,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Button,
  CircularProgress,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Mail,
  AssignmentInd,
  Edit,
  Reply,
  CheckCircle,
  Chat,
  Info,
  Delete,
  DoneAll,
  Circle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
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

const NotificationPanel = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications({ limit: 10 });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    
    if (notification.data?.url) {
      navigate(notification.data.url);
      handleClose();
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (e, notificationId) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const getIcon = (iconName) => {
    const IconComponent = ICON_MAP[iconName] || Info;
    return <IconComponent fontSize="small" />;
  };

  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: es,
      });
    } catch {
      return '';
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Notificaciones">
        <IconButton color="inherit" onClick={handleOpen}>
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 500,
            mt: 1,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notificaciones
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              startIcon={<DoneAll />}
              onClick={handleMarkAllAsRead}
              sx={{ textTransform: 'none' }}
            >
              Marcar todas
            </Button>
          )}
        </Box>

        <Divider />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">
              No tienes notificaciones
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0, maxHeight: 350, overflow: 'auto' }}>
            {notifications.map((notification, index) => (
              <Box key={notification.id}>
                <ListItem
                  button
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                    '&:hover': {
                      bgcolor: notification.isRead ? 'action.hover' : 'action.selected',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: notification.isRead ? 400 : 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: 200,
                          }}
                        >
                          {notification.data?.title || 'Notificación'}
                        </Typography>
                        {!notification.isRead && (
                          <Circle sx={{ fontSize: 8, color: 'primary.main' }} />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {notification.data?.message}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {formatTime(notification.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => handleDelete(e, notification.id)}
                      sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}

        <Divider />

        <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
          <Button
            size="small"
            onClick={() => {
              navigate('/notifications');
              handleClose();
            }}
            sx={{ textTransform: 'none' }}
          >
            Ver todas las notificaciones
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationPanel;
