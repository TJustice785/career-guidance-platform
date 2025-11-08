import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaGraduationCap, 
  FaUsers, 
  FaBook, 
  FaChartLine,
  FaUserGraduate,
  FaClipboardCheck,
  FaPlus,
  FaCertificate
} from 'react-icons/fa';

export default function InstituteDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    completedCourses: 0,
    pendingApplications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalStudents: 342,
        activeCourses: 18,
        completedCourses: 156,
        pendingApplications: 23
      });
      setLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ icon: Icon, title, value, gradient }) => (
    <div className="card-glass card-hover animate-scale-in overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-32 h-32 ${gradient} opacity-10 rounded-full -mr-16 -mt-16`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${gradient} shadow-lg`}>
            <Icon className="text-white text-2xl" />
          </div>
        </div>
        <h3 className="text-secondary text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-primary">
          {loading ? (
            <span className="inline-block w-20 h-8 bg-gray-200 rounded animate-pulse"></span>
          ) : (
            value
          )}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-gradient-primary mb-2">
          Welcome, {user?.firstName || 'Institute'}! 🏫
        </h1>
        <p className="text-secondary text-lg">Manage your courses and track student progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FaUsers}
          title="Total Students"
          value={stats.totalStudents}
          gradient="gradient-primary"
        />
        <StatCard
          icon={FaBook}
          title="Active Courses"
          value={stats.activeCourses}
          gradient="gradient-success"
        />
        <StatCard
          icon={FaCertificate}
          title="Completed Courses"
          value={stats.completedCourses}
          gradient="gradient-purple"
        />
        <StatCard
          icon={FaClipboardCheck}
          title="Pending Applications"
          value={stats.pendingApplications}
          gradient="gradient-warning"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enrollments */}
        <div className="lg:col-span-2 card-glass animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary">Recent Enrollments</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="text-center text-muted py-12">
            <div className="mb-4 text-6xl">🎓</div>
            <p className="text-lg font-medium mb-2 text-primary">No recent enrollments</p>
            <p className="text-sm text-secondary">Student enrollments will appear here</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-glass animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-bold text-primary mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full btn-primary py-3 rounded-xl shadow-colored-blue hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              <FaPlus className="inline mr-2" />
              Add New Course
            </button>
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl shadow-colored-green hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium">
              <FaUserGraduate className="inline mr-2" />
              Manage Students
            </button>
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl shadow-colored-purple hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium">
              <FaChartLine className="inline mr-2" />
              View Reports
            </button>
            <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium">
              <FaClipboardCheck className="inline mr-2" />
              Review Applications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
