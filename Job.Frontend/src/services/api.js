import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add the token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    },
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};

export const companyService = {
    getAll: async () => {
        const response = await api.get('/companies');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/companies/${id}`);
        return response.data;
    },
    getMyCompany: async (userId) => {
        const allCompanies = await companyService.getAll();
        return allCompanies.find(c => c.userId === userId);
    }
};

export const jobService = {
    getAll: async (companyId = null) => {
        let url = '/jobs';
        if (companyId) {
            url += `?companyId=${companyId}`;
        }
        const response = await api.get(url);
        return response.data;
    },
    getStats: async (jobId) => {
        const response = await api.get(`/applications/job/${jobId}`);
        return {
            applicationsCount: response.data.length,
            interviewsCount: response.data.filter(a => a.status === 4).length
        };
    }
};

export const applicationService = {
    getAll: async () => {
        const response = await api.get('/applications');
        return response.data;
    },
    getByJobId: async (jobId) => {
        const response = await api.get(`/applications/job/${jobId}`);
        return response.data;
    }
};

export default api;
