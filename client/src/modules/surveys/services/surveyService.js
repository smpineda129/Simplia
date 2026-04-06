import axiosInstance from '../../../api/axiosConfig';

const surveyService = {
  // ===== SURVEYS =====

  create: async (data) => {
    const response = await axiosInstance.post('/surveys', data);
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/surveys', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/surveys/${id}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/surveys/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/surveys/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get('/surveys/stats');
    return response.data;
  },

  generateIndividualPresentation: async (id) => {
    const response = await axiosInstance.get(`/surveys/${id}/presentation`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // ===== SURVEY DEFINITIONS =====

  getActiveDefinition: async (name) => {
    const response = await axiosInstance.get(`/surveys/definitions/${name}/active`);
    return response.data;
  },

  getAllDefinitions: async () => {
    const response = await axiosInstance.get('/surveys/definitions/all');
    return response.data;
  },

  createOrUpdateDefinition: async (data) => {
    const response = await axiosInstance.post('/surveys/definitions', data);
    return response.data;
  },

  deleteDefinition: async (id) => {
    const response = await axiosInstance.delete(`/surveys/definitions/${id}`);
    return response.data;
  },
};

export default surveyService;
