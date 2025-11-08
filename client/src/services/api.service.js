import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.response.status >= 500) {
        toast.error('Server error. Please try again later.');
      }
      
      // Return error response
      return Promise.reject({
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('No response from server. Please check your connection.');
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
      return Promise.reject({ message: 'Request setup error' });
    }
  }
);

// API methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => 
    api.post(`/auth/reset-password/${token}`, { password }),
  getMe: () => api.get('/auth/me'),
};

export const studentAPI = {
  // Institutions
  getInstitutions: () => api.get('/institutions'),
  getInstitution: (id) => api.get(`/institutions/${id}`),
  
  // Courses
  getInstitutionCourses: (institutionId) => 
    api.get(`/institutions/${institutionId}/courses`),
  applyForCourse: (data) => api.post('/applications', data),
  
  // Applications
  getMyApplications: () => api.get('/me/applications'),
  getApplication: (id) => api.get(`/applications/${id}`),
  
  // Admissions
  getMyAdmissions: () => api.get('/me/admissions'),
  acceptAdmission: (admissionId) => 
    api.post(`/admissions/${admissionId}/accept`),
  
  // Documents
  getMyDocuments: () => api.get('/me/documents'),
  uploadDocument: (formData) => {
    return api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteDocument: (documentId) => api.delete(`/documents/${documentId}`),
  
  // Jobs
  getAvailableJobs: () => api.get('/jobs/available'),
  applyForJob: (jobId, data) => api.post(`/jobs/${jobId}/apply`, data),
  getMyJobApplications: () => api.get('/me/job-applications'),
};

export const adminAPI = {
  // User Management
  getUsers: () => api.get('/admin/users'),
  getUser: (userId) => api.get(`/admin/users/${userId}`),
  updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  
  // Institutions
  createInstitution: (data) => api.post('/admin/institutions', data),
  updateInstitution: (id, data) => api.put(`/admin/institutions/${id}`, data),
  deleteInstitution: (id) => api.delete(`/admin/institutions/${id}`),
};

export const instituteAPI = {
  // Courses
  getMyCourses: () => api.get('/institute/courses'),
  createCourse: (data) => api.post('/institute/courses', data),
  updateCourse: (courseId, data) => api.put(`/institute/courses/${courseId}`, data),
  deleteCourse: (courseId) => api.delete(`/institute/courses/${courseId}`),
  
  // Applications
  getCourseApplications: (courseId) => api.get(`/institute/courses/${courseId}/applications`),
  updateApplicationStatus: (applicationId, status) => 
    api.put(`/institute/applications/${applicationId}`, { status }),
  
  // Admissions
  createAdmission: (data) => api.post('/institute/admissions', data),
  getAdmittedStudents: () => api.get('/institute/admissions'),
};

export const companyAPI = {
  // Jobs
  getMyJobs: () => api.get('/company/jobs'),
  createJob: (data) => api.post('/company/jobs', data),
  updateJob: (jobId, data) => api.put(`/company/jobs/${jobId}`, data),
  deleteJob: (jobId) => api.delete(`/company/jobs/${jobId}`),
  
  // Applications
  getJobApplications: (jobId) => api.get(`/company/jobs/${jobId}/applications`),
  updateApplicationStatus: (applicationId, status) => 
    api.put(`/company/applications/${applicationId}`, { status }),
};

export default api;
