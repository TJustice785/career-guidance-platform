import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import comprehensiveDatabaseSeeder from '../../utils/comprehensiveDatabaseSeeder';
import { FaDatabase, FaCheck, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SeedComprehensiveDatabase = () => {
  const { userData } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const handleSeedDatabase = async () => {
    if (!userData || userData.role !== 'admin') {
      toast.error('Only administrators can seed the database');
      return;
    }

    setSeeding(true);
    try {
      await comprehensiveDatabaseSeeder();
      setSeeded(true);
      toast.success('Database seeded successfully!');
    } catch (error) {
      console.error('Seeding error:', error);
      toast.error('Failed to seed database: ' + error.message);
    } finally {
      setSeeding(false);
    }
  };

  if (userData?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-3" />
            <h2 className="text-lg font-semibold text-red-800">Access Denied</h2>
          </div>
          <p className="text-red-700 mt-2">
            Only administrators can access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <FaDatabase className="mr-3" />
          Comprehensive Database Seeder
        </h1>
        <p className="text-gray-600">
          Populate the database with comprehensive sample data for testing and development
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">What will be created:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Users (6 total)</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 1 Admin user</li>
              <li>• 2 Student users with full profiles</li>
              <li>• 2 Company users</li>
              <li>• 1 Institution user</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Institutions (3 total)</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• National University of Lesotho</li>
              <li>• Institute of Development Management</li>
              <li>• Lesotho College of Education</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Companies (3 total)</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• TechCorp Lesotho</li>
              <li>• Lesotho Bank</li>
              <li>• Lesotho Mining Corporation</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Courses (3 total)</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Bachelor of Computer Science</li>
              <li>• Diploma in HR Management</li>
              <li>• Bachelor of Education</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Jobs (3 total)</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Software Developer</li>
              <li>• Business Analyst</li>
              <li>• Mining Engineer</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Applications & More</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 2 Sample applications</li>
              <li>• 1 Admission record</li>
              <li>• 2 Notifications</li>
              <li>• 2 System settings</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <div className="flex items-start">
          <FaExclamationTriangle className="text-yellow-500 mr-3 mt-1" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
            <p className="text-yellow-700 text-sm">
              This will add sample data to your database. If you're running this on a production database, 
              make sure you understand the implications. This seeder is designed for development and testing purposes.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        {seeded ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <FaCheck className="text-green-500 text-4xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Database Seeded Successfully!</h3>
            <p className="text-green-700">
              All sample data has been created. You can now test all functionalities of the platform.
            </p>
          </div>
        ) : (
          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-lg font-semibold"
          >
            {seeding ? (
              <>
                <FaSpinner className="animate-spin mr-3" />
                Seeding Database...
              </>
            ) : (
              <>
                <FaDatabase className="mr-3" />
                Seed Comprehensive Database
              </>
            )}
          </button>
        )}
      </div>

      {seeded && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Next Steps:</h3>
          <div className="space-y-2 text-blue-700">
            <p>1. <strong>Test Student Login:</strong> Use john.doe@email.com or jane.smith@email.com</p>
            <p>2. <strong>Test Company Login:</strong> Use hr@techcorp.co.ls or recruitment@lesothobank.co.ls</p>
            <p>3. <strong>Test Institution Login:</strong> Use admin@nul.ac.ls</p>
            <p>4. <strong>Browse Opportunities:</strong> Check personalized recommendations for students</p>
            <p>5. <strong>Test Applications:</strong> Apply for jobs and courses</p>
            <p>6. <strong>Manage Data:</strong> Use admin dashboard to manage all data</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeedComprehensiveDatabase;
