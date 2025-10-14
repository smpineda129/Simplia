import axiosInstance from '../../../api/axiosConfig';

const reportsService = {
  getSummary: async () => {
    const response = await axiosInstance.get('/reports/summary');
    return response.data;
  },

  getUsersReport: async () => {
    const response = await axiosInstance.get('/reports/users');
    return response.data;
  },

  getInventoryReport: async () => {
    const response = await axiosInstance.get('/reports/inventory');
    return response.data;
  },
};

export default reportsService;
