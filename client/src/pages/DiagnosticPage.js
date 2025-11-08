import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase.config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const DiagnosticPage = () => {
  const { currentUser, userData } = useAuth();
  const [diagnostics, setDiagnostics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runDiagnostics();
  }, [currentUser]);

  const runDiagnostics = async () => {
    setLoading(true);
    const results = {};

    try {
      // Check auth
      results.auth = {
        isAuthenticated: !!currentUser,
        uid: currentUser?.uid || 'Not authenticated',
        email: currentUser?.email || 'N/A',
        userRole: userData?.role || 'N/A',
        userName: userData?.name || userData?.firstName + ' ' + userData?.lastName || 'N/A'
      };

      if (!currentUser) {
        setDiagnostics(results);
        setLoading(false);
        return;
      }

      // Check collections
      const collections = [
        'users',
        'institutions',
        'courses',
        'applications',
        'admissions',
        'jobs',
        'companies',
        'jobApplications'
      ];

      for (const collectionName of collections) {
        try {
          const snapshot = await getDocs(collection(db, collectionName));
          results[collectionName] = {
            total: snapshot.size,
            docs: snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })).slice(0, 3) // Show first 3 for preview
          };
        } catch (error) {
          results[collectionName] = {
            error: error.message
          };
        }
      }

      // Role-specific checks
      if (userData?.role === 'institute') {
        // Check courses owned by this institution
        const myCoursesSnapshot = await getDocs(
          query(collection(db, 'courses'), where('institutionId', '==', currentUser.uid))
        );
        results.myCourses = {
          count: myCoursesSnapshot.size,
          docs: myCoursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        };

        // Check all courses with institution name
        const allCoursesSnapshot = await getDocs(collection(db, 'courses'));
        const coursesWithMyName = allCoursesSnapshot.docs.filter(doc => 
          doc.data().institutionName?.toLowerCase().includes(userData.name?.toLowerCase())
        ).map(doc => ({ id: doc.id, ...doc.data() }));
        
        results.coursesWithMyName = {
          count: coursesWithMyName.length,
          docs: coursesWithMyName
        };

        // Check applications
        const myAppsSnapshot = await getDocs(
          query(collection(db, 'applications'), where('institutionId', '==', currentUser.uid))
        );
        results.myApplications = {
          count: myAppsSnapshot.size,
          docs: myAppsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        };
      }

      if (userData?.role === 'student') {
        const myAppsSnapshot = await getDocs(
          query(collection(db, 'applications'), where('studentId', '==', currentUser.uid))
        );
        results.myApplications = {
          count: myAppsSnapshot.size,
          docs: myAppsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        };
      }

      if (userData?.role === 'company') {
        const myJobsSnapshot = await getDocs(
          query(collection(db, 'jobs'), where('companyId', '==', currentUser.uid))
        );
        results.myJobs = {
          count: myJobsSnapshot.size,
          docs: myJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        };
      }

    } catch (error) {
      results.globalError = error.message;
    }

    setDiagnostics(results);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Running Diagnostics...
          </h1>
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          System Diagnostics
        </h1>

        <button
          onClick={runDiagnostics}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh Diagnostics
        </button>

        <div className="space-y-6">
          {Object.entries(diagnostics).map(([key, value]) => (
            <div key={key} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h2>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto max-h-96 text-sm">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          ))}
        </div>

        {diagnostics.auth?.userRole === 'institute' && diagnostics.coursesWithMyName?.count > 0 && (
          <div className="mt-8 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-4">
              ⚠️ InstitutionId Mismatch Detected
            </h3>
            <p className="text-yellow-800 dark:text-yellow-200 mb-4">
              Found {diagnostics.coursesWithMyName.count} courses with your institution name,
              but only {diagnostics.myCourses?.count || 0} are linked to your UID ({diagnostics.auth.uid}).
            </p>
            <p className="text-yellow-800 dark:text-yellow-200 mb-4">
              Courses that need fixing:
            </p>
            <ul className="list-disc pl-6 text-yellow-800 dark:text-yellow-200">
              {diagnostics.coursesWithMyName.docs
                .filter(c => c.institutionId !== diagnostics.auth.uid)
                .map(course => (
                  <li key={course.id}>
                    <strong>{course.name || course.title}</strong> - 
                    Current institutionId: {course.institutionId} → 
                    Should be: {diagnostics.auth.uid}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticPage;
