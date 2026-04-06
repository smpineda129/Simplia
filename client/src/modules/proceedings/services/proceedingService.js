import axiosInstance from '../../../api/axiosConfig';

const proceedingService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/proceedings', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/proceedings/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/proceedings', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/proceedings/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/proceedings/${id}`);
    return response.data;
  },

  // ─── Boxes ────────────────────────────────────────────────────────────────

  attachBox: async (proceedingId, boxId) => {
    const response = await axiosInstance.post(`/proceedings/${proceedingId}/boxes`, { boxId });
    return response.data;
  },

  detachBox: async (proceedingId, boxId) => {
    const response = await axiosInstance.delete(`/proceedings/${proceedingId}/boxes/${boxId}`);
    return response.data;
  },

  // ─── External Users ───────────────────────────────────────────────────────

  shareWithUser: async (proceedingId, externalUserId) => {
    const response = await axiosInstance.post(`/proceedings/${proceedingId}/external-users`, { externalUserId });
    return response.data;
  },

  unshareWithUser: async (proceedingId, userId) => {
    const response = await axiosInstance.delete(`/proceedings/${proceedingId}/external-users/${userId}`);
    return response.data;
  },

  // ─── Threads (Loans) ──────────────────────────────────────────────────────

  createThread: async (proceedingId, data) => {
    const response = await axiosInstance.post(`/proceedings/${proceedingId}/threads`, data);
    return response.data;
  },

  deleteThread: async (proceedingId, threadId) => {
    const response = await axiosInstance.delete(`/proceedings/${proceedingId}/threads/${threadId}`);
    return response.data;
  },

  // ─── Documents ────────────────────────────────────────────────────────────

  attachDocument: async (proceedingId, documentId) => {
    const response = await axiosInstance.post(`/proceedings/${proceedingId}/documents`, { documentId });
    return response.data;
  },

  detachDocument: async (proceedingId, documentId) => {
    const response = await axiosInstance.delete(`/proceedings/${proceedingId}/documents/${documentId}`);
    return response.data;
  },

  uploadDocument: async (proceedingId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post(`/proceedings/${proceedingId}/upload-document`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default proceedingService;
