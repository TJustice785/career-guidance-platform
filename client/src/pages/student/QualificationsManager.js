import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaGraduationCap, FaAward, FaBook, FaStar } from 'react-icons/fa';
import { calculatePoints, calculateCredits } from '../../utils/qualificationMatcher';

const QualificationsManager = () => {
  const { userData, currentUser, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
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
    
    // Additional Qualifications
    certifications: userData?.certifications || [],
    skills: userData?.skills || [],
    languages: userData?.languages || [],
    workExperience: userData?.workExperience || [],
    
    // Contact Information
    address: userData?.address || '',
    emergencyContact: userData?.emergencyContact || '',
    emergencyPhone: userData?.emergencyPhone || ''
  });

  const [newCertification, setNewCertification] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newSubject, setNewSubject] = useState({ name: '', grade: '' });
  const [newWorkExperience, setNewWorkExperience] = useState({
    position: '',
    company: '',
    duration: '',
    description: ''
  });

  const grades = ['A', 'B', 'C', 'D', 'E', 'F'];

  const availableSubjects = [
    'Mathematics', 'English', 'Sesotho', 'Science', 'Biology', 'Chemistry', 'Physics',
    'History', 'Geography', 'Economics', 'Business Studies', 'Computer Science',
    'Art', 'Music', 'Physical Education', 'Agriculture', 'Home Economics',
    'Accounting', 'Statistics', 'Literature', 'French', 'German'
  ];

  // Update form data when userData changes (e.g., after save or navigation)
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth || '',
        currentGrade: userData.currentGrade || '',
        subjects: userData.subjects || [],
        previousSchool: userData.previousSchool || '',
        graduationYear: userData.graduationYear || '',
        academicAchievements: userData.academicAchievements || '',
        certifications: userData.certifications || [],
        skills: userData.skills || [],
        languages: userData.languages || [],
        workExperience: userData.workExperience || [],
        address: userData.address || '',
        emergencyContact: userData.emergencyContact || '',
        emergencyPhone: userData.emergencyPhone || ''
      });
    }
  }, [userData]);

  const gradeLevels = [
    'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
    'Certificate', 'Diploma', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSubject = () => {
    if (newSubject.name && newSubject.grade) {
      const subjectString = `${newSubject.name} - ${newSubject.grade}`;
      // Check if subject already exists
      const exists = formData.subjects.some(s => 
        s.split(' - ')[0] === newSubject.name
      );
      
      if (exists) {
        toast.error('Subject already added');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, subjectString]
      }));
      setNewSubject({ name: '', grade: '' });
    } else {
      toast.error('Please select both subject and grade');
    }
  };

  const handleRemoveSubject = (index) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const handleAddCertification = () => {
    if (newCertification.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const handleRemoveCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim()) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const handleAddWorkExperience = () => {
    if (newWorkExperience.position.trim() && newWorkExperience.company.trim()) {
      setFormData(prev => ({
        ...prev,
        workExperience: [...prev.workExperience, { ...newWorkExperience }]
      }));
      setNewWorkExperience({
        position: '',
        company: '',
        duration: '',
        description: ''
      });
    }
  };

    const handleRemoveWorkExperience = (index) => {
      setFormData(prev => ({
        ...prev,
        workExperience: prev.workExperience.filter((_, i) => i !== index)
      }));
    };

    const sanitizeArray = (value) => {
      if (!Array.isArray(value)) return [];
      return value.filter(v => v != null && v !== '');
    };
    
    const sanitizeString = (value) => {
      if (value === null || value === undefined) return '';
      if (typeof value === 'string') return value;
      return String(value);
    };

    const sanitizeWorkExperience = (arr) => {
      const items = Array.isArray(arr) ? arr : [];
      return items
        .filter(item => item && (item.position || item.company || item.duration || item.description))
        .map(item => ({
          position: sanitizeString(item.position),
          company: sanitizeString(item.company),
          duration: sanitizeString(item.duration),
          description: sanitizeString(item.description)
        }));
    };

    const handleSave = async () => {
      try {
        setLoading(true);
        
        if (!currentUser || !currentUser.uid) {
          toast.error('User not logged in or user ID is missing');
          setLoading(false);
          return;
        }
        
        // Build payload with only defined values
        const payload = {};
        
        // Add string fields
        const stringFields = [
          'firstName', 'lastName', 'email', 'phone', 'dateOfBirth',
          'currentGrade', 'previousSchool', 'graduationYear', 
          'academicAchievements', 'address', 'emergencyContact', 'emergencyPhone'
        ];
        
        stringFields.forEach(field => {
          const value = sanitizeString(formData[field]);
          if (value !== '') {
            payload[field] = value;
          }
        });
        
        // Add array fields
        payload.subjects = sanitizeArray(formData.subjects);
        payload.certifications = sanitizeArray(formData.certifications);
        payload.skills = sanitizeArray(formData.skills);
        payload.languages = sanitizeArray(formData.languages);
        payload.workExperience = sanitizeWorkExperience(formData.workExperience);

        // Use updateUserProfile from AuthContext to ensure userData is refreshed
        await updateUserProfile(payload);
        
        setEditing(false);
      } catch (error) {
        console.error('Error updating qualifications:', error);
        toast.error('Failed to update qualifications: ' + (error.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    const handleCancel = () => {
      setFormData({
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        email: userData?.email || '',
        phone: userData?.phone || '',
        dateOfBirth: userData?.dateOfBirth || '',
        currentGrade: userData?.currentGrade || '',
        subjects: userData?.subjects || [],
        previousSchool: userData?.previousSchool || '',
        graduationYear: userData?.graduationYear || '',
        academicAchievements: userData?.academicAchievements || '',
        certifications: userData?.certifications || [],
        skills: userData?.skills || [],
        languages: userData?.languages || [],
        workExperience: userData?.workExperience || [],
        address: userData?.address || '',
        emergencyContact: userData?.emergencyContact || '',
        emergencyPhone: userData?.emergencyPhone || ''
      });
      setEditing(false);
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Qualifications</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your academic and professional qualifications</p>
        </div>

        {!editing ? (
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-dark-100 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <FaGraduationCap className="mr-2" />
                  Personal Information
                </h2>
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <FaEdit className="mr-2" />
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <p className="text-gray-900 dark:text-white">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <p className="text-gray-900 dark:text-white">{formData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <p className="text-gray-900 dark:text-white">{formData.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                  <p className="text-gray-900 dark:text-white">{formData.dateOfBirth || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white dark:bg-dark-100 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaBook className="mr-2" />
                Academic Information
              </h2>
              
              {/* Credits & Points Summary */}
              {formData.subjects.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/30 dark:to-teal-900/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formData.subjects.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Total Subjects</div>
                  </div>
                  <div className="text-center border-x border-gray-300 dark:border-gray-600">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 flex items-center justify-center">
                      <FaStar className="mr-1 text-2xl" />
                      {calculateCredits(formData.subjects)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Credits (C+ grades)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">{calculatePoints(formData.subjects)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Total Points</div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Grade/Level</label>
                  <p className="text-gray-900 dark:text-white">{formData.currentGrade || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Previous School</label>
                  <p className="text-gray-900 dark:text-white">{formData.previousSchool || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Graduation Year</label>
                  <p className="text-gray-900 dark:text-white">{formData.graduationYear || 'Not specified'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subjects & Grades</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.subjects.length > 0 ? (
                      formData.subjects.map((subject, index) => {
                        const [subjectName, grade] = subject.split(' - ');
                        return (
                          <span key={index} className={`px-3 py-1 text-sm rounded-full font-medium ${
                            grade === 'A' ? 'bg-green-100 text-green-800' :
                            grade === 'B' ? 'bg-blue-100 text-blue-800' :
                            grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                            grade === 'D' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {subjectName}: <strong>{grade}</strong>
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">No subjects added</span>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Academic Achievements</label>
                  <p className="text-gray-900 dark:text-white">{formData.academicAchievements || 'None specified'}</p>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white dark:bg-dark-100 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaAward className="mr-2" />
                Certifications
              </h2>
              <div className="space-y-2">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>{cert}</span>
                  </div>
                ))}
                {formData.certifications.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400">No certifications added</p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {skill}
                  </span>
                ))}
                {formData.skills.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400">No skills added</p>
                )}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {formData.languages.map((language, index) => (
                  <span key={index} className="px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full">
                    {language}
                  </span>
                ))}
                {formData.languages.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400">No languages added</p>
                )}
              </div>
            </div>

            {/* Work Experience */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Work Experience</h2>
              <div className="space-y-4">
                {formData.workExperience.map((exp, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.duration}</p>
                    <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                  </div>
                ))}
                {formData.workExperience.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400">No work experience added</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Personal Information Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
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

            {/* Academic Information Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Academic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Grade/Level *</label>
                  <select
                    name="currentGrade"
                    value={formData.currentGrade}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Grade</option>
                    {gradeLevels.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Previous School</label>
                  <input
                    type="text"
                    name="previousSchool"
                    value={formData.previousSchool}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Achievements</label>
                  <textarea
                    name="academicAchievements"
                    value={formData.academicAchievements}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="List any academic awards, honors, or achievements..."
                  />
                </div>
              </div>

              {/* Subjects with Grades */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subjects & Grades</label>
                
                {/* Display added subjects */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.subjects.map((subject, index) => {
                    const [subjectName, grade] = subject.split(' - ');
                    return (
                      <span key={index} className={`flex items-center px-3 py-1 text-sm rounded-full font-medium ${
                        grade === 'A' ? 'bg-green-100 text-green-800' :
                        grade === 'B' ? 'bg-blue-100 text-blue-800' :
                        grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                        grade === 'D' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {subjectName}: <strong className="ml-1">{grade}</strong>
                        <button
                          onClick={() => handleRemoveSubject(index)}
                          className="ml-2 text-current hover:opacity-70"
                          type="button"
                        >
                          <FaTimes />
                        </button>
                      </span>
                    );
                  })}
                </div>

                {/* Add new subject */}
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select
                      value={newSubject.name}
                      onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Subject</option>
                      {availableSubjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                    <select
                      value={newSubject.grade}
                      onChange={(e) => setNewSubject(prev => ({ ...prev, grade: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Grade</option>
                      {grades.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddSubject}
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                    >
                      <FaPlus className="mr-2" />
                      Add Subject
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Certifications</h2>
              <div className="space-y-2 mb-4">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>{cert}</span>
                    <button
                      onClick={() => handleRemoveCertification(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  placeholder="Add certification..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddCertification}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <FaTimes />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Languages</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.languages.map((language, index) => (
                  <span key={index} className="flex items-center px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full">
                    {language}
                    <button
                      onClick={() => handleRemoveLanguage(index)}
                      className="ml-2 text-teal-600 hover:text-teal-800"
                    >
                      <FaTimes />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="Add language..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddLanguage}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Work Experience */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Work Experience</h2>
              <div className="space-y-4 mb-4">
                {formData.workExperience.map((exp, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500">{exp.duration}</p>
                        <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveWorkExperience(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={newWorkExperience.position}
                    onChange={(e) => setNewWorkExperience(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="Position/Job Title"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={newWorkExperience.company}
                    onChange={(e) => setNewWorkExperience(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Company/Organization"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  value={newWorkExperience.duration}
                  onChange={(e) => setNewWorkExperience(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="Duration (e.g., Jan 2020 - Dec 2021)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  value={newWorkExperience.description}
                  onChange={(e) => setNewWorkExperience(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Job description and responsibilities..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddWorkExperience}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FaPlus className="mr-2" />
                  Add Work Experience
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default QualificationsManager;
