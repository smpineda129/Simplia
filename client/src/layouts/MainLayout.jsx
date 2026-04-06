import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
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
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  People,
  Business,
  Description,
  Send,
  Article,
  Folder,
  InsertDriveFile,
  Group,
  Warehouse,
  Menu as MenuIcon,
  Security,
  VpnKey,
  Logout,
  ContactSupport,
  Assignment,
  Storage,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { NotificationPanel } from '../modules/notifications';
import ImpersonationBanner from '../components/ImpersonationBanner';
import { getAvatarConfig } from '../utils/avatarUtils';

const drawerWidth = 256;

// Sidebar color tokens
const SIDEBAR = {
  bg: '#0F172A',
  hover: 'rgba(255,255,255,0.07)',
  active: 'rgba(37,99,235,0.85)',
  activeBorder: '#2563EB',
  text: '#94A3B8',
  textActive: '#ffffff',
  textHover: '#E2E8F0',
  divider: 'rgba(255,255,255,0.08)',
  icon: '#64748B',
  iconActive: '#ffffff',
};

const MainLayout = () => {
  const { user, logout, isOwner } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleSettings = () => {
    handleMenuClose();
    if (user?.companyId) navigate(`/companies/${user.companyId}`);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const hasPermission = (permission) => {
    if (!permission) return true;
    if (!user?.allPermissions) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return user.allPermissions.includes(permission);
  };

  const menuGroups = [
    {
      label: 'Principal',
      items: [
        { text: 'Dashboard', icon: <Dashboard sx={{ fontSize: 18 }} />, path: '/dashboard', permission: null },
      ],
    },
    {
      label: 'Gestión',
      items: [
        { text: 'Empresas', icon: <Business sx={{ fontSize: 18 }} />, path: isOwner ? '/companies' : `/companies/${user?.companyId}`, permission: 'company.view' },
        { text: 'Correspondencia', icon: <Send sx={{ fontSize: 18 }} />, path: '/correspondences', permission: 'correspondence.view' },
        { text: 'Plantillas', icon: <Article sx={{ fontSize: 18 }} />, path: '/templates', permission: 'template.view' },
        { text: 'Expedientes', icon: <Folder sx={{ fontSize: 18 }} />, path: '/proceedings', permission: 'proceeding.view' },
        { text: 'Retención', icon: <Description sx={{ fontSize: 18 }} />, path: '/retentions', permission: 'retention.view' },
        { text: 'Externos', icon: <Group sx={{ fontSize: 18 }} />, path: '/entities', permission: 'entity.view' },
        { text: 'Almacenes', icon: <Warehouse sx={{ fontSize: 18 }} />, path: '/warehouses', permission: 'warehouse.view' },
      ],
    },
    {
      label: 'Diagnóstico',
      items: [
        { text: 'Instrumentos', icon: <Assignment sx={{ fontSize: 18 }} />, path: '/surveys', permission: null },
        { text: 'Resultados DX', icon: <InsertDriveFile sx={{ fontSize: 18 }} />, path: '/surveys/results', permission: null },
        { text: 'Custodia Digital', icon: <Storage sx={{ fontSize: 18 }} />, path: '/custodia', permission: null },
      ],
    },
    {
      label: 'Administración',
      items: [
        { text: 'Permisos', icon: <VpnKey sx={{ fontSize: 18 }} />, path: '/permissions', permission: 'permission.view' },
        { text: 'Roles', icon: <Security sx={{ fontSize: 18 }} />, path: '/roles', permission: 'role.view' },
        { text: 'Usuarios', icon: <People sx={{ fontSize: 18 }} />, path: '/users', permission: 'user.view' },
        { text: 'Soporte', icon: <ContactSupport sx={{ fontSize: 18 }} />, path: '/support', permission: null },
        { text: 'Admin Tickets', icon: <Assignment sx={{ fontSize: 18 }} />, path: '/support/admin', permission: null },
      ],
    },
  ];

  const isActive = (path) =>
    location.pathname === path ||
    (path !== '/dashboard' && location.pathname.startsWith(path));

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: SIDEBAR.bg }}>
      {/* Logo */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: 'pointer',
          borderBottom: `1px solid ${SIDEBAR.divider}`,
          minHeight: 64,
        }}
        onClick={() => navigate('/')}
      >
        <Box
          component="img"
          src="/Horizontal_Logo.jpeg"
          alt="Simplia"
          sx={{
            height: 32,
            objectFit: 'contain',
          }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <Box>
          <Typography
            sx={{
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1.1rem',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            simplia
          </Typography>
          <Typography sx={{ color: SIDEBAR.icon, fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.05em' }}>
            v1.0
          </Typography>
        </Box>
      </Box>

      {/* Nav Groups */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2, px: 2 }}>
        {menuGroups.map((group) => {
          const visibleItems = group.items.filter((item) => hasPermission(item.permission));
          if (visibleItems.length === 0) return null;
          return (
            <Box key={group.label} sx={{ mb: 1 }}>
              <Typography
                sx={{
                  color: SIDEBAR.icon,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  px: 1.5,
                  mb: 0.5,
                  mt: 1,
                }}
              >
                {group.label}
              </Typography>
              {visibleItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <ListItem key={item.text} disablePadding sx={{ mb: 0.25 }}>
                    <ListItemButton
                      onClick={() => {
                        navigate(item.path);
                        setMobileOpen(false);
                      }}
                      sx={{
                        borderRadius: 1.5,
                        py: 0.9,
                        px: 1.5,
                        minHeight: 40,
                        bgcolor: active ? SIDEBAR.active : 'transparent',
                        borderLeft: active ? `2px solid ${SIDEBAR.activeBorder}` : '2px solid transparent',
                        '&:hover': {
                          bgcolor: active ? SIDEBAR.active : SIDEBAR.hover,
                          '& .nav-text': { color: SIDEBAR.textHover },
                          '& .nav-icon': { color: SIDEBAR.textHover },
                        },
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <ListItemIcon
                        className="nav-icon"
                        sx={{
                          minWidth: 32,
                          color: active ? SIDEBAR.iconActive : SIDEBAR.icon,
                          transition: 'color 0.15s',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        className="nav-text"
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '0.8375rem',
                          fontWeight: active ? 600 : 500,
                          color: active ? SIDEBAR.textActive : SIDEBAR.text,
                          sx: { transition: 'color 0.15s' },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </Box>
          );
        })}
      </Box>

      {/* User card at bottom */}
      <Box
        sx={{
          px: 2,
          py: 2,
          borderTop: `1px solid ${SIDEBAR.divider}`,
        }}
      >
        {(() => {
          const avatarConfig = getAvatarConfig(user?.avatar);
          const AvatarIcon = avatarConfig.icon;
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                borderRadius: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: SIDEBAR.hover },
                transition: 'background-color 0.15s',
              }}
              onClick={handleMenuOpen}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: avatarConfig.color, flexShrink: 0 }}>
                <AvatarIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography sx={{ color: '#E2E8F0', fontWeight: 600, fontSize: '0.8125rem', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name || 'Usuario'}
                </Typography>
                <Typography sx={{ color: SIDEBAR.icon, fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.company?.name || ''}
                </Typography>
              </Box>
              <KeyboardArrowDown sx={{ color: SIDEBAR.icon, fontSize: 16, flexShrink: 0 }} />
            </Box>
          );
        })()}
      </Box>
    </Box>
  );

  const avatarConfig = getAvatarConfig(user?.avatar);
  const AvatarIcon = avatarConfig.icon;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#ffffff',
          borderBottom: '1px solid #E2E8F0',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important', gap: 1 }}>
          <IconButton
            aria-label="Abrir menú"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'none' }, color: '#64748B' }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          {/* Right side: Notifications + User */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <NotificationPanel />

            <Tooltip title="Opciones de cuenta">
              <Box
                onClick={handleMenuOpen}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 2,
                  cursor: 'pointer',
                  border: '1px solid transparent',
                  transition: 'all 0.15s',
                  '&:hover': {
                    bgcolor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                  },
                }}
              >
                <Avatar sx={{ width: 30, height: 30, bgcolor: avatarConfig.color }}>
                  <AvatarIcon sx={{ fontSize: 17 }} />
                </Avatar>
                <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'left' }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#1E293B', lineHeight: 1.2 }}>
                    {user?.name || 'Usuario'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8', lineHeight: 1.2 }}>
                    {user?.company?.name || ''}
                  </Typography>
                </Box>
                <KeyboardArrowDown sx={{ color: '#94A3B8', fontSize: 16, display: { xs: 'none', md: 'block' } }} />
              </Box>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1,
                  minWidth: 220,
                  borderRadius: 2,
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: '1px solid #E2E8F0',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#F8FAFC' },
                  transition: 'background-color 0.15s',
                }}
                onClick={handleProfile}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: avatarConfig.color }}>
                    <AvatarIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#1E293B' }}>
                      {user?.name || 'Usuario'}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                      {user?.email || ''}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  py: 1.25,
                  px: 2,
                  color: '#EF4444',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  gap: 1.5,
                  '&:hover': { bgcolor: 'rgba(239,68,68,0.06)' },
                }}
              >
                <Logout fontSize="small" />
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth, bgcolor: SIDEBAR.bg },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important' }} />
        <ImpersonationBanner />
        <Container
          maxWidth="xl"
          sx={{
            flexGrow: 1,
            py: 3,
            px: { xs: 2, md: 3 },
          }}
        >
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
