import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../modules/auth/services/authService';
import impersonateService from '../modules/users/services/impersonateService';
import LoadingSpinner from '../components/LoadingSpinner';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [originalUser, setOriginalUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await authService.getCurrentUser();
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { user, accessToken, refreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(user);
      navigate('/dashboard');
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsImpersonating(false);
    setOriginalUser(null);
    navigate('/auth/login');
  };

  const startImpersonation = async (userId) => {
    try {
      // Guardar el usuario original antes de personificar
      setOriginalUser(user);

      const response = await impersonateService.impersonateUser(userId);
      const { accessToken, user: impersonatedUser } = response.data;

      // Actualizar el token
      localStorage.setItem('accessToken', accessToken);

      // Actualizar el estado
      setUser(impersonatedUser);
      setIsImpersonating(true);

      navigate('/dashboard');

      return response;
    } catch (error) {
      console.error('Error starting impersonation:', error);
      throw error;
    }
  };

  const leaveImpersonation = async () => {
    try {
      const response = await impersonateService.leaveImpersonation();
      const { accessToken, refreshToken, user: restoredUser } = response.data;

      // Actualizar tokens
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Restaurar el usuario original
      setUser(restoredUser);
      setIsImpersonating(false);
      setOriginalUser(null);

      return response;
    } catch (error) {
      console.error('Error leaving impersonation:', error);
      throw error;
    }
  };

  const updateUser = (updatedData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedData,
    }));
  };

  // Calculate isOwner safely checking for role object structure
  const isOwner = user?.roles?.some(r => r.name === 'Owner' || r.roleLevel === 1) || false;
  
  // SUPER_ADMIN tiene acceso completo a todo
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isImpersonating,
    originalUser,
    startImpersonation,
    leaveImpersonation,
    isOwner,
    isSuperAdmin,
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Iniciando aplicación..." />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
