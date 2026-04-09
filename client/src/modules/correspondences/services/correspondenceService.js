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

  getAreaUsers: async (correspondenceTypeId) => {
    const response = await axiosInstance.get('/correspondences/area-users', {
      params: { correspondenceTypeId },
    });
    return response.data;
  },

  getCompanyUsers: async (type = 'internal', companyId = null) => {
    const params = { type };
    if (companyId) params.companyId = companyId;
    const response = await axiosInstance.get('/correspondences/company-users', { params });
    return response.data;
  },

  uploadDocument: async (file) => {
    const form = new FormData();
    form.append('file', file);
    const response = await axiosInstance.post('/documents/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  exportExcel: (params = {}) => {
    const query = new URLSearchParams();
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    if (params.companyId) query.set('companyId', params.companyId);
    if (params.search) query.set('search', params.search);
    if (params.status) query.set('status', params.status);
    const token = localStorage.getItem('accessToken');
    const base = axiosInstance.defaults.baseURL || '/api';
    const url = `${base}/correspondences/export?${query.toString()}`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.setAttribute('download', `Correspondencias_${Date.now()}.xlsx`);
        a.click();
        URL.revokeObjectURL(blobUrl);
      });
  },

  // ─── Folders ─────────────────────────────────────────────────────────────

  createFolder: async (correspondenceId, name) => {
    const response = await axiosInstance.post(`/correspondences/${correspondenceId}/folders`, { name });
    return response.data;
  },

  getFolders: async (correspondenceId) => {
    const response = await axiosInstance.get(`/correspondences/${correspondenceId}/folders`);
    return response.data;
  },

  deleteFolder: async (correspondenceId, folderId) => {
    const response = await axiosInstance.delete(`/correspondences/${correspondenceId}/folders/${folderId}`);
    return response.data;
  },
};

export default correspondenceService;
