import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Divider,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import { Close, AccountTree, OpenInNew } from '@mui/icons-material';
import areaService from '../services/areaService';
import correspondenceTypeService from '../../correspondence-types/services/correspondenceTypeService';

const AreaDetailModal = ({ open, onClose, areaId }) => {
  const navigate = useNavigate();
  const [area, setArea] = useState(null);
  const [correspondenceTypes, setCorrespondenceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && areaId) {
      loadData();
    }
  }, [open, areaId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [areaRes, ctData] = await Promise.all([
        areaService.getById(areaId),
        correspondenceTypeService.getAll({ areaId, limit: 100 }),
      ]);
      setArea(areaRes.data || areaRes);
      setCorrespondenceTypes(ctData.data || []);
    } catch (err) {
      setError('Error al cargar los datos del área');
    } finally {
      setLoading(false);
    }
  };

  const users = area?.areaUsers?.map((au) => au.user) || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 6 }}>
        <AccountTree color="primary" />
        <Typography variant="h6" component="span">
          {area?.name || 'Detalle del Área'}
        </Typography>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && area && (
          <>
            {/* Información general */}
            <Typography variant="overline" color="text.secondary" fontWeight="bold">
              Información General
            </Typography>
            <Box sx={{ mt: 1, mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Código</Typography>
                <Typography variant="body2" fontWeight="medium">{area.code || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Empresa</Typography>
                <Typography variant="body2" fontWeight="medium">{area.company?.name || '—'}</Typography>
              </Box>
              {area.description && (
                <Box sx={{ width: '100%' }}>
                  <Typography variant="caption" color="text.secondary">Descripción</Typography>
                  <Typography variant="body2">{area.description}</Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Tipos de correspondencia */}
            <Typography variant="overline" color="text.secondary" fontWeight="bold">
              Tipos de Correspondencia ({correspondenceTypes.length})
            </Typography>
            <Box sx={{ mt: 1, mb: 2 }}>
              {correspondenceTypes.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                  No hay tipos de correspondencia asociados
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {correspondenceTypes.map((ct) => (
                    <Box key={ct.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={ct.name} size="small" color="primary" variant="outlined" />
                      {ct.responseDeadlineDays != null && (
                        <Typography variant="caption" color="text.secondary">
                          Vence: {ct.responseDeadlineDays} días
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Usuarios */}
            <Typography variant="overline" color="text.secondary" fontWeight="bold">
              Usuarios ({users.length})
            </Typography>
            <Box sx={{ mt: 1 }}>
              {users.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                  No hay usuarios asignados a esta área
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {users.map((user) => (
                    <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                        {user.name?.[0]?.toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight="medium" noWrap>
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {user.email}
                        </Typography>
                      </Box>
                      {user.role && (
                        <Chip label={user.role.name} size="small" variant="outlined" />
                      )}
                      <Tooltip title="Ver usuario">
                        <IconButton size="small" onClick={() => { onClose(); navigate(`/users/${user.id}`); }}>
                          <OpenInNew fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AreaDetailModal;
