import React, { useState } from 'react';
import { auth, db } from '../config/firebase.config';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

function FixAdminUser() {
  const [loading, setLoading] = useState(false);
  const [fixed, setFixed] = useState(false);

  const fixAdminUser = async () => {
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
      console.log('Fixing admin user...');
      
      // Try to sign in with the admin credentials
      const userCredential = await signInWithEmailAndPassword(
        auth,
        adminData.email,
        adminData.password
      );
      
      const user = userCredential.user;
      console.log('✅ Signed in with UID:', user.uid);

      // Check if user document exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.log('Creating Firestore document...');
        // Create Firestore user document
        await setDoc(userDocRef, {
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
        console.log('✅ Firestore document created!');
      } else {
        console.log('✅ Firestore document already exists!');
        // Update to ensure it has admin role
        await setDoc(userDocRef, {
          role: adminData.role,
          isActive: true,
          updatedAt: serverTimestamp()
        }, { merge: true });
        console.log('✅ Admin role confirmed!');
      }

      // Sign out
      await signOut(auth);

      toast.success('Admin user fixed successfully! You can now login.');
      setFixed(true);
      
    } catch (error) {
      console.error('❌ Error fixing admin user:', error);
      
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        toast.error('Invalid credentials. The admin user may not exist yet. Go to /create-admin first.');
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
          Fix Admin User
        </h1>

        {!fixed ? (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">What this does:</h3>
              <ul className="space-y-1 text-sm text-yellow-800 list-disc list-inside">
                <li>Signs in with admin credentials</li>
                <li>Creates or updates Firestore user document</li>
                <li>Ensures admin role is set correctly</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Admin Credentials:</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Email:</strong> thabotsehla31@gmail.com</p>
                <p><strong>Password:</strong> vegetarian@31</p>
              </div>
            </div>

            <button
              onClick={fixAdminUser}
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Fixing Admin User...' : 'Fix Admin User'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Use this if you can't login as admin
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="font-semibold text-green-900 mb-2">Success!</h3>
              <p className="text-sm text-green-800">
                Admin user has been fixed. You can now login.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Login Credentials:</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Email:</strong> thabotsehla31@gmail.com</p>
                <p><strong>Password:</strong> vegetarian@31</p>
              </div>
            </div>

            <a
              href="/login"
              className="block w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 text-center transition-colors"
            >
              Go to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default FixAdminUser;
