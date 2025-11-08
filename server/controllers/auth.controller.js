const { db } = require('../config/firebase');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password, userType, userData } = req.body;
    
    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: false,
      disabled: false
    });
    
    // Create user profile in Firestore
    const userId = userRecord.uid;
    const userProfile = {
      id: userId,
      email,
      userType,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('users').doc(userId).set(userProfile);
    
    // Generate custom token for client-side authentication
    const token = await admin.auth().createCustomToken(userId);
    
    res.status(201).json({
      success: true,
      data: {
        id: userId,
        email,
        userType,
        token
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to register user' 
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Sign in with email and password
    const user = await admin.auth().getUserByEmail(email);
    
    // In a real app, you would verify the password here
    // For Firebase Admin SDK, we can't verify password directly
    // This is a simplified example
    
    // Get user profile
    const userDoc = await db.collection('users').doc(user.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }
    
    // Generate custom token for client-side authentication
    const token = await admin.auth().createCustomToken(user.uid);
    
    res.status(200).json({
      success: true,
      data: {
        id: user.uid,
        email: user.email,
        userType: userDoc.data().userType,
        token
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(401).json({ 
      success: false, 
      error: 'Invalid email or password' 
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      data: userDoc.data()
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user profile' 
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    await db.collection('users').doc(userId).update(updateData);
    
    res.status(200).json({
      success: true,
      data: { id: userId, ...updateData }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update profile' 
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.uid;
    
    // In a real app, you would:
    // 1. Verify current password
    // 2. Update to new password
    // For Firebase Admin SDK, you would use updateUser
    
    await admin.auth().updateUser(userId, {
      password: newPassword
    });
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to change password' 
    });
  }
};
