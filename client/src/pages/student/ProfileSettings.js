import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api.service';
import { toast } from 'react-toastify';

const ProfileSettings = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      address: currentUser?.address || '',
      city: currentUser?.city || '',
      country: currentUser?.country || 'Lesotho',
      bio: currentUser?.bio || '',
      education: currentUser?.education || [
        { institution: '', qualification: '', year: '' }
      ]
    }
  });

  useEffect(() => {
    if (currentUser?.photoURL) {
      setProfileImage(currentUser.photoURL);
    }
  }, [currentUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await api.uploadProfileImage(formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      setProfileImage(response.data.imageUrl);
      await updateUserProfile({ photoURL: response.data.imageUrl });
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await api.student.updateProfile(data);
      await updateUserProfile(data);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await api.auth.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      toast.success('Password updated successfully');
      reset({}, { keepValues: true });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">Profile Settings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Update your account information and manage your profile
          </p>
        </div>

        {/* Profile Picture */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400">
                    <svg
                      className="h-12 w-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="absolute -bottom-2 left-0 right-0">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="ml-6">
              <label
                htmlFor="profile-image"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
              >
                {loading ? 'Uploading...' : 'Change Photo'}
                <input
                  id="profile-image"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={loading}
                />
              </label>
              <p className="mt-2 text-xs text-gray-500">
                JPG, GIF or PNG. Max size 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  {...register('firstName', { required: 'First name is required' })}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md ${isEditing ? 'border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500' : 'border-transparent bg-gray-50'} border py-2 px-3`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  {...register('lastName', { required: 'Last name is required' })}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md ${isEditing ? 'border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500' : 'border-transparent bg-gray-50'} border py-2 px-3`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  disabled
                  className="mt-1 block w-full rounded-md border-transparent bg-gray-100 py-2 px-3 text-gray-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register('phone', {
                    pattern: {
                      value: /^[0-9+\-\s()]*$/,
                      message: 'Invalid phone number',
                    },
                  })}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md ${isEditing ? 'border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500' : 'border-transparent bg-gray-50'} border py-2 px-3`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={3}
                  {...register('bio')}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md ${isEditing ? 'border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500' : 'border-transparent bg-gray-50'} border py-2 px-3`}
                  placeholder="Tell us a little about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  {...register('address')}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md ${isEditing ? 'border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500' : 'border-transparent bg-gray-50'} border py-2 px-3`}
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  {...register('city')}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md ${isEditing ? 'border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500' : 'border-transparent bg-gray-50'} border py-2 px-3`}
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <select
                  id="country"
                  {...register('country')}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md ${isEditing ? 'border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500' : 'border-transparent bg-gray-50'} border py-2 px-3`}
                >
                  <option value="Lesotho">Lesotho</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Education</h3>
              {isEditing && (
                <button
                  type="button"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={() => {
                    // Add new education field
                    const currentEducation = getValues('education') || [];
                    setValue('education', [
                      ...currentEducation,
                      { institution: '', qualification: '', year: '' },
                    ]);
                  }}
                >
                  + Add Education
                </button>
              )}
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="mb-4 p-4 bg-gray-50 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Institution</label>
                    <input
                      type="text"
                      {...register(`education.${index}.institution`)}
                      disabled={!isEditing}
                      className={`mt-1 block w-full rounded-md ${isEditing ? 'border-gray-300 shadow-sm' : 'border-transparent bg-white'} border py-2 px-3`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Qualification</label>
                    <input
                      type="text"
                      {...register(`education.${index}.qualification`)}
                      disabled={!isEditing}
                      className={`mt-1 block w-full rounded-md ${isEditing ? 'border-gray-300 shadow-sm' : 'border-transparent bg-white'} border py-2 px-3`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year</label>
                    <div className="flex">
                      <input
                        type="number"
                        min="1900"
                        max={new Date().getFullYear() + 5}
                        {...register(`education.${index}.year`)}
                        disabled={!isEditing}
                        className={`mt-1 block w-full rounded-l-md ${isEditing ? 'border-gray-300 shadow-sm' : 'border-transparent bg-white'} border py-2 px-3`}
                      />
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="mt-1 inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-white text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-1 focus:ring-red-500 rounded-r-md"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 text-right">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Profile
              </button>
            ) : (
              <div className="space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setIsEditing(false);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
        </div>
        <form onSubmit={handleSubmit(handleChangePassword)} className="px-6 py-5">
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                {...register('currentPassword', { required: 'Current password is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
              />
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register('confirmPassword', {
                  required: 'Please confirm your new password',
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
