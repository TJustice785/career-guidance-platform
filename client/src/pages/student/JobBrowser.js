import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import ApplicationForm from './ApplicationForm';
import { FaMapMarkerAlt, FaBriefcase, FaDollarSign, FaClock, FaBuilding } from 'react-icons/fa';
import toast from 'react-hot-toast';

const JobBrowser = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const categories = [
    'Technology', 'Business', 'Education', 'Healthcare', 'Finance',
    'Marketing', 'Engineering', 'Administration', 'Customer Service', 'Other'
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      console.log('Fetching jobs from Firestore...');
      
      const snapshot = await getDocs(collection(db, 'jobs'));
      console.log('Jobs snapshot received, count:', snapshot.size);
      
      const allJobs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Filter active jobs
      const activeJobs = allJobs.filter(job => 
        job.status === 'active' || job.status === 'open' || !job.status
      );
      
      console.log('Active jobs found:', activeJobs.length);
      setJobs(activeJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
  };

  const handleApplicationSuccess = () => {
    toast.success('Application submitted successfully!');
    setShowApplicationForm(false);
    setSelectedJob(null);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || job.category === category;
    const matchesLocation = !location || job.location?.toLowerCase().includes(location.toLowerCase());
    return matchesSearch && matchesCategory && matchesLocation;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Jobs</h1>
        <p className="text-gray-600">Find your next career opportunity</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Jobs
            </label>
            <input
              type="text"
              placeholder="Job title, company, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="City or region..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setCategory('');
                setLocation('');
              }}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <FaBriefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-900 mr-3">{job.title}</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {job.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <FaBuilding className="mr-2" />
                    <span className="mr-4">{job.companyName}</span>
                    <FaMapMarkerAlt className="mr-2" />
                    <span className="mr-4">{job.location}</span>
                    <FaClock className="mr-2" />
                    <span>{job.type}</span>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.category && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {job.category}
                      </span>
                    )}
                    {job.salary && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center">
                        <FaDollarSign className="mr-1" />
                        {job.salary}
                      </span>
                    )}
                    {job.experience && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                        {job.experience}
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-500">
                    Posted: {new Date(job.createdAt).toLocaleDateString() || 'Recently'}
                  </div>
                </div>

                <div className="ml-6">
                  <button
                    onClick={() => handleApply(job)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && selectedJob && (
        <ApplicationForm
          type="job"
          itemId={selectedJob.id}
          itemName={selectedJob.title}
          companyId={selectedJob.companyId}
          onClose={() => {
            setShowApplicationForm(false);
            setSelectedJob(null);
          }}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};

export default JobBrowser;
