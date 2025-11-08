import React, { useState } from 'react';
import { auth, db } from '../config/firebase.config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

function CreateAdmin() {
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);

  const createAdminUser = async () => {
    setLoading(true);

    const adminData = {
      email: 'thabotsehla31@gmail.com',
      password: 'vegetarian@31',
      firstName: 'Thabo',
      lastName: 'Admin',
      fullName: 'Justice',
      role: 'admin'
    };

    try {
      console.log('Creating admin user...');
      
      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        adminData.email,
        adminData.password
      );
      
      const user = userCredential.user;
      console.log('✅ Auth user created with UID:', user.uid);

      // Create Firestore user document
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: adminData.email,
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        fullName: adminData.fullName,
        role: adminData.role,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('✅ Admin user created successfully!');
      toast.success('Admin user created successfully!');
      setCreated(true);
      
    } catch (error) {
      console.error('❌ Error creating admin user:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error('User already exists. You can login with these credentials.');
        setCreated(true);
      } else {
        toast.error('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Create Admin User
        </h1>

        {!created ? (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Admin Credentials:</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Email:</strong> thabotsehla31@gmail.com</p>
                <p><strong>Password:</strong> vegetarian@31</p>
                <p><strong>Name:</strong> Thabo</p>
                <p><strong>Role:</strong> Admin</p>
              </div>
            </div>

            <button
              onClick={createAdminUser}
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating Admin User...' : 'Create Admin User'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Click the button above to create the admin user in Firebase
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-success-50 border border-success-200 rounded-lg p-4 text-center">
              <div className="text-success-600 text-5xl mb-4">✅</div>
              <h3 className="font-semibold text-success-900 mb-2">Admin User Ready!</h3>
              <p className="text-sm text-success-800">
                You can now login with the admin credentials
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Login Credentials:</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Email:</strong> tsepangtsehla31@gmail.com</p>
                <p><strong>Password:</strong> vegetarian@31</p>
              </div>
            </div>

            <a
              href="/login"
              className="block w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 text-center transition-colors"
            >
              Go to Login Page
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateAdmin;
