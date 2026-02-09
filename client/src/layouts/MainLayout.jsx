import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  People,
  Business,
  AccountTree,
  Description,
  Mail,
  Article,
  Folder,
  Send,
  InsertDriveFile,
  Group,
  Warehouse,
  Menu as MenuIcon,
  Security,
  VpnKey,
  AccountCircle,
  Settings,
  Logout,
  KeyboardArrowDown,
  ContactSupport,
  Assignment,
} from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { NotificationPanel } from '../modules/notifications';
import ImpersonationBanner from '../components/ImpersonationBanner';
import { getAvatarConfig } from '../utils/avatarUtils';

const drawerWidth = 240;

const MainLayout = () => {
  const { user, logout, isOwner } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleSettings = () => {
    handleMenuClose();
    // Navegar al perfil de la empresa del usuario
    if (user?.companyId) {
      navigate(`/companies/${user.companyId}`);
    }
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!permission) return true; // Public route
    if (!user?.allPermissions) return false;
    // SUPER_ADMIN tiene acceso completo a todo
    if (user.role === 'SUPER_ADMIN') return true;
    return user.allPermissions.includes(permission);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', permission: null },
    {
      text: 'Empresas',
      icon: <Business />,
      path: isOwner ? '/companies' : `/companies/${user?.companyId}`,
      permission: 'company.view'
    },
    { text: 'Correspondencia', icon: <Send />, path: '/correspondences', permission: 'correspondence.view' },
    { text: 'Plantillas', icon: <Article />, path: '/templates', permission: 'template.view' },
    { text: 'Expedientes', icon: <Folder />, path: '/proceedings', permission: 'proceeding.view' },
    { text: 'Retención', icon: <Description />, path: '/retentions', permission: 'retention.view' },
    { text: 'Entidades', icon: <Group />, path: '/entities', permission: 'entity.view' },
    { text: 'Almacenes', icon: <Warehouse />, path: '/warehouses', permission: 'warehouse.view' },
    { text: 'Permisos', icon: <VpnKey />, path: '/permissions', permission: 'permission.view' },
    { text: 'Roles', icon: <Security />, path: '/roles', permission: 'role.view' },
    { text: 'Usuarios', icon: <People />, path: '/users', permission: 'user.view' },
    { text: 'Soporte', icon: <ContactSupport />, path: '/support', permission: null },
    { text: 'Admin Tickets', icon: <Assignment />, path: '/support/admin', permission: null },
  ];

  const filteredMenuItems = menuItems.filter(item => hasPermission(item.permission));

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Toolbar sx={{ justifyContent: 'center', py: 2.5, px: 2 }}>
        <Box
          component="img"
          src="/Horizontal_Logo.jpeg"
          alt="GDI Logo"
          onClick={() => navigate('/')}
          sx={{
            height: 40,
            objectFit: 'contain',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
      </Toolbar>
      <Divider />
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  py: 1.25,
                  px: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'translateX(4px)',
                  },
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 40,
                    color: isActive ? 'inherit' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            
          </Typography>

          {/* Notifications & User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationPanel />
            <Button
              color="inherit"
              onClick={handleMenuOpen}
              startIcon={
                (() => {
                  const avatarConfig = getAvatarConfig(user?.avatar);
                  const AvatarIcon = avatarConfig.icon;
                  return (
                    <Avatar
                      sx={{ width: 32, height: 32, bgcolor: avatarConfig.color }}
                    >
                      <AvatarIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                  );
                })()
              }
              endIcon={<KeyboardArrowDown />}
              sx={{ textTransform: 'none' }}
            >
              <Box sx={{ textAlign: 'left', ml: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user?.name || 'Usuario'}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {user?.company?.name || 'Company'}
                </Typography>
              </Box>
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 220,
                  borderRadius: 2,
                  overflow: 'visible',
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
            >
              <Box 
                sx={{ 
                  px: 2, 
                  py: 1.5, 
                  borderBottom: 1, 
                  borderColor: 'divider',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  transition: 'background-color 0.2s',
                }}
                onClick={handleProfile}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {(() => {
                    const avatarConfig = getAvatarConfig(user?.avatar);
                    const AvatarIcon = avatarConfig.icon;
                    return (
                      <Avatar
                        sx={{ width: 40, height: 40, bgcolor: avatarConfig.color }}
                      >
                        <AvatarIcon sx={{ fontSize: 24 }} />
                      </Avatar>
                    );
                  })()}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {user?.name || 'Usuario'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email || ''}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <MenuItem 
                onClick={handleLogout}
                sx={{ 
                  py: 1.5, 
                  px: 2,
                  color: 'error.main',
                  '&:hover': {
                    bgcolor: 'error.lighter',
                  }
                }}
              >
                <ListItemIcon>
                  <Logout fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Cerrar Sesión"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <ImpersonationBanner />
        <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
