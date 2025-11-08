// Mock axios module
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

import jobService from '../job.service';
import { API_BASE_URL } from '../../config';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('Job Service', () => {
  const mockToken = 'test-token';
  
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    axios.get.mockClear();
    axios.post.mockClear();
    axios.put.mockClear();
    axios.delete.mockClear();
    
    // Set up auth token for tests
    localStorage.setItem('token', mockToken);
  });

  afterEach(() => {
    localStorage.removeItem('token');
  });

  describe('getJobs', () => {
    it('should fetch jobs with default parameters', async () => {
      const mockJobs = [{ id: 1, title: 'Software Engineer' }];
      axios.get.mockResolvedValueOnce({ data: mockJobs });

      const result = await jobService.getJobs();

      expect(axios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/jobs`,
        { params: {} }
      );
      expect(result).toEqual(mockJobs);
    });

    it('should fetch jobs with filters', async () => {
      const filters = { status: 'open', search: 'engineer' };
      axios.get.mockResolvedValueOnce({ data: [] });

      await jobService.getJobs(filters);

      expect(axios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/jobs`,
        { params: filters }
      );
    });

    it('should handle errors', async () => {
      const error = new Error('Network error');
      axios.get.mockRejectedValueOnce({ response: { data: { error: 'Failed to fetch jobs' } } });

      await expect(jobService.getJobs()).rejects.toEqual({
        error: 'Failed to fetch jobs'
      });
    });
  });

  describe('applyForJob', () => {
    it('should apply for a job', async () => {
      const jobId = '123';
      const applicationData = new FormData();
      applicationData.append('resume', 'test.pdf');
      
      const mockResponse = { success: true, applicationId: 'app-123' };
      axios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await jobService.applyForJob(jobId, applicationData);

      expect(axios.post).toHaveBeenCalledWith(
        `${API_BASE_URL}/jobs/${jobId}/apply`,
        applicationData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getMyApplications', () => {
    it('should fetch user job applications', async () => {
      const mockApplications = [{ id: 'app-1', jobId: 'job-1' }];
      axios.get.mockResolvedValueOnce({ data: mockApplications });

      const result = await jobService.getMyApplications({ status: 'pending' });

      expect(axios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/jobs/applications/me`,
        { params: { status: 'pending' } }
      );
      expect(result).toEqual(mockApplications);
    });
  });

  describe('withdrawApplication', () => {
    it('should withdraw a job application', async () => {
      const applicationId = 'app-123';
      const mockResponse = { success: true };
      axios.delete.mockResolvedValueOnce({ data: mockResponse });

      const result = await jobService.withdrawApplication(applicationId);

      expect(axios.delete).toHaveBeenCalledWith(
        `${API_BASE_URL}/jobs/applications/${applicationId}`
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('saveJob', () => {
    it('should save a job for later', async () => {
      const jobId = 'job-123';
      const mockResponse = { success: true };
      axios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await jobService.saveJob(jobId);

      expect(axios.post).toHaveBeenCalledWith(
        `${API_BASE_URL}/jobs/${jobId}/save`
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getRecommendedJobs', () => {
    it('should fetch recommended jobs', async () => {
      const mockJobs = [{ id: 'job-1', title: 'Recommended Job' }];
      axios.get.mockResolvedValueOnce({ data: mockJobs });

      const result = await jobService.getRecommendedJobs();

      expect(axios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/jobs/recommended`
      );
      expect(result).toEqual(mockJobs);
    });
  });

  describe('searchJobs', () => {
    it('should search jobs with parameters', async () => {
      const searchParams = {
        query: 'software',
        location: 'remote',
        page: 1,
        limit: 10
      };
      const mockResponse = { jobs: [], total: 0 };
      axios.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await jobService.searchJobs(searchParams);

      expect(axios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/jobs/search`,
        { params: searchParams }
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
