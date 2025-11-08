import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import basicAdminSeeder from '../../utils/basicAdminSeeder';
import { FaUserPlus, FaCheck, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CreateAdminUser = () => {
  const { userData } = useAuth();
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const handleCreateAdmin = async () => {
    setCreating(true);
    try {
      await basicAdminSeeder();
      setCreated(true);
      toast.success('Admin user created successfully!');
    } catch (error) {
      console.error('Creation error:', error);
      toast.error('Failed to create admin user: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <FaUserPlus className="mr-3" />
          Create Admin User
        </h1>
        <p className="text-gray-600">
          Create the initial admin user to access the database seeding functionality
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Admin User Details:</h2>
        <div className="space-y-2">
          <p><strong>Email:</strong> thabotsehla31@gmail.com</p>
          <p><strong>Name:</strong> Thabo Tsehla</p>
          <p><strong>Role:</strong> admin</p>
          <p><strong>Phone:</strong> +266 1234 5678</p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <div className="flex items-start">
          <FaExclamationTriangle className="text-yellow-500 mr-3 mt-1" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
            <p className="text-yellow-700 text-sm">
              This will create the initial admin user. After creation, you can use this admin account 
              to access the comprehensive database seeding functionality.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        {created ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <FaCheck className="text-green-500 text-4xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Admin User Created Successfully!</h3>
            <p className="text-green-700 mb-4">
              The admin user has been created. You can now proceed to seed the comprehensive database.
            </p>
            <div className="space-y-2 text-green-700">
              <p><strong>Next Steps:</strong></p>
              <p>1. Logout and login with: thabotsehla31@gmail.com</p>
              <p>2. Navigate to "Seed Database" in the admin menu</p>
              <p>3. Click "Seed Comprehensive Database" to populate all sample data</p>
            </div>
          </div>
        ) : (
          <button
            onClick={handleCreateAdmin}
            disabled={creating}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-lg font-semibold"
          >
            {creating ? (
              <>
                <FaSpinner className="animate-spin mr-3" />
                Creating Admin User...
              </>
            ) : (
              <>
                <FaUserPlus className="mr-3" />
                Create Admin User
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateAdminUser;
