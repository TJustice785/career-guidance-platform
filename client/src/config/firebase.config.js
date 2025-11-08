// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_79__mDnD1ytz_MoJcYGDuyoq0X_q_og",
  authDomain: "career-guidance-platform-7e18e.firebaseapp.com",
  projectId: "career-guidance-platform-7e18e",
  storageBucket: "career-guidance-platform-7e18e.firebasestorage.app",
  messagingSenderId: "150070878263",
  appId: "1:150070878263:web:f153c36b60a610880bdfb2",
  measurementId: "G-Q3YLV45W62"
};

// Initialize Firebase (check if already initialized)
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  if (error.code === 'app/duplicate-app') {
    // Firebase already initialized, get the existing app
    app = getApp();
  } else {
    throw error;
  }
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
