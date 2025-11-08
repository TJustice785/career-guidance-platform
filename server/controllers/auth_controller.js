const { validationResult } = require('express-validator');
const { auth, db, Timestamp } = require('../config/firebase.config');
// const { sendVerificationEmail } = require('../services/email_service');

const authController = {
  // ==================== AUTHENTICATION METHODS ====================
  // Register new user
  register: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          errors: errors.array()
        });
      }

      const { email, password, role, firstName, lastName, name, ...otherData } = req.body;

      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email,
        password,
        emailVerified: false
      });

      // Prepare user data based on role
      let userData = {
        email,
        role,
        emailVerified: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      switch (role) {
        case 'student':
          userData = {
            ...userData,
            firstName: firstName || '',
            lastName: lastName || '',
            applications: [],
            admissions: [],
            documents: [],
            qualifications: []
          };
          break;
        
        case 'institute':
          userData = {
            ...userData,
            name: name || '',
            description: otherData.description || '',
            address: otherData.address || '',
            phone: otherData.phone || '',
            website: otherData.website || '',
            faculties: [],
            courses: []
          };
          break;
        
        case 'company':
          userData = {
            ...userData,
            name: name || '',
            description: otherData.description || '',
            industry: otherData.industry || '',
            address: otherData.address || '',
            phone: otherData.phone || '',
            website: otherData.website || '',
            status: 'pending', // Requires admin approval
            jobs: []
          };
          break;
      }

      // Save user data to Firestore
      await db.collection('users').doc(userRecord.uid).set(userData);

      // Generate email verification link
      const verificationLink = await auth.generateEmailVerificationLink(email);
      
      // Send verification email (commented out for now)
      // await sendVerificationEmail(email, verificationLink, firstName || name);

      res.status(201).json({
        status: 'success',
        message: 'Registration successful. Please check your email to verify your account.',
        data: {
          uid: userRecord.uid,
          email: userData.email,
          role: userData.role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-exists') {
        return res.status(400).json({
          status: 'error',
          message: 'Email already in use'
        });
      }

      res.status(500).json({
        status: 'error',
        message: 'Registration failed',
        error: error.message
      });
    }
  },

  // ==================== LOGIN/LOGOUT METHODS ====================
  // Login user
  login: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          errors: errors.array()
        });
      }

      const { email } = req.body;

      // Get user by email
      const userRecord = await auth.getUserByEmail(email);
      
      // Get user data from Firestore
      const userDoc = await db.collection('users').doc(userRecord.uid).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      const userData = userDoc.data();

      // Note: Actual password verification happens on the client side with Firebase Auth
      // This endpoint just returns user data after successful Firebase authentication

      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          uid: userRecord.uid,
          email: userData.email,
          role: userData.role,
          emailVerified: userData.emailVerified,
          ...userData
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.code === 'auth/user-not-found') {
        return res.status(404).json({
          status: 'error',
          message: 'Invalid email or password'
        });
      }

      res.status(500).json({
        status: 'error',
        message: 'Login failed',
        error: error.message
      });
    }
  },

  // ==================== EMAIL VERIFICATION METHODS ====================
  // Verify email
  verifyEmail: async (req, res) => {
    try {
      const { uid } = req.body;

      // Update user's email verification status
      await auth.updateUser(uid, {
        emailVerified: true
      });

      await db.collection('users').doc(uid).update({
        emailVerified: true,
        updatedAt: Timestamp.now()
      });

      res.status(200).json({
        status: 'success',
        message: 'Email verified successfully'
      });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Email verification failed',
        error: error.message
      });
    }
  },

  // Resend verification email
  resendVerification: async (req, res) => {
    try {
      const { email } = req.body;

      const verificationLink = await auth.generateEmailVerificationLink(email);
      // await sendVerificationEmail(email, verificationLink);

      res.status(200).json({
        status: 'success',
        message: 'Verification email sent'
      });
    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to send verification email',
        error: error.message
      });
    }
  },

  // ==================== PASSWORD MANAGEMENT ====================
  // Forgot password
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const resetLink = await auth.generatePasswordResetLink(email);
      // Send password reset email (implement in email service)

      res.status(200).json({
        status: 'success',
        message: 'Password reset email sent'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to send password reset email',
        error: error.message
      });
    }
  },

  // Reset password
  resetPassword: async (req, res) => {
    try {
      const { oobCode, newPassword } = req.body;

      await auth.confirmPasswordReset(oobCode, newPassword);

      res.status(200).json({
        status: 'success',
        message: 'Password reset successful'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Password reset failed',
        error: error.message
      });
    }
  },

  // ==================== USER PROFILE METHODS ====================
  // Get current user
  getCurrentUser: async (req, res) => {
    try {
      res.status(200).json({
        status: 'success',
        data: req.user
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get user data',
        error: error.message
      });
    }
  },

  // Update profile
  updateProfile: async (req, res) => {
    try {
      const { uid } = req.user;
      const updates = req.body;

      // Remove sensitive fields
      delete updates.email;
      delete updates.role;
      delete updates.createdAt;
      delete updates.emailVerified;

      updates.updatedAt = Timestamp.now();

      await db.collection('users').doc(uid).update(updates);

      // Get updated user data
      const updatedDoc = await db.collection('users').doc(uid).get();

      res.status(200).json({
        status: 'success',
        message: 'Profile updated successfully',
        data: updatedDoc.data()
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update profile',
        error: error.message
      });
    }
  }
};

module.exports = authController;