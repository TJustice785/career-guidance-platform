import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaHome,
  FaUsers,
  FaGraduationCap,
  FaBriefcase,
  FaNewspaper,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUniversity
} from 'react-icons/fa';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, userData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const menuItems = {
    admin: [
      { icon: FaHome, label: 'Dashboard', path: '/admin' },
      { icon: FaUsers, label: 'Users', path: '/admin/users' },
      { icon: FaUniversity, label: 'Institutions', path: '/admin/institutions' },
      { icon: FaGraduationCap, label: 'Courses', path: '/admin/courses' },
      { icon: FaBriefcase, label: 'Jobs', path: '/admin/jobs' },
      { icon: FaNewspaper, label: 'Applications', path: '/admin/applications' },
      { icon: FaCog, label: 'Settings', path: '/admin/settings' }
    ],
    student: [
      { icon: FaHome, label: 'Dashboard', path: '/student' },
      { icon: FaGraduationCap, label: 'Courses', path: '/student/courses' },
      { icon: FaBriefcase, label: 'Jobs', path: '/student/jobs' },
      { icon: FaNewspaper, label: 'Applications', path: '/student/applications' },
      { icon: FaCog, label: 'Settings', path: '/student/settings' }
    ],
    institute: [
      { icon: FaHome, label: 'Dashboard', path: '/institute' },
      { icon: FaGraduationCap, label: 'Courses', path: '/institute/courses' },
      { icon: FaNewspaper, label: 'Applications', path: '/institute/applications' },
      { icon: FaCog, label: 'Settings', path: '/institute/settings' }
    ],
    company: [
      { icon: FaHome, label: 'Dashboard', path: '/company' },
      { icon: FaBriefcase, label: 'Jobs', path: '/company/jobs' },
      { icon: FaNewspaper, label: 'Applications', path: '/company/applications' },
      { icon: FaCog, label: 'Settings', path: '/company/settings' }
    ]
  };

  const currentMenu = menuItems[userData?.role] || [];

  return (
    <div className="min-h-screen flex dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-64 transition duration-300 transform bg-white dark:bg-gray-800 lg:translate-x-0 lg:static lg:inset-0 shadow-lg lg:shadow-none`}
      >
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-800 dark:text-white">Career Guide</span>
          </div>
        </div>

        <nav className="mt-10 px-6">
          {currentMenu.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="mt-3 flex items-center px-4 py-3 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <item.icon className="w-5 h-5" />
              <span className="mx-4">{item.label}</span>
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="mt-3 flex items-center w-full px-4 py-3 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className="mx-4">Logout</span>
          </button>
        </nav>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 dark:text-gray-200 focus:outline-none lg:hidden"
          >
            {sidebarOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>

          <div className="flex items-center">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {userData?.email}
            </span>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 flex flex-col">
          <div className="container mx-auto px-6 py-8 flex-1">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;