const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./career-guidance-platform-7e18e-firebase-adminsdk-fbsvc-a5b8af8773.json');

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Jobs to add
const jobs = [
  {
    title: 'Financial Analyst',
    companyName: 'Lesotho Bank',
    location: 'Maseru, Lesotho',
    employmentType: 'Full-time',
    salaryRange: 'M15,000 - M25,000',
    description: 'Looking for a qualified Financial Analyst to join our banking team.',
    industry: 'Finance',
    status: 'active',
    createdAt: new Date(),
    companyId: 'lesotho-bank'
  },
  {
    title: 'Mining Engineer',
    companyName: 'Lesotho Mining Corporation',
    location: 'Letseng, Lesotho',
    employmentType: 'Full-time',
    salaryRange: 'M20,000 - M35,000',
    description: 'Seeking experienced Mining Engineer for our diamond mining operations.',
    industry: 'Mining',
    status: 'active',
    createdAt: new Date(),
    companyId: 'lesotho-mining'
  },
  {
    title: 'Software Developer',
    companyName: 'TechCorp Lesotho',
    location: 'Maseru, Lesotho',
    employmentType: 'Full-time',
    salaryRange: 'M18,000 - M30,000',
    description: 'Looking for skilled Software Developer to work on innovative projects.',
    industry: 'Technology',
    status: 'active',
    createdAt: new Date(),
    companyId: 'techcorp-lesotho'
  }
];

// Add all jobs
Promise.all(jobs.map(job => db.collection('jobs').add(job)))
  .then(() => {
    console.log('Jobs added successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error adding jobs:', error);
    process.exit(1);
  });