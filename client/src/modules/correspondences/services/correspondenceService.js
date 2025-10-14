import axiosInstance from '../../../api/axiosConfig';

const correspondenceService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/correspondences', { params });
    return response.data;
  },

  getStats: async (params = {}) => {
    const response = await axiosInstance.get('/correspondences/stats', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/correspondences/${id}`);
    return response.data.data || response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/correspondences', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/correspondences/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/correspondences/${id}`);
    return response.data;
  },

  createThread: async (id, data) => {
    const response = await axiosInstance.post(`/correspondences/${id}/threads`, data);
    return response.data;
  },

  deleteThread: async (correspondenceId, threadId) => {
    const response = await axiosInstance.delete(`/correspondences/${correspondenceId}/threads/${threadId}`);
    return response.data;
  },

  respond: async (id, data) => {
    const response = await axiosInstance.post(`/correspondences/${id}/respond`, data);
    return response.data;
  },

  markAsDelivered: async (id) => {
    const response = await axiosInstance.post(`/correspondences/${id}/mark-delivered`);
    return response.data;
  },
};

export default correspondenceService;
