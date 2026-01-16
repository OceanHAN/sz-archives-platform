import axios from 'axios';

const base =
  (import.meta as any).env?.VITE_API_BASE ||
  'http://localhost:3000';

const api = axios.create({
  baseURL: base,
  timeout: 8000,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
