import axiosInstance from '../../../api/axiosConfig';

const proceedingService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/proceedings', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/proceedings/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/proceedings', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/proceedings/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/proceedings/${id}`);
    return response.data;
  },
};

export default proceedingService;
