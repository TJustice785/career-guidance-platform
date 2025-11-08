import React, { useState } from 'react';
import { db } from '../../config/firebase.config';
import { collection, getDocs, addDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase.config';
import toast from 'react-hot-toast';

const MasterSeeder = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, step: '' });
  const [results, setResults] = useState({});

  // Check if item exists
  const checkDuplicate = async (collectionName, field, value) => {
    const q = query(
      collection(db, collectionName),
      where(field, '==', value)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  };

  // Seed Test Users (Students, Companies, Admins)
  const seedUsers = async () => {
    const users = [
      // Students
      {
        email: 'student1@test.com',
        password: 'Student123!',
        role: 'student',
        firstName: 'Thabo',
        lastName: 'Molapo',
        phone: '+266 5812 3456',
        currentGrade: 'Form E',
        subjects: ['Mathematics - B', 'Physical Science - B', 'English - A', 'Biology - C'],
        skills: ['Programming', 'Problem Solving', 'Communication']
      },
      {
        email: 'student2@test.com',
        password: 'Student123!',
        role: 'student',
        firstName: 'Lerato',
        lastName: 'Makhetha',
        phone: '+266 5823 4567',
        currentGrade: 'Form E',
        subjects: ['English - A', 'History - B', 'Geography - B', 'Sesotho - A'],
        skills: ['Writing', 'Research', 'Public Speaking']
      },
      {
        email: 'student3@test.com',
        password: 'Student123!',
        role: 'student',
        firstName: 'Mpho',
        lastName: 'Lesaoana',
        phone: '+266 5834 5678',
        currentGrade: 'Diploma',
        subjects: ['Business Management - B', 'Accounting - C', 'Economics - B'],
        skills: ['Leadership', 'Time Management', 'Microsoft Office']
      },
      // Companies
      {
        email: 'company1@test.com',
        password: 'Company123!',
        role: 'company',
        companyName: 'Vodacom Lesotho',
        industry: 'Telecommunications',
        contactPerson: 'Mpho Rakuoane',
        phone: '+266 2231 5000',
        website: 'https://vodacom.co.ls'
      },
      {
        email: 'company2@test.com',
        password: 'Company123!',
        role: 'company',
        companyName: 'Lesotho Electricity Company',
        industry: 'Energy',
        contactPerson: 'Nthabiseng Molefe',
        phone: '+266 2231 2000',
        website: 'https://lec.co.ls'
      },
      // Admin (already exists, skip)
      {
        email: 'admin@career.com',
        password: 'Admin123!',
        role: 'admin',
        firstName: 'System',
        lastName: 'Administrator'
      }
    ];

    let added = 0;
    let skipped = 0;

    for (const user of users) {
      try {
        // Check if user exists
        const exists = await checkDuplicate('users', 'email', user.email);
        if (exists) {
          console.log(`User exists: ${user.email}`);
          skipped++;
          continue;
        }

        // Create auth user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          user.email,
          user.password
        );

        // Create user document
        const { password, ...userData } = user;
        await addDoc(collection(db, 'users'), {
          ...userData,
          uid: userCredential.user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        added++;
        console.log(`Added user: ${user.email}`);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          skipped++;
        } else {
          console.error(`Error adding ${user.email}:`, error);
        }
      }
    }

    return { added, skipped, total: users.length };
  };

  // Seed everything
  const seedEverything = async () => {
    try {
      setLoading(true);
      const allResults = {};
      let totalItems = 0;
      let currentItem = 0;

      // Step 1: Seed Users
      setProgress({ current: currentItem, total: 100, step: 'Seeding users...' });
      const usersResult = await seedUsers();
      allResults.users = usersResult;
      currentItem += 20;
      setProgress({ current: currentItem, total: 100, step: 'Users complete' });
      toast.success(`Users: ${usersResult.added} added, ${usersResult.skipped} skipped`);

      // Step 2: Check Institutions
      setProgress({ current: currentItem, total: 100, step: 'Checking institutions...' });
      const institutionsSnapshot = await getDocs(collection(db, 'institutions'));
      const institutionsCount = institutionsSnapshot.size;
      allResults.institutions = { existing: institutionsCount };
      currentItem += 20;
      
      if (institutionsCount === 0) {
        toast.error('No institutions found! Please seed institutions first.');
      } else {
        toast.success(`Found ${institutionsCount} institutions`);
      }

      // Step 3: Check Courses
      setProgress({ current: currentItem, total: 100, step: 'Checking courses...' });
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const coursesCount = coursesSnapshot.size;
      allResults.courses = { existing: coursesCount };
      currentItem += 20;
      
      if (coursesCount === 0) {
        toast.error('No courses found! Please seed courses first.');
      } else {
        toast.success(`Found ${coursesCount} courses`);
      }

      // Step 4: Seed Jobs
      setProgress({ current: currentItem, total: 100, step: 'Seeding jobs...' });
      const jobsResult = await seedJobs();
      allResults.jobs = jobsResult;
      currentItem += 20;
      toast.success(`Jobs: ${jobsResult.added} added, ${jobsResult.skipped} skipped`);

      // Step 5: Seed Companies
      setProgress({ current: currentItem, total: 100, step: 'Seeding companies...' });
      const companiesResult = await seedCompanies();
      allResults.companies = companiesResult;
      currentItem += 20;
      toast.success(`Companies: ${companiesResult.added} added, ${companiesResult.skipped} skipped`);

      setProgress({ current: 100, total: 100, step: 'Complete!' });
      setResults(allResults);
      
      toast.success('✅ Master seeding complete!', { duration: 5000 });

    } catch (error) {
      console.error('Error seeding:', error);
      toast.error('Failed to seed data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Seed Jobs
  const seedJobs = async () => {
    const jobs = [
      {
        title: 'Software Developer',
        company: 'Vodacom Lesotho',
        location: 'Maseru',
        type: 'Full-time',
        category: 'Technology',
        description: 'Develop and maintain software applications for telecommunications services.',
        requirements: {
          educationLevel: 'Degree in Computer Science',
          experience: '2 years',
          skills: ['Java', 'Python', 'SQL', 'Problem Solving']
        },
        salary: '15000-25000',
        status: 'open'
      },
      {
        title: 'Electrical Engineer',
        company: 'Lesotho Electricity Company',
        location: 'Maseru',
        type: 'Full-time',
        category: 'Engineering',
        description: 'Design and maintain electrical systems and infrastructure.',
        requirements: {
          educationLevel: 'Degree/Diploma in Electrical Engineering',
          experience: '3 years',
          skills: ['Circuit Design', 'AutoCAD', 'Power Systems']
        },
        salary: '18000-30000',
        status: 'open'
      },
      {
        title: 'Marketing Officer',
        company: 'Vodacom Lesotho',
        location: 'Maseru',
        type: 'Full-time',
        category: 'Marketing',
        description: 'Develop and implement marketing strategies.',
        requirements: {
          educationLevel: 'Degree in Marketing/Business',
          experience: '1 year',
          skills: ['Digital Marketing', 'Social Media', 'Communication']
        },
        salary: '12000-18000',
        status: 'open'
      }
    ];

    let added = 0;
    let skipped = 0;

    for (const job of jobs) {
      try {
        const exists = await checkDuplicate('jobs', 'title', job.title);
        if (exists) {
          skipped++;
          continue;
        }

        await addDoc(collection(db, 'jobs'), {
          ...job,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          postedDate: new Date().toISOString(),
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });
        added++;
      } catch (error) {
        console.error(`Error adding job ${job.title}:`, error);
      }
    }

    return { added, skipped, total: jobs.length };
  };

  // Seed Companies
  const seedCompanies = async () => {
    const companies = [
      {
        name: 'Vodacom Lesotho',
        industry: 'Telecommunications',
        description: 'Leading telecommunications provider in Lesotho',
        location: 'Maseru',
        email: 'careers@vodacom.co.ls',
        phone: '+266 2231 5000',
        website: 'https://vodacom.co.ls',
        size: '500+',
        status: 'active'
      },
      {
        name: 'Lesotho Electricity Company',
        industry: 'Energy',
        description: 'National electricity provider',
        location: 'Maseru',
        email: 'hr@lec.co.ls',
        phone: '+266 2231 2000',
        website: 'https://lec.co.ls',
        size: '200-500',
        status: 'active'
      },
      {
        name: 'Standard Lesotho Bank',
        industry: 'Banking',
        description: 'Premier banking services in Lesotho',
        location: 'Maseru',
        email: 'recruitment@standardlesothobank.co.ls',
        phone: '+266 2231 4000',
        website: 'https://standardlesothobank.co.ls',
        size: '200-500',
        status: 'active'
      },
      {
        name: 'Maluti Mountain Brewery',
        industry: 'Manufacturing',
        description: 'Leading beverage manufacturer',
        location: 'Maseru',
        email: 'hr@mmb.co.ls',
        phone: '+266 2231 3500',
        website: 'https://mmb.co.ls',
        size: '100-200',
        status: 'active'
      }
    ];

    let added = 0;
    let skipped = 0;

    for (const company of companies) {
      try {
        const exists = await checkDuplicate('company', 'name', company.name);
        if (exists) {
          skipped++;
          continue;
        }

        await addDoc(collection(db, 'companies'), {
          ...company,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        added++;
      } catch (error) {
        console.error(`Error adding company ${company.name}:`, error);
      }
    }

    return { added, skipped, total: companies.length };
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🌟 Master Data Seeder</h1>
        <p className="text-gray-600">
          Seed ALL data (users, institutions, courses, jobs, companies) with automatic duplicate prevention
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">What This Will Seed:</h3>
        <ul className="space-y-2 text-blue-800">
          <li>✓ <strong>Test Users</strong> - 3 students, 2 companies, 1 admin</li>
          <li>✓ <strong>Institutions</strong> - Check existing (seed separately if needed)</li>
          <li>✓ <strong>Courses</strong> - Check existing (seed separately if needed)</li>
          <li>✓ <strong>Jobs</strong> - 3 sample job postings</li>
          <li>✓ <strong>Companies</strong> - 4 major Lesotho companies</li>
        </ul>
        <p className="mt-3 text-sm text-blue-700">
          ⚡ <strong>Duplicate Protection:</strong> Automatically skips items that already exist
        </p>
      </div>

      {/* Test Credentials */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-green-900 mb-3">📋 Test Credentials:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-semibold text-green-900">Students:</p>
            <p className="text-green-700">student1@test.com / Student123!</p>
            <p className="text-green-700">student2@test.com / Student123!</p>
            <p className="text-green-700">student3@test.com / Student123!</p>
          </div>
          <div>
            <p className="font-semibold text-green-900">Companies:</p>
            <p className="text-green-700">company1@test.com / Company123!</p>
            <p className="text-green-700">company2@test.com / Company123!</p>
          </div>
          <div>
            <p className="font-semibold text-green-900">Admin:</p>
            <p className="text-green-700">(Use existing admin account)</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      {loading && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{progress.step}</span>
              <span>{progress.current}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progress.current}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {Object.keys(results).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Seeding Results:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(results).map(key => (
              <div key={key} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 capitalize mb-2">{key}</h4>
                {results[key].added !== undefined && (
                  <>
                    <p className="text-sm text-green-600">✓ Added: {results[key].added}</p>
                    <p className="text-sm text-yellow-600">⊘ Skipped: {results[key].skipped}</p>
                    <p className="text-sm text-gray-600">Total: {results[key].total}</p>
                  </>
                )}
                {results[key].existing !== undefined && (
                  <p className="text-sm text-blue-600">Existing: {results[key].existing}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seed Button */}
      <button
        onClick={seedEverything}
        disabled={loading}
        className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Seeding All Data...' : '🚀 Seed All Data (With Duplicate Prevention)'}
      </button>

      {/* Additional Tools */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">Need Institutions?</h4>
          <p className="text-sm text-yellow-700 mb-3">Use "Bulk Add Institutions" to add Lesotho institutions</p>
          <a href="/admin/bulk-add-institutions" className="text-blue-600 hover:underline text-sm">
            → Go to Bulk Add Institutions
          </a>
        </div>
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <h4 className="font-semibold text-teal-900 mb-2">Need Courses?</h4>
          <p className="text-sm text-teal-700 mb-3">Use "Seed Courses" to add courses with requirements</p>
          <a href="/admin/seed-courses" className="text-blue-600 hover:underline text-sm">
            → Go to Seed Courses
          </a>
        </div>
      </div>
    </div>
  );
};

export default MasterSeeder;
