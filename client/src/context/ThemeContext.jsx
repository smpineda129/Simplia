import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeCustomizationContext = createContext();

const DEFAULT_THEME_CONFIG = {
  primaryColor: '#1976d2',
  secondaryColor: '#dc004e',
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
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                transition: 'background-color 0.3s ease, color 0.3s ease',
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
