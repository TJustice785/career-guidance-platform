import axios from 'axios';
import { auth } from '../config/firebase.config';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred';
      console.error('API Error:', message);
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  verifyEmail: (uid) => api.post('/auth/verify-email', { uid }),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data)
};

// Student API
export const studentAPI = {
  getInstitutions: () => api.get('/student/institutions'),
  getInstitutionCourses: (institutionId) => api.get(`/student/institutions/${institutionId}/courses`),
  applyForCourse: (data) => api.post('/student/apply', data),
  getMyApplications: () => api.get('/student/applications'),
  getMyAdmissions: () => api.get('/student/admissions'),
  acceptAdmission: (admissionId) => api.post(`/student/admissions/${admissionId}/accept`),
  uploadDocument: (formData) => api.post('/student/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyDocuments: () => api.get('/student/documents'),
  deleteDocument: (documentId) => api.delete(`/student/documents/${documentId}`),
  uploadTranscript: (formData) => api.post('/student/transcript/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadCertificate: (formData) => api.post('/student/certificates/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAvailableJobs: () => api.get('/student/jobs'),
  applyForJob: (jobId, data) => api.post(`/student/jobs/${jobId}/apply`, data),
  getMyJobApplications: () => api.get('/student/job-applications'),
  getNotifications: () => api.get('/student/notifications'),
  markNotificationAsRead: (notificationId) => api.put(`/student/notifications/${notificationId}/read`)
};

// Institute API
export const instituteAPI = {
  addFaculty: (data) => api.post('/institute/faculties', data),
  getFaculties: () => api.get('/institute/faculties'),
  updateFaculty: (facultyId, data) => api.put(`/institute/faculties/${facultyId}`, data),
  deleteFaculty: (facultyId) => api.delete(`/institute/faculties/${facultyId}`),
  addCourse: (data) => api.post('/institute/courses', data),
  getCourses: () => api.get('/institute/courses'),
  updateCourse: (courseId, data) => api.put(`/institute/courses/${courseId}`, data),
  deleteCourse: (courseId) => api.delete(`/institute/courses/${courseId}`),
  getApplications: (params) => api.get('/institute/applications', { params }),
  processApplication: (applicationId, data) => api.put(`/institute/applications/${applicationId}/process`, data),
  publishAdmissions: (data) => api.post('/institute/admissions/publish', data),
  getAdmissions: () => api.get('/institute/admissions'),
  getStudents: () => api.get('/institute/students')
};

// Company API
export const companyAPI = {
  createJob: (data) => api.post('/company/jobs', data),
  getMyJobs: () => api.get('/company/jobs'),
  updateJob: (jobId, data) => api.put(`/company/jobs/${jobId}`, data),
  deleteJob: (jobId) => api.delete(`/company/jobs/${jobId}`),
  getJobApplications: (jobId) => api.get(`/company/jobs/${jobId}/applications`),
  updateApplicationStatus: (applicationId, data) => api.put(`/company/applications/${applicationId}`, data)
};

// Admin API
export const adminAPI = {
  addInstitution: (data) => api.post('/admin/institutions', data),
  getAllInstitutions: () => api.get('/admin/institutions'),
  updateInstitution: (institutionId, data) => api.put(`/admin/institutions/${institutionId}`, data),
  deleteInstitution: (institutionId) => api.delete(`/admin/institutions/${institutionId}`),
  addFaculty: (data) => api.post('/admin/faculties', data),
  getAllFaculties: () => api.get('/admin/faculties'),
  updateFaculty: (facultyId, data) => api.put(`/admin/faculties/${facultyId}`, data),
  deleteFaculty: (facultyId) => api.delete(`/admin/faculties/${facultyId}`),
  addCourse: (data) => api.post('/admin/courses', data),
  getAllCourses: () => api.get('/admin/courses'),
  updateCourse: (courseId, data) => api.put(`/admin/courses/${courseId}`, data),
  deleteCourse: (courseId) => api.delete(`/admin/courses/${courseId}`),
  getAllCompanies: () => api.get('/admin/companies'),
  approveCompany: (companyId) => api.put(`/admin/companies/${companyId}/approve`),
  suspendCompany: (companyId) => api.put(`/admin/companies/${companyId}/suspend`),
  deleteCompany: (companyId) => api.delete(`/admin/companies/${companyId}`),
  getAllUsers: () => api.get('/admin/users'),
  getUserStats: () => api.get('/admin/users/stats'),
  getDashboardStats: () => api.get('/admin/reports/dashboard'),
  getApplicationsReport: () => api.get('/admin/reports/applications'),
  getAdmissionsReport: () => api.get('/admin/reports/admissions'),
  getJobsReport: () => api.get('/admin/reports/jobs')
};

export default api;
