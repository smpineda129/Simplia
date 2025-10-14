import axiosInstance from '../../../api/axiosConfig';

const correspondenceTypeService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/correspondence-types', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/correspondence-types/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/correspondence-types', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/correspondence-types/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/correspondence-types/${id}`);
    return response.data;
  },
};

export default correspondenceTypeService;
