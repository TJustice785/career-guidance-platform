import React, { useState } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import toast from 'react-hot-toast';

const UpdateCoursesToReal = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [stats, setStats] = useState({ updated: 0, deleted: 0, total: 0 });

  // Real course mappings based on Lesotho institutions
  const courseNameMappings = {
    // Generic to Specific mappings
    'Computer Science': 'Bachelor of Science in Computer Science',
    'Information Technology': 'Bachelor of Information Technology',
    'Business Administration': 'Bachelor of Business Administration',
    'Agriculture': 'Bachelor of Agriculture',
    'Engineering': 'National Diploma in Civil Engineering',
    'Nursing': 'Bachelor of Science in Nursing',
    'Education': 'Bachelor of Education',
    'Marketing': 'Diploma in Marketing Management'
  };

  const realCoursesByInstitution = {
    'Botho University': [
      { name: 'Bachelor of Commerce in Accounting', level: 'Undergraduate', duration: '4 years', fees: 48000, field: 'Business' },
      { name: 'Bachelor of Information Technology', level: 'Undergraduate', duration: '4 years', fees: 50000, field: 'Technology' },
      { name: 'Bachelor of Business Administration', level: 'Undergraduate', duration: '3 years', fees: 45000, field: 'Business' },
      { name: 'Bachelor of Science in Computing', level: 'Undergraduate', duration: '3 years', fees: 48000, field: 'Technology' },
      { name: 'Diploma in Information Technology', level: 'Diploma', duration: '2 years', fees: 30000, field: 'Technology' },
      { name: 'Diploma in Business Management', level: 'Diploma', duration: '2 years', fees: 28000, field: 'Business' },
      { name: 'Diploma in Marketing', level: 'Diploma', duration: '2 years', fees: 27000, field: 'Business' },
      { name: 'Bachelor of Finance', level: 'Undergraduate', duration: '3 years', fees: 46000, field: 'Business' }
    ],
    'National University of Lesotho': [
      { name: 'Bachelor of Science in Computer Science', level: 'Undergraduate', duration: '4 years', fees: 25000, field: 'Technology' },
      { name: 'Bachelor of Education', level: 'Undergraduate', duration: '4 years', fees: 22000, field: 'Education' },
      { name: 'Bachelor of Agriculture', level: 'Undergraduate', duration: '4 years', fees: 24000, field: 'Agriculture' },
      { name: 'Bachelor of Science in Nursing', level: 'Undergraduate', duration: '4 years', fees: 28000, field: 'Healthcare' },
      { name: 'Bachelor of Commerce', level: 'Undergraduate', duration: '3 years', fees: 23000, field: 'Business' },
      { name: 'Bachelor of Law (LLB)', level: 'Undergraduate', duration: '4 years', fees: 30000, field: 'Law' },
      { name: 'Bachelor of Science in Mathematics', level: 'Undergraduate', duration: '3 years', fees: 22000, field: 'Science' },
      { name: 'Bachelor of Arts in English', level: 'Undergraduate', duration: '3 years', fees: 20000, field: 'Arts' },
      { name: 'Diploma in Agriculture Extension', level: 'Diploma', duration: '2 years', fees: 18000, field: 'Agriculture' }
    ],
    'Lerotholi Polytechnic': [
      { name: 'National Diploma in Civil Engineering', level: 'Diploma', duration: '3 years', fees: 18000, field: 'Engineering' },
      { name: 'National Diploma in Electrical Engineering', level: 'Diploma', duration: '3 years', fees: 18000, field: 'Engineering' },
      { name: 'National Diploma in Mechanical Engineering', level: 'Diploma', duration: '3 years', fees: 18000, field: 'Engineering' },
      { name: 'National Diploma in Building Construction', level: 'Diploma', duration: '3 years', fees: 17000, field: 'Engineering' },
      { name: 'Certificate in Automotive Technology', level: 'Certificate', duration: '1 year', fees: 12000, field: 'Engineering' },
      { name: 'Certificate in Welding and Fabrication', level: 'Certificate', duration: '1 year', fees: 11000, field: 'Engineering' },
      { name: 'Diploma in Information Technology', level: 'Diploma', duration: '2 years', fees: 16000, field: 'Technology' }
    ],
    'Lesotho College of Education': [
      { name: 'Diploma in Primary Education', level: 'Diploma', duration: '3 years', fees: 20000, field: 'Education' },
      { name: 'Diploma in Secondary Education', level: 'Diploma', duration: '3 years', fees: 20000, field: 'Education' },
      { name: 'Bachelor of Education in Primary', level: 'Undergraduate', duration: '4 years', fees: 25000, field: 'Education' },
      { name: 'Bachelor of Education in Secondary', level: 'Undergraduate', duration: '4 years', fees: 25000, field: 'Education' },
      { name: 'Certificate in Early Childhood Education', level: 'Certificate', duration: '1 year', fees: 15000, field: 'Education' }
    ],
    'Limkokwing University': [
      { name: 'Bachelor of Arts in Digital Media Design', level: 'Undergraduate', duration: '3 years', fees: 52000, field: 'Creative Arts' },
      { name: 'Bachelor of Science in Software Engineering', level: 'Undergraduate', duration: '4 years', fees: 55000, field: 'Technology' },
      { name: 'Diploma in Graphic Design', level: 'Diploma', duration: '2 years', fees: 35000, field: 'Creative Arts' },
      { name: 'Bachelor of Multimedia Design', level: 'Undergraduate', duration: '3 years', fees: 51000, field: 'Creative Arts' },
      { name: 'Diploma in Fashion Design', level: 'Diploma', duration: '2 years', fees: 33000, field: 'Creative Arts' },
      { name: 'Bachelor of Marketing and Communication', level: 'Undergraduate', duration: '3 years', fees: 48000, field: 'Business' }
    ]
  };

  const handleUpdateCourses = async () => {
    if (!window.confirm('Update existing courses to real Lesotho institution programs? This will update course names, fees, and details.')) {
      return;
    }

    try {
      setLoading(true);
      setProgress('Fetching institutions and courses...');

      // First, get all institutions to map IDs to names
      const institutionsSnapshot = await getDocs(collection(db, 'institutions'));
      const institutionsMap = {};
      institutionsSnapshot.docs.forEach(doc => {
        institutionsMap[doc.id] = doc.data().name;
      });

      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const courses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setStats({ ...stats, total: courses.length });
      setProgress(`Found ${courses.length} courses. Updating...`);

      let updated = 0;
      let deleted = 0;

      for (const course of courses) {
        // Get institution name from course data or lookup by ID
        let institutionName = course.institutionName;
        
        if (!institutionName && course.institutionId) {
          institutionName = institutionsMap[course.institutionId];
        }
        
        if (!institutionName) {
          institutionName = '';
        }
        
        // Check if institution has specific real courses
        if (realCoursesByInstitution[institutionName]) {
          const institutionCourses = realCoursesByInstitution[institutionName];
          
          // Find best matching course
          const matchingCourse = institutionCourses.find(c => 
            course.name?.toLowerCase().includes(c.name.toLowerCase().split(' ')[0]) ||
            c.field === course.field
          ) || institutionCourses[Math.floor(Math.random() * institutionCourses.length)];

          if (matchingCourse) {
            await updateDoc(doc(db, 'courses', course.id), {
              name: matchingCourse.name,
              title: `${matchingCourse.name} - ${matchingCourse.level}`,
              level: matchingCourse.level,
              duration: matchingCourse.duration,
              fees: matchingCourse.fees,
              field: matchingCourse.field,
              institutionName: institutionName, // Always set institutionName
              description: `Comprehensive ${matchingCourse.name} program offered by ${institutionName}. This program equips students with essential knowledge and skills in ${matchingCourse.field.toLowerCase()}.`,
              isActive: true
            });
            updated++;
            setProgress(`Updated: ${matchingCourse.name} at ${institutionName}`);
          }
        } else {
          // Generic update for other institutions
          const courseName = course.name || course.title || '';
          let updatedName = courseName;

          // Try to map generic names to specific ones
          for (const [generic, specific] of Object.entries(courseNameMappings)) {
            if (courseName.includes(generic)) {
              updatedName = specific;
              break;
            }
          }

          await updateDoc(doc(db, 'courses', course.id), {
            name: updatedName,
            title: `${updatedName} - ${course.level || 'Undergraduate'}`,
            institutionName: institutionName || course.institutionName || 'Institution',
            description: `Professional ${updatedName} program at ${institutionName || 'our institution'}`,
            isActive: true
          });
          updated++;
        }

        setStats({ total: courses.length, updated, deleted });
      }

      toast.success(`Successfully updated ${updated} courses!`);
      setProgress(`✅ Updated ${updated} courses to real programs`);
    } catch (error) {
      console.error('Error updating courses:', error);
      toast.error('Failed to update courses');
      setProgress('❌ Failed to update courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllCourses = async () => {
    if (!window.confirm('⚠️ DELETE ALL COURSES? This action cannot be undone! Make sure you have a backup.')) {
      return;
    }

    if (!window.confirm('Are you absolutely sure? This will delete ALL courses from the database.')) {
      return;
    }

    try {
      setLoading(true);
      setProgress('Deleting all courses...');

      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const courses = coursesSnapshot.docs;

      setStats({ ...stats, total: courses.length });

      for (let i = 0; i < courses.length; i++) {
        await deleteDoc(doc(db, 'courses', courses[i].id));
        setProgress(`Deleted ${i + 1}/${courses.length} courses`);
        setStats({ total: courses.length, updated: 0, deleted: i + 1 });
      }

      toast.success(`Deleted ${courses.length} courses successfully!`);
      setProgress(`✅ Deleted all ${courses.length} courses`);
    } catch (error) {
      console.error('Error deleting courses:', error);
      toast.error('Failed to delete courses');
      setProgress('❌ Failed to delete courses');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    console.log('Real Courses by Institution:', realCoursesByInstitution);
    toast.success('Check console for course preview');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Update Courses to Real Programs
        </h2>
        
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            📚 Real Lesotho Institution Programs
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
            This will update your courses to use real faculty and program names from:
          </p>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
            <li><strong>Botho University:</strong> Agriculture, IT, Accounting, Business (6 programs)</li>
            <li><strong>National University of Lesotho:</strong> Computer Science, Education, Agriculture, Nursing, Law (6 programs)</li>
            <li><strong>Lerotholi Polytechnic:</strong> Engineering (Civil, Electrical, Mechanical), Business (5 programs)</li>
            <li><strong>Lesotho College of Education:</strong> Primary & Secondary Education (3 programs)</li>
            <li><strong>Limkokwing University:</strong> Digital Media, Software Engineering, Graphic Design (4 programs)</li>
          </ul>
        </div>

        {/* Stats Display */}
        {stats.total > 0 && (
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Courses</div>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.updated}</div>
              <div className="text-sm text-green-700 dark:text-green-300">Updated</div>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.deleted}</div>
              <div className="text-sm text-red-700 dark:text-red-300">Deleted</div>
            </div>
          </div>
        )}

        {/* Progress Display */}
        {progress && (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">{progress}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleUpdateCourses}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? '⏳ Updating Courses...' : '🔄 Update All Courses to Real Programs'}
          </button>

          <button
            onClick={handlePreview}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            👁️ Preview Real Courses (Check Console)
          </button>

          <button
            onClick={handleDeleteAllCourses}
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? '⏳ Deleting...' : '🗑️ Delete All Courses (Cannot Undo!)'}
          </button>
        </div>

        {/* Warning */}
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">⚠️ Important Notes:</h4>
          <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1 list-disc list-inside">
            <li>Update will match courses to their institutions automatically</li>
            <li>Course fees are in LSL (Lesotho Loti)</li>
            <li>All course information is based on real Lesotho institutions</li>
            <li>Existing applications will remain linked to updated courses</li>
            <li>Delete operation cannot be undone - use with caution!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UpdateCoursesToReal;
