import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentAPI } from '../../services/api.service';
import { FaUniversity, FaFileAlt, FaCheckCircle, FaBriefcase, FaArrowRight } from 'react-icons/fa';

const StudentHome = () => {
  const [stats, setStats] = useState({
    applications: 0,
    admissions: 0,
    documents: 0,
    jobApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [applicationsRes, admissionsRes, documentsRes, jobsRes, jobAppsRes] = await Promise.all([
        studentAPI.getMyApplications(),
        studentAPI.getMyAdmissions(),
        studentAPI.getMyDocuments(),
        studentAPI.getAvailableJobs(),
        studentAPI.getMyJobApplications()
      ]);

      setStats({
        applications: applicationsRes.data.data.length,
        admissions: admissionsRes.data.data.length,
        documents: documentsRes.data.data.length,
        jobApplications: jobAppsRes.data.data.length
      });

      setRecentApplications(applicationsRes.data.data.slice(0, 5));
      setRecentJobs(jobsRes.data.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.applications}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaFileAlt className="text-blue-600 text-2xl" />
            </div>
          </div>
          <Link
            to="/student/applications"
            className="text-blue-600 text-sm font-medium mt-4 inline-flex items-center hover:underline"
          >
            View All <FaArrowRight className="ml-1" size={12} />
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Admissions</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.admissions}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FaCheckCircle className="text-green-600 text-2xl" />
            </div>
          </div>
          <Link
            to="/student/admissions"
            className="text-green-600 text-sm font-medium mt-4 inline-flex items-center hover:underline"
          >
            View All <FaArrowRight className="ml-1" size={12} />
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Documents</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.documents}</p>
            </div>
            <div className="bg-teal-100 p-3 rounded-lg">
              <FaFileAlt className="text-teal-600 text-2xl" />
            </div>
          </div>
          <Link
            to="/student/documents"
            className="text-teal-600 text-sm font-medium mt-4 inline-flex items-center hover:underline"
          >
            Manage <FaArrowRight className="ml-1" size={12} />
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Job Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.jobApplications}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <FaBriefcase className="text-orange-600 text-2xl" />
            </div>
          </div>
          <Link
            to="/student/job-applications"
            className="text-orange-600 text-sm font-medium mt-4 inline-flex items-center hover:underline"
          >
            View All <FaArrowRight className="ml-1" size={12} />
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-primary-500 to-teal-600 rounded-xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Apply to Institutions</h3>
          <p className="mb-6 opacity-90">
            Browse available courses and submit your applications to top institutions in Lesotho.
          </p>
          <Link
            to="/student/institutions"
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold inline-flex items-center hover:bg-gray-100 transition"
          >
            Browse Now <FaArrowRight className="ml-2" />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Find Jobs</h3>
          <p className="mb-6 opacity-90">
            Explore job opportunities that match your qualifications and career goals.
          </p>
          <Link
            to="/student/jobs"
            className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold inline-flex items-center hover:bg-gray-100 transition"
          >
            Explore Jobs <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      {/* Recent Applications */}
      {recentApplications.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Recent Applications</h3>
            <Link
              to="/student/applications"
              className="text-primary-600 text-sm font-medium hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{app.courseName}</p>
                  <p className="text-sm text-gray-500">{app.institutionName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  app.status === 'admitted' ? 'bg-green-100 text-green-800' :
                  app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Jobs */}
      {recentJobs.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Recommended Jobs</h3>
            <Link
              to="/student/jobs"
              className="text-primary-600 text-sm font-medium hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{job.title}</p>
                  <p className="text-sm text-gray-500">{job.companyName} • {job.location}</p>
                </div>
                <Link
                  to={`/student/jobs`}
                  className="text-primary-600 text-sm font-medium hover:underline"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHome;