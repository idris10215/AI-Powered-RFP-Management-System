import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchRFPs = () => api.get('/rfp');
export const createRFP = (data) => api.post('/rfp', data);
export const fetchRFPById = (id) => api.get(`/rfp/${id}`);
export const sendRFP = (data) => api.post('/rfp/send', data);
export const checkInbox = () => api.get('/rfp/check-inbox');
export const fetchAllProposals = () => api.get('/rfp/proposals');
export const analyzeRFP = (id) => api.get(`/rfp/${id}/analysis`);

export const fetchVendors = () => api.get('/vendors');

export default api;
