import { ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name?: string;
  roles: string[];
  [key: string]: any; // Allow additional user properties
}

export interface AuthContextType {
  /**
   * The currently authenticated user or null if not authenticated
   */
  user: User | null;
  
  /**
   * Loading state for authentication operations
   */
  loading: boolean;
  
  /**
   * Error message from the last authentication operation
   */
  error: string | null;
  
  /**
   * Log in a user with email and password
   * @param email User's email address
   * @param password User's password
   * @returns Promise that resolves with success status and optional error
   */
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  
  /**
   * Register a new user
   * @param userData User registration data
   * @returns Promise that resolves with success status and optional error
   */
  register: (userData: Record<string, any>) => Promise<{ success: boolean; error?: string }>;
  
  /**
   * Log out the current user
   * @param message Optional message to display after logout
   */
  logout: (message?: string) => void;
  
  /**
   * Update the current user's profile
   * @param userData Updated user data
   * @returns Promise that resolves with success status and optional error
   */
  updateUser: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  
  /**
   * Check if the current user has a specific role
   * @param role Role or array of roles to check
   * @returns boolean indicating if the user has the required role(s)
   */
  hasRole: (role: string | string[]) => boolean;
  
  /**
   * Refresh the authentication token
   * @returns Promise that resolves with success status
   */
  refreshToken: () => Promise<boolean>;
}

/**
 * Props for the AuthProvider component
 */
export interface AuthProviderProps {
  /**
   * Child components that will have access to the auth context
   */
  children: ReactNode;
}

/**
 * Props for the ProtectedRoute component
 */
export interface ProtectedRouteProps {
  /**
   * Child components to render if access is allowed
   */
  children: ReactNode;
  
  /**
   * Array of allowed role names (user must have at least one)
   */
  allowedRoles?: string[];
  
  /**
   * Whether authentication is required (default: true)
   */
  requireAuth?: boolean;
  
  /**
   * Custom redirect path when access is denied
   */
  redirectTo?: string;
}
