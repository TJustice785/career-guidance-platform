const { auth, db } = require('../config/firebase.config');

// Verify Firebase ID token
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided'
      });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);
    
    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const userData = userDoc.data();
    
    // Check if email is verified
    if (!userData.emailVerified && userData.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Please verify your email first'
      });
    }

    // Attach user data to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      ...userData
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token'
    });
  }
};

// Check user role
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Insufficient permissions'
      });
    }

    next();
  };
};

// Check if company is approved
const checkCompanyApproval = async (req, res, next) => {
  try {
    if (req.user.role !== 'company') {
      return next();
    }

    if (req.user.status !== 'approved') {
      return res.status(403).json({
        status: 'error',
        message: 'Your company account is pending approval'
      });
    }

    next();
  } catch (error) {
    console.error('Company approval check error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error checking company approval status'
    });
  }
};

module.exports = {
  verifyToken,
  checkRole,
  checkCompanyApproval
};
