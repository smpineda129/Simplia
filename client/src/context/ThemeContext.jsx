import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeCustomizationContext = createContext();

const DEFAULT_THEME_CONFIG = {
  primaryColor: '#2563EB',
  secondaryColor: '#6366F1',
  mode: 'light',
};

export const ThemeCustomizationProvider = ({ children }) => {
  const [themeConfig, setThemeConfig] = useState(() => {
    const savedTheme = localStorage.getItem('userThemeConfig');
    return savedTheme ? JSON.parse(savedTheme) : DEFAULT_THEME_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('userThemeConfig', JSON.stringify(themeConfig));
  }, [themeConfig]);

  const updateThemeConfig = (newConfig) => {
    setThemeConfig((prev) => ({
      ...prev,
      ...newConfig,
    }));
  };

  const resetTheme = () => {
    setThemeConfig(DEFAULT_THEME_CONFIG);
    localStorage.removeItem('userThemeConfig');
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeConfig.mode,
          primary: {
            main: themeConfig.primaryColor,
          },
          secondary: {
            main: themeConfig.secondaryColor,
          },
          background: {
            default: themeConfig.mode === 'dark' ? '#0F172A' : '#F8FAFC',
            paper: themeConfig.mode === 'dark' ? '#1E293B' : '#ffffff',
          },
          text: {
            primary: themeConfig.mode === 'dark' ? '#F1F5F9' : '#1E293B',
            secondary: themeConfig.mode === 'dark' ? '#94A3B8' : '#64748B',
          },
          divider: themeConfig.mode === 'dark' ? '#334155' : '#E2E8F0',
        },
        typography: {
          fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                transition: 'background-color 0.2s ease, color 0.2s ease',
              },
            },
          },
        },
      }),
    [themeConfig]
  );

  const value = {
    themeConfig,
    updateThemeConfig,
    resetTheme,
  };

  return (
    <ThemeCustomizationContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeCustomizationContext.Provider>
  );
};

export const useThemeCustomization = () => {
  const context = useContext(ThemeCustomizationContext);
  if (!context) {
    throw new Error('useThemeCustomization must be used within ThemeCustomizationProvider');
  }
  return context;
};
