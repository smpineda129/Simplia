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

  shareWithUser: async (proceedingId, externalUserId, customMessage = '') => {
    const response = await axiosInstance.post(`/proceedings/${proceedingId}/external-users`, { 
      externalUserId,
      customMessage 
    });
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

  uploadDocument: async (proceedingId, file, folderId = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) formData.append('folderId', folderId);
    const response = await axiosInstance.post(`/proceedings/${proceedingId}/upload-document`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  moveDocument: async (proceedingId, documentId, folderId) => {
    const response = await axiosInstance.patch(`/proceedings/${proceedingId}/documents/${documentId}/folder`, { folderId });
    return response.data;
  },

  // ─── Folders ──────────────────────────────────────────────────────────────

  getFolders: async (proceedingId) => {
    const response = await axiosInstance.get(`/proceedings/${proceedingId}/folders`);
    return response.data;
  },

  createFolder: async (proceedingId, name) => {
    const response = await axiosInstance.post(`/proceedings/${proceedingId}/folders`, { name });
    return response.data;
  },

  deleteFolder: async (proceedingId, folderId) => {
    const response = await axiosInstance.delete(`/proceedings/${proceedingId}/folders/${folderId}`);
    return response.data;
  },

  exportExcel: (params = {}) => {
    const query = new URLSearchParams();
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    if (params.companyId) query.set('companyId', params.companyId);
    if (params.search) query.set('search', params.search);
    const token = localStorage.getItem('accessToken');
    const base = axiosInstance.defaults.baseURL || '/api';
    const url = `${base}/proceedings/export?${query.toString()}`;
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', '');
    // Attach token via fetch to handle auth
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        a.href = blobUrl;
        a.click();
        URL.revokeObjectURL(blobUrl);
      });
  },
};

export default proceedingService;
