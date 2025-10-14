import axiosInstance from '../../../api/axiosConfig';

const areaService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/areas', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/areas/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/areas', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/areas/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/areas/${id}`);
    return response.data;
  },

  assignUsers: async (id, userIds) => {
    const response = await axiosInstance.post(`/areas/${id}/users`, { userIds });
    return response.data;
  },

  removeUser: async (id, userId) => {
    const response = await axiosInstance.delete(`/areas/${id}/users/${userId}`);
    return response.data;
  },
};

export default areaService;
