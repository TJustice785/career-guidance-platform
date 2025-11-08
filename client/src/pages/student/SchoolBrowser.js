import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import ApplicationForm from './ApplicationForm';
import { FaMapMarkerAlt, FaGraduationCap, FaDollarSign, FaClock, FaUniversity, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { canApplyToCourse, getRecommendedCourses } from '../../utils/qualificationMatcher';

const SchoolBrowser = () => {
  const { userData } = useAuth();
  const [institutions, setInstitutions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, eligible, recommended
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const categories = [
    'Technology', 'Business', 'Education', 'Health Sciences', 'Engineering',
    'Arts & Humanities', 'Social Sciences', 'Agriculture', 'Law', 'Other'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching courses and institutions from Firestore...');

      // Fetch courses from Firestore
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      console.log('Courses snapshot received, count:', coursesSnapshot.size);
      
      const allCourses = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Filter active courses
      const activeCourses = allCourses.filter(course => 
        course.status === 'active' || !course.status
      );
      
      console.log('Active courses found:', activeCourses.length);
      setCourses(activeCourses);

      // Fetch institutions from Firestore
      const institutionsSnapshot = await getDocs(collection(db, 'institutions'));
      console.log('Institutions snapshot received, count:', institutionsSnapshot.size);
      
      const allInstitutions = institutionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Filter active institutions
      const activeInstitutions = allInstitutions.filter(inst => 
        inst.status === 'active' || !inst.status
      );
      
      console.log('Active institutions found:', activeInstitutions.length);
      setInstitutions(activeInstitutions);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load institutions and courses: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (course) => {
    // Check qualification before allowing apply
    if (userData) {
      const qualificationCheck = canApplyToCourse(userData, course);
      if (!qualificationCheck.canApply) {
        toast.error(qualificationCheck.message, { duration: 4000 });
        return;
      }
    }
    setSelectedCourse(course);
    setShowApplicationForm(true);
  };

  const handleApplicationSuccess = () => {
    toast.success('Application submitted successfully!');
    setShowApplicationForm(false);
    setSelectedCourse(null);
  };

  // Add qualification info to courses
  const coursesWithQualifications = userData ? courses.map(course => {
    const qualCheck = canApplyToCourse(userData, course);
    return {
      ...course,
      qualificationCheck: qualCheck
    };
  }) : courses;

  // Filter courses based on search and filters
  const filteredCourses = coursesWithQualifications.filter(course => {
    const matchesSearch = course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.institutionName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || course.category === category;
    const matchesLocation = !location || course.institutionName?.toLowerCase().includes(location.toLowerCase());
    
    // Filter by eligibility
    const matchesFilter = filterType === 'all' ? true :
                         filterType === 'eligible' ? course.qualificationCheck?.canApply :
                         filterType === 'recommended' ? (course.qualificationCheck?.score >= 80) : true;
    
    return matchesSearch && matchesCategory && matchesLocation && matchesFilter;
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Schools & Courses</h1>
        <p className="text-gray-600">Find your next educational opportunity</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Courses
            </label>
            <input
              type="text"
              placeholder="Course name, institution, or keywords..."
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
              Institution
            </label>
            <input
              type="text"
              placeholder="Institution name..."
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

        {/* Qualification Filter */}
        {userData && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-md font-medium transition ${
                filterType === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Courses ({coursesWithQualifications.length})
            </button>
            <button
              onClick={() => setFilterType('eligible')}
              className={`px-4 py-2 rounded-md font-medium transition ${
                filterType === 'eligible' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✓ You Qualify ({coursesWithQualifications.filter(c => c.qualificationCheck?.canApply).length})
            </button>
            <button
              onClick={() => setFilterType('recommended')}
              className={`px-4 py-2 rounded-md font-medium transition ${
                filterType === 'recommended' 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⭐ Recommended ({coursesWithQualifications.filter(c => c.qualificationCheck?.score >= 80).length})
            </button>
          </div>
        )}
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <FaGraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          filteredCourses.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2 flex-wrap gap-2">
                    <h3 className="text-xl font-bold text-gray-900">{course.name}</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {course.level}
                    </span>
                    
                    {/* Qualification Badge */}
                    {userData && course.qualificationCheck && (
                      <span className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${
                        course.qualificationCheck.canApply 
                          ? 'bg-green-100 text-green-800'
                          : course.qualificationCheck.score >= 50
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {course.qualificationCheck.canApply ? (
                          <><FaCheckCircle /> You Qualify ({course.qualificationCheck.score}%)</>
                        ) : course.qualificationCheck.score >= 50 ? (
                          <><FaExclamationTriangle /> Partially Qualify ({course.qualificationCheck.score}%)</>
                        ) : (
                          <><FaTimesCircle /> Not Qualified ({course.qualificationCheck.score}%)</>
                        )}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <FaUniversity className="mr-2" />
                    <span className="mr-4">{course.institutionName}</span>
                    <FaClock className="mr-2" />
                    <span className="mr-4">{course.duration}</span>
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{course.institutionName}</span>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3">{course.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.category && typeof course.category === 'string' && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {course.category}
                      </span>
                    )}
                    {course.fees && typeof course.fees === 'object' && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center">
                        <FaDollarSign className="mr-1" />
                        {course.fees?.local ? `M${course.fees.local}` : (course.fees?.international ? `M${course.fees.international}` : 'Contact for fees')}
                      </span>
                    )}
                    {typeof course.fees === 'number' && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center">
                        <FaDollarSign className="mr-1" />
                        M{course.fees}
                      </span>
                    )}
                    {course.requirements?.minimumGrade && typeof course.requirements.minimumGrade === 'string' && (
                      <span className="px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full">
                        Min Grade: {course.requirements.minimumGrade}
                      </span>
                    )}
                  </div>

                  {course.requirements?.subjects && Array.isArray(course.requirements.subjects) && course.requirements.subjects.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Required Subjects:</h4>
                      <div className="flex flex-wrap gap-1">
                        {course.requirements.subjects.map((subject, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {typeof subject === 'string' ? subject : String(subject)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {course.careerProspects && Array.isArray(course.careerProspects) && course.careerProspects.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Career Prospects:</h4>
                      <div className="flex flex-wrap gap-1">
                        {course.careerProspects.slice(0, 3).map((prospect, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {typeof prospect === 'string' ? prospect : String(prospect)}
                          </span>
                        ))}
                        {course.careerProspects.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                            +{course.careerProspects.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Qualification Details */}
                  {userData && course.qualificationCheck && course.qualificationCheck.reasons && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Qualification Details:</h4>
                      <ul className="text-xs space-y-1">
                        {course.qualificationCheck.reasons.map((reason, idx) => (
                          <li key={idx} className={reason.startsWith('✓') ? 'text-green-700' : reason.startsWith('⚠') ? 'text-yellow-700' : 'text-red-700'}>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-sm text-gray-500">
                    Institution: {course.institutionName}
                  </div>
                </div>

                <div className="ml-6">
                  <button
                    onClick={() => handleApply(course)}
                    disabled={userData && course.qualificationCheck && !course.qualificationCheck.canApply}
                    className={`px-6 py-2 rounded-md transition-colors ${
                      userData && course.qualificationCheck && !course.qualificationCheck.canApply
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    title={userData && course.qualificationCheck && !course.qualificationCheck.canApply ? 'You do not meet the requirements' : 'Apply to this course'}
                  >
                    {userData && course.qualificationCheck && !course.qualificationCheck.canApply ? 'Not Qualified' : 'Apply Now'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && selectedCourse && (
        <ApplicationForm
          type="course"
          itemId={selectedCourse.id}
          itemName={selectedCourse.name}
          onClose={() => {
            setShowApplicationForm(false);
            setSelectedCourse(null);
          }}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};

export default SchoolBrowser;
