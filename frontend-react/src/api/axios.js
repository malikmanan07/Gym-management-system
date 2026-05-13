import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('gym_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || 'Something went wrong';
        toast.error(message);
        
        if (error.response?.status === 401) {
            localStorage.removeItem('gym_token');
            window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || { message: 'Network Error' });
    }
);

export default api;
