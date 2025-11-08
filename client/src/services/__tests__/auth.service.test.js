// Mock axios module
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  defaults: {
    headers: {
      common: {}
    }
  }
}));

import authService from '../auth.service';
import { API_BASE_URL } from '../../config';
import axios from 'axios';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Auth Service', () => {
  const mockToken = 'test-token';
  const mockRefreshToken = 'test-refresh-token';
  const mockUser = { id: 'user-123', email: 'test@example.com' };
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Clear local storage
    localStorage.clear();
    
    // Reset axios defaults
    delete axios.defaults.headers.common['Authorization'];
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      };
      
      const mockResponse = { user: { ...userData, id: 'user-123' } };
      axios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await authService.register(userData);

      expect(axios.post).toHaveBeenCalledWith(
        `${API_BASE_URL}/auth/register`,
        userData
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('login', () => {
    it('should log in a user and store the token', async () => {
      const credentials = { email: 'test@example.com', password: 'Password123!' };
      const mockResponse = { 
        user: mockUser, 
        token: mockToken,
        refreshToken: mockRefreshToken
      };
      
      axios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await authService.login(credentials);

      expect(axios.post).toHaveBeenCalledWith(
        `${API_BASE_URL}/auth/login`,
        credentials
      );
      expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
      expect(axios.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    it('should remove the token and clear auth header', () => {
      // Set up initial state
      localStorage.setItem('token', mockToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;

      authService.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token exists', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should return false for expired token', () => {
      // Create an expired token (1 hour ago)
      const expiredToken = `header.${btoa(JSON.stringify({
        exp: Math.floor(Date.now() / 1000) - 3600
      }))}.signature`;
      
      localStorage.setItem('token', expiredToken);
      
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should return true for valid token', () => {
      // Create a token that expires in 1 hour
      const validToken = `header.${btoa(JSON.stringify({
        exp: Math.floor(Date.now() / 1000) + 3600
      }))}.signature`;
      
      localStorage.setItem('token', validToken);
      
      expect(authService.isAuthenticated()).toBe(true);
    });
  });

  describe('getCurrentUser', () => {
    it('should fetch the current user profile', async () => {
      axios.get.mockResolvedValueOnce({ data: mockUser });

      const result = await authService.getCurrentUser();

      expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/auth/me`);
      expect(result).toEqual(mockUser);
    });
  });

  describe('refreshToken', () => {
    it('should refresh the access token', async () => {
      const newToken = 'new-test-token';
      const mockResponse = { token: newToken };
      
      axios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await authService.refreshToken();

      expect(axios.post).toHaveBeenCalledWith(`${API_BASE_URL}/auth/refresh-token`);
      expect(localStorage.setItem).toHaveBeenCalledWith('token', newToken);
      expect(axios.defaults.headers.common['Authorization']).toBe(`Bearer ${newToken}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('initialize', () => {
    it('should initialize with a valid token', async () => {
      const validToken = `header.${btoa(JSON.stringify({
        exp: Math.floor(Date.now() / 1000) + 3600
      }))}.signature`;
      
      localStorage.setItem('token', validToken);
      axios.get.mockResolvedValueOnce({ data: mockUser });

      const result = await authService.initialize();

      expect(result).toEqual({
        isAuthenticated: true,
        user: mockUser
      });
    });

    it('should handle expired token by refreshing', async () => {
      const expiredToken = `header.${btoa(JSON.stringify({
        exp: Math.floor(Date.now() / 1000) - 3600
      }))}.signature`;
      
      const newToken = 'new-test-token';
      
      localStorage.setItem('token', expiredToken);
      
      // Mock refresh token response
      axios.post.mockResolvedValueOnce({ 
        data: { 
          token: newToken,
          user: mockUser
        } 
      });

      const result = await authService.initialize();

      expect(axios.post).toHaveBeenCalledWith(`${API_BASE_URL}/auth/refresh-token`);
      expect(localStorage.setItem).toHaveBeenCalledWith('token', newToken);
      expect(result).toEqual({
        isAuthenticated: true,
        user: mockUser
      });
    });

    it('should handle invalid token', async () => {
      localStorage.setItem('token', 'invalid-token');
      
      const result = await authService.initialize();

      expect(result).toEqual({
        isAuthenticated: false,
        user: null
      });
    });
  });

  describe('changePassword', () => {
    it('should change the user password', async () => {
      const currentPassword = 'oldPassword123!';
      const newPassword = 'newPassword123!';
      const mockResponse = { success: true };
      
      axios.put.mockResolvedValueOnce({ data: mockResponse });

      const result = await authService.changePassword(currentPassword, newPassword);

      expect(axios.put).toHaveBeenCalledWith(
        `${API_BASE_URL}/auth/change-password`,
        { currentPassword, newPassword }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset email', async () => {
      const email = 'test@example.com';
      const mockResponse = { success: true };
      
      axios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await authService.forgotPassword(email);

      expect(axios.post).toHaveBeenCalledWith(
        `${API_BASE_URL}/auth/forgot-password`,
        { email }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('resetPassword', () => {
    it('should reset password with token', async () => {
      const token = 'reset-token-123';
      const newPassword = 'newPassword123!';
      const mockResponse = { success: true };
      
      axios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await authService.resetPassword(token, newPassword);

      expect(axios.post).toHaveBeenCalledWith(
        `${API_BASE_URL}/auth/reset-password`,
        { token, newPassword }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('verifyEmail', () => {
    it('should verify email with token', async () => {
      const token = 'verify-token-123';
      const mockResponse = { success: true };
      
      axios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await authService.verifyEmail(token);

      expect(axios.post).toHaveBeenCalledWith(
        `${API_BASE_URL}/auth/verify-email`,
        { token }
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
