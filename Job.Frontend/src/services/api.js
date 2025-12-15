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
        console.log("🔍 getMyCompany called with userId:", userId, "Type:", typeof userId);
        const allCompanies = await companyService.getAll();
        console.log("📊 All companies in DB:", allCompanies);
        const found = allCompanies.find(c => {
            console.log(`Comparing company userId ${c.userId} (type: ${typeof c.userId}) with search ${userId} (type: ${typeof userId})`);
            return c.userId == userId || c.UserId == userId;
        });
        console.log("✅ Found company:", found);
        return found;
    }
};

export const candidateService = {
    getAll: async () => {
        const response = await api.get('/candidates');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/candidates/${id}`);
        return response.data;
    },
    getMyCandidate: async (userId) => {
        const allCandidates = await candidateService.getAll();
        console.log("Looking for candidate with userId:", userId);
        console.log("All candidates:", allCandidates);
        const found = allCandidates.find(c => {
            console.log("Checking candidate:", c, "c.userId:", c.userId, "c.UserId:", c.UserId);
            return c.userId == userId || c.UserId == userId;
        });
        console.log("Found candidate:", found);
        return found;
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
    },
    create: async (jobData) => {
        const response = await api.post('/jobs', jobData);
        return response.data;
    },
    delete: async (id) => {
        await api.delete(`/jobs/${id}`);
    },
    updateStatus: async (id, isActive) => {
        const response = await api.patch(`/jobs/${id}/status`, isActive, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
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
    },
    create: async (applicationData) => {
        const response = await api.post('/applications', applicationData);
        return response.data;
    },
    updateStatus: async (applicationId, newStatus) => {
        const response = await api.patch(`/applications/${applicationId}/status`, newStatus, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    }
};

export default api;
