import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaGraduationCap, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { inputClasses, textareaClasses, selectClasses } from '../styles/formStyles';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Student fields
    firstName: '',
    lastName: '',
    // Institute/Company fields
    name: '',
    description: '',
    address: '',
    phone: '',
    website: '',
    // Company specific
    industry: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, email, password, ...otherData } = formData;
      
      // Prepare user data for Firestore
      const userData = {
        ...otherData,
        role: formData.role
      };
      
      await register(email, password, userData);

      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      // Error toast is already shown by AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80" 
          alt="Students studying"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-dark/95 via-dark/90 to-primary-900/80"></div>
      </div>
      
      <div className="max-w-2xl w-full relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <FaGraduationCap className="text-primary-600 text-5xl" />
          </Link>
          <h2 className="text-3xl font-extrabold text-white mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-300">
            {step === 1 ? 'Choose your account type' : 'Fill in your details'}
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-dark-300/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700/50">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-dark0 text-gray-300'}`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-dark0'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-dark0 text-gray-300'}`}>
                2
              </div>
            </div>
          </div>

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleRoleSelect('student')}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-600 hover:shadow-lg transition group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition">🎓</div>
                <h3 className="text-lg font-bold text-white mb-2">Student</h3>
                <p className="text-sm text-gray-300">Apply to institutions and find jobs</p>
              </button>

              <button
                onClick={() => handleRoleSelect('institute')}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-600 hover:shadow-lg transition group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition">🏛️</div>
                <h3 className="text-lg font-bold text-white mb-2">Institution</h3>
                <p className="text-sm text-gray-300">Manage courses and students</p>
              </button>

              <button
                onClick={() => handleRoleSelect('company')}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-600 hover:shadow-lg transition group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition">💼</div>
                <h3 className="text-lg font-bold text-white mb-2">Company</h3>
                <p className="text-sm text-gray-300">Post jobs and hire talents</p>
              </button>
            </div>
          )}

          {/* Step 2: Details Form */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Fields */}
              {formData.role === 'student' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Thabo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Mokoena"
                    />
                  </div>
                </div>
              )}

              {/* Institute/Company Fields */}
              {(formData.role === 'institute' || formData.role === 'company') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      {formData.role === 'institute' ? 'Institution Name' : 'Company Name'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder={formData.role === 'institute' ? 'National University of Lesotho' : 'Lesotho Tech Solutions'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Brief description..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="+266 xxxx xxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="https://yoursite.co.ls"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Maseru, Lesotho"
                    />
                  </div>

                  {formData.role === 'company' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Industry
                      </label>
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Select industry</option>
                        <option value="Technology">Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Retail">Retail</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  )}
                </>
              )}

              {/* Common Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="your.email@mail.ls"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition pr-12"
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-200"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Confirm your password"
                />
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600 rounded mt-1"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-200">
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 text-gray-200 py-3 px-4 rounded-lg hover:bg-dark0 transition font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Login Link */}
          {step === 1 && (
            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-300 hover:text-white text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;