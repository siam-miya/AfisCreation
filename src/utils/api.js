import axios from 'axios';

const rawURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const cleanURL = rawURL.replace(/\/+$/, '');

// স্বয়ংক্রিয়ভাবে একটিমাত্র /api/v1 ফরম্যাট তৈরি করবে
const baseURL = cleanURL.endsWith('/api/v1')
  ? cleanURL
  : cleanURL.endsWith('/api')
  ? `${cleanURL}/v1`
  : `${cleanURL}/api/v1`;

const API = axios.create({
  baseURL,
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;