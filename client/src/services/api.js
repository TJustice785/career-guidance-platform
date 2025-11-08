import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    if (response.data?.message) {
      // You can show success messages here if needed
      // toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          toast.error(data.message || 'Bad request. Please check your input.');
          break;
        case 401:
          // Handle unauthorized access
          localStorage.removeItem('token');
          window.location.href = '/login?sessionExpired=true';
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('The requested resource was not found.');
          break;
        case 422:
          // Validation errors are handled in the components
          break;
        case 500:
          toast.error('An internal server error occurred. Please try again later.');
          break;
        default:
          toast.error(data.message || 'An error occurred. Please try again.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please check your internet connection.');
      } else {
        toast.error('Network error. Please check your internet connection.');
      }
    } else {
      // Something happened in setting up the request
      toast.error('An unexpected error occurred. Please try again.');
    }

    return Promise.reject(error);
  }
);

/**
 * API Services
 */

// Institutions API
const institutions = {
  // Get all institutions with pagination and filters
  getAll: (params = {}) => {
    const { page = 1, limit = 10, search = '', status = '' } = params;
    return api.get('/admin/institutions', {
      params: {
        page,
        limit,
        search,
        status,
      },
    });
  },

  // Get a single institution by ID
  getById: (id) => api.get(`/admin/institutions/${id}`),

  // Create a new institution
  create: (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'logo' && value instanceof File) {
          formData.append('logo', value);
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    return api.post('/admin/institutions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update an institution
  update: (id, data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'logo' && value instanceof File) {
          formData.append('logo', value);
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    return api.put(`/admin/institutions/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete an institution
  delete: (id) => api.delete(`/admin/institutions/${id}`),

  // Toggle institution status
  toggleStatus: (id) => api.patch(`/admin/institutions/${id}/toggle-status`),

  // Get institution statistics
  getStats: () => api.get('/admin/institutions/stats'),
};

// Users API
const users = {
  // Get all users with pagination and filters
  getAll: (params = {}) => {
    const { page = 1, limit = 10, search = '', role = '', status = '' } = params;
    return api.get('/admin/users', {
      params: {
        page,
        limit,
        search,
        role,
        status,
      },
    });
  },

  // Get current user profile
  getProfile: () => api.get('/users/me'),

  // Update user profile
  updateProfile: (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'avatar' && value instanceof File) {
          formData.append('avatar', value);
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    return api.put('/users/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Change password
  changePassword: (currentPassword, newPassword) =>
    api.patch('/users/change-password', { currentPassword, newPassword }),

  // Get user by ID
  getById: (id) => api.get(`/admin/users/${id}`),

  // Create a new user
  create: (userData) => api.post('/admin/users', userData),

  // Update a user
  update: (id, userData) => api.put(`/admin/users/${id}`, userData),

  // Delete a user
  delete: (id) => api.delete(`/admin/users/${id}`),

  // Toggle user status
  toggleStatus: (id) => api.patch(`/admin/users/${id}/toggle-status`),

  // Get user statistics
  getStats: () => api.get('/admin/users/stats'),
};

// Auth API
const auth = {
  // Login
  login: (credentials) => api.post('/auth/login', credentials),

  // Logout
  logout: () => api.post('/auth/logout'),

  // Refresh token
  refreshToken: () => api.post('/auth/refresh-token'),

  // Forgot password
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),

  // Reset password
  resetPassword: (token, newPassword) =>
    api.post('/auth/reset-password', { token, newPassword }),

  // Verify email
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
};

// Application API
const applications = {
  // Get all applications with filters
  getAll: (params = {}) => {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    return api.get('/admin/applications', {
      params: {
        page,
        limit,
        search,
        status,
        sortBy,
        sortOrder,
      },
    });
  },

  // Get application by ID
  getById: (id) => api.get(`/admin/applications/${id}`),

  // Update application status
  updateStatus: (id, status, notes) =>
    api.patch(`/admin/applications/${id}/status`, { status, notes }),

  // Add note to application
  addNote: (id, note) =>
    api.post(`/admin/applications/${id}/notes`, { note }),

  // Get application statistics
  getStats: () => api.get('/admin/applications/stats'),
};

// Settings API
const settings = {
  // Get all settings
  getAll: () => api.get('/admin/settings'),

  // Update settings
  update: (settingsData) => api.put('/admin/settings', settingsData),

  // Get public settings
  getPublic: () => api.get('/settings'),
};

// Admin API
const adminAPI = {
  // User management
  getAllUsers: (params = {}) => {
    const { page = 1, limit = 10, search = '', role = 'all', status = 'all' } = params;
    return api.get('/admin/users', {
      params: {
        page,
        limit,
        search,
        role,
        status,
      },
    });
  },

  getUserById: (id) => api.get(`/admin/users/${id}`),

  createUser: (userData) => api.post('/admin/users', userData),

  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),

  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/toggle-status`),

  // Institution management
  getAllInstitutions: (params = {}) => {
    const { page = 1, limit = 10, search = '', status = 'all' } = params;
    return api.get('/admin/institutions', {
      params: {
        page,
        limit,
        search,
        status,
      },
    });
  },

  // Company management
  getAllCompanies: (params = {}) => {
    const { page = 1, limit = 10, search = '', status = 'all' } = params;
    return api.get('/admin/companies', {
      params: {
        page,
        limit,
        search,
        status,
      },
    });
  },

  // Course management
  getAllCourses: () => api.get('/admin/courses'),

  // Dashboard statistics
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
};

// Jobs API
const jobs = {
  // Get all jobs with filters (public)
  getAll: (params = {}) => {
    const { companyId, status, search, type, location, page = 1, limit = 10 } = params;
    return api.get('/jobs', {
      params: {
        companyId,
        status,
        search,
        type,
        location,
        page,
        limit,
      },
    });
  },

  // Get single job by ID
  getById: (id) => api.get(`/jobs/${id}`),

  // Create new job (company/admin only)
  create: (jobData) => api.post('/jobs', jobData),

  // Update job (company/admin only)
  update: (id, jobData) => api.put(`/jobs/${id}`, jobData),

  // Delete job (company/admin only)
  delete: (id) => api.delete(`/jobs/${id}`),

  // Apply for job (student only)
  apply: (jobId, applicationData) => api.post(`/jobs/${jobId}/apply`, applicationData),
};

// Courses API
const courses = {
  // Get all courses with filters (public)
  getAll: (params = {}) => {
    const { institutionId, status, search, category, page = 1, limit = 10 } = params;
    return api.get('/courses', {
      params: {
        institutionId,
        status,
        search,
        category,
        page,
        limit,
      },
    });
  },

  // Get single course by ID
  getById: (id) => api.get(`/courses/${id}`),
};

// Export all API methods
const apiService = {
  auth,
  users,
  institutions,
  applications,
  settings,
  adminAPI,
  jobs,
  courses,

  // Helper method to handle file downloads
  downloadFile: (url, filename) => {
    return api.get(url, { responseType: 'blob' })
      .then(response => {
        // Create blob link to download
        const href = window.URL.createObjectURL(new Blob([response.data]));

        // Create "a" HTML element with href to file
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', filename);
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(href);
      })
      .catch(error => {
        console.error('Error downloading file:', error);
        throw error;
      });
  },

  // Helper method to cancel requests
  cancelToken: () => axios.CancelToken.source(),
};

export default apiService;
