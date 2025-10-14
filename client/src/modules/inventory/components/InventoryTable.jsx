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
  Typography,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const InventoryTable = ({ items, onEdit, onDelete, loading }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography color="text.secondary">No hay items en el inventario</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell align="right">Cantidad</TableCell>
            <TableCell align="right">Precio</TableCell>
            <TableCell>Fecha de Creación</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <Chip
                  label={item.category}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Chip
                  label={item.quantity}
                  color={item.quantity > 10 ? 'success' : item.quantity > 0 ? 'warning' : 'error'}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">{formatCurrency(item.price)}</TableCell>
              <TableCell>
                {new Date(item.createdAt).toLocaleDateString('es-ES')}
              </TableCell>
              <TableCell align="right">
                <IconButton
                  color="primary"
                  onClick={() => onEdit(item)}
                  size="small"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => onDelete(item.id)}
                  size="small"
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryTable;
