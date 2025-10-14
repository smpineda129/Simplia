import axiosInstance from '../../../api/axiosConfig';

const documentService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/documents', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/documents/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/documents', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/documents/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/documents/${id}`);
    return response.data;
  },
};

export default documentService;
