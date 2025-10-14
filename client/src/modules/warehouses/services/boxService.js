import axiosInstance from '../../../api/axiosConfig';

const boxService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/warehouses/boxes', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/warehouses/boxes/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/warehouses/boxes', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/warehouses/boxes/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/warehouses/boxes/${id}`);
    return response.data;
  },
};

export default boxService;
