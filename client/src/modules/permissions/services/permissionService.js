import axiosInstance from '../../../api/axiosConfig';

const permissionService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/permissions', { params });
    return response.data;
  },
  getGrouped: async () => {
    const response = await axiosInstance.get('/permissions/grouped');
    return response.data;
  },
  getById: async (id) => {
    const response = await axiosInstance.get(`/permissions/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await axiosInstance.post('/permissions', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await axiosInstance.put(`/permissions/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await axiosInstance.delete(`/permissions/${id}`);
    return response.data;
  },
  getRoles: async (id) => {
    const response = await axiosInstance.get(`/permissions/${id}/roles`);
    return response.data;
  },
};

export default permissionService;
