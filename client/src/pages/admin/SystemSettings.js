import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import toast from 'react-hot-toast';
import seedTsepangApplications from '../../utils/seedTsepangApplications';

const SystemSettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    applicationDeadline: '',
    maxApplicationsPerStudent: 5,
    enableJobApplications: true,
    enableCourseApplications: true,
    requireTertiaryForJobs: true,
    maintenanceMode: false,
    systemMessage: '',
    contactEmail: 'support@careerpath.com',
    contactPhone: '+266 5000 0000'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'systemSettings', 'general'));
      if (settingsDoc.exists()) {
        setSettings({ ...settings, ...settingsDoc.data() });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    }
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      await setDoc(doc(db, 'systemSettings', 'general'), {
        ...settings,
        updatedAt: serverTimestamp()
      });
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedTsepangData = async () => {
    if (!window.confirm('This will create test applications for Tsepang Tsehla. Continue?')) {
      return;
    }

    try {
      setLoading(true);
      toast.loading('Seeding Tsepang\'s applications...');
      
      const result = await seedTsepangApplications();
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Failed to seed applications');
      }
    } catch (error) {
      console.error('Error seeding:', error);
      toast.error('Failed to seed applications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
          <p className="text-gray-600">Configure system-wide settings and preferences</p>
        </div>

        {/* Application Settings */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Deadline
              </label>
              <input
                type="date"
                value={settings.applicationDeadline}
                onChange={(e) => setSettings({ ...settings, applicationDeadline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Applications Per Student
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={settings.maxApplicationsPerStudent}
                onChange={(e) => setSettings({ ...settings, maxApplicationsPerStudent: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableCourseApplications"
                checked={settings.enableCourseApplications}
                onChange={(e) => setSettings({ ...settings, enableCourseApplications: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="enableCourseApplications" className="ml-2 block text-sm text-gray-700">
                Enable Course Applications
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableJobApplications"
                checked={settings.enableJobApplications}
                onChange={(e) => setSettings({ ...settings, enableJobApplications: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="enableJobApplications" className="ml-2 block text-sm text-gray-700">
                Enable Job Applications
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireTertiaryForJobs"
                checked={settings.requireTertiaryForJobs}
                onChange={(e) => setSettings({ ...settings, requireTertiaryForJobs: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="requireTertiaryForJobs" className="ml-2 block text-sm text-gray-700">
                Require Tertiary Qualification for Job Applications
              </label>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                Maintenance Mode (Disable user access)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Message (Display to all users)
              </label>
              <textarea
                value={settings.systemMessage}
                onChange={(e) => setSettings({ ...settings, systemMessage: e.target.value })}
                rows="3"
                placeholder="Enter a message to display to all users..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Phone
              </label>
              <input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Testing & Development */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Testing & Development</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Development tools for testing purposes. Use with caution.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSeedTsepangData}
              disabled={loading}
              className="w-full px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Seed Applications for Tsepang Tsehla'}
            </button>
            <p className="text-xs text-gray-500">
              Creates sample course and job applications for Tsepang Tsehla for testing purposes.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={fetchSettings}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
