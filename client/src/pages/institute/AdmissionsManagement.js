import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { db } from '../../config/firebase.config';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';

function AdmissionsManagement() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { currentUser } = useAuth();

  // Keep track of unique courses for the filter dropdown
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchAdmissions();
  }, [currentUser]);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      if (!currentUser?.uid) {
        console.log('No currentUser UID');
        setLoading(false);
        return;
      }

      console.log('Fetching admissions for institution:', currentUser.uid);

      // Fetch enrollments from Firestore
      const enrollmentsRef = collection(db, 'enrollments');
      const q = query(
        enrollmentsRef,
        where('institutionId', '==', currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      console.log('Found enrollments:', querySnapshot.size);
      const enrollmentsData = [];

      for (const docSnap of querySnapshot.docs) {
        const enrollment = docSnap.data();
        console.log('Processing enrollment:', docSnap.id, enrollment);
        
        // Get student details - use stored data first, then fetch if not available
        let studentData = null;
        if (enrollment.studentName && enrollment.studentEmail) {
          // Use directly stored student data
          studentData = {
            firstName: enrollment.studentName?.split(' ')[0] || '',
            lastName: enrollment.studentName?.split(' ').slice(1).join(' ') || '',
            name: enrollment.studentName,
            email: enrollment.studentEmail
          };
          console.log('Using stored student data:', studentData);
        } else if (enrollment.studentId) {
          // Fall back to Firestore lookup
          try {
            const studentDocRef = doc(db, 'students', enrollment.studentId);
            const studentDoc = await getDoc(studentDocRef);
            if (studentDoc.exists()) {
              studentData = studentDoc.data();
              console.log('Found student from Firestore:', studentData);
            } else {
              console.log('No student found for ID:', enrollment.studentId);
            }
          } catch (error) {
            console.error('Error fetching student:', error);
          }
        }
        
        // Get course details - use stored data first, then fetch if not available
        let courseData = null;
        if (enrollment.courseName) {
          // Use directly stored course name
          courseData = {
            name: enrollment.courseName,
            title: enrollment.courseName
          };
          console.log('Using stored course data:', courseData);
        } else if (enrollment.courseId) {
          // Fall back to Firestore lookup
          try {
            const courseDocRef = doc(db, 'courses', enrollment.courseId);
            const courseDoc = await getDoc(courseDocRef);
            if (courseDoc.exists()) {
              courseData = courseDoc.data();
              console.log('Found course from Firestore:', courseData);
            } else {
              console.log('No course found for ID:', enrollment.courseId);
            }
          } catch (error) {
            console.error('Error fetching course:', error);
          }
        }

        enrollmentsData.push({
          id: docSnap.id,
          ...enrollment,
          student: studentData,
          course: courseData
        });
      }

      // Sort by enrolledAt date (newest first)
      enrollmentsData.sort((a, b) => {
        const dateA = a.enrolledAt?.seconds || 0;
        const dateB = b.enrolledAt?.seconds || 0;
        return dateB - dateA;
      });

      // Extract unique courses
      const uniqueCourses = [
        ...new Set(
          enrollmentsData
            .map((adm) => adm?.course?.name)
            .filter((name) => Boolean(name))
        ),
      ];
      setCourses(uniqueCourses);

      setAdmissions(enrollmentsData);
    } catch (error) {
      console.error('Error fetching admissions:', error);
      toast.error('Failed to fetch admissions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (admissionId, newStatus) => {
    try {
      // Update enrollment status in Firestore
      const enrollmentRef = doc(db, 'enrollments', admissionId);
      await updateDoc(enrollmentRef, {
        status: newStatus,
        updatedAt: new Date()
      });

      // Update local state
      setAdmissions(prev => prev.map(adm =>
        adm.id === admissionId ? { ...adm, status: newStatus } : adm
      ));

      toast.success(`Status updated to ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status: ' + error.message);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      deferred: 'bg-orange-100 text-orange-800',
      withdrawn: 'bg-red-100 text-red-800',
      graduated: 'bg-blue-100 text-blue-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredAdmissions = admissions.filter(admission => {
    const matchesStatus = selectedStatus === 'all' || admission.status === selectedStatus;
    const matchesCourse =
      selectedCourse === 'all' || admission?.course?.name === selectedCourse;
    return matchesStatus && matchesCourse;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="spinner h-8 w-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admissions Management
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="deferred">Deferred</option>
            <option value="withdrawn">Withdrawn</option>
            <option value="graduated">Graduated</option>
          </select>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Courses</option>
            {courses.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>

        {/* Admissions List */}
        <div className="overflow-x-auto">
          {filteredAdmissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {admissions.length === 0 
                  ? 'No enrollments found. Students need to be enrolled in courses first.'
                  : 'No admissions match the selected filters.'}
              </p>
              {admissions.length === 0 && (
                <p className="text-sm text-gray-400 mt-2">
                  Check the console (F12) for debugging information.
                </p>
              )}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Admission Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAdmissions.map((admission) => (
                  <tr key={admission.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {admission?.student?.firstName && admission?.student?.lastName
                            ? `${admission.student.firstName} ${admission.student.lastName}`
                            : admission?.student?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {admission?.student?.email || '—'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {admission?.course?.name || admission?.course?.title || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {admission?.enrolledAt?.seconds
                          ? new Date(admission.enrolledAt.seconds * 1000).toLocaleDateString()
                          : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(admission.status)}`}>
                        {admission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        value={admission.status}
                        onChange={(e) => handleStatusChange(admission.id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="deferred">Deferred</option>
                        <option value="withdrawn">Withdrawn</option>
                        <option value="graduated">Graduated</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdmissionsManagement;