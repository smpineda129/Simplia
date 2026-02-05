import axiosInstance from '../../api/axiosConfig';

const auditService = {
  getEvents: async (params = {}) => {
    const response = await axiosInstance.get('/audit', { params });
    return response.data;
  },

  exportExcel: async (params = {}) => {
    const response = await axiosInstance.get(`/audit/export/excel`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  exportPdf: async (params = {}) => {
    const response = await axiosInstance.get(`/audit/export/pdf`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

export default auditService;
