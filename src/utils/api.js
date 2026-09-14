import axios from 'axios';

const rawURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const cleanURL = rawURL.replace(/\/+$/, '');
const baseURL = cleanURL.endsWith('/api/v1')
  ? cleanURL
  : cleanURL.endsWith('/api')
  ? `${cleanURL}/v1`
  : `${cleanURL}/api/v1`;

const API = axios.create({
  baseURL,
  withCredentials: true, // কুকি পাঠানোর জন্য এটি অত্যন্ত জরুরি
});

API.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // localStorage এর সব সম্ভাব্য নামগুলো এখানে চেক করা হলো যাতে কোনো টোকেন মিস না হয়
      const token = 
        localStorage.getItem('token') || 
        localStorage.getItem('adminToken') || 
        localStorage.getItem('adminUserToken');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;