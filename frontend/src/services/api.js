// frontend/src/services/api.js
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', //'http://187.77.125.200:5000/api', // Ganti dengan IP VPS & Port backend Anda
});

export default API;