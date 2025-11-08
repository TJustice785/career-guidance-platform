import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ProtectedRoute component for handling route protection and role-based access control
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if access is allowed
 * @param {string[]} [props.allowedRoles] - Array of allowed role names (user must have at least one)
 * @param {boolean} [props.requireAuth=true] - Whether authentication is required (default: true)
 * @param {string} [props.redirectTo] - Custom redirect path when access is denied
 * @returns {JSX.Element} Protected route component
 */
const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requireAuth = true,
  redirectTo = '/login',
  ...rest
}) => {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  // Check if user has required role(s)
  const hasRequiredRole = allowedRoles.length === 0 || hasRole(allowedRoles);

  // If user doesn't have required role
  if (requireAuth && !hasRequiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Result
          status="403"
          title="Access Denied"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Button 
              type="primary" 
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  // If all checks pass, render the children
  return children;
};

export default ProtectedRoute;
