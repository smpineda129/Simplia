import axiosInstance from '../../../api/axiosConfig';

const userService = {
  getAll: async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  create: async (userData) => {
    const response = await axiosInstance.post('/users', userData);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await axiosInstance.put(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },
};

export default userService;
