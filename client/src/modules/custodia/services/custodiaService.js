import axiosInstance from '../../../api/axiosConfig';

const custodiaService = {
  // ===== DOCUMENTS =====

  uploadDocument: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/custodia/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return response.data;
  },

  getDocuments: async (params = {}) => {
    const response = await axiosInstance.get('/custodia/documents', { params });
    return response.data;
  },

  getDocumentById: async (id) => {
    const response = await axiosInstance.get(`/custodia/documents/${id}`);
    return response.data;
  },

  deleteDocument: async (id) => {
    const response = await axiosInstance.delete(`/custodia/documents/${id}`);
    return response.data;
  },

  downloadDocument: async (id) => {
    const response = await axiosInstance.get(`/custodia/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // ===== CHAT =====

  sendMessage: async (message, conversationId = null) => {
    const response = await axiosInstance.post('/custodia/chat', {
      message,
      conversationId,
    });
    return response.data;
  },

  getConversations: async () => {
    const response = await axiosInstance.get('/custodia/chat/conversations');
    return response.data;
  },

  getConversation: async (id) => {
    const response = await axiosInstance.get(`/custodia/chat/${id}`);
    return response.data;
  },

  deleteConversation: async (id) => {
    const response = await axiosInstance.delete(`/custodia/chat/${id}`);
    return response.data;
  },

  // ===== STATS =====

  getStats: async () => {
    const response = await axiosInstance.get('/custodia/stats');
    return response.data;
  },
};

export default custodiaService;
