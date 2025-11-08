import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase.config';
import { collection, getDocs, addDoc, serverTimestamp, query, where } from 'firebase/firestore';
import toast from 'react-hot-toast';

const SeedCoursesWithRequirements = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'institutions'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInstitutions(data);
      toast.success(`Found ${data.length} institutions`);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      toast.error('Failed to fetch institutions');
    }
  };

  // Comprehensive course database with requirements
  const coursesDatabase = [
    // National University of Lesotho (NUL)
    {
      institutionName: 'National University of Lesotho',
      courses: [
        {
          name: 'Bachelor of Science in Computer Science',
          code: 'BSC-CS',
          level: 'Undergraduate',
          duration: '4 years',
          category: 'Technology',
          description: 'Comprehensive computer science program covering programming, algorithms, data structures, software engineering, and artificial intelligence.',
          requirements: {
            minimumGrade: 'C',
            subjects: ['Mathematics', 'Physical Science', 'English'],
            entranceExam: true,
            minimumPoints: 24
          },
          fees: {
            local: 15000,
            international: 45000,
            currency: 'LSL'
          },
          careerProspects: ['Software Developer', 'Systems Analyst', 'Database Administrator', 'IT Consultant'],
          intakeMonths: ['January', 'August']
        },
        {
          name: 'Bachelor of Education in Secondary Education',
          code: 'BED-SEC',
          level: 'Undergraduate',
          duration: '4 years',
          category: 'Education',
          description: 'Teacher training program for secondary school education with specialization options.',
          requirements: {
            minimumGrade: 'C',
            subjects: ['English', 'Any two teaching subjects'],
            entranceExam: false,
            minimumPoints: 20
          },
          fees: {
            local: 12000,
            international: 35000,
            currency: 'LSL'
          },
          careerProspects: ['Secondary School Teacher', 'Education Officer', 'Curriculum Developer'],
          intakeMonths: ['January']
        },
        {
          name: 'Bachelor of Arts in Law',
          code: 'BA-LAW',
          level: 'Undergraduate',
          duration: '4 years',
          category: 'Law',
          description: 'Comprehensive law degree covering constitutional law, criminal law, contract law, and legal procedures.',
          requirements: {
            minimumGrade: 'B',
            subjects: ['English', 'Any two subjects'],
            entranceExam: true,
            minimumPoints: 28
          },
          fees: {
            local: 18000,
            international: 50000,
            currency: 'LSL'
          },
          careerProspects: ['Lawyer', 'Legal Advisor', 'Magistrate', 'Corporate Legal Officer'],
          intakeMonths: ['January']
        },
        {
          name: 'Bachelor of Science in Agriculture',
          code: 'BSC-AGR',
          level: 'Undergraduate',
          duration: '4 years',
          category: 'Agriculture',
          description: 'Agricultural science program focusing on crop production, animal science, and sustainable farming.',
          requirements: {
            minimumGrade: 'C',
            subjects: ['Biology', 'Mathematics OR Agriculture', 'English'],
            entranceExam: false,
            minimumPoints: 22
          },
          fees: {
            local: 14000,
            international: 40000,
            currency: 'LSL'
          },
          careerProspects: ['Agricultural Officer', 'Farm Manager', 'Agricultural Consultant', 'Extension Officer'],
          intakeMonths: ['January', 'August']
        },
        {
          name: 'Bachelor of Commerce in Accounting',
          code: 'BCOM-ACC',
          level: 'Undergraduate',
          duration: '4 years',
          category: 'Business',
          description: 'Professional accounting program preparing students for careers in accounting and finance.',
          requirements: {
            minimumGrade: 'C',
            subjects: ['Mathematics', 'English', 'Business Studies OR Accounting'],
            entranceExam: false,
            minimumPoints: 24
          },
          fees: {
            local: 16000,
            international: 45000,
            currency: 'LSL'
          },
          careerProspects: ['Accountant', 'Auditor', 'Financial Analyst', 'Tax Consultant'],
          intakeMonths: ['January', 'August']
        }
      ]
    },
    // Lerotholi Polytechnic
    {
      institutionName: 'Lerotholi Polytechnic',
      courses: [
        {
          name: 'Diploma in Civil Engineering',
          code: 'DIP-CE',
          level: 'Diploma',
          duration: '3 years',
          category: 'Engineering',
          description: 'Practical civil engineering program covering construction, structural design, and project management.',
          requirements: {
            minimumGrade: 'D',
            subjects: ['Mathematics', 'Physical Science', 'English'],
            entranceExam: false,
            minimumPoints: 18
          },
          fees: {
            local: 10000,
            international: 30000,
            currency: 'LSL'
          },
          careerProspects: ['Civil Engineering Technician', 'Construction Supervisor', 'Site Engineer', 'Quantity Surveyor'],
          intakeMonths: ['January']
        },
        {
          name: 'Diploma in Electrical Engineering',
          code: 'DIP-EE',
          level: 'Diploma',
          duration: '3 years',
          category: 'Engineering',
          description: 'Electrical engineering program focusing on power systems, electronics, and industrial automation.',
          requirements: {
            minimumGrade: 'D',
            subjects: ['Mathematics', 'Physical Science', 'English'],
            entranceExam: false,
            minimumPoints: 18
          },
          fees: {
            local: 10000,
            international: 30000,
            currency: 'LSL'
          },
          careerProspects: ['Electrical Technician', 'Maintenance Engineer', 'Power Systems Technician', 'Automation Specialist'],
          intakeMonths: ['January']
        },
        {
          name: 'Diploma in Business Management',
          code: 'DIP-BM',
          level: 'Diploma',
          duration: '3 years',
          category: 'Business',
          description: 'Business management program covering marketing, finance, human resources, and entrepreneurship.',
          requirements: {
            minimumGrade: 'D',
            subjects: ['English', 'Mathematics', 'Any other subject'],
            entranceExam: false,
            minimumPoints: 16
          },
          fees: {
            local: 8000,
            international: 25000,
            currency: 'LSL'
          },
          careerProspects: ['Business Manager', 'Marketing Officer', 'HR Officer', 'Entrepreneur'],
          intakeMonths: ['January', 'August']
        },
        {
          name: 'Diploma in Information Technology',
          code: 'DIP-IT',
          level: 'Diploma',
          duration: '3 years',
          category: 'Technology',
          description: 'IT program covering networking, programming, database management, and cybersecurity.',
          requirements: {
            minimumGrade: 'D',
            subjects: ['Mathematics', 'English', 'Computer Studies OR Physical Science'],
            entranceExam: false,
            minimumPoints: 18
          },
          fees: {
            local: 9000,
            international: 28000,
            currency: 'LSL'
          },
          careerProspects: ['IT Support Specialist', 'Network Administrator', 'Web Developer', 'Systems Analyst'],
          intakeMonths: ['January', 'August']
        }
      ]
    },
    // Botho University Lesotho
    {
      institutionName: 'Botho University Lesotho',
      courses: [
        {
          name: 'Bachelor of Computing in Software Engineering',
          code: 'BCOM-SE',
          level: 'Undergraduate',
          duration: '4 years',
          category: 'Technology',
          description: 'Modern software engineering program focusing on application development, mobile apps, and cloud computing.',
          requirements: {
            minimumGrade: 'C',
            subjects: ['Mathematics', 'English', 'Physical Science OR Computer Studies'],
            entranceExam: false,
            minimumPoints: 24
          },
          fees: {
            local: 20000,
            international: 55000,
            currency: 'LSL'
          },
          careerProspects: ['Software Engineer', 'Mobile App Developer', 'Full Stack Developer', 'DevOps Engineer'],
          intakeMonths: ['January', 'May', 'September']
        },
        {
          name: 'Bachelor of Accounting',
          code: 'BACC',
          level: 'Undergraduate',
          duration: '4 years',
          category: 'Business',
          description: 'Professional accounting degree with ACCA exemptions and practical training.',
          requirements: {
            minimumGrade: 'C',
            subjects: ['Mathematics', 'English', 'Accounting OR Business Studies'],
            entranceExam: false,
            minimumPoints: 24
          },
          fees: {
            local: 22000,
            international: 60000,
            currency: 'LSL'
          },
          careerProspects: ['Chartered Accountant', 'Financial Manager', 'Auditor', 'Tax Specialist'],
          intakeMonths: ['January', 'May', 'September']
        },
        {
          name: 'Bachelor of Education in Primary Education',
          code: 'BED-PRIM',
          level: 'Undergraduate',
          duration: '4 years',
          category: 'Education',
          description: 'Teacher training for primary school education with modern teaching methodologies.',
          requirements: {
            minimumGrade: 'C',
            subjects: ['English', 'Mathematics', 'Any other subject'],
            entranceExam: false,
            minimumPoints: 20
          },
          fees: {
            local: 18000,
            international: 48000,
            currency: 'LSL'
          },
          careerProspects: ['Primary School Teacher', 'Education Coordinator', 'Curriculum Specialist'],
          intakeMonths: ['January', 'September']
        }
      ]
    },
    // Limkokwing University
    {
      institutionName: 'Limkokwing University of Creative Technology',
      courses: [
        {
          name: 'Bachelor of Arts in Fashion Design',
          code: 'BA-FD',
          level: 'Undergraduate',
          duration: '3 years',
          category: 'Arts & Design',
          description: 'Creative fashion design program with industry exposure and portfolio development.',
          requirements: {
            minimumGrade: 'D',
            subjects: ['English', 'Design & Technology OR Art', 'Any other subject'],
            entranceExam: false,
            minimumPoints: 18,
            portfolio: true
          },
          fees: {
            local: 25000,
            international: 65000,
            currency: 'LSL'
          },
          careerProspects: ['Fashion Designer', 'Fashion Stylist', 'Pattern Maker', 'Fashion Entrepreneur'],
          intakeMonths: ['January', 'May', 'August']
        },
        {
          name: 'Bachelor of Multimedia Design',
          code: 'BMD',
          level: 'Undergraduate',
          duration: '3 years',
          category: 'Technology',
          description: 'Digital media and design program covering graphics, animation, video production, and web design.',
          requirements: {
            minimumGrade: 'D',
            subjects: ['English', 'Mathematics OR Art', 'Any other subject'],
            entranceExam: false,
            minimumPoints: 18
          },
          fees: {
            local: 24000,
            international: 62000,
            currency: 'LSL'
          },
          careerProspects: ['Graphic Designer', 'Animator', 'Video Editor', 'UI/UX Designer'],
          intakeMonths: ['January', 'May', 'August']
        },
        {
          name: 'Bachelor of Business Management',
          code: 'BBM',
          level: 'Undergraduate',
          duration: '3 years',
          category: 'Business',
          description: 'International business management with entrepreneurship and marketing focus.',
          requirements: {
            minimumGrade: 'C',
            subjects: ['English', 'Mathematics', 'Any other subject'],
            entranceExam: false,
            minimumPoints: 20
          },
          fees: {
            local: 22000,
            international: 58000,
            currency: 'LSL'
          },
          careerProspects: ['Business Manager', 'Marketing Manager', 'Entrepreneur', 'Brand Manager'],
          intakeMonths: ['January', 'May', 'August']
        }
      ]
    },
    // Lesotho College of Education
    {
      institutionName: 'Lesotho College of Education',
      courses: [
        {
          name: 'Diploma in Primary Education',
          code: 'DIP-PE',
          level: 'Diploma',
          duration: '3 years',
          category: 'Education',
          description: 'Primary teacher training with practical teaching experience.',
          requirements: {
            minimumGrade: 'D',
            subjects: ['English', 'Mathematics', 'Any other subject'],
            entranceExam: false,
            minimumPoints: 15
          },
          fees: {
            local: 5000,
            international: 20000,
            currency: 'LSL'
          },
          careerProspects: ['Primary School Teacher', 'Early Childhood Educator', 'Education Assistant'],
          intakeMonths: ['January']
        },
        {
          name: 'Diploma in Secondary Education',
          code: 'DIP-SE',
          level: 'Diploma',
          duration: '3 years',
          category: 'Education',
          description: 'Secondary teacher training with subject specialization.',
          requirements: {
            minimumGrade: 'C',
            subjects: ['English', 'Two teaching subjects'],
            entranceExam: false,
            minimumPoints: 18
          },
          fees: {
            local: 6000,
            international: 22000,
            currency: 'LSL'
          },
          careerProspects: ['Secondary School Teacher', 'Subject Specialist', 'Education Officer'],
          intakeMonths: ['January']
        }
      ]
    },
    // National Health Training College
    {
      institutionName: 'National Health Training College',
      courses: [
        {
          name: 'Diploma in General Nursing',
          code: 'DIP-GN',
          level: 'Diploma',
          duration: '3 years',
          category: 'Health Sciences',
          description: 'Comprehensive nursing program with clinical practice and patient care training.',
          requirements: {
            minimumGrade: 'C',
            subjects: ['Biology', 'Physical Science OR Mathematics', 'English'],
            entranceExam: true,
            minimumPoints: 24,
            medicalFitness: true
          },
          fees: {
            local: 8000,
            international: 30000,
            currency: 'LSL'
          },
          careerProspects: ['Registered Nurse', 'Clinical Nurse', 'Community Health Nurse', 'Nurse Manager'],
          intakeMonths: ['January']
        },
        {
          name: 'Diploma in Midwifery',
          code: 'DIP-MW',
          level: 'Diploma',
          duration: '2 years',
          category: 'Health Sciences',
          description: 'Specialized midwifery training for maternal and child health.',
          requirements: {
            minimumGrade: 'C',
            subjects: ['Biology', 'Physical Science', 'English'],
            entranceExam: true,
            minimumPoints: 24,
            medicalFitness: true,
            prerequisite: 'Nursing qualification preferred'
          },
          fees: {
            local: 7000,
            international: 28000,
            currency: 'LSL'
          },
          careerProspects: ['Midwife', 'Maternity Nurse', 'Reproductive Health Specialist'],
          intakeMonths: ['January']
        },
        {
          name: 'Diploma in Medical Laboratory Sciences',
          code: 'DIP-MLS',
          level: 'Diploma',
          duration: '3 years',
          category: 'Health Sciences',
          description: 'Laboratory science program covering diagnostics, pathology, and clinical testing.',
          requirements: {
            minimumGrade: 'C',
            subjects: ['Biology', 'Physical Science', 'Mathematics', 'English'],
            entranceExam: true,
            minimumPoints: 26
          },
          fees: {
            local: 9000,
            international: 32000,
            currency: 'LSL'
          },
          careerProspects: ['Medical Laboratory Technician', 'Laboratory Manager', 'Pathology Specialist'],
          intakeMonths: ['January']
        }
      ]
    },
    // Lesotho Agricultural College
    {
      institutionName: 'Lesotho Agricultural College',
      courses: [
        {
          name: 'Diploma in Agriculture',
          code: 'DIP-AGR',
          level: 'Diploma',
          duration: '3 years',
          category: 'Agriculture',
          description: 'Practical agriculture program with focus on crop production and farm management.',
          requirements: {
            minimumGrade: 'D',
            subjects: ['Biology OR Agriculture', 'English', 'Any other subject'],
            entranceExam: false,
            minimumPoints: 15
          },
          fees: {
            local: 6000,
            international: 22000,
            currency: 'LSL'
          },
          careerProspects: ['Agricultural Extension Officer', 'Farm Manager', 'Crop Specialist'],
          intakeMonths: ['January']
        },
        {
          name: 'Certificate in Animal Production',
          code: 'CERT-AP',
          level: 'Certificate',
          duration: '1 year',
          category: 'Agriculture',
          description: 'Short course in livestock management and animal husbandry.',
          requirements: {
            minimumGrade: 'E',
            subjects: ['Any three subjects'],
            entranceExam: false,
            minimumPoints: 12
          },
          fees: {
            local: 3000,
            international: 12000,
            currency: 'LSL'
          },
          careerProspects: ['Livestock Officer', 'Animal Health Assistant', 'Farm Worker'],
          intakeMonths: ['January', 'August']
        }
      ]
    }
  ];

  const seedCourses = async () => {
    if (institutions.length === 0) {
      toast.error('No institutions found! Please add institutions first.');
      return;
    }

    const confirm = window.confirm(
      `This will add courses with requirements to institutions.\n\n` +
      `Total courses to add: ${coursesDatabase.reduce((sum, inst) => sum + inst.courses.length, 0)}\n\n` +
      `Continue?`
    );

    if (!confirm) return;

    try {
      setLoading(true);
      let totalAdded = 0;
      const totalCourses = coursesDatabase.reduce((sum, inst) => sum + inst.courses.length, 0);
      
      setProgress({ current: 0, total: totalCourses });

      for (const institutionData of coursesDatabase) {
        // Find matching institution
        const institution = institutions.find(inst => 
          inst.name.toLowerCase().includes(institutionData.institutionName.toLowerCase())
        );

        if (!institution) {
          console.warn(`Institution not found: ${institutionData.institutionName}`);
          continue;
        }

        // Check for existing courses to avoid duplicates
        const existingCoursesSnapshot = await getDocs(
          query(
            collection(db, 'courses'),
            where('institutionId', '==', institution.id)
          )
        );
        
        const existingCourseNames = [];
        existingCoursesSnapshot.forEach(doc => {
          existingCourseNames.push(doc.data().name.toLowerCase());
        });

        // Add courses for this institution
        for (const course of institutionData.courses) {
          // Check if course already exists
          if (existingCourseNames.includes(course.name.toLowerCase())) {
            console.log(`Skipping duplicate: ${course.name}`);
            setProgress(prev => ({ ...prev, current: prev.current + 1 }));
            continue;
          }

          await addDoc(collection(db, 'courses'), {
            ...course,
            institutionId: institution.id,
            institutionName: institution.name,
            institutionType: institution.type,
            location: institution.location,
            isActive: true,
            status: 'active',
            applicationDeadline: 'Contact institution',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });

          totalAdded++;
          setProgress({ current: totalAdded, total: totalCourses });
          
          toast.success(
            `Added ${totalAdded}/${totalCourses}: ${course.name}`,
            { duration: 1000 }
          );
        }
      }

      toast.success(
        `🎉 Successfully added ${totalAdded} courses with requirements!`,
        { duration: 5000 }
      );

    } catch (error) {
      console.error('Error seeding courses:', error);
      toast.error('Failed to seed courses: ' + error.message);
    } finally {
      setLoading(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Seed Courses with Requirements</h1>
        <p className="text-gray-600">
          Add comprehensive courses with qualification requirements to each institution
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
          <p className="text-gray-600">Institutions found: {institutions.length}</p>
          <p className="text-gray-600">
            Total courses ready: {coursesDatabase.reduce((sum, inst) => sum + inst.courses.length, 0)}
          </p>
        </div>

        {loading && progress.total > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Adding courses...</span>
              <span>{progress.current} / {progress.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={seedCourses}
          disabled={loading || institutions.length === 0}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
        >
          {loading ? 'Seeding Courses...' : 'Seed Courses with Requirements'}
        </button>
      </div>

      {/* Course Preview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Courses to be Added</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {coursesDatabase.map((instData, idx) => (
            <div key={idx} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-bold text-gray-900">{instData.institutionName}</h4>
              <p className="text-sm text-gray-600 mb-2">{instData.courses.length} courses</p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {instData.courses.map((course, cIdx) => (
                  <li key={cIdx}>
                    {course.name} ({course.level}) - Grade: {course.requirements.minimumGrade}+
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeedCoursesWithRequirements;
