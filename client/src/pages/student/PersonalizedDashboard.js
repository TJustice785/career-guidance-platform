import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import ApplicationForm from './ApplicationForm';
import { FaGraduationCap, FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaClock, FaStar, FaFilter, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { calculatePoints, calculateCredits, getRecommendedCourses, getRecommendedJobs, canApplyToCourse, canApplyToJob } from '../../utils/qualificationMatcher';

const PersonalizedDashboard = () => {
  const { userData } = useAuth();
  const [courses, setCourses] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [applicationType, setApplicationType] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, recommended, available
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [showAllCompanies, setShowAllCompanies] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all courses (no index required)
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const allCourses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter and sort in JavaScript
      const activeCourses = allCourses
        .filter(course => course.isActive === true || course.status === 'active' || !course.status)
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      
      setCourses(activeCourses);

      // Fetch all jobs (no index required)
      const jobsSnapshot = await getDocs(collection(db, 'jobs'));
      const allJobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter and sort in JavaScript
      const activeJobs = allJobs
        .filter(job => job.status === 'active' || job.status === 'open' || !job.status)
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        });
      
      setJobs(activeJobs);

      // Fetch all companies (no index required)
      const companiesSnapshot = await getDocs(collection(db, 'companies'));
      const allCompanies = companiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort in JavaScript
      const sortedCompanies = allCompanies.sort((a, b) => 
        (a.name || '').localeCompare(b.name || '')
      );
      
      setCompanies(sortedCompanies);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getRecommendedCoursesLocal = () => {
    if (!userData?.subjects || userData.subjects.length === 0) return [];
    
    // Use the qualification matcher from utils
    const recommendedCourses = getRecommendedCourses(userData, courses);
    return recommendedCourses;
  };

  const getRecommendedJobsLocal = () => {
    if (!userData?.subjects || userData.subjects.length === 0) return [];
    
    // Use the qualification matcher from utils  
    const recommendedJobs = getRecommendedJobs(userData, jobs);
    return recommendedJobs;
  };

  const getGradeLevel = (grade) => {
    const gradeLevels = {
      'Grade 9': 1, 'Grade 10': 2, 'Grade 11': 3, 'Grade 12': 4,
      'Certificate': 5, 'Diploma': 6, 'Bachelor\'s': 7, 'Master\'s': 8
    };
    return gradeLevels[grade] || 0;
  };

  const getExperienceLevel = (level) => {
    const levels = {
      'Entry Level': 1, 'Junior': 2, 'Mid Level': 3, 'Senior': 4, 'Expert': 5
    };
    return levels[level] || 0;
  };

  const handleApply = (item, type) => {
    setSelectedItem(item);
    setApplicationType(type);
    setShowApplicationForm(true);
  };

  const handleApplicationSuccess = () => {
    toast.success('Application submitted successfully!');
    setShowApplicationForm(false);
    setSelectedItem(null);
  };

  const getFilteredData = () => {
    switch (filterType) {
      case 'recommended':
        return {
          courses: getRecommendedCoursesLocal(),
          jobs: getRecommendedJobsLocal(),
          companies: companies
        };
      case 'available':
        return {
          courses: courses.filter(course => course.isActive),
          jobs: jobs.filter(job => job.status === 'active' || job.status === 'open'),
          companies: companies
        };
      default:
        return { courses, jobs, companies };
    }
  };

  const filteredData = getFilteredData();

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Personalized Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Discover opportunities tailored to your qualifications
        </p>
      </div>

      {/* Academic Stats Card - Modern Design */}
      {userData?.subjects && userData.subjects.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-700 p-[1px] shadow-2xl mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-teal-500/20 animate-pulse"></div>
          
          <div className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Your Academic Profile</h2>
              <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold">Active</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              {/* Subjects */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/5 rounded-xl"></div>
                <div className="relative text-center p-4">
                  <div className="text-4xl font-bold font-mono text-white mb-1">{userData.subjects.length}</div>
                  <div className="text-sm text-white/80 uppercase tracking-wider font-semibold">Subjects</div>
                </div>
              </div>
              
              {/* Credits */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-xl"></div>
                <div className="relative text-center p-4 border-x border-white/20">
                  <div className="text-4xl font-bold font-mono text-white mb-1">
                    {calculateCredits(userData.subjects)}
                  </div>
                  <div className="text-sm text-white/80 uppercase tracking-wider font-semibold">Credits (C+)</div>
                </div>
              </div>
              
              {/* Total Points */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/5 rounded-xl"></div>
                <div className="relative text-center p-4">
                  <div className="text-4xl font-bold font-mono text-white mb-1">{calculatePoints(userData.subjects)}</div>
                  <div className="text-sm text-white/80 uppercase tracking-wider font-semibold">Total Points</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs - Modern Design */}
      <div className="bg-white dark:bg-dark-100 rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilterType('all')}
            className={`group relative px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              filterType === 'all' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50 scale-105' 
                : 'bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300 hover:scale-105'
            }`}
          >
            <span className="text-sm uppercase tracking-wider font-mono">All Opportunities</span>
            {filterType === 'all' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </button>
          
          <button
            onClick={() => setFilterType('recommended')}
            className={`group relative px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              filterType === 'recommended' 
                ? 'bg-gradient-to-r from-teal-600 to-cyan-700 text-white shadow-lg shadow-teal-500/50 scale-105' 
                : 'bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300 hover:scale-105'
            }`}
          >
            <span className="text-sm uppercase tracking-wider font-mono">Recommended for You</span>
            {filterType === 'recommended' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </button>
          
          <button
            onClick={() => setFilterType('available')}
            className={`group relative px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              filterType === 'available' 
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/50 scale-105' 
                : 'bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300 hover:scale-105'
            }`}
          >
            <span className="text-sm uppercase tracking-wider font-mono">Currently Available</span>
            {filterType === 'available' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </button>
        </div>
      </div>

      {/* Student Qualifications Summary - Modern Design */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-200 to-dark-300 p-6 mb-6 border border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Your Qualifications</h2>
            <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">Profile</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Level */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-dark-300/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 group-hover:border-blue-500/50 transition-all">
                <h3 className="text-sm font-mono uppercase tracking-wider text-gray-400 mb-2">Current Level</h3>
                <p className="text-white font-semibold">{userData?.currentGrade || 'Not specified'}</p>
              </div>
            </div>
            
            {/* Subjects */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-dark-300/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 group-hover:border-purple-500/50 transition-all">
                <h3 className="text-sm font-mono uppercase tracking-wider text-gray-400 mb-2">Subjects</h3>
                <p className="text-white font-semibold">
                  {userData?.subjects?.length > 0 
                    ? userData.subjects.join(', ') 
                    : 'Not specified'
                  }
                </p>
              </div>
            </div>
            
            {/* Previous School */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-dark-300/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 group-hover:border-green-500/50 transition-all">
                <h3 className="text-sm font-mono uppercase tracking-wider text-gray-400 mb-2">Previous School</h3>
                <p className="text-white font-semibold">{userData?.previousSchool || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section - Modern Design */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Courses & Programs</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {filteredData.courses.length} opportunities available
            </p>
          </div>
          <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
            <span className="text-sm font-mono uppercase tracking-wider text-blue-400 font-semibold">
              {filteredData.courses.length}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(showAllCourses ? filteredData.courses : filteredData.courses.slice(0, 6)).map(course => {
            const qualCheck = userData?.subjects ? canApplyToCourse(userData, course) : null;
            return (
              <div key={course.id} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-dark-100 border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative p-6">
                  {/* Header with title and match score */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {course.name}
                    </h3>
                    {qualCheck && (
                      <div className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold ${
                        qualCheck.canApply 
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30'
                          : qualCheck.score >= 50
                          ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30'
                      }`}>
                        {qualCheck.score}%
                      </div>
                    )}
                  </div>
                  
                  {/* Course details - Modern badges */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{course.institutionName}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {course.fees?.local ? `M${course.fees.local}` : 'Contact for fees'}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.category && (
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-mono uppercase tracking-wider rounded-full border border-blue-500/30">
                        {course.category}
                      </span>
                    )}
                    {course.level && (
                      <span className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-mono uppercase tracking-wider rounded-full border border-green-500/30">
                        {course.level}
                      </span>
                    )}
                  </div>

                  {/* Apply button */}
                  <button
                    onClick={() => handleApply(course, 'course')}
                    disabled={qualCheck && !qualCheck.canApply}
                    className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      qualCheck && !qualCheck.canApply
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl hover:scale-105'
                    }`}
                  >
                    <span className="text-sm uppercase tracking-wider">
                      {qualCheck && !qualCheck.canApply ? 'Not Qualified' : 'Apply Now'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredData.courses.length > 6 && (
          <div className="text-center mt-8">
            <button 
              onClick={() => setShowAllCourses(!showAllCourses)}
              className="group px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span className="text-sm uppercase tracking-wider">
                {showAllCourses ? 'Show Less' : `View All Courses (${filteredData.courses.length})`}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Jobs Section - Modern Design */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Job Opportunities</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {filteredData.jobs.length} positions available
            </p>
          </div>
          <div className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30">
            <span className="text-sm font-mono uppercase tracking-wider text-purple-400 font-semibold">
              {filteredData.jobs.length}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(showAllJobs ? filteredData.jobs : filteredData.jobs.slice(0, 6)).map(job => {
            const jobQualCheck = userData?.subjects ? canApplyToJob(userData, job) : null;
            return (
              <div key={job.id} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-dark-100 border border-gray-200 dark:border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative p-6">
                  {/* Header with title and match score */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {job.title}
                    </h3>
                    {jobQualCheck && (
                      <div className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold ${
                        jobQualCheck.canApply 
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30'
                          : jobQualCheck.score >= 50
                          ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30'
                      }`}>
                        {jobQualCheck.score}%
                      </div>
                    )}
                  </div>
                  
                  {/* Job details - Modern badges */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{job.location}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{job.type}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-3"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{job.salary}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.category && (
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-mono uppercase tracking-wider rounded-full border border-purple-500/30">
                        {job.category}
                      </span>
                    )}
                    {job.companyName && (
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-mono uppercase tracking-wider rounded-full border border-blue-500/30">
                        {job.companyName}
                      </span>
                    )}
                  </div>

                  {/* Apply button */}
                  <button
                    onClick={() => handleApply(job, 'job')}
                    disabled={jobQualCheck && !jobQualCheck.canApply}
                    className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      jobQualCheck && !jobQualCheck.canApply
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl hover:scale-105'
                    }`}
                  >
                    <span className="text-sm uppercase tracking-wider">
                      {jobQualCheck && !jobQualCheck.canApply ? 'Not Qualified' : 'Apply Now'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredData.jobs.length > 6 && (
          <div className="text-center mt-8">
            <button 
              onClick={() => setShowAllJobs(!showAllJobs)}
              className="group px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full font-semibold hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span className="text-sm uppercase tracking-wider">
                {showAllJobs ? 'Show Less' : `View All Jobs (${filteredData.jobs.length})`}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Companies Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <FaBriefcase className="mr-2" />
          Companies & Organizations
          <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
            ({filteredData.companies.length} available)
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(showAllCompanies ? filteredData.companies : filteredData.companies.slice(0, 8)).map(company => (
            <div key={company.id} className="bg-white dark:bg-dark-100 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{company.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{company.industry}</p>
              <p className="text-gray-700 dark:text-gray-300 text-xs line-clamp-2">
                {company.description}
              </p>
            </div>
          ))}
        </div>

        {filteredData.companies.length > 8 && (
          <div className="text-center mt-4">
            <button 
              onClick={() => setShowAllCompanies(!showAllCompanies)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {showAllCompanies ? 'Show Less' : `View All Companies (${filteredData.companies.length})`}
            </button>
          </div>
        )}
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && selectedItem && (
        <ApplicationForm
          type={applicationType}
          itemId={selectedItem.id}
          itemName={selectedItem.name || selectedItem.title}
          companyId={applicationType === 'job' ? selectedItem.companyId : undefined}
          onClose={() => {
            setShowApplicationForm(false);
            setSelectedItem(null);
          }}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};

export default PersonalizedDashboard;
