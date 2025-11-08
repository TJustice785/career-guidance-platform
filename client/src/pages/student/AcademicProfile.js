import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import { toast } from 'react-hot-toast';

const AcademicProfile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    currentGrade: '',
    subjects: [],
    skills: [],
    certifications: [],
    languages: [],
    workExperience: []
  });
  const [newSubject, setNewSubject] = useState({ name: '', grade: '' });
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  useEffect(() => {
    fetchAcademicProfile();
  }, [currentUser]);

  const fetchAcademicProfile = async () => {
    if (!currentUser?.uid) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setFormData({
          currentGrade: data.currentGrade || '',
          subjects: data.subjects || [],
          skills: data.skills || [],
          certifications: data.certifications || [],
          languages: data.languages || [],
          workExperience: data.workExperience || []
        });
      }
    } catch (error) {
      console.error('Error fetching academic profile:', error);
      toast.error('Failed to load academic profile');
    }
  };

  const calculateCredits = () => {
    return formData.subjects.filter(subject => {
      const grade = subject.grade?.toUpperCase();
      return ['A', 'B', 'C'].includes(grade);
    }).length;
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const credits = calculateCredits();
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        currentGrade: formData.currentGrade,
        subjects: formData.subjects,
        credits: credits,
        skills: formData.skills,
        certifications: formData.certifications,
        languages: formData.languages,
        workExperience: formData.workExperience,
        updatedAt: new Date()
      });

      toast.success('Academic profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating academic profile:', error);
      toast.error('Failed to update academic profile');
    } finally {
      setLoading(false);
    }
  };

  const addSubject = () => {
    if (newSubject.name && newSubject.grade) {
      const subjectString = `${newSubject.name} - ${newSubject.grade}`;
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, subjectString]
      }));
      setNewSubject({ name: '', grade: '' });
    } else {
      toast.error('Please enter both subject name and grade');
    }
  };

  const removeSubject = (index) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const credits = calculateCredits();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Academic Profile</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your academic information, subjects, and qualifications
              </p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    fetchAcademicProfile();
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Current Grade */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Current Grade Level</h3>
          <select
            value={formData.currentGrade}
            onChange={(e) => setFormData(prev => ({ ...prev, currentGrade: e.target.value }))}
            disabled={!isEditing}
            className={`w-full max-w-md px-4 py-2 border rounded-lg ${
              isEditing 
                ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700' 
                : 'border-transparent bg-gray-50 dark:bg-gray-900 text-gray-500'
            } text-gray-900 dark:text-white`}
          >
            <option value="">Select Grade Level</option>
            <option value="Form A">Form A</option>
            <option value="Form B">Form B</option>
            <option value="Form C">Form C</option>
            <option value="Form D">Form D</option>
            <option value="Form E">Form E</option>
            <option value="Certificate">Certificate</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
          </select>
        </div>

        {/* Subjects and Grades */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Subjects & Grades</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Credits: <span className="font-bold text-green-600">{credits}</span> 
                <span className="text-xs ml-2">(Subjects with A, B, or C grades)</span>
              </p>
            </div>
          </div>

          {isEditing && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Add New Subject</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Subject name (e.g., Mathematics)"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <select
                  value={newSubject.grade}
                  onChange={(e) => setNewSubject(prev => ({ ...prev, grade: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Grade</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="U">U</option>
                </select>
                <button
                  onClick={addSubject}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {formData.subjects.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No subjects added yet. {isEditing && 'Add your subjects above.'}
              </p>
            ) : (
              formData.subjects.map((subject, index) => {
                const [name, grade] = subject.split(' - ');
                const isCredit = ['A', 'B', 'C'].includes(grade?.trim().toUpperCase());
                
                return (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      isCredit 
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                        : 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-sm font-bold rounded ${
                        isCredit 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-400 text-white'
                      }`}>
                        {grade}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">{name}</span>
                      {isCredit && (
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                          ✓ Credit
                        </span>
                      )}
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => removeSubject(index)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Skills</h3>
          
          {isEditing && (
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                placeholder="Add a skill (e.g., Python, Leadership)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={addSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {formData.skills.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No skills added yet</p>
            ) : (
              formData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full flex items-center gap-2"
                >
                  <span>{skill}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(index)}
                      className="text-blue-700 dark:text-blue-200 hover:text-blue-900 dark:hover:text-blue-100"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Certifications */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Certifications</h3>
          
          {isEditing && (
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                placeholder="Add a certification"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={addCertification}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add
              </button>
            </div>
          )}

          <div className="space-y-2">
            {formData.certifications.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No certifications added yet</p>
            ) : (
              formData.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                >
                  <span className="text-gray-900 dark:text-white">{cert}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeCertification(index)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Languages */}
        <div className="px-6 py-5">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Languages</h3>
          
          {isEditing && (
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                placeholder="Add a language"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={addLanguage}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {formData.languages.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No languages added yet</p>
            ) : (
              formData.languages.map((language, index) => (
                <div
                  key={index}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 rounded-full flex items-center gap-2"
                >
                  <span>{language}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeLanguage(index)}
                      className="text-indigo-700 dark:text-indigo-200 hover:text-indigo-900 dark:hover:text-indigo-100"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicProfile;
