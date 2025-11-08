import axios from 'axios';
import { API_BASE_URL } from '../config';

const JOB_API_URL = `${API_BASE_URL}/jobs`;

const jobService = {
  // Get all jobs with optional filters
  getJobs: async (filters = {}) => {
    try {
      const response = await axios.get(JOB_API_URL, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error.response?.data || { error: 'Failed to fetch jobs' };
    }
  },

  // Get job by ID
  getJobById: async (jobId) => {
    try {
      const response = await axios.get(`${JOB_API_URL}/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error.response?.data || { error: 'Failed to fetch job details' };
    }
  },

  // Apply for a job
  applyForJob: async (jobId, applicationData) => {
    try {
      const response = await axios.post(
        `${JOB_API_URL}/${jobId}/apply`,
        applicationData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error.response?.data || { error: 'Failed to submit application' };
    }
  },

  // Get job applications for current user
  getMyApplications: async (filters = {}) => {
    try {
      const response = await axios.get(`${JOB_API_URL}/applications/me`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching job applications:', error);
      throw error.response?.data || { error: 'Failed to fetch applications' };
    }
  },

  // Withdraw job application
  withdrawApplication: async (applicationId) => {
    try {
      const response = await axios.delete(
        `${JOB_API_URL}/applications/${applicationId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error withdrawing application:', error);
      throw error.response?.data || { error: 'Failed to withdraw application' };
    }
  },

  // Get application status
  getApplicationStatus: async (applicationId) => {
    try {
      const response = await axios.get(
        `${JOB_API_URL}/applications/${applicationId}/status`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching application status:', error);
      throw error.response?.data || { error: 'Failed to fetch application status' };
    }
  },

  // Save job for later
  saveJob: async (jobId) => {
    try {
      const response = await axios.post(`${JOB_API_URL}/${jobId}/save`);
      return response.data;
    } catch (error) {
      console.error('Error saving job:', error);
      throw error.response?.data || { error: 'Failed to save job' };
    }
  },

  // Get saved jobs
  getSavedJobs: async () => {
    try {
      const response = await axios.get(`${JOB_API_URL}/saved`);
      return response.data;
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      throw error.response?.data || { error: 'Failed to fetch saved jobs' };
    }
  },

  // Get recommended jobs based on profile
  getRecommendedJobs: async () => {
    try {
      const response = await axios.get(`${JOB_API_URL}/recommended`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommended jobs:', error);
      throw error.response?.data || { error: 'Failed to fetch recommended jobs' };
    }
  },

  // Search jobs with filters
  searchJobs: async (searchParams) => {
    try {
      const response = await axios.get(`${JOB_API_URL}/search`, {
        params: searchParams,
      });
      return response.data;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error.response?.data || { error: 'Failed to search jobs' };
    }
  },
};

export default jobService;
