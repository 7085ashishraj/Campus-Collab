import axios from 'axios';

// Keep REST requests on the Vercel frontend's origin. Vercel forwards /api to
// Render, so browsers do not need a separate cross-origin connection to it.
const useVercelProxy = typeof window !== 'undefined' &&
  window.location.hostname.endsWith('.vercel.app');

const api = axios.create({
  baseURL: useVercelProxy ? '/api' :
    import.meta.env?.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 15000, // 15 seconds timeout
});

api.interceptors.request.use((config) => {
  let user;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {
    localStorage.removeItem('user');
  }
  if (user && user.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
