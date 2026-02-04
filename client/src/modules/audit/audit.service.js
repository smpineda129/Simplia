import axios from 'axios';

const API_URL = '/api/audit';

const auditService = {
  getEvents: async (params = {}) => {
    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  exportExcel: async (params = {}) => {
    const response = await axios.get(`${API_URL}/export/excel`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  exportPdf: async (params = {}) => {
    const response = await axios.get(`${API_URL}/export/pdf`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

export default auditService;
