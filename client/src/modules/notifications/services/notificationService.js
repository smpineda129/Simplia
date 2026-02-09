import axiosInstance from '../../../api/axiosConfig';

const notificationService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/notifications', { params });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await axiosInstance.get('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await axiosInstance.post(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axiosInstance.post('/notifications/mark-all-read');
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/notifications/${id}`);
    return response.data;
  },

  deleteAll: async () => {
    const response = await axiosInstance.delete('/notifications');
    return response.data;
  },
};

export default notificationService;
