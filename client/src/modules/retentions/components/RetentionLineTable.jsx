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
  Chip,
  Box,
} from '@mui/material';
import { Edit, Delete, CheckCircle, Cancel } from '@mui/icons-material';

const RetentionLineTable = ({ lines, onEdit, onDelete }) => {
  const getDispositionChips = (line) => {
    const dispositions = [];
    if (line.dispositionCt) dispositions.push({ label: 'CT', tooltip: 'Conservación Total', color: 'success' });
    if (line.dispositionE) dispositions.push({ label: 'E', tooltip: 'Eliminación', color: 'error' });
    if (line.dispositionM) dispositions.push({ label: 'M', tooltip: 'Microfilmación', color: 'info' });
    if (line.dispositionD) dispositions.push({ label: 'D', tooltip: 'Digitalización', color: 'primary' });
    if (line.dispositionS) dispositions.push({ label: 'S', tooltip: 'Selección', color: 'warning' });
    return dispositions;
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SERIE</TableCell>
              <TableCell>SUBSERIE</TableCell>
              <TableCell>CÓDIGO</TableCell>
              <TableCell>DOCUMENTOS</TableCell>
              <TableCell align="center">RET. LOCAL</TableCell>
              <TableCell align="center">RET. CENTRAL</TableCell>
              <TableCell align="center">DISPOSICIÓN</TableCell>
              <TableCell align="right">ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No hay líneas de retención. Haz clic en "Crear Línea" para agregar una.
                </TableCell>
              </TableRow>
            ) : (
              lines.map((line) => (
                <TableRow key={line.id} hover>
                  <TableCell>
                    <Box sx={{ fontWeight: 500 }}>{line.series}</Box>
                  </TableCell>
                  <TableCell>{line.subseries}</TableCell>
                  <TableCell>
                    <Chip label={line.code} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {line.documents || '-'}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={`${line.localRetention} años`} size="small" color="primary" />
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={`${line.centralRetention} años`} size="small" color="secondary" />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                      {getDispositionChips(line).map((disp, index) => (
                        <Tooltip key={index} title={disp.tooltip}>
                          <Chip
                            label={disp.label}
                            size="small"
                            color={disp.color}
                            sx={{ minWidth: 40 }}
                          />
                        </Tooltip>
                      ))}
                      {getDispositionChips(line).length === 0 && (
                        <Chip label="-" size="small" variant="outlined" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(line)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(line.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RetentionLineTable;
