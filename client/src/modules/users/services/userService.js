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

  // Role management
  assignRole: async (userId, roleId) => {
    const response = await axiosInstance.post(`/users/${userId}/roles`, { roleId });
    return response.data;
  },

  removeRole: async (userId, roleId) => {
    const response = await axiosInstance.delete(`/users/${userId}/roles/${roleId}`);
    return response.data;
  },

  getUserRoles: async (userId) => {
    const response = await axiosInstance.get(`/users/${userId}/roles`);
    return response.data;
  },

  // Area management
  assignArea: async (userId, areaId) => {
    const response = await axiosInstance.post(`/users/${userId}/areas`, { areaId });
    return response.data;
  },

  removeArea: async (userId, areaId) => {
    const response = await axiosInstance.delete(`/users/${userId}/areas/${areaId}`);
    return response.data;
  },

  // Permission management
  assignPermission: async (userId, permissionId) => {
    const response = await axiosInstance.post(`/users/${userId}/permissions`, { permissionId });
    return response.data;
  },

  removePermission: async (userId, permissionId) => {
    const response = await axiosInstance.delete(`/users/${userId}/permissions/${permissionId}`);
    return response.data;
  },

  getUserPermissions: async (userId) => {
    const response = await axiosInstance.get(`/users/${userId}/permissions`);
    return response.data;
  },
};

export default userService;
