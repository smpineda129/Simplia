import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../modules/auth/services/authService';
import LoadingSpinner from '../components/LoadingSpinner';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
      const { user, accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(user);
      console.log(user);
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
    navigate('/auth/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Iniciando aplicación..." />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
