import axios from 'axios';

const publicApi = axios.create({ baseURL: '/api/public' });

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
