import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const BrowseCourses = () => {
  const location = useLocation();
  const { userData } = useAuth();
  const [institutions, setInstitutions] = useState([]);
  const [institutionCourses, setInstitutionCourses] = useState({});
  const [expandedInstitutions, setExpandedInstitutions] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState({});
  const [applying, setApplying] = useState(false);
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'select'

  useEffect(() => {
    fetchInstitutions();
    // Auto-expand institution if coming from navigation
    if (location.state?.institutionId) {
      setExpandedInstitutions(new Set([location.state.institutionId]));
    }
  }, []);

  useEffect(() => {
    // Fetch courses for all expanded institutions
    expandedInstitutions.forEach(instId => {
      if (!institutionCourses[instId]) {
        fetchCoursesForInstitution(instId);
      }
    });
  }, [expandedInstitutions]);

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const institutionsRef = collection(db, 'institutions');
      const snapshot = await getDocs(institutionsRef);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Institutions loaded:', data.length, data);
      setInstitutions(data);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      toast.error('Failed to fetch institutions');
    } finally {
      setLoading(false);
    }
  };

  const fetchCoursesForInstitution = async (institutionId) => {
    console.log('Fetching courses for institution:', institutionId);
    setLoadingCourses(prev => ({ ...prev, [institutionId]: true }));
    try {
      const coursesQuery = query(
        collection(db, 'courses'),
        where('institutionId', '==', institutionId)
      );
      const snapshot = await getDocs(coursesQuery);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Courses found for', institutionId, ':', data.length, data);
      setInstitutionCourses(prev => ({
        ...prev,
        [institutionId]: data
      }));
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses: ' + error.message);
    } finally {
      setLoadingCourses(prev => ({ ...prev, [institutionId]: false }));
    }
  };

  const toggleInstitution = (institutionId) => {
    setExpandedInstitutions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(institutionId)) {
        newSet.delete(institutionId);
      } else {
        newSet.add(institutionId);
      }
      return newSet;
    });
  };

  const hasTertiaryLevel = () => {
    const tertiaryLevels = ['Certificate', 'Diploma', "Bachelor's Degree", "Master's Degree", 'PhD'];
    return tertiaryLevels.includes(userData?.currentGrade);
  };

  const handleApply = async (courseId, courseName, institutionId, institutionName) => {
    // Check if student has completed tertiary level
    if (hasTertiaryLevel()) {
      toast.error('You have already completed a tertiary level qualification and cannot apply for courses.');
      return;
    }

    if (!window.confirm(`Apply for ${courseName}?`)) return;
    
    setApplying(true);
    try {
      // Check if already applied
      const existingQuery = query(
        collection(db, 'applications'),
        where('studentId', '==', userData.uid),
        where('courseId', '==', courseId)
      );
      const existingSnapshot = await getDocs(existingQuery);
      
      if (!existingSnapshot.empty) {
        toast.error('You have already applied to this course');
        setApplying(false);
        return;
      }

      // Check max 2 applications per institution
      const instAppsQuery = query(
        collection(db, 'applications'),
        where('studentId', '==', userData.uid),
        where('institutionId', '==', institutionId)
      );
      const instAppsSnapshot = await getDocs(instAppsQuery);
      
      if (instAppsSnapshot.size >= 2) {
        toast.error('You can only apply to 2 courses per institution');
        setApplying(false);
        return;
      }

      await addDoc(collection(db, 'applications'), {
        studentId: userData.uid,
        studentName: `${userData.firstName} ${userData.lastName}`,
        studentEmail: userData.email,
        institutionId: institutionId,
        institutionName: institutionName,
        courseId: courseId,
        courseName: courseName,
        status: 'pending',
        createdAt: serverTimestamp(),
        qualifications: {
          currentGrade: userData.currentGrade || '',
          subjects: userData.subjects || [],
          certifications: userData.certifications || []
        }
      });
      
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Browse Courses</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : institutions.length > 0 ? (
        <div className="space-y-4">
          {institutions.map((institution) => {
            const isExpanded = expandedInstitutions.has(institution.id);
            const courses = institutionCourses[institution.id] || [];
            const isLoadingCourses = loadingCourses[institution.id];

            return (
              <div
                key={institution.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-lg"
              >
                {/* Institution Header */}
                <button
                  onClick={() => toggleInstitution(institution.id)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition"
                >
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      {institution.name}
                    </h2>
                    {institution.location && (
                      <p className="text-sm text-gray-600">
                        📍 {institution.location}
                      </p>
                    )}
                    {institution.type && (
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {institution.type}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {isExpanded && courses.length > 0 && (
                      <span className="text-sm text-gray-600">
                        {courses.length} course{courses.length !== 1 ? 's' : ''}
                      </span>
                    )}
                    <svg
                      className={`w-6 h-6 text-gray-600 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Courses Section */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                    {isLoadingCourses ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      </div>
                    ) : courses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {courses.map((course) => (
                          <div
                            key={course.id}
                            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
                          >
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              {course.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {course.description}
                            </p>

                            <div className="space-y-1 mb-4 text-sm">
                              {course.duration && (
                                <p className="text-gray-700">
                                  <span className="font-medium">Duration:</span> {course.duration}
                                </p>
                              )}
                              {course.fees && (
                                <p className="text-gray-700">
                                  <span className="font-medium">Fees:</span>{' '}
                                  {typeof course.fees === 'object' 
                                    ? `Local: M${course.fees.local || 'N/A'}, International: M${course.fees.international || 'N/A'}`
                                    : `M${course.fees}`
                                  }
                                </p>
                              )}
                              {course.level && (
                                <p className="text-gray-700">
                                  <span className="font-medium">Level:</span> {course.level}
                                </p>
                              )}
                              {course.requirements && typeof course.requirements === 'object' && (
                                <p className="text-gray-700">
                                  <span className="font-medium">Min. Grade:</span>{' '}
                                  {course.requirements.minimumGrade || course.requirements.minGrade || 'N/A'}
                                  {course.requirements.minimumPoints && ` (${course.requirements.minimumPoints} pts)`}
                                </p>
                              )}
                            </div>

                            <button
                              onClick={() => handleApply(course.id, course.name || course.title, institution.id, institution.name)}
                              disabled={applying || hasTertiaryLevel()}
                              className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50 text-sm font-medium"
                              title={hasTertiaryLevel() ? 'You have completed tertiary level and cannot apply' : ''}
                            >
                              {hasTertiaryLevel() ? 'Not Eligible' : applying ? 'Applying...' : 'Apply Now'}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          No courses available for this institution
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No institutions found</p>
        </div>
      )}
    </div>
  );
};

export default BrowseCourses;
