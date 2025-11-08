const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./career-guidance-platform-7e18e-firebase-adminsdk-fbsvc-a5b8af8773.json');

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function verifyCollection(collectionName) {
  console.log(`\nChecking ${collectionName}:`);
  const snapshot = await db.collection(collectionName).get();
  console.log(`Total documents: ${snapshot.size}`);
  
  if (snapshot.size > 0) {
    console.log('Sample document:');
    console.log(snapshot.docs[0].data());
  } else {
    console.log('Collection is empty');
  }
}

async function verifyAllCollections() {
  const collections = [
    'companies',
    'jobs',
    'institutions',
    'courses',
    'users',
    'applications',
    'admissions',
    'notifications',
    'savedJobs',
    'system_settings'
  ];

  for (const collection of collections) {
    await verifyCollection(collection);
  }
  
  process.exit(0);
}

verifyAllCollections().catch(console.error);