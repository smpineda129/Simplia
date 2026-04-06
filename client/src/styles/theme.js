import { createTheme } from '@mui/material/styles';

// Simplia Design System — Modern SaaS Flat Design
// Primary: #2563EB | Background: #F8FAFC | Text: #1E293B
// Font: Plus Jakarta Sans

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB',
      light: '#60A5FA',
      dark: '#1D4ED8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6366F1',
      light: '#A5B4FC',
      dark: '#4338CA',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8FAFC',
      paper: '#ffffff',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
    divider: '#E2E8F0',
    info: {
      main: '#0EA5E9',
      light: '#38BDF8',
      dark: '#0284C7',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#D97706',
      contrastText: '#ffffff',
    },
    error: {
      main: '#EF4444',
      light: '#FCA5A5',
      dark: '#DC2626',
      contrastText: '#ffffff',
    },
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 700, color: '#1E293B', letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, color: '#1E293B', letterSpacing: '-0.01em' },
    h3: { fontWeight: 600, color: '#1E293B', letterSpacing: '-0.01em' },
    h4: { fontWeight: 600, color: '#1E293B' },
    h5: { fontWeight: 600, color: '#1E293B' },
    h6: { fontWeight: 600, color: '#1E293B' },
    body1: { color: '#1E293B', lineHeight: 1.6 },
    body2: { color: '#64748B', lineHeight: 1.6 },
    subtitle1: { fontWeight: 500, color: '#1E293B' },
    subtitle2: { fontWeight: 600, color: '#1E293B' },
    caption: { color: '#94A3B8', fontSize: '0.75rem' },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    overline: {
      fontWeight: 600,
      letterSpacing: '0.08em',
      fontSize: '0.7rem',
      color: '#94A3B8',
    },
  },
  shape: {
    borderRadius: 10,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0,0,0,0.05)',
    '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
    '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
    '0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -4px rgba(0,0,0,0.05)',
    '0 20px 25px -5px rgba(0,0,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.04)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    ...Array(18).fill('none'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F8FAFC',
          transition: 'background-color 0.2s ease',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: '8px 18px',
          transition: 'all 0.15s ease',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: 'none',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(37, 99, 235, 0.06)',
          },
        },
        sizeSmall: { padding: '5px 12px', fontSize: '0.8125rem' },
        sizeLarge: { padding: '11px 24px', fontSize: '0.9375rem' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid #E2E8F0',
          backgroundImage: 'none',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          '&:last-child': { paddingBottom: 20 },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1E293B',
          boxShadow: 'none',
          borderBottom: '1px solid #E2E8F0',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0F172A',
          borderRight: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.15s ease',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.8rem',
          borderRadius: 6,
        },
        colorPrimary: {
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          color: '#2563EB',
          fontWeight: 600,
        },
        colorSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: '#059669',
          fontWeight: 600,
        },
        colorWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          color: '#D97706',
          fontWeight: 600,
        },
        colorError: {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#DC2626',
          fontWeight: 600,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#F8FAFC',
            fontWeight: 600,
            color: '#475569',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            borderBottom: '1px solid #E2E8F0',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#F8FAFC',
          },
          '&:last-child .MuiTableCell-body': {
            borderBottom: 0,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#E2E8F0',
          fontSize: '0.875rem',
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'medium' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': { borderColor: '#E2E8F0', borderWidth: '1.5px' },
            '&:hover fieldset': { borderColor: '#CBD5E1' },
            '&.Mui-focused fieldset': { borderColor: '#2563EB', borderWidth: '1.5px' },
          },
          '& .MuiInputLabel-root': {
            color: '#64748B',
            fontWeight: 500,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.18)',
          border: '1px solid #E2E8F0',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: '1.125rem',
          color: '#1E293B',
          paddingBottom: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid #E2E8F0',
        },
        elevation2: {
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
          border: '1px solid #E2E8F0',
        },
        elevation3: {
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)',
          border: '1px solid #E2E8F0',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.875rem',
        },
        standardError: {
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          color: '#DC2626',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        },
        standardSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          color: '#059669',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        },
        standardWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          color: '#D97706',
          border: '1px solid rgba(245, 158, 11, 0.2)',
        },
        standardInfo: {
          backgroundColor: 'rgba(14, 165, 233, 0.08)',
          color: '#0284C7',
          border: '1px solid rgba(14, 165, 233, 0.2)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1E293B',
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 500,
          padding: '5px 10px',
        },
        arrow: {
          color: '#1E293B',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#E2E8F0',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 700,
          fontSize: '0.65rem',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: '0.875rem',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.15s ease',
          '&:hover': {
            backgroundColor: 'rgba(15, 23, 42, 0.06)',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: '#E2E8F0',
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
  },
});

export default theme;
