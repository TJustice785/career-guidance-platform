import React, { useState } from 'react';
import toast from 'react-hot-toast';
import seedTsepangApplications from '../../utils/seedTsepangApplications';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase.config';

const UnifiedSeeder = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');

  // Seed Tsepang's Applications
  const handleSeedTsepangApplications = async () => {
    if (!window.confirm('Seed applications for Tsepang Tsehla (tsepangtsehla31@gmail.com)?')) {
      return;
    }

    try {
      setLoading(true);
      setProgress('Seeding Tsepang\'s applications...');
      
      const result = await seedTsepangApplications();
      
      if (result.success) {
        toast.success(result.message);
        setProgress('✅ Tsepang applications created successfully!');
      } else {
        toast.error(result.message || 'Failed to seed applications');
        setProgress('❌ Failed to seed Tsepang applications');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to seed applications');
      setProgress('❌ Error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Seed Sample Institutions
  const handleSeedInstitutions = async () => {
    if (!window.confirm('Seed sample institutions? This will add test institutions to the database.')) {
      return;
    }

    try {
      setLoading(true);
      setProgress('Creating sample institutions...');

      const institutions = [
        {
          name: 'National University of Lesotho',
          description: 'The premier university in Lesotho offering diverse undergraduate and postgraduate programs.',
          location: 'Roma, Lesotho',
          type: 'University',
          establishedYear: 1975,
          website: 'www.nul.ls',
          email: 'info@nul.ls',
          phone: '+266 2234 0601',
          status: 'active',
          createdAt: serverTimestamp()
        },
        {
          name: 'Limkokwing University',
          description: 'International university focused on creative technology and innovation.',
          location: 'Maseru, Lesotho',
          type: 'University',
          establishedYear: 2008,
          website: 'www.limkokwing.net',
          email: 'info@limkokwing.net',
          phone: '+266 2231 2156',
          status: 'active',
          createdAt: serverTimestamp()
        },
        {
          name: 'Lerotholi Polytechnic',
          description: 'Leading technical and vocational training institution.',
          location: 'Maseru, Lesotho',
          type: 'Polytechnic',
          establishedYear: 1906,
          website: 'www.lerotholi.ac.ls',
          email: 'info@lerotholi.ac.ls',
          phone: '+266 2231 2345',
          status: 'active',
          createdAt: serverTimestamp()
        },
        {
          name: 'Lesotho College of Education',
          description: 'Premier teacher training college in Lesotho.',
          location: 'Maseru, Lesotho',
          type: 'College',
          establishedYear: 1975,
          website: 'www.lce.ac.ls',
          email: 'info@lce.ac.ls',
          phone: '+266 2231 4567',
          status: 'active',
          createdAt: serverTimestamp()
        },
        {
          name: 'Botho University',
          description: 'Private university offering business and IT programs.',
          location: 'Maseru, Lesotho',
          type: 'University',
          establishedYear: 2014,
          website: 'www.bothouniversity.ac.ls',
          email: 'info@bothouniversity.ac.ls',
          phone: '+266 5888 0000',
          status: 'active',
          createdAt: serverTimestamp()
        }
      ];

      for (const institution of institutions) {
        await addDoc(collection(db, 'institutions'), institution);
      }

      toast.success(`Added ${institutions.length} institutions successfully!`);
      setProgress(`✅ Created ${institutions.length} institutions`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to seed institutions');
      setProgress('❌ Failed to create institutions');
    } finally {
      setLoading(false);
    }
  };

  // Seed Sample Courses
  const handleSeedCourses = async () => {
    if (!window.confirm('Seed sample courses? This will add test courses to existing institutions.')) {
      return;
    }

    try {
      setLoading(true);
      setProgress('Fetching institutions...');

      // Get institutions first
      const institutionsSnapshot = await getDocs(collection(db, 'institutions'));
      if (institutionsSnapshot.empty) {
        toast.error('No institutions found. Please seed institutions first.');
        setProgress('❌ No institutions found');
        setLoading(false);
        return;
      }

      const institutions = institutionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProgress(`Creating courses for ${institutions.length} institutions...`);

      const courseTemplates = [
        // Botho University - Business & IT Focus (Private University)
        { name: 'Bachelor of Commerce in Accounting', level: 'Undergraduate', duration: '4 years', fees: 48000, field: 'Business' },
        { name: 'Bachelor of Information Technology', level: 'Undergraduate', duration: '4 years', fees: 50000, field: 'Technology' },
        { name: 'Bachelor of Business Administration', level: 'Undergraduate', duration: '3 years', fees: 45000, field: 'Business' },
        { name: 'Bachelor of Science in Computing', level: 'Undergraduate', duration: '3 years', fees: 48000, field: 'Technology' },
        { name: 'Diploma in Information Technology', level: 'Diploma', duration: '2 years', fees: 30000, field: 'Technology' },
        { name: 'Diploma in Business Management', level: 'Diploma', duration: '2 years', fees: 28000, field: 'Business' },
        { name: 'Diploma in Marketing', level: 'Diploma', duration: '2 years', fees: 27000, field: 'Business' },
        { name: 'Bachelor of Finance', level: 'Undergraduate', duration: '3 years', fees: 46000, field: 'Business' },
        
        // National University of Lesotho - Comprehensive University
        { name: 'Bachelor of Science in Computer Science', level: 'Undergraduate', duration: '4 years', fees: 25000, field: 'Technology' },
        { name: 'Bachelor of Education', level: 'Undergraduate', duration: '4 years', fees: 22000, field: 'Education' },
        { name: 'Bachelor of Agriculture', level: 'Undergraduate', duration: '4 years', fees: 24000, field: 'Agriculture' },
        { name: 'Bachelor of Science in Nursing', level: 'Undergraduate', duration: '4 years', fees: 28000, field: 'Healthcare' },
        { name: 'Bachelor of Commerce', level: 'Undergraduate', duration: '3 years', fees: 23000, field: 'Business' },
        { name: 'Bachelor of Law (LLB)', level: 'Undergraduate', duration: '4 years', fees: 30000, field: 'Law' },
        { name: 'Bachelor of Science in Mathematics', level: 'Undergraduate', duration: '3 years', fees: 22000, field: 'Science' },
        { name: 'Bachelor of Arts in English', level: 'Undergraduate', duration: '3 years', fees: 20000, field: 'Arts' },
        { name: 'Diploma in Agriculture Extension', level: 'Diploma', duration: '2 years', fees: 18000, field: 'Agriculture' },
        
        // Lerotholi Polytechnic - Engineering & Technical Focus ONLY
        { name: 'National Diploma in Civil Engineering', level: 'Diploma', duration: '3 years', fees: 18000, field: 'Engineering' },
        { name: 'National Diploma in Electrical Engineering', level: 'Diploma', duration: '3 years', fees: 18000, field: 'Engineering' },
        { name: 'National Diploma in Mechanical Engineering', level: 'Diploma', duration: '3 years', fees: 18000, field: 'Engineering' },
        { name: 'National Diploma in Building Construction', level: 'Diploma', duration: '3 years', fees: 17000, field: 'Engineering' },
        { name: 'Certificate in Automotive Technology', level: 'Certificate', duration: '1 year', fees: 12000, field: 'Engineering' },
        { name: 'Certificate in Welding and Fabrication', level: 'Certificate', duration: '1 year', fees: 11000, field: 'Engineering' },
        { name: 'Diploma in Information Technology', level: 'Diploma', duration: '2 years', fees: 16000, field: 'Technology' },
        
        // Lesotho College of Education - Teacher Training ONLY
        { name: 'Diploma in Primary Education', level: 'Diploma', duration: '3 years', fees: 20000, field: 'Education' },
        { name: 'Diploma in Secondary Education', level: 'Diploma', duration: '3 years', fees: 20000, field: 'Education' },
        { name: 'Bachelor of Education in Primary', level: 'Undergraduate', duration: '4 years', fees: 25000, field: 'Education' },
        { name: 'Bachelor of Education in Secondary', level: 'Undergraduate', duration: '4 years', fees: 25000, field: 'Education' },
        { name: 'Certificate in Early Childhood Education', level: 'Certificate', duration: '1 year', fees: 15000, field: 'Education' },
        
        // Limkokwing University - Creative Arts & Technology
        { name: 'Bachelor of Arts in Digital Media Design', level: 'Undergraduate', duration: '3 years', fees: 52000, field: 'Creative Arts' },
        { name: 'Bachelor of Science in Software Engineering', level: 'Undergraduate', duration: '4 years', fees: 55000, field: 'Technology' },
        { name: 'Diploma in Graphic Design', level: 'Diploma', duration: '2 years', fees: 35000, field: 'Creative Arts' },
        { name: 'Bachelor of Multimedia Design', level: 'Undergraduate', duration: '3 years', fees: 51000, field: 'Creative Arts' },
        { name: 'Diploma in Fashion Design', level: 'Diploma', duration: '2 years', fees: 33000, field: 'Creative Arts' },
        { name: 'Bachelor of Marketing and Communication', level: 'Undergraduate', duration: '3 years', fees: 48000, field: 'Business' }
      ];

      let coursesCreated = 0;

      for (const institution of institutions) {
        // Add 3-5 random courses per institution
        const numCourses = Math.floor(Math.random() * 3) + 3;
        const selectedCourses = courseTemplates.sort(() => 0.5 - Math.random()).slice(0, numCourses);

        for (const courseTemplate of selectedCourses) {
          const courseData = {
            institutionId: institution.id,
            institutionName: institution.name,
            title: `${courseTemplate.name} - ${courseTemplate.level}`,
            name: courseTemplate.name,
            description: `Comprehensive ${courseTemplate.name} program at ${courseTemplate.level} level`,
            level: courseTemplate.level,
            duration: courseTemplate.duration,
            fees: courseTemplate.fees,
            currency: 'LSL',
            field: courseTemplate.field,
            requirements: ['Grade 12', 'English', 'Mathematics'],
            status: 'active',
            createdAt: serverTimestamp()
          };

          await addDoc(collection(db, 'courses'), courseData);
          coursesCreated++;
        }
      }

      toast.success(`Created ${coursesCreated} courses successfully!`);
      setProgress(`✅ Created ${coursesCreated} courses for ${institutions.length} institutions`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to seed courses');
      setProgress('❌ Failed to create courses');
    } finally {
      setLoading(false);
    }
  };

  // Seed Sample Jobs
  const handleSeedJobs = async () => {
    if (!window.confirm('Seed sample jobs? This will add test job postings.')) {
      return;
    }

    try {
      setLoading(true);
      setProgress('Creating sample jobs...');

      const jobs = [
        {
          title: 'Software Developer',
          company: 'Tech Solutions Lesotho',
          companyName: 'Tech Solutions Lesotho',
          description: 'We are looking for a skilled software developer to join our team.',
          location: 'Maseru',
          type: 'Full-time',
          category: 'Technology',
          salary: '15000-25000',
          requirements: ['Bachelor\'s Degree in Computer Science', '2+ years experience', 'Knowledge of React and Node.js'],
          status: 'open',
          postedDate: serverTimestamp(),
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: 'Accountant',
          company: 'Finance Corp',
          companyName: 'Finance Corp',
          description: 'Experienced accountant needed for growing financial services company.',
          location: 'Maseru',
          type: 'Full-time',
          category: 'Finance',
          salary: '12000-18000',
          requirements: ['Bachelor\'s Degree in Accounting', 'CPA certification preferred', '3+ years experience'],
          status: 'open',
          postedDate: serverTimestamp(),
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: 'Registered Nurse',
          company: 'Queen Mamohato Memorial Hospital',
          companyName: 'Queen Mamohato Memorial Hospital',
          description: 'Join our healthcare team as a registered nurse.',
          location: 'Maseru',
          type: 'Full-time',
          category: 'Healthcare',
          salary: '10000-15000',
          requirements: ['Nursing Diploma or Degree', 'Valid nursing license', '1+ years experience'],
          status: 'open',
          postedDate: serverTimestamp(),
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: 'Marketing Manager',
          company: 'Retail Enterprises',
          companyName: 'Retail Enterprises',
          description: 'Lead our marketing team and drive brand growth.',
          location: 'Maseru',
          type: 'Full-time',
          category: 'Marketing',
          salary: '18000-28000',
          requirements: ['Bachelor\'s Degree in Marketing', '5+ years experience', 'Digital marketing expertise'],
          status: 'open',
          postedDate: serverTimestamp(),
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: 'Teacher - Mathematics',
          company: 'Maseru High School',
          companyName: 'Maseru High School',
          description: 'Mathematics teacher for high school students.',
          location: 'Maseru',
          type: 'Full-time',
          category: 'Education',
          salary: '8000-12000',
          requirements: ['Bachelor\'s in Education', 'Teaching certification', 'Mathematics specialization'],
          status: 'open',
          postedDate: serverTimestamp(),
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      for (const job of jobs) {
        await addDoc(collection(db, 'jobs'), job);
      }

      toast.success(`Created ${jobs.length} jobs successfully!`);
      setProgress(`✅ Created ${jobs.length} job postings`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to seed jobs');
      setProgress('❌ Failed to create jobs');
    } finally {
      setLoading(false);
    }
  };

  // Seed Everything
  const handleSeedAll = async () => {
    if (!window.confirm('Seed ALL data? This will create institutions, courses, jobs, and Tsepang\'s applications. This may take a few minutes.')) {
      return;
    }

    try {
      setLoading(true);
      
      // Step 1: Institutions
      setProgress('Step 1/4: Creating institutions...');
      await handleSeedInstitutions();
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 2: Courses
      setProgress('Step 2/4: Creating courses...');
      await handleSeedCourses();
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Jobs
      setProgress('Step 3/4: Creating jobs...');
      await handleSeedJobs();
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 4: Tsepang's applications
      setProgress('Step 4/4: Creating Tsepang\'s applications...');
      await handleSeedTsepangApplications();

      toast.success('🎉 All seeding completed successfully!');
      setProgress('✅ All data seeded successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error during full seeding process');
      setProgress('❌ Seeding process encountered errors');
    } finally {
      setLoading(false);
    }
  };

  const SeedCard = ({ title, description, onClick, icon, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`text-4xl ${color}`}>{icon}</div>
        <button
          onClick={onClick}
          disabled={loading}
          className={`px-4 py-2 ${color.replace('text-', 'bg-').replace('-600', '-500')} text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium`}
        >
          Seed
        </button>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Seeding Center</h1>
          <p className="text-gray-600">Populate your database with test data for development and testing</p>
        </div>

        {/* Progress Display */}
        {progress && (
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-blue-700 font-medium">{progress}</p>
          </div>
        )}

        {/* Seed All Button */}
        <div className="mb-8">
          <button
            onClick={handleSeedAll}
            disabled={loading}
            className="w-full px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white text-lg font-bold rounded-xl hover:from-teal-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {loading ? '⏳ Seeding in progress...' : '🚀 Seed Everything (All Data)'}
          </button>
          <p className="text-sm text-gray-500 text-center mt-2">
            Creates institutions, courses, jobs, and test applications in one go
          </p>
        </div>

        {/* Individual Seed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <SeedCard
            icon="🏛️"
            title="Seed Institutions"
            description="Add 5 sample institutions including universities, colleges, and polytechnics"
            onClick={handleSeedInstitutions}
            color="text-blue-600"
          />

          <SeedCard
            icon="📚"
            title="Seed Courses"
            description="Add multiple courses to existing institutions (requires institutions to exist first)"
            onClick={handleSeedCourses}
            color="text-green-600"
          />

          <SeedCard
            icon="💼"
            title="Seed Jobs"
            description="Add 5 sample job postings across different categories and industries"
            onClick={handleSeedJobs}
            color="text-orange-600"
          />

          <SeedCard
            icon="👤"
            title="Seed Tsepang's Applications"
            description="Create test applications for Tsepang Tsehla (tsepangtsehla31@gmail.com)"
            onClick={handleSeedTsepangApplications}
            color="text-teal-600"
          />
        </div>

        {/* Warning Note */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Development Use Only</h3>
              <p className="mt-1 text-sm text-yellow-700">
                These seeding operations are intended for development and testing purposes only. 
                Use with caution on production databases.
              </p>
            </div>
          </div>
        </div>

        {/* Seeding Order Info */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Recommended Seeding Order</h3>
              <ol className="mt-1 text-sm text-blue-700 list-decimal list-inside">
                <li>Seed Institutions first</li>
                <li>Then seed Courses (requires institutions)</li>
                <li>Seed Jobs anytime</li>
                <li>Finally, seed Tsepang's Applications (requires courses and jobs)</li>
              </ol>
              <p className="mt-2 text-sm text-blue-700">
                Or simply click "Seed Everything" to do all steps automatically in the correct order!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedSeeder;
