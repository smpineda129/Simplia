import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const publicApi = axios.create({ baseURL: `${API_URL}/public` });

export const getPublicCompany = (id) => publicApi.get(`/companies/${id}`);
export const getPublicCorrespondenceTypes = (companyId) =>
  publicApi.get(`/correspondence-types?companyId=${companyId}`);
export const lookupEntityByEmail = (companyId, email) =>
  publicApi.get(`/entities/lookup?companyId=${companyId}&email=${encodeURIComponent(email)}`);
export const submitPublicCorrespondence = (data) => publicApi.post('/correspondences', data);
export const uploadPublicDocument = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return publicApi.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
