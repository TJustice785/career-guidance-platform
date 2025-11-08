import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api.service';
import { toast } from 'react-toastify';
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

const JobApplications = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });

  useEffect(() => {
    fetchJobApplications();
  }, [filters]);

  const fetchJobApplications = async () => {
    try {
      setLoading(true);
      const response = await api.student.getJobApplications({
        status: filters.status === 'all' ? '' : filters.status,
        search: filters.search
      });
      setApplications(response.data || []);
    } catch (error) {
      console.error('Error fetching job applications:', error);
      toast.error('Failed to load job applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status }));
  };

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            Applied
          </span>
        );
      case 'shortlisted':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Shortlisted
          </span>
        );
      case 'interview':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
            Interview
          </span>
        );
      case 'hired':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Hired
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'hired':
        return <FaCheckCircle className="text-green-500 mr-1" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-500 mr-1" />;
      default:
        return <FaHourglassHalf className="text-yellow-500 mr-1" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = filters.search === '' || 
      app.jobTitle?.toLowerCase().includes(filters.search.toLowerCase()) ||
      app.companyName?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || 
      app.status?.toLowerCase() === filters.status.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Job Applications</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track the status of your job applications
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search jobs or companies..."
                value={filters.search}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <button
              onClick={() => handleStatusFilter('all')}
              className={`px-3 py-1 text-sm rounded-full ${
                filters.status === 'all'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilter('applied')}
              className={`px-3 py-1 text-sm rounded-full flex items-center ${
                filters.status === 'applied'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Applied
            </button>
            <button
              onClick={() => handleStatusFilter('shortlisted')}
              className={`px-3 py-1 text-sm rounded-full flex items-center ${
                filters.status === 'shortlisted'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Shortlisted
            </button>
            <button
              onClick={() => handleStatusFilter('interview')}
              className={`px-3 py-1 text-sm rounded-full flex items-center ${
                filters.status === 'interview'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Interview
            </button>
          </div>
        </div>
      </div>

      {/* Application List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <FaBriefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.status === 'all' 
                ? "You haven't applied to any jobs yet."
                : `No ${filters.status} applications found.`}
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/browse/jobs')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaBriefcase className="-ml-1 mr-2 h-5 w-5" />
                Browse Jobs
              </button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredApplications.map((application) => (
              <li key={application.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-md bg-indigo-100 flex items-center justify-center">
                        <FaBriefcase className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-indigo-600">
                            {application.jobTitle}
                          </h3>
                          <div className="ml-2">
                            {getStatusBadge(application.status)}
                          </div>
                        </div>
                        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <FaBuilding className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {application.companyName}
                          </div>
                          {application.location && (
                            <div className="flex items-center text-sm text-gray-500">
                              <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {application.location}
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-500">
                            <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            Applied on {formatDate(application.appliedAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        onClick={() => navigate(`/jobs/${application.jobId}`)}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        View Job
                      </button>
                    </div>
                  </div>
                  
                  {/* Status Timeline */}
                  <div className="mt-4">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="flex-1 flex items-center">
                            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-indigo-600 rounded-full"
                                style={{ 
                                  width: application.status === 'applied' ? '25%' : 
                                         application.status === 'shortlisted' ? '50%' :
                                         application.status === 'interview' ? '75%' : '100%'
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                          <div className={`text-center ${application.status === 'applied' ? 'text-indigo-600 font-medium' : ''}`}>
                            <div className="flex flex-col items-center">
                              {getStatusIcon('applied')}
                              <span>Applied</span>
                            </div>
                          </div>
                          <div className={`text-center ${application.status === 'shortlisted' ? 'text-indigo-600 font-medium' : ''}`}>
                            <div className="flex flex-col items-center">
                              {application.status === 'shortlisted' || 
                              application.status === 'interview' || 
                              application.status === 'hired' ? 
                                <FaCheckCircle className="text-green-500" /> : 
                                <FaHourglassHalf className="text-gray-400" />}
                              <span>Shortlisted</span>
                            </div>
                          </div>
                          <div className={`text-center ${application.status === 'interview' ? 'text-indigo-600 font-medium' : ''}`}>
                            <div className="flex flex-col items-center">
                              {application.status === 'interview' || 
                              application.status === 'hired' ? 
                                <FaCheckCircle className="text-green-500" /> : 
                                <FaHourglassHalf className="text-gray-400" />}
                              <span>Interview</span>
                            </div>
                          </div>
                          <div className={`text-center ${application.status === 'hired' ? 'text-indigo-600 font-medium' : ''}`}>
                            <div className="flex flex-col items-center">
                              {application.status === 'hired' ? 
                                <FaCheckCircle className="text-green-500" /> : 
                                application.status === 'rejected' ?
                                <FaTimesCircle className="text-red-500" /> :
                                <FaHourglassHalf className="text-gray-400" />}
                              <span>{application.status === 'rejected' ? 'Not Selected' : 'Hired'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {application.status === 'interview' && application.interviewDetails && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-md">
                      <h4 className="text-sm font-medium text-blue-800">Interview Scheduled</h4>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-blue-700">Date & Time</p>
                          <p className="text-sm font-medium text-blue-900">
                            {new Date(application.interviewDetails.dateTime).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-blue-700">Type</p>
                          <p className="text-sm font-medium text-blue-900 capitalize">
                            {application.interviewDetails.type || 'Not specified'}
                          </p>
                        </div>
                        {application.interviewDetails.location && (
                          <div>
                            <p className="text-xs text-blue-700">Location</p>
                            <p className="text-sm font-medium text-blue-900">
                              {application.interviewDetails.location}
                            </p>
                          </div>
                        )}
                        {application.interviewDetails.additionalInfo && (
                          <div className="md:col-span-2">
                            <p className="text-xs text-blue-700">Additional Information</p>
                            <p className="text-sm text-blue-900">
                              {application.interviewDetails.additionalInfo}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default JobApplications;
