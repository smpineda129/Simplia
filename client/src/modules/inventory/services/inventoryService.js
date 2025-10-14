import axiosInstance from '../../../api/axiosConfig';

const inventoryService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/inventory', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/inventory/${id}`);
    return response.data;
  },

  create: async (itemData) => {
    const response = await axiosInstance.post('/inventory', itemData);
    return response.data;
  },

  update: async (id, itemData) => {
    const response = await axiosInstance.put(`/inventory/${id}`, itemData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/inventory/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get('/inventory/stats');
    return response.data;
  },
};

export default inventoryService;
