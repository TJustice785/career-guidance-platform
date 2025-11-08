import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '../AuthContext';
import '@testing-library/jest-dom';

// Mock the API module
jest.mock('../../services/api', () => ({
  auth: {
    login: jest.fn(),
    register: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
  },
  users: {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
  },
  cancelToken: {
    cancel: jest.fn(),
  },
}));

// Mock the toast
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Helper component to test the context
const TestComponent = () => {
  const { user, login, logout, register, updateUser, hasRole } = useAuth();
  const location = useLocation();
  
  return (
    <div>
      <div data-testid="user">{JSON.stringify(user)}</div>
      <div data-testid="pathname">{location.pathname}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
      <button onClick={() => register({ email: 'test@example.com', password: 'password' })}>Register</button>
      <button onClick={() => updateUser({ name: 'New Name' })}>Update User</button>
      <div data-testid="isAdmin">{hasRole('admin') ? 'true' : 'false'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: MemoryRouter });
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  it('should initialize with no user', () => {
    renderWithRouter(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  it('should handle successful login', async () => {
    const mockUser = { id: '1', email: 'test@example.com', roles: ['user'] };
    const mockToken = 'test-token';
    
    // Mock the API response
    require('../../services/api').auth.login.mockResolvedValueOnce({
      data: {
        data: {
          token: mockToken,
          user: mockUser,
          expiresIn: 3600,
        },
      },
    });

    renderWithRouter(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Trigger login
    await act(async () => {
      screen.getByText('Login').click();
    });

    // Check if login was called with correct parameters
    expect(require('../../services/api').auth.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });

    // Check if token was stored
    expect(localStorage.getItem('token')).toBe(mockToken);
    
    // Check if user was set
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toContain('test@example.com');
    });
  });

  it('should handle login error', async () => {
    // Mock a failed login
    require('../../services/api').auth.login.mockRejectedValueOnce({
      response: {
        data: { message: 'Invalid credentials' },
      },
    });

    renderWithRouter(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Trigger login
    await act(async () => {
      screen.getByText('Login').click();
    });

    // Check if error toast was shown
    expect(require('react-toastify').toast.error).toHaveBeenCalledWith('Invalid credentials');
  });

  it('should handle logout', async () => {
    // Set up initial state with a logged-in user
    localStorage.setItem('token', 'test-token');
    
    renderWithRouter(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Mock the getProfile response
    require('../../services/api').users.getProfile.mockResolvedValueOnce({
      data: {
        data: { id: '1', email: 'test@example.com', roles: ['user'] },
      },
    });

    // Wait for the user to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toContain('test@example.com');
    });

    // Trigger logout
    await act(async () => {
      screen.getByText('Logout').click();
    });

    // Check if token was removed
    expect(localStorage.getItem('token')).toBeNull();
    
    // Check if user was cleared
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  it('should check user roles correctly', async () => {
    // Set up initial state with a logged-in admin user
    localStorage.setItem('token', 'test-token');
    
    renderWithRouter(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Mock the getProfile response with admin role
    require('../../services/api').users.getProfile.mockResolvedValueOnce({
      data: {
        data: { 
          id: '1', 
          email: 'admin@example.com', 
          roles: ['admin', 'user'] 
        },
      },
    });

    // Wait for the user to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toContain('admin@example.com');
    });

    // Check role-based access
    expect(screen.getByTestId('isAdmin').textContent).toBe('true');
  });
});
