import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Azul principal
      light: '#42a5f5', // Azul celeste
      dark: '#1565c0', // Azul oscuro
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0288d1', // Azul celeste secundario
      light: '#03a9f4',
      dark: '#01579b',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5', // Gris muy claro (casi blanco)
      paper: '#ffffff', // Blanco puro
    },
    text: {
      primary: '#1a237e', // Azul oscuro para texto
      secondary: '#424242', // Gris oscuro
    },
    info: {
      main: '#29b6f6', // Azul celeste para información
      light: '#4fc3f7',
      dark: '#0288d1',
    },
    success: {
      main: '#66bb6a',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ffa726',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#ef5350',
      light: '#e57373',
      dark: '#c62828',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
      color: '#1976d2',
    },
    h2: {
      fontWeight: 600,
      color: '#1976d2',
    },
    h3: {
      fontWeight: 600,
      color: '#1976d2',
    },
    h4: {
      fontWeight: 600,
      color: '#1976d2',
    },
    h5: {
      fontWeight: 600,
      color: '#1976d2',
    },
    h6: {
      fontWeight: 600,
      color: '#1976d2',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(25, 118, 210, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2',
          boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid rgba(25, 118, 210, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5f5f5',
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: '#1976d2',
          },
        },
      },
    },
  },
});
export default theme;
