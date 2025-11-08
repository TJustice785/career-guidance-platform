import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api.service';

// Icons
import { FaGraduationCap, FaBriefcase, FaFileAlt, FaBell } from 'react-icons/fa';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    applications: 0,
    jobsApplied: 0,
    documents: 0,
    notifications: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all data in parallel
        const [applicationsRes, jobsRes, docsRes, notificationsRes] = await Promise.all([
          api.student.getApplications(),
          api.student.getJobApplications(),
          api.student.getDocuments(),
          api.notifications.getNotifications()
        ]);

        setStats({
          applications: applicationsRes.data?.length || 0,
          jobsApplied: jobsRes.data?.length || 0,
          documents: docsRes.data?.length || 0,
          notifications: notificationsRes.data?.filter(n => !n.read).length || 0
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ icon: Icon, title, value, onClick, color = 'blue', gradient }) => (
    <div 
      onClick={onClick}
      className="card-glass card-hover cursor-pointer animate-scale-in overflow-hidden relative group"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:opacity-20 transition-opacity duration-300`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-4 rounded-xl ${gradient} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={24} className="text-white" />
          </div>
        </div>
        <p className="text-secondary text-sm font-medium mb-2">{title}</p>
        <p className="text-3xl font-bold text-primary">
          {loading ? (
            <span className="inline-block w-16 h-8 bg-gray-200 rounded animate-pulse"></span>
          ) : (
            value
          )}
        </p>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-gradient-primary mb-2">
          Welcome back, {currentUser?.displayName?.split(' ')[0] || 'Student'}! 👋
        </h1>
        <p className="mt-2 text-secondary text-lg">Here's what's happening with your applications and opportunities.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={FaGraduationCap} 
          title="My Applications" 
          value={stats.applications}
          onClick={() => navigate('/student/applications')}
          gradient="gradient-primary"
        />
        <StatCard 
          icon={FaBriefcase} 
          title="Jobs Applied" 
          value={stats.jobsApplied}
          onClick={() => navigate('/student/jobs/applied')}
          gradient="gradient-success"
        />
        <StatCard 
          icon={FaFileAlt} 
          title="My Documents" 
          value={stats.documents}
          onClick={() => navigate('/student/documents')}
          gradient="gradient-warning"
        />
        <StatCard 
          icon={FaBell} 
          title="Notifications" 
          value={stats.notifications}
          onClick={() => navigate('/notifications')}
          gradient="gradient-danger"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="card-glass mb-8 animate-slide-up">
        <div className="px-6 py-5 border-b border-gray-200/50">
          <h3 className="text-xl font-bold text-primary">Recent Activity</h3>
          <p className="mt-1 text-sm text-secondary">Your recent applications and updates</p>
        </div>
        <div className="px-6 py-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner w-12 h-12"></div>
            </div>
          ) : (
            <div className="text-center text-muted py-8">
              <div className="mb-4 text-6xl">📚</div>
              <p className="text-lg font-medium mb-2 text-primary">No recent activity to display</p>
              <p className="text-sm text-secondary mb-6">Start your journey by browsing available courses</p>
              <button
                onClick={() => navigate('/browse/courses')}
                className="btn-primary px-6 py-3 rounded-xl shadow-colored-blue hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Browse Courses
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-glass animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="px-6 py-5 border-b border-gray-200/50">
          <h3 className="text-xl font-bold text-primary">Quick Actions</h3>
        </div>
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/browse/courses')}
              className="group flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:shadow-colored-blue transform hover:scale-105 transition-all duration-300 border-2 border-blue-200/50"
            >
              <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FaGraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Apply to a Course</span>
            </button>
            <button
              onClick={() => navigate('/browse/jobs')}
              className="group flex flex-col items-center justify-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-colored-green transform hover:scale-105 transition-all duration-300 border-2 border-green-200/50"
            >
              <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FaBriefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Find a Job</span>
            </button>
            <button
              onClick={() => navigate('/student/documents/upload')}
              className="group flex flex-col items-center justify-center p-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-yellow-200/50"
            >
              <div className="p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FaFileAlt className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Upload Documents</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
