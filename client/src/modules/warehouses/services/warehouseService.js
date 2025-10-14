import axiosInstance from '../../../api/axiosConfig';

const warehouseService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/warehouses', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/warehouses/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/warehouses', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/warehouses/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/warehouses/${id}`);
    return response.data;
  },
};

export default warehouseService;
