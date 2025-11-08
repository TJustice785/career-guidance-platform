import axios from 'axios';
import { API_BASE_URL } from '../config';

const AUTH_API_URL = `${API_BASE_URL}/auth`;

const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await axios.post(`${AUTH_API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data || { error: 'Registration failed' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await axios.post(`${AUTH_API_URL}/login`, credentials);
      
      // Store the token in local storage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        this.setAuthToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  // Logout user
  logout: () => {
    // Remove token from local storage
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  },

  // Set the authentication token in the axios headers
  setAuthToken: (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${AUTH_API_URL}/me`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error.response?.data || { error: 'Failed to fetch user profile' };
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await axios.put(`${AUTH_API_URL}/profile`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error.response?.data || { error: 'Failed to update profile' };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await axios.put(`${AUTH_API_URL}/change-password`, {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error.response?.data || { error: 'Failed to change password' };
    }
  },

  // Request password reset
  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${AUTH_API_URL}/forgot-password`, { email });
      return response.data;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error.response?.data || { error: 'Failed to request password reset' };
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    try {
      const response = await axios.post(`${AUTH_API_URL}/reset-password`, {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error.response?.data || { error: 'Failed to reset password' };
    }
  },

  // Verify email with token
  verifyEmail: async (token) => {
    try {
      const response = await axios.post(`${AUTH_API_URL}/verify-email`, { token });
      return response.data;
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error.response?.data || { error: 'Failed to verify email' };
    }
  },

  // Refresh access token
  refreshToken: async () => {
    try {
      const response = await axios.post(`${AUTH_API_URL}/refresh-token`);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        this.setAuthToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout();
      throw error;
    }
  },

  // Initialize auth state
  initialize: async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      this.setAuthToken(token);
      
      // Check if token is valid
      if (this.isAuthenticated()) {
        try {
          const user = await this.getCurrentUser();
          return { isAuthenticated: true, user };
        } catch (error) {
          console.error('Error initializing auth:', error);
          this.logout();
          return { isAuthenticated: false, user: null };
        }
      } else {
        // Try to refresh token if expired
        try {
          const data = await this.refreshToken();
          if (data.token) {
            const user = await this.getCurrentUser();
            return { isAuthenticated: true, user };
          }
        } catch (error) {
          console.error('Error refreshing token:', error);
          this.logout();
        }
      }
    }
    
    return { isAuthenticated: false, user: null };
  },
};

export default authService;
