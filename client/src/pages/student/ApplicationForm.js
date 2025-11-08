import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import toast from 'react-hot-toast';
import { FaGraduationCap, FaBriefcase, FaFileAlt, FaCheck } from 'react-icons/fa';

const ApplicationForm = ({ type, itemId, itemName, companyId, onClose, onSuccess }) => {
  const { userData, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    dateOfBirth: userData?.dateOfBirth || '',
    
    // Academic Information
    currentGrade: userData?.currentGrade || '',
    subjects: userData?.subjects || [],
    previousSchool: userData?.previousSchool || '',
    graduationYear: userData?.graduationYear || '',
    academicAchievements: userData?.academicAchievements || '',
    
    // Additional qualifications from profile
    certifications: userData?.certifications || [],
    skills: userData?.skills || [],
    languages: userData?.languages || [],
    workExperience: userData?.workExperience || [],
    
    // Application Specific
    motivation: '',
    coverLetter: '',
    additionalInfo: '',
    
    // Documents
    documents: []
  });

  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        firstName: userData.firstName || prev.firstName,
        lastName: userData.lastName || prev.lastName,
        email: userData.email || prev.email,
        phone: userData.phone || prev.phone,
        dateOfBirth: userData.dateOfBirth || prev.dateOfBirth,
        currentGrade: userData.currentGrade || prev.currentGrade,
        subjects: userData.subjects || [],
        previousSchool: userData.previousSchool || prev.previousSchool,
        graduationYear: userData.graduationYear || prev.graduationYear,
        academicAchievements: userData.academicAchievements || prev.academicAchievements,
        certifications: userData.certifications || [],
        skills: userData.skills || [],
        languages: userData.languages || [],
        workExperience: userData.workExperience || []
      }));
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Helper function to check if user has tertiary education
  const hasTertiaryEducation = (currentGrade) => {
    const tertiaryLevels = ['certificate', 'diploma', "bachelor's", "master's", 'phd', 'degree'];
    return tertiaryLevels.some(level => currentGrade.toLowerCase().includes(level));
  };

  // Helper function to calculate credits (subjects with C or better)
  const calculateCredits = (subjects) => {
    if (!Array.isArray(subjects)) return 0;
    let credits = 0;
    subjects.forEach(subject => {
      const grade = subject.split('-').pop()?.trim().toUpperCase();
      if (['A', 'B', 'C'].includes(grade)) {
        credits++;
      }
    });
    return credits;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate user is logged in
      if (!currentUser || !currentUser.uid) {
        toast.error('Please login to submit application');
        setLoading(false);
        return;
      }

      // Validate itemId is provided
      if (!itemId) {
        toast.error('Invalid course/job ID');
        setLoading(false);
        return;
      }

      // Validate qualifications exist
      if (!formData.subjects || formData.subjects.length === 0) {
        toast.error('Please add your qualifications (subjects with grades) in your profile first');
        setLoading(false);
        return;
      }

      // For job applications, validate tertiary education completion
      if (type === 'job') {
        if (!formData.currentGrade || !hasTertiaryEducation(formData.currentGrade)) {
          toast.error('Job applications require completion of tertiary education (Certificate, Diploma, or Degree)');
          setLoading(false);
          return;
        }
      }

      // Get all applications for this student
      const existingAppsQuery = query(
        collection(db, 'applications'),
        where('studentId', '==', currentUser.uid)
      );
      const existingAppsSnapshot = await getDocs(existingAppsQuery);
      
      // Check for same course name rather than ID
      const alreadyApplied = existingAppsSnapshot.docs.some(doc => {
        const appData = doc.data();
        return appData.courseName === itemName;
      });
      
      if (alreadyApplied) {
        toast.error(`You have already applied to ${itemName}`);
        setLoading(false);
        return;
      }

      const credits = calculateCredits(formData.subjects);

      const applicationData = {
        studentId: currentUser.uid,
        studentName: `${formData.firstName} ${formData.lastName}`,
        studentEmail: formData.email,
        studentPhone: formData.phone,
        studentDateOfBirth: formData.dateOfBirth,
        
        // Academic Information with Qualifications
        currentGrade: formData.currentGrade,
        subjects: formData.subjects, // Subjects with grades (e.g., "Mathematics - A")
        previousSchool: formData.previousSchool,
        graduationYear: formData.graduationYear,
        academicAchievements: formData.academicAchievements,
        
        // Qualifications Summary
        credits: credits,
        totalSubjects: formData.subjects.length,
        
        // Additional Qualifications
        certifications: formData.certifications,
        skills: formData.skills,
        languages: formData.languages,
        workExperience: formData.workExperience,
        
        // Application Details
        motivation: formData.motivation,
        coverLetter: formData.coverLetter,
        additionalInfo: formData.additionalInfo,
        
        // Application Metadata
        applicationType: type,
        status: 'pending',
        appliedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      // Add type-specific fields
      if (type === 'job') {
        applicationData.jobId = itemId;
        applicationData.jobTitle = itemName;
        applicationData.companyId = companyId; // Add companyId for job applications
      } else {
        applicationData.courseId = itemId;
        applicationData.courseName = itemName;
      }

      // Get institution details first
      const institutionsQuery = query(
        collection(db, 'institutions'),
        where('name', '==', 'Machabeng College')
      );
      const institutionsSnapshot = await getDocs(institutionsQuery);
      
      if (institutionsSnapshot.empty) {
        toast.error('Institution not found');
        return;
      }

      const institution = institutionsSnapshot.docs[0];
      console.log('Found institution:', institution.id, institution.data());

      // Add institution details to application
      const finalApplicationData = {
        ...applicationData,
        institutionId: institution.id,
        institutionName: institution.data().name,
        ownerId: institution.id
      };

      await addDoc(collection(db, 'applications'), finalApplicationData);

      toast.success('Application submitted successfully!');
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Apply for {type === 'job' ? 'Job' : 'Course'}: {itemName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Job Application Requirements Notice */}
          {type === 'job' && (
            <div className={`p-4 rounded-lg border ${
              formData.currentGrade && hasTertiaryEducation(formData.currentGrade)
                ? 'bg-green-50 border-green-200'
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {formData.currentGrade && hasTertiaryEducation(formData.currentGrade) ? (
                    <FaCheck className="text-green-600 text-xl" />
                  ) : (
                    <span className="text-yellow-600 text-xl">⚠️</span>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <h3 className={`text-sm font-medium ${
                    formData.currentGrade && hasTertiaryEducation(formData.currentGrade)
                      ? 'text-green-800'
                      : 'text-yellow-800'
                  }`}>
                    Tertiary Education Requirement
                  </h3>
                  <div className={`mt-1 text-sm ${
                    formData.currentGrade && hasTertiaryEducation(formData.currentGrade)
                      ? 'text-green-700'
                      : 'text-yellow-700'
                  }`}>
                    {formData.currentGrade && hasTertiaryEducation(formData.currentGrade) ? (
                      <p>✓ You meet the tertiary education requirement ({formData.currentGrade})</p>
                    ) : (
                      <p>Job applications require completion of tertiary education (Certificate, Diploma, Bachelor's Degree, Master's Degree, or PhD). Current level: {formData.currentGrade || 'Not specified'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Personal Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaFileAlt className="mr-2" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaGraduationCap className="mr-2" />
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Grade/Level *
                </label>
                <select
                  name="currentGrade"
                  value={formData.currentGrade}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Grade</option>
                  <option value="Grade 12">Grade 12</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelor's">Bachelor's Degree</option>
                  <option value="Master's">Master's Degree</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Previous School/Institution
                </label>
                <input
                  type="text"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Graduation Year
                </label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  min="1990"
                  max="2030"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Qualifications Display */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Qualifications
              </label>
              
              {formData.subjects && formData.subjects.length > 0 ? (
                <div className="space-y-3">
                  {/* Summary Stats */}
                  <div className="flex gap-4 p-3 bg-blue-100 rounded-md">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-800">{formData.subjects.length}</div>
                      <div className="text-xs text-blue-600">Total Subjects</div>
                    </div>
                    <div className="text-center border-l border-blue-300 pl-4">
                      <div className="text-xl font-bold text-green-800">{calculateCredits(formData.subjects)}</div>
                      <div className="text-xs text-green-600">Credits (A-C)</div>
                    </div>
                  </div>
                  
                  {/* Subjects with Grades */}
                  <div className="flex flex-wrap gap-2">
                    {formData.subjects.map((subject, index) => {
                      const [subjectName, grade] = subject.split(' - ');
                      return (
                        <span key={index} className={`px-3 py-1 text-sm rounded-full font-medium ${
                          grade === 'A' ? 'bg-green-100 text-green-800' :
                          grade === 'B' ? 'bg-blue-100 text-blue-800' :
                          grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                          grade === 'D' ? 'bg-orange-100 text-orange-800' :
                          grade === 'E' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {subjectName}: <strong>{grade}</strong>
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    ⚠️ No qualifications found. Please add your subjects with grades in your{' '}
                    <a href="/student/qualifications" className="font-semibold underline">Qualifications Manager</a> first.
                  </p>
                </div>
              )}
            </div>
            
            {/* Additional Qualifications Preview */}
            {(formData.certifications.length > 0 || formData.skills.length > 0 || formData.languages.length > 0) && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-xs font-medium text-gray-700 mb-2">Additional Qualifications:</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {formData.certifications.length > 0 && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                      {formData.certifications.length} Certification(s)
                    </span>
                  )}
                  {formData.skills.length > 0 && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                      {formData.skills.length} Skill(s)
                    </span>
                  )}
                  {formData.languages.length > 0 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {formData.languages.length} Language(s)
                    </span>
                  )}
                  {formData.workExperience.length > 0 && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
                      {formData.workExperience.length} Work Experience(s)
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Achievements
              </label>
              <textarea
                name="academicAchievements"
                value={formData.academicAchievements}
                onChange={handleInputChange}
                rows="3"
                placeholder="List any academic awards, honors, or achievements..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Application Specific */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              {type === 'job' ? <FaBriefcase className="mr-2" /> : <FaGraduationCap className="mr-2" />}
              Application Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Why are you interested in this {type}? *
                </label>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder={`Explain why you want to apply for this ${type}...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Write a cover letter explaining your qualifications and interest..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any additional information you'd like to share..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FaCheck className="mr-2" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
