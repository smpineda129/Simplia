import axiosInstance from '../../../api/axiosConfig';

export const dashboardService = {
  // Get dashboard statistics from real API
  getStats: async () => {
    try {
      // Fetch real counts from API
      const [usersRes, companiesRes, proceedingsRes, correspondencesRes] = await Promise.all([
        axiosInstance.get('/users').catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/companies').catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/proceedings').catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/correspondences').catch(() => ({ data: { data: [] } })),
      ]);

      const users = usersRes.data?.data || [];
      const companies = companiesRes.data?.data || [];
      const proceedings = proceedingsRes.data?.data || [];
      const correspondences = correspondencesRes.data?.data || [];

      return {
        users: {
          total: Array.isArray(users) ? users.length : 0,
          subtitle: 'Usuarios registrados',
        },
        companies: {
          total: Array.isArray(companies) ? companies.length : 0,
          subtitle: 'Empresas activas',
        },
        proceedings: {
          total: Array.isArray(proceedings) ? proceedings.length : 0,
          subtitle: 'Expedientes totales',
        },
        correspondence: {
          total: Array.isArray(correspondences) ? correspondences.length : 0,
          subtitle: 'Correspondencias',
        },
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return zeros if API fails
      return {
        users: { total: 0, subtitle: 'Usuarios registrados' },
        companies: { total: 0, subtitle: 'Empresas activas' },
        proceedings: { total: 0, subtitle: 'Expedientes totales' },
        correspondence: { total: 0, subtitle: 'Correspondencias' },
      };
    }
  },

};
