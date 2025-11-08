import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase.config';
import toast from 'react-hot-toast';
import { sendWelcomeNotification } from '../utils/notificationHelpers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore
  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const data = await fetchUserData(user.uid);
        setUserData(data);
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const data = await fetchUserData(userCredential.user.uid);
      
      // Validate that user data was retrieved successfully
      if (!data) {
        toast.error('User profile not found. Please contact support.');
        throw new Error('User data not found in Firestore');
      }
      
      // Validate that user has a role assigned
      if (!data.role) {
        toast.error('User role not assigned. Please contact support.');
        throw new Error('User role not found');
      }
      
      toast.success('Login successful!');
      return { user: userCredential.user, userData: data };
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      } else if (error.message && !error.code) {
        // Custom error messages (like missing role)
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      throw error;
    }
  };

  // Register function
  const register = async (email, password, additionalData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        ...additionalData,
        emailVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Send welcome notification
      try {
        const userName = additionalData.firstName 
          ? `${additionalData.firstName} ${additionalData.lastName || ''}`
          : additionalData.name || 'User';
        await sendWelcomeNotification(user.uid, userName, additionalData.role);
      } catch (notifError) {
        console.error('Error sending welcome notification:', notifError);
        // Don't fail registration if notification fails
      }

      toast.success('Registration successful! Please check your email to verify your account.');
      return { user };
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      }
      toast.error(errorMessage);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error('Error sending password reset email');
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (currentUser) {
        await setDoc(doc(db, 'users', currentUser.uid), {
          ...updates,
          updatedAt: serverTimestamp()
        }, { merge: true });
        
        const updatedData = await fetchUserData(currentUser.uid);
        setUserData(updatedData);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error('Error updating profile');
      throw error;
    }
  };

  // Helper functions for ProtectedRoute
  const isAuthenticated = () => {
    return !!currentUser && !!userData;
  };

  const hasRole = (role) => {
    return userData?.role === role;
  };

  const value = {
    currentUser,
    userData,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile,
    isAuthenticated,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
