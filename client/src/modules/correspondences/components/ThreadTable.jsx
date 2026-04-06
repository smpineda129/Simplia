import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
  Avatar,
  Typography,
  Chip,
} from '@mui/material';
import { Delete, Person } from '@mui/icons-material';

const ThreadTable = ({ threads, onDelete }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>USUARIO</TableCell>
              <TableCell>MENSAJE</TableCell>
              <TableCell>FECHA</TableCell>
              <TableCell align="right">ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {threads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No hay hilos de conversación. Haz clic en "Crear Hilo" para agregar uno.
                </TableCell>
              </TableRow>
            ) : (
              threads.map((thread) => {
                const fromUser = thread.users_correspondence_threads_from_idTousers;
                const taggedUsers = Array.isArray(thread.tagged_users_data)
                  ? thread.tagged_users_data
                  : [];

                return (
                  <TableRow key={thread.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          <Person fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {fromUser?.name || thread.user?.name || 'Usuario'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {fromUser?.email || thread.user?.email || ''}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box
                          sx={{
                            maxWidth: 400,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {thread.message}
                        </Box>
                        {taggedUsers.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                            {taggedUsers.map((u) => (
                              <Chip
                                key={u.id}
                                label={`@${u.name}`}
                                size="small"
                                variant="outlined"
                                color="primary"
                                sx={{ height: 18, fontSize: 10 }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(thread.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDelete(thread.id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ThreadTable;
