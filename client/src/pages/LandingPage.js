import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase.config';

const LandingPage = () => {
  const [stats, setStats] = useState({
    institutions: 0,
    courses: 0,
    jobs: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [institutionsSnap, coursesSnap, jobsSnap] = await Promise.all([
          getDocs(collection(db, 'institutions')),
          getDocs(collection(db, 'courses')),
          getDocs(query(collection(db, 'jobs'), where('status', '==', 'active')))
        ]);

        setStats({
          institutions: institutionsSnap.size,
          courses: coursesSnap.size,
          jobs: jobsSnap.size
        });

        // Get most recent jobs
        const jobsData = jobsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecentJobs(jobsData.slice(0, 3)); // Show top 3 recent jobs
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-dark">
      {/* Navigation */}
      <nav className="bg-dark-400 border-b border-gray-700 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-3xl mr-2">🎓</span>
              <span className="text-2xl font-bold text-white">CareerPath</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-300 hover:text-primary-400 font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
              Your Journey to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                {' '}Success Starts Here
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect with top institutions in Lesotho, discover your dream course, and land your perfect job—all in one platform.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/register"
                className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Your Journey
              </Link>
              <a
                href="#features"
                className="bg-dark-300 text-white px-8 py-4 rounded-lg hover:bg-dark-200 transition font-semibold text-lg shadow-lg border-2 border-primary-600"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Stats - Modern Technical Design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            {/* Partner Institutions */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-300 to-dark-400 p-[1px] hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-primary-600/20 to-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-dark-300 rounded-2xl p-8 h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono uppercase tracking-wider text-primary-400 font-semibold">
                      Network
                    </span>
                    <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse"></div>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <h3 className="text-6xl font-bold font-mono bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                      {stats.institutions}+
                    </h3>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <p className="text-sm text-gray-400 font-medium">Partner Institutions</p>
                    <div className="mt-2 h-1 bg-dark-400 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Courses */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-300 to-dark-400 p-[1px] hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-success-500/20 via-success-600/20 to-success-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-dark-300 rounded-2xl p-8 h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono uppercase tracking-wider text-success-400 font-semibold">
                      Catalog
                    </span>
                    <div className="h-2 w-2 rounded-full bg-success-500 animate-pulse"></div>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <h3 className="text-6xl font-bold font-mono bg-gradient-to-r from-success-400 to-success-600 bg-clip-text text-transparent">
                      {stats.courses}+
                    </h3>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <p className="text-sm text-gray-400 font-medium">Available Courses</p>
                    <div className="mt-2 h-1 bg-dark-400 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-success-500 to-success-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Opportunities */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-300 to-dark-400 p-[1px] hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-purple-600/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-dark-300 rounded-2xl p-8 h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
                      Opportunities
                    </span>
                    <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <h3 className="text-6xl font-bold font-mono bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                      {stats.jobs}+
                    </h3>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <p className="text-sm text-gray-400 font-medium">Job Opportunities</p>
                    <div className="mt-2 h-1 bg-dark-400 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Jobs Section */}
            <div className="col-span-1 md:col-span-3 mt-8">
              <h3 className="text-2xl font-bold text-white mb-4">Recent Job Opportunities</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentJobs.map(job => (
                  <div key={job.id} className="bg-dark-300 p-6 rounded-lg border border-gray-700">
                    <h4 className="text-lg font-semibold text-white mb-2">{job.title}</h4>
                    <p className="text-gray-400 mb-2">{job.companyName}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span className="mr-3">📍 {job.location}</span>
                      <span>💼 {job.employmentType}</span>
                    </div>
                    <Link
                      to="/login"
                      className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                    >
                      Login to Apply →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-dark-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-300">
              Streamlined process from application to employment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 - Find Jobs */}
            <div className="group relative overflow-hidden rounded-2xl bg-dark-300 p-[1px] hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-dark-300 rounded-2xl p-8 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                      <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">Search</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      Find Jobs
                    </h3>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 opacity-50 group-hover:opacity-100 group-hover:animate-pulse transition-opacity"></div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Search and filter jobs by title, location, type, and more. Advanced filters to find your perfect match.
                </p>
                <div className="mt-6 pt-4 border-t border-gray-700/50">
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="h-1 flex-1 bg-dark-400 rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                    </div>
                    <span className="ml-3 font-mono">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - Apply for Jobs */}
            <div className="group relative overflow-hidden rounded-2xl bg-dark-300 p-[1px] hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-green-500/20 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-dark-300 rounded-2xl p-8 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                      <span className="text-xs font-mono uppercase tracking-wider text-green-400 font-semibold">Apply</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                      Apply for Jobs
                    </h3>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500 opacity-50 group-hover:opacity-100 group-hover:animate-pulse transition-opacity"></div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Submit applications with resume, LinkedIn, and portfolio links. Track your application status in real-time.
                </p>
                <div className="mt-6 pt-4 border-t border-gray-700/50">
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="h-1 flex-1 bg-dark-400 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                    </div>
                    <span className="ml-3 font-mono">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 - Recruiter Dashboard */}
            <div className="group relative overflow-hidden rounded-2xl bg-dark-300 p-[1px] hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-dark-300 rounded-2xl p-8 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                      <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">Manage</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                      Recruiter Dashboard
                    </h3>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-purple-500 opacity-50 group-hover:opacity-100 group-hover:animate-pulse transition-opacity"></div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Post, edit, and manage job listings. Review applications and connect with top talent.
                </p>
                <div className="mt-6 pt-4 border-t border-gray-700/50">
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="h-1 flex-1 bg-dark-400 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                    </div>
                    <span className="ml-3 font-mono">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4 - Trending & Featured Jobs */}
            <div className="group relative overflow-hidden rounded-2xl bg-dark-300 p-[1px] hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/20 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-dark-300 rounded-2xl p-8 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
                      <span className="text-xs font-mono uppercase tracking-wider text-orange-400 font-semibold">Featured</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                      Trending & Featured Jobs
                    </h3>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-orange-500 opacity-50 group-hover:opacity-100 group-hover:animate-pulse transition-opacity"></div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Highlighted jobs and companies on the homepage. Discover the most sought-after opportunities.
                </p>
                <div className="mt-6 pt-4 border-t border-gray-700/50">
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="h-1 flex-1 bg-dark-400 rounded-full overflow-hidden">
                      <div className="h-full w-5/6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
                    </div>
                    <span className="ml-3 font-mono">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 5 - Career Tips */}
            <div className="group relative overflow-hidden rounded-2xl bg-dark-300 p-[1px] hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-dark-300 rounded-2xl p-8 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                      <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">Insights</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                      Career Tips & Company Highlights
                    </h3>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-cyan-500 opacity-50 group-hover:opacity-100 group-hover:animate-pulse transition-opacity"></div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Helpful resources and featured employers. Get insights to boost your career success.
                </p>
                <div className="mt-6 pt-4 border-t border-gray-700/50">
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="h-1 flex-1 bg-dark-400 rounded-full overflow-hidden">
                      <div className="h-full w-3/5 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full"></div>
                    </div>
                    <span className="ml-3 font-mono">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Modern Timeline Design */}
      <section className="py-20 bg-dark relative overflow-hidden">
        {/* Background gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-600/5 to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
              <span className="text-sm font-mono uppercase tracking-wider text-primary-400 font-semibold">Process</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300">
              Simple steps to kickstart your future
            </p>
          </div>

          {/* Desktop Timeline */}
          <div className="hidden md:block relative">
            {/* Connection Line */}
            <div className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-success-600 to-purple-600 opacity-20" style={{ top: '80px' }}></div>
            
            <div className="grid grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="group relative">
                <div className="text-center">
                  {/* Number Badge */}
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold font-mono shadow-lg group-hover:scale-110 transition-transform">
                      01
                    </div>
                  </div>
                  
                  {/* Content Card */}
                  <div className="bg-dark-300/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 group-hover:border-primary-500/50 transition-all group-hover:shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">Create Account</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Sign up and verify your email</p>
                    
                    {/* Progress indicator */}
                    <div className="mt-4 pt-3 border-t border-gray-700/50">
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative">
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold font-mono shadow-lg group-hover:scale-110 transition-transform">
                      02
                    </div>
                  </div>
                  
                  <div className="bg-dark-300/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 group-hover:border-blue-500/50 transition-all group-hover:shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Browse & Apply</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Explore institutions and submit applications</p>
                    
                    <div className="mt-4 pt-3 border-t border-gray-700/50">
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group relative">
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-success-500 to-success-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-success-500 to-success-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold font-mono shadow-lg group-hover:scale-110 transition-transform">
                      03
                    </div>
                  </div>
                  
                  <div className="bg-dark-300/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 group-hover:border-success-500/50 transition-all group-hover:shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-success-400 transition-colors">Get Admitted</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Receive admission results and accept your offer</p>
                    
                    <div className="mt-4 pt-3 border-t border-gray-700/50">
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <div className="w-2 h-2 rounded-full bg-success-500"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="group relative">
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold font-mono shadow-lg group-hover:scale-110 transition-transform">
                      04
                    </div>
                  </div>
                  
                  <div className="bg-dark-300/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 group-hover:border-purple-500/50 transition-all group-hover:shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Find Jobs</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Graduate and access exclusive job opportunities</p>
                    
                    <div className="mt-4 pt-3 border-t border-gray-700/50">
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <div className="w-2 h-2 rounded-full bg-success-500"></div>
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden space-y-6">
            {[
              { num: '01', title: 'Create Account', desc: 'Sign up and verify your email', color: 'primary', progress: 1 },
              { num: '02', title: 'Browse & Apply', desc: 'Explore institutions and submit applications', color: 'blue', progress: 2 },
              { num: '03', title: 'Get Admitted', desc: 'Receive admission results and accept your offer', color: 'success', progress: 3 },
              { num: '04', title: 'Find Jobs', desc: 'Graduate and access exclusive job opportunities', color: 'purple', progress: 4 }
            ].map((step, index) => (
              <div key={index} className="group relative flex items-start space-x-4">
                <div className="relative flex-shrink-0">
                  <div className={`absolute inset-0 bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 rounded-full blur-lg opacity-50`}></div>
                  <div className={`relative bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold font-mono shadow-lg`}>
                    {step.num}
                  </div>
                </div>
                <div className="flex-1 bg-dark-300/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <h3 className={`text-lg font-bold text-white mb-2 group-hover:text-${step.color}-400 transition-colors`}>{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Section - Modern Design */}
      <section className="py-20 bg-dark-200 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-600/5 to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
              <span className="text-sm font-mono uppercase tracking-wider text-primary-400 font-semibold">Leadership</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Meet Our Founders</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The visionaries behind CareerPath, dedicated to transforming career guidance in Lesotho
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Founder 1 - Thabo Mokoena */}
            <div className="group relative">
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-blue-500 to-primary-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              
              <div className="relative bg-dark-300 rounded-2xl p-8 border border-gray-700/50 group-hover:border-primary-500/50 transition-all duration-500 hover:shadow-2xl">
                {/* Profile Image with modern ring */}
                <div className="relative w-36 h-36 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full animate-pulse opacity-20"></div>
                  <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-primary-500/30 group-hover:ring-primary-500/60 transition-all duration-300 group-hover:scale-105">
                    <img 
                      src="/images/founders/justice-tsehla.jpg" 
                      alt="Justice Tsehla - Co-Founder & CEO"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600 text-white text-4xl font-bold">JT</div>';
                      }}
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">Justice Tsehla</h3>
                  
                  {/* Modern badge for title */}
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 mb-4">
                    <span className="text-sm font-mono uppercase tracking-wider text-primary-400 font-semibold">Co-Founder & CEO</span>
                  </div>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    With over 10 years of experience in education technology, Justice leads our vision 
                    to connect every student in Lesotho with quality educational opportunities and career paths.
                  </p>
                  
                  {/* Modern LinkedIn button */}
                  <div className="flex justify-center">
                    <a href="#" className="inline-flex items-center px-6 py-2.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 hover:bg-primary-500 hover:text-white transition-all duration-300 group/btn">
                      <span className="text-xs font-mono uppercase tracking-wider font-semibold">LinkedIn</span>
                      <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Founder 2 - Lerato Ramoeletsi */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-success-500 via-green-500 to-success-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              
              <div className="relative bg-dark-300 rounded-2xl p-8 border border-gray-700/50 group-hover:border-success-500/50 transition-all duration-500 hover:shadow-2xl">
                <div className="relative w-36 h-36 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-success-400 to-success-600 rounded-full animate-pulse opacity-20"></div>
                  <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-success-500/30 group-hover:ring-success-500/60 transition-all duration-300 group-hover:scale-105">
                    <img 
                      src="/images/founders/retsepile-phamane.jpg" 
                      alt="Retsepile Phamane - Co-Founder & CTO"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-success-400 to-success-600 text-white text-4xl font-bold">RP</div>';
                      }}
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-success-400 transition-colors">Retsepile Phamane</h3>
                  
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-success-500/10 border border-success-500/30 mb-4">
                    <span className="text-sm font-mono uppercase tracking-wider text-success-400 font-semibold">Co-Founder & CTO</span>
                  </div>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    A software engineering expert passionate about building scalable solutions. 
                    Retsepile architected the platform to ensure seamless connections between students, 
                    institutions, and employers.
                  </p>
                  
                  <div className="flex justify-center">
                    <a href="#" className="inline-flex items-center px-6 py-2.5 rounded-full bg-success-500/10 border border-success-500/30 text-success-400 hover:bg-success-500 hover:text-white transition-all duration-300 group/btn">
                      <span className="text-xs font-mono uppercase tracking-wider font-semibold">LinkedIn</span>
                      <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Founder 3 - Mpho Phiri */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              
              <div className="relative bg-dark-300 rounded-2xl p-8 border border-gray-700/50 group-hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl">
                <div className="relative w-36 h-36 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full animate-pulse opacity-20"></div>
                  <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-purple-500/30 group-hover:ring-purple-500/60 transition-all duration-300 group-hover:scale-105">
                    <img 
                      src="/images/founders/boitumelo-marasi.jpg" 
                      alt="Boitumelo Marasi - Co-Founder & COO"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600 text-white text-4xl font-bold">BM</div>';
                      }}
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Boitumelo Marasi</h3>
                  
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 mb-4">
                    <span className="text-sm font-mono uppercase tracking-wider text-purple-400 font-semibold">Co-Founder & COO</span>
                  </div>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    A career counseling specialist with deep connections in Lesotho's education sector. 
                    Boitumelo ensures our platform delivers real value to students and partners across the country.
                  </p>
                  
                  <div className="flex justify-center">
                    <a href="#" className="inline-flex items-center px-6 py-2.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500 hover:text-white transition-all duration-300 group/btn">
                      <span className="text-xs font-mono uppercase tracking-wider font-semibold">LinkedIn</span>
                      <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Statement - Modern Design */}
          <div className="mt-16 text-center">
            <div className="relative group/mission">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-success-500 to-purple-500 rounded-2xl opacity-10 group-hover/mission:opacity-20 transition-opacity blur-xl"></div>
              
              <div className="relative bg-dark-300/80 backdrop-blur-sm rounded-2xl p-10 max-w-4xl mx-auto border border-gray-700/50 group-hover/mission:border-primary-500/30 transition-all">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/10 via-success-500/10 to-purple-500/10 border border-gray-600/30 mb-6">
                  <span className="text-sm font-mono uppercase tracking-wider bg-gradient-to-r from-primary-400 via-success-400 to-purple-400 bg-clip-text text-transparent font-semibold">Our Mission</span>
                </div>
                
                <div className="relative">
                  <svg className="absolute -left-4 -top-2 w-8 h-8 text-primary-500/20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6,17h3l2-4V7H5v6h3Zm8,0h3l2-4V7H13v6h3Z"/>
                  </svg>
                  <p className="text-xl text-gray-300 leading-relaxed italic">
                    We believe every student in Lesotho deserves access to quality education and meaningful 
                    career opportunities. CareerPath was born from our shared vision to bridge the gap between 
                    aspiration and achievement, making career guidance accessible, efficient, and impactful for all.
                  </p>
                  <svg className="absolute -right-4 -bottom-2 w-8 h-8 text-purple-500/20 transform rotate-180" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6,17h3l2-4V7H5v6h3Zm8,0h3l2-4V7H13v6h3Z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA removed */}

    
    </div>
  );
};

export default LandingPage;