import axiosInstance from '../../../api/axiosConfig';

const companyService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/companies', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/companies/${id}`);
    return response.data;
  },

  getStats: async (id) => {
    const response = await axiosInstance.get(`/companies/${id}/stats`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/companies', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/companies/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/companies/${id}`);
    return response.data;
  },
};

export default companyService;
