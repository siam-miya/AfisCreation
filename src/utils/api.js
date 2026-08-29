import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1', // Tumar backend server URL
  withCredentials: true, // HTTP-only cookies browser-e save korar jonno eta obossoi lagbe
});

export default API;