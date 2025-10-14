import axiosInstance from '../../../api/axiosConfig';

const entityService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/entities', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/entities/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/entities', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/entities/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/entities/${id}`);
    return response.data;
  },

  getAllCategories: async (params = {}) => {
    const response = await axiosInstance.get('/entities/categories', { params });
    return response.data;
  },

  createCategory: async (data) => {
    const response = await axiosInstance.post('/entities/categories', data);
    return response.data;
  },
};

export default entityService;
