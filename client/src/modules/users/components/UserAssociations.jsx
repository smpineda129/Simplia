import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Chip,
    Tooltip,
    Grid,
} from '@mui/material';
import { Add, Delete, Info, AccountTree, Security, Key, ArrowForward } from '@mui/icons-material';
import userService from '../services/userService';
import areaService from '../../areas/services/areaService';
import roleService from '../../roles/services/roleService';
import permissionService from '../../permissions/services/permissionService';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useAuth } from '../../../hooks/useAuth';

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`user-tabpanel-${index}`}
            aria-labelledby={`user-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
};

const UserAssociations = ({ userId }) => {
    const { user: currentUser } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Data for current associations
    const [userAreas, setUserAreas] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [userPermissions, setUserPermissions] = useState([]);

    // Data for all available options (for dialogs)
    const [allAreas, setAllAreas] = useState([]);
    const [allRoles, setAllRoles] = useState([]);
    const [allPermissions, setAllPermissions] = useState([]);

    // Dialog states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState('');

    useEffect(() => {
        if (userId) {
            loadUserData();
            loadAllOptions();
        }
    }, [userId]);

    const canManage = (permissionName) => {
        if (!currentUser) return false;
        const roles = currentUser.roles || [];
        const isOwner = roles.some(role => {
            if (typeof role === 'string') return role === 'Owner';
            return role.name === 'Owner';
        });
        if (isOwner) return true;
        return currentUser.allPermissions?.includes(permissionName);
    };

    const loadUserData = async () => {
        try {
            setLoading(true);
            const [areasRes, rolesRes, permissionsRes] = await Promise.all([
                userService.getById(userId), // userService.getById now includes areas
                userService.getUserRoles(userId),
                userService.getUserPermissions(userId),
            ]);

            // Handle response structure (check if it's nested in .data)
            const userData = areasRes.data || areasRes;
            setUserAreas(userData.areaUsers?.map(au => au.area) || []);
            setUserRoles(rolesRes.data || rolesRes);
            setUserPermissions(permissionsRes.data || permissionsRes);
        } catch (err) {
            console.error('Error loading user associations:', err);
            setError('Error al cargar las asociaciones del usuario');
        } finally {
            setLoading(false);
        }
    };

    const loadAllOptions = async () => {
        try {
            const [areasRes, rolesRes, permissionsRes] = await Promise.all([
                areaService.getAll({ limit: 100 }),
                roleService.getAll({ limit: 100 }),
                permissionService.getAll({ limit: 500 }),
            ]);
            setAllAreas(areasRes.data || areasRes);
            setAllRoles(rolesRes.data || rolesRes);
            setAllPermissions(permissionsRes.data || permissionsRes);
        } catch (err) {
            console.error('Error loading options:', err);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setError('');
        setSuccess('');
    };

    const handleOpenDialog = () => {
        setSelectedId('');
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleAssociate = async () => {
        if (!selectedId) return;

        try {
            setError('');
            if (tabValue === 0) { // Area
                await userService.assignArea(userId, selectedId);
            } else if (tabValue === 1) { // Role
                await userService.assignRole(userId, selectedId);
            } else if (tabValue === 2) { // Permission
                await userService.assignPermission(userId, selectedId);
            }
            setSuccess('Asociación creada exitosamente');
            loadUserData();
            handleCloseDialog();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al asociar');
        }
    };

    const handleRemove = async (assocId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta asociación?')) return;

        try {
            setError('');
            if (tabValue === 0) { // Area
                await userService.removeArea(userId, assocId);
            } else if (tabValue === 1) { // Role
                await userService.removeRole(userId, assocId);
            } else if (tabValue === 2) { // Permission
                await userService.removePermission(userId, assocId);
            }
            setSuccess('Asociación eliminada exitosamente');
            loadUserData();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al eliminar');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <Box sx={{ mt: 3 }}>
            {/* Tabs in separate Paper */}
            <Paper sx={{ mb: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="user associations tabs"
                >
                    <Tab icon={<AccountTree />} label="Áreas" iconPosition="start" />
                    <Tab icon={<Security />} label="Roles" iconPosition="start" />
                    <Tab icon={<Key />} label="Permisos" iconPosition="start" />
                </Tabs>
            </Paper>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            {/* Tab Panels with Card Layout */}

            {/* Areas Tab */}
            <TabPanel value={tabValue} index={0}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">Áreas Asignadas</Typography>
                    {canManage('user.attach-area') && (
                        <Button variant="contained" startIcon={<Add />} onClick={handleOpenDialog}>
                            Asociar Área
                        </Button>
                    )}
                </Box>

                {userAreas.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
                        <AccountTree sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                        <Typography color="text.secondary">No hay áreas asignadas a este usuario</Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={2}>
                        {userAreas.map((area) => (
                            <Grid item xs={12} sm={6} md={4} key={area.id}>
                                <Paper sx={{ p: 2, position: 'relative', '&:hover': { boxShadow: 4 } }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <AccountTree color="primary" sx={{ mr: 1 }} />
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    {area.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Código: {area.code}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {canManage('user.detach-area') && (
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleRemove(area.id)}
                                                sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </TabPanel>

            {/* Roles Tab */}
            <TabPanel value={tabValue} index={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">Roles de Seguridad</Typography>
                    {canManage('user.attach-role') && (
                        <Button variant="contained" startIcon={<Add />} onClick={handleOpenDialog}>
                            Asociar Rol
                        </Button>
                    )}
                </Box>

                {userRoles.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
                        <Security sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                        <Typography color="text.secondary">No hay roles asignados a este usuario</Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={2}>
                        {userRoles.map((role) => (
                            <Grid item xs={12} sm={6} md={4} key={role.id}>
                                <Paper sx={{ p: 2, borderLeft: '4px solid', borderLeftColor: 'primary.main' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Security color="primary" sx={{ mr: 1 }} />
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                {role.name}
                                            </Typography>
                                        </Box>
                                        {canManage('user.detach-role') && (
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleRemove(role.id)}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                        Guard: {role.guardName}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </TabPanel>

            {/* Permissions Tab */}
            <TabPanel value={tabValue} index={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6">Permisos del Sistema</Typography>
                        <Tooltip title="Aquí se muestran todos los permisos del usuario. Solo puedes eliminar los permisos asignados directamente.">
                            <Info color="info" fontSize="small" />
                        </Tooltip>
                    </Box>
                    {canManage('user.attach-permission') && (
                        <Button variant="contained" startIcon={<Add />} onClick={handleOpenDialog}>
                            Asignar Permiso Directo
                        </Button>
                    )}
                </Box>

                {userPermissions.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
                        <Key sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                        <Typography color="text.secondary">No hay permisos asignados</Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={1}>
                        {userPermissions.map((permission) => (
                            <Grid item xs={12} sm={4} md={3} key={permission.id}>
                                <Paper
                                    sx={{
                                        p: 1.5,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        bgcolor: permission.is_direct ? 'primary.50' : 'background.paper',
                                        border: '1px solid',
                                        borderColor: permission.is_direct ? 'primary.200' : 'divider'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                                        <Key color={permission.is_direct ? 'primary' : 'disabled'} sx={{ mr: 1, fontSize: 18, flexShrink: 0 }} />
                                        <Typography variant="body2" noWrap sx={{ fontWeight: permission.is_direct ? 'bold' : 'normal' }}>
                                            {permission.name}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {Boolean(permission.is_direct) && canManage('user.detach-permission') && (
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleRemove(permission.id)}
                                                sx={{ ml: 0.5 }}
                                            >
                                                <Delete sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        )}
                                        {!permission.is_direct && (
                                            <Tooltip title="Heredado por Rol">
                                                <ArrowForward sx={{ fontSize: 14, color: 'text.disabled', ml: 1 }} />
                                            </Tooltip>
                                        )}
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </TabPanel>

            {/* Association Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="xs">
                <DialogTitle>
                    {tabValue === 0 ? 'Asociar Área' : tabValue === 1 ? 'Asociar Rol' : 'Asignar Permiso Directo'}
                </DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="assoc-select-label">
                            {tabValue === 0 ? 'Área' : tabValue === 1 ? 'Rol' : 'Permiso'}
                        </InputLabel>
                        <Select
                            labelId="assoc-select-label"
                            value={selectedId}
                            label={tabValue === 0 ? 'Área' : tabValue === 1 ? 'Rol' : 'Permiso'}
                            onChange={(e) => setSelectedId(e.target.value)}
                        >
                            {tabValue === 0 && allAreas.map(item => (
                                <MenuItem key={item.id} value={item.id}>{item.name} ({item.code})</MenuItem>
                            ))}
                            {tabValue === 1 && allRoles.map(item => (
                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                            ))}
                            {tabValue === 2 && allPermissions.map(item => (
                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleAssociate} variant="contained" disabled={!selectedId}>
                        Asociar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserAssociations;
