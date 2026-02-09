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
} from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ImpersonationBanner from '../components/ImpersonationBanner';

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
  ];

  const filteredMenuItems = menuItems.filter(item => hasPermission(item.permission));

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          SIMPLIA
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
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
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestión
          </Typography>

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              color="inherit"
              onClick={handleMenuOpen}
              startIcon={
                <Avatar
                  sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
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
                sx: {
                  mt: 1,
                  minWidth: 200,
                },
              }}
            >
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                <ListItemText>Perfil</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleSettings}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                <ListItemText>Configuración</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cerrar Sesión</ListItemText>
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
