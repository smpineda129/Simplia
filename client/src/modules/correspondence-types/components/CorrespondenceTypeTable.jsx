import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  TablePagination,
  Tooltip,
} from '@mui/material';
import { Edit, Delete, Mail, Public, Lock } from '@mui/icons-material';

const CorrespondenceTypeTable = ({ types, onEdit, onDelete, page, onPageChange, pagination }) => {
  if (!types || types.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Mail sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <p>No hay tipos de correspondencia registrados</p>
      </Paper>
    );
  }

  const handleChangePage = (event, newPage) => {
    onPageChange(newPage + 1);
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Empresa</TableCell>
              <TableCell>Área</TableCell>
              <TableCell align="center">Expiración (días)</TableCell>
              <TableCell align="center">Visibilidad</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {types.map((type) => (
              <TableRow key={type.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Mail color="primary" />
                    <strong>{type.name}</strong>
                  </Box>
                </TableCell>
                <TableCell>{type.description || '-'}</TableCell>
                <TableCell>
                  {type.company ? (
                    <Box>
                      <div>{type.company.name}</div>
                      <small style={{ color: 'gray' }}>{type.company.short}</small>
                    </Box>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {type.area ? (
                    <Chip label={type.area.name} size="small" />
                  ) : (
                    <Chip label="Todas" size="small" variant="outlined" />
                  )}
                </TableCell>
                <TableCell align="center">
                  {type.expiration ? (
                    <Chip label={type.expiration} size="small" color="warning" />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell align="center">
                  {type.public ? (
                    <Tooltip title="Público (visible en portal externo)">
                      <Chip
                        icon={<Public />}
                        label="Público"
                        size="small"
                        color="success"
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Privado (solo interno)">
                      <Chip
                        icon={<Lock />}
                        label="Privado"
                        size="small"
                        color="default"
                      />
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEdit(type)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(type.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total || 0}
          page={(page || 1) - 1}
          onPageChange={handleChangePage}
          rowsPerPage={pagination.limit || 10}
          rowsPerPageOptions={[10]}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      )}
    </Paper>
  );
};

export default CorrespondenceTypeTable;
