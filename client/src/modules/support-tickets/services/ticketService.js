import axiosInstance from '../../../api/axiosConfig';

const ticketService = {
  // Get all tickets (admin)
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/tickets', { params });
    return response.data;
  },

  // Get my tickets
  getMyTickets: async (params = {}) => {
    const response = await axiosInstance.get('/tickets/my-tickets', { params });
    return response.data;
  },

  // Get ticket by ID
  getById: async (id) => {
    const response = await axiosInstance.get(`/tickets/${id}`);
    return response.data;
  },

  // Create ticket (authenticated)
  create: async (data) => {
    const response = await axiosInstance.post('/tickets', data);
    return response.data;
  },

  // Create anonymous PQRS (public)
  createAnonymous: async (data) => {
    const response = await axiosInstance.post('/tickets/public/pqrs', data);
    return response.data;
  },

  // Update ticket
  update: async (id, data) => {
    const response = await axiosInstance.put(`/tickets/${id}`, data);
    return response.data;
  },

  // Add comment
  addComment: async (id, data) => {
    const response = await axiosInstance.post(`/tickets/${id}/comments`, data);
    return response.data;
  },

  // Get statistics
  getStats: async (params = {}) => {
    const response = await axiosInstance.get('/tickets/stats', { params });
    return response.data;
  },

  // Delete ticket
  delete: async (id) => {
    const response = await axiosInstance.delete(`/tickets/${id}`);
    return response.data;
  },
};

export default ticketService;
