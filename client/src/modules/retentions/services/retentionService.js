import axiosInstance from '../../../api/axiosConfig';

const retentionService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/retentions', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/retentions/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/retentions', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/retentions/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/retentions/${id}`);
    return response.data;
  },

  // Retention Lines
  getLines: async (retentionId) => {
    const response = await axiosInstance.get(`/retentions/${retentionId}/lines`);
    return response.data;
  },

  createLine: async (retentionId, data) => {
    const response = await axiosInstance.post(`/retentions/${retentionId}/lines`, data);
    return response.data;
  },

  updateLine: async (lineId, data) => {
    const response = await axiosInstance.put(`/retentions/lines/${lineId}`, data);
    return response.data;
  },

  deleteLine: async (lineId) => {
    const response = await axiosInstance.delete(`/retentions/lines/${lineId}`);
    return response.data;
  },
};

export default retentionService;
