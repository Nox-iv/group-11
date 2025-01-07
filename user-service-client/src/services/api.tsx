import axios from 'axios';

const userServiceAPI = axios.create({
    baseURL: import.meta.env.VITE_USER_SERVICE_URL, 
});

userServiceAPI.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers['x-api-key'] = import.meta.env.VITE_USER_SERVICE_API_KEY;

    return config;
});

export default userServiceAPI;