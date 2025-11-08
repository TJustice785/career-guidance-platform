const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin if it hasn't been initialized already
if (!admin.apps.length) {
  try {
    // Use service account file if available, otherwise fall back to environment variables
    const serviceAccountPath = path.join(__dirname, '../../career-guidance-platform-7e18e-firebase-adminsdk-fbsvc-a5b8af8773.json');

    let credential;
    try {
      // Try to use service account file first
      credential = admin.credential.cert(serviceAccountPath);
    } catch (fileError) {
      console.log('Service account file not found, using environment variables');
      // Fall back to environment variables
      credential = admin.credential.cert({
        type: process.env.FIREBASE_TYPE,
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || 'googleapis.com'
      });
    }

    admin.initializeApp({
      credential: credential,
      databaseURL: 'https://career-guidance-platform-7e18e.firebaseio.com',
      storageBucket: 'career-guidance-platform-7e18e.appspot.com'
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase admin initialization error', error);
    process.exit(1);
  }
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();
const bucket = storage.bucket();

// Firestore helpers
const Timestamp = admin.firestore.Timestamp;
const FieldValue = admin.firestore.FieldValue;

// Enable offline support for Firestore (for development)
if (process.env.NODE_ENV === 'development' && process.env.FIRESTORE_EMULATOR_HOST) {
  db.settings({
    host: process.env.FIRESTORE_EMULATOR_HOST,
    ssl: false
  });
}

module.exports = { 
  admin, 
  db, 
  auth, 
  storage, 
  bucket,
  Timestamp, 
  FieldValue 
};
