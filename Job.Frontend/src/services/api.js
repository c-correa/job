import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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
    getAll: async (filters = {}) => {
        const response = await api.get('/companies', { params: filters });
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
    },
    create: async (companyData) => {
        const response = await api.post('/companies', companyData);
        return response.data;
    },
    update: async (id, companyData) => {
        const response = await api.put(`/companies/${id}`, companyData);
        return response.data;
    },
    getIndustries: async () => {
        const response = await api.get('/companies/industries');
        return response.data;
    }
};

export const candidateService = {
    getAll: async (filters = {}) => {
        const response = await api.get('/candidates', { params: filters });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/candidates/${id}`);
        return response.data;
    },
    getMyCandidate: async (userId) => {
        // Fetch all candidates and filter by userId
        // This ensures we get the full candidate object with skills
        const allCandidates = await candidateService.getAll();
        const found = allCandidates.find(c => {
            return c.userId == userId || c.UserId == userId;
        });

        if (found) {
            console.log("✅ Found candidate with skills:", found);
            console.log("Skills count:", found.candidateSkills?.length || 0);
        } else {
            console.log("❌ No candidate found for userId:", userId);
        }

        return found;
    },
    create: async (candidateData) => {
        const response = await api.post('/candidates', candidateData);
        return response.data;
    },
    update: async (id, profileData) => {
        const response = await api.put(`/candidates/${id}`, profileData);
        return response.data;
    },
    addSkill: async (candidateId, skillData) => {
        const response = await api.post(`/candidates/${candidateId}/skills`, skillData);
        return response.data;
    },
    deleteSkill: async (candidateId, skillId) => {
        const response = await api.delete(`/candidates/${candidateId}/skills/${skillId}`);
        return response.data;
    },
    getAvailableSkills: async () => {
        const response = await api.get('/candidates/skills');
        return response.data;
    }
};

export const jobService = {
    getAll: async (filters = {}) => {
        let params = {};
        // Backward compatibility: if filters is likely an ID (not object)
        if (filters && typeof filters !== 'object') {
            params = { companyId: filters };
        } else if (filters) {
            params = filters;
        }
        const response = await api.get('/jobs', { params });
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
    update: async (id, jobData) => {
        const response = await api.put(`/jobs/${id}`, jobData);
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
    getAll: async (filters = {}) => {
        const response = await api.get('/applications', { params: filters });
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
    },
    getById: async (id) => {
        const response = await api.get(`/applications/${id}`);
        return response.data;
    },
    getByCandidateId: async (candidateId) => {
        const response = await api.get(`/applications/candidate/${candidateId}`);
        return response.data;
    },
    delete: async (id) => {
        await api.delete(`/applications/${id}`);
    }
};

export const userService = {
    getAll: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },
    update: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },
    delete: async (id) => {
        await api.delete(`/users/${id}`);
    },
    checkUsername: async (username) => {
        const response = await api.get(`/users/check-username/${username}`);
        return response.data;
    }
};

export const fileService = {
    upload: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export default api;
