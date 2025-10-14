import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  TablePagination,
  Tooltip,
} from '@mui/material';
import { Edit, Delete, Description } from '@mui/icons-material';

const TemplateTable = ({ templates, onEdit, onDelete, page, onPageChange, pagination }) => {
  if (!templates || templates.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Description sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <p>No hay plantillas registradas</p>
      </Paper>
    );
  }

  const handleChangePage = (event, newPage) => {
    onPageChange(newPage + 1);
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Empresa</TableCell>
              <TableCell>Vista Previa</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templates.map((template) => (
              <TableRow key={template.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Description color="primary" />
                    <strong>{template.title}</strong>
                  </Box>
                </TableCell>
                <TableCell>{truncateText(template.description, 80)}</TableCell>
                <TableCell>
                  {template.company ? (
                    <Box>
                      <div>{template.company.name}</div>
                      <small style={{ color: 'gray' }}>{template.company.short}</small>
                    </Box>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      maxWidth: 300,
                      fontSize: '0.85rem',
                      color: 'text.secondary',
                      fontStyle: 'italic',
                    }}
                  >
                    {truncateText(template.content, 100)}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEdit(template)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(template.id)}
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

export default TemplateTable;
