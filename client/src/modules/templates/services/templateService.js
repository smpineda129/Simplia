import axiosInstance from '../../../api/axiosConfig';

const templateService = {
  getHelpers: async () => {
    const response = await axiosInstance.get('/templates/helpers');
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/templates', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/templates/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/templates', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/templates/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/templates/${id}`);
    return response.data;
  },

  processTemplate: async (id, data) => {
    const response = await axiosInstance.post(`/templates/${id}/process`, data);
    return response.data;
  },
};

export default templateService;
