const admin = require('firebase-admin');
const serviceAccount = require('../career-guidance-platform-7e18e-firebase-adminsdk-fbsvc-a5b8af8773.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Sample Data
const institutions = [
  {
    name: 'National University of Lesotho',
    email: 'admin@nul.ac.ls',
    phone: '+266 2234 0601',
    address: 'Roma, Maseru, Lesotho',
    website: 'https://www.nul.ls',
    description: 'The National University of Lesotho is the leading institution of higher learning in Lesotho.',
    role: 'institute',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Limkokwing University',
    email: 'info@limkokwing.ac.ls',
    phone: '+266 2831 4247',
    address: 'Maseru, Lesotho',
    website: 'https://www.limkokwing.net/lesotho',
    description: 'Limkokwing University of Creative Technology - Transforming Africa through Innovation and Creativity.',
    role: 'institute',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Lesotho College of Education',
    email: 'info@lce.ac.ls',
    phone: '+266 2231 3431',
    address: 'Maseru, Lesotho',
    website: 'https://www.lce.ac.ls',
    description: 'Leading teacher education institution in Lesotho.',
    role: 'institute',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

const courses = [
  {
    name: 'Bachelor of Science in Computer Science',
    code: 'BSC-CS',
    description: 'A comprehensive program covering programming, algorithms, software engineering, and computer systems.',
    duration: '4 years',
    level: 'Bachelor',
    requirements: 'Mathematics C or better, English C or better',
    career_opportunities: 'Software Developer, Systems Analyst, Database Administrator, IT Consultant',
    tuition_fee: 'M45,000 per year',
    start_date: new Date('2026-01-15'),
    application_deadline: new Date('2025-12-01'),
    isActive: true
  },
  {
    name: 'Bachelor of Commerce in Accounting',
    code: 'BCOM-ACC',
    description: 'Comprehensive accounting program preparing students for professional accounting careers.',
    duration: '4 years',
    level: 'Bachelor',
    requirements: 'Mathematics C or better, Accounting C or better',
    career_opportunities: 'Accountant, Auditor, Financial Analyst, Tax Consultant',
    tuition_fee: 'M40,000 per year',
    start_date: new Date('2026-01-15'),
    application_deadline: new Date('2025-12-01'),
    isActive: true
  },
  {
    name: 'Diploma in Information Technology',
    code: 'DIP-IT',
    description: 'Practical program focusing on IT skills and computer applications.',
    duration: '2 years',
    level: 'Diploma',
    requirements: 'Mathematics D or better',
    career_opportunities: 'IT Support, Network Technician, Web Developer',
    tuition_fee: 'M25,000 per year',
    start_date: new Date('2026-01-15'),
    application_deadline: new Date('2025-12-01'),
    isActive: true
  }
];

const jobs = [
  {
    title: 'Software Developer',
    company: 'Tech Solutions Lesotho',
    location: 'Maseru, Lesotho',
    type: 'Full-time',
    description: 'Looking for a skilled software developer to join our team.',
    requirements: "Bachelor's degree in Computer Science or related field, 2+ years experience",
    salary_range: 'M15,000 - M25,000 per month',
    application_deadline: new Date('2025-12-15'),
    isActive: true
  },
  {
    title: 'Accountant',
    company: 'Standard Lesotho Bank',
    location: 'Maseru, Lesotho',
    type: 'Full-time',
    description: 'Seeking a qualified accountant for our finance department.',
    requirements: "Bachelor's degree in Accounting, ACCA qualification preferred",
    salary_range: 'M20,000 - M30,000 per month',
    application_deadline: new Date('2025-12-20'),
    isActive: true
  }
];

async function seedData() {
  try {
    // Seed Institutions (in users collection)
    console.log('Seeding institutions...');
    for (const institution of institutions) {
      const docRef = await db.collection('users').add(institution);
      console.log('Added institution:', institution.name, 'with ID:', docRef.id);
    }

    // Get the first institution's ID for courses
    const institutionSnapshot = await db.collection('users')
      .where('role', '==', 'institute')
      .limit(1)
      .get();
    const institutionId = institutionSnapshot.docs[0].id;

    // Seed Courses
    console.log('\\nSeeding courses...');
    for (const course of courses) {
      const courseData = {
        ...course,
        institutionId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      const docRef = await db.collection('courses').add(courseData);
      console.log('Added course:', course.name, 'with ID:', docRef.id);
    }

    // Seed Jobs
    console.log('\\nSeeding jobs...');
    for (const job of jobs) {
      const jobData = {
        ...job,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      const docRef = await db.collection('jobs').add(jobData);
      console.log('Added job:', job.title, 'with ID:', docRef.id);
    }

    console.log('\\nSeeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

// Run the seeding
seedData();