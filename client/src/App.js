import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import MainLayout from './layouts/MainLayout';


// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Dashboard pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import InstituteDashboard from './pages/institute/InstituteDashboard';
import CompanyDashboard from './pages/company/CompanyDashboard';
import SeedDatabase from './pages/admin/SeedDatabase';
import CreateAdmin from './pages/CreateAdmin';
import FixAdminUser from './pages/FixAdminUser';
import DiagnosticPage from './pages/DiagnosticPage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userData, loading, isAuthenticated, hasRole } = useAuth();

  console.log('ProtectedRoute - Loading:', loading, 'User:', currentUser?.email, 'UserData:', userData); // Debug

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }

  // Temporarily disabled email verification check for development
  // Uncomment this block in production to enforce email verification
  /*
  if (!userData?.emailVerified && userData?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verification Required</h2>
          <p className="text-gray-600 mb-6">
            Please verify your email address to access your dashboard. Check your inbox for the verification link.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            I've Verified My Email
          </button>
        </div>
      </div>
    );
  }
  */

  if (allowedRoles && !allowedRoles.some(role => hasRole(role))) {
    console.log('User role not allowed. Required:', allowedRoles, 'User has:', userData?.role);
    return <Navigate to="/" />;
  }

  console.log('Access granted, rendering dashboard');
  return children;
};

// Public Route (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { currentUser, userData } = useAuth();

  if (currentUser && userData) {
    const dashboardMap = {
      admin: '/admin',
      student: '/student',
      institute: '/institute',
      company: '/company'
    };
    return <Navigate to={dashboardMap[userData.role] || '/'} />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <MainLayout><LoginPage /></MainLayout>
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <MainLayout><RegisterPage /></MainLayout>
              </PublicRoute>
            } 
          />
          <Route path="/forgot-password" element={<MainLayout><ForgotPasswordPage /></MainLayout>} />
          
          {/* Admin Setup - Remove this route after creating admin */}
          <Route path="/create-admin" element={<CreateAdmin />} />
          <Route path="/fix-admin" element={<FixAdminUser />} />
          
          {/* Database Seeder - Remove this route after initial setup */}
          <Route path="/seed-database" element={<SeedDatabase />} />
          
          {/* Diagnostic Page - For debugging */}
          <Route path="/diagnostics" element={<DiagnosticPage />} />

          {/* Protected Routes - Admin */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Student */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Institute */}
          <Route
            path="/institute/*"
            element={
              <ProtectedRoute allowedRoles={['institute']}>
                <InstituteDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Company */}
          <Route
            path="/company/*"
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
