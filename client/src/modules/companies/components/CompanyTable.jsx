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
import { Edit, Delete, Business, People, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CompanyTable = ({ companies, onEdit, onDelete, page, onPageChange, pagination }) => {
  const navigate = useNavigate();
  if (!companies || companies.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Business sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <p>No hay empresas registradas</p>
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
              <TableCell>Identificador</TableCell>
              <TableCell>Nombre Corto</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Usuarios</TableCell>
              <TableCell>Sitio Web</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {company.imageUrl && (
                      <img
                        src={company.imageUrl}
                        alt={company.name}
                        style={{ width: 32, height: 32, borderRadius: 4 }}
                      />
                    )}
                    <strong>{company.name}</strong>
                  </Box>
                </TableCell>
                <TableCell>{company.identifier}</TableCell>
                <TableCell>
                  <Chip label={company.short} size="small" />
                </TableCell>
                <TableCell>{company.email || '-'}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Usuarios activos">
                    <Chip
                      icon={<People />}
                      label={`${company._count?.users || 0}${company.maxUsers ? `/${company.maxUsers}` : ''}`}
                      size="small"
                      color={
                        company.maxUsers && company._count?.users >= company.maxUsers
                          ? 'error'
                          : 'primary'
                      }
                    />
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {company.website ? (
                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                      {company.website}
                    </a>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Ver Detalles">
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() => navigate(`/companies/${company.id}`)}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEdit(company)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(company.id)}
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

export default CompanyTable;
