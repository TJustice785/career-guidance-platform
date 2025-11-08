/**
 * Admin User Creation Script
 * Run this once to create the admin user
 */

import { auth, db } from '../config/firebase.config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const createAdminUser = async () => {
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
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('👤 Name:', adminData.fullName);
    console.log('🎯 Role:', adminData.role);
    
    return {
      success: true,
      uid: user.uid,
      message: 'Admin user created successfully!'
    };
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️ User already exists. You can login with these credentials.');
      return {
        success: false,
        message: 'User already exists'
      };
    }
    
    return {
      success: false,
      error: error.message
    };
  }
};

export default createAdminUser;
