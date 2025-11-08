import { db } from '../config/firebase.config';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

const comprehensiveDatabaseSeeder = async () => {
  console.log('Starting comprehensive database seeding...');

  try {
    // 1. Create Users
    console.log('Creating users...');
    
    // Admin User
    const adminUser = await addDoc(collection(db, 'users'), {
      email: 'thabotsehla31@gmail.com',
      firstName: 'Thabo',
      lastName: 'Tsehla',
      role: 'admin',
      phone: '+266 1234 5678',
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Student Users
    const student1 = await addDoc(collection(db, 'users'), {
      email: 'tshepo.mokoena@email.com',
      firstName: 'Tshepo',
      lastName: 'Mokoena',
      role: 'student',
      phone: '+266 2345 6789',
      dateOfBirth: '2000-05-15',
      currentGrade: 'Grade 12',
      subjects: ['Mathematics', 'English', 'Physics', 'Chemistry'],
      previousSchool: 'Maseru High School',
      graduationYear: '2023',
      academicAchievements: 'Top 10% of class, Mathematics Olympiad winner',
      certifications: ['Microsoft Office Specialist', 'Python Programming'],
      skills: ['Programming', 'Data Analysis', 'Communication'],
      languages: ['English', 'Sesotho', 'French'],
      workExperience: [{
        position: 'Part-time Tutor',
        company: 'Local Learning Center',
        duration: '2022-2023',
        description: 'Tutored mathematics and science to junior students'
      }],
      address: '123 Main Street, Maseru',
      emergencyContact: 'Mamello Mokoena',
      emergencyPhone: '+266 3456 7890',
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const student2 = await addDoc(collection(db, 'users'), {
      email: 'palesa.motsoene@email.com',
      firstName: 'Palesa',
      lastName: 'Motsoene',
      role: 'student',
      phone: '+266 3456 7890',
      dateOfBirth: '1999-08-22',
      currentGrade: 'Bachelor\'s Degree',
      subjects: ['Business Studies', 'Economics', 'English'],
      previousSchool: 'Lesotho College of Education',
      graduationYear: '2022',
      academicAchievements: 'Dean\'s List, Business Case Competition Winner',
      certifications: ['Project Management Professional', 'Digital Marketing'],
      skills: ['Project Management', 'Marketing', 'Leadership'],
      languages: ['English', 'Sesotho'],
      workExperience: [{
        position: 'Marketing Intern',
        company: 'Local Marketing Agency',
        duration: '2021-2022',
        description: 'Assisted with social media marketing campaigns'
      }],
      address: '456 Business District, Maseru',
      emergencyContact: 'Thabo Motsoene',
      emergencyPhone: '+266 4567 8901',
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Company Users
    const company1 = await addDoc(collection(db, 'users'), {
      email: 'hr@techcorp.co.ls',
      firstName: 'Lerato',
      lastName: 'Ntsane',
      role: 'company',
      phone: '+266 4567 8901',
      companyName: 'TechCorp Lesotho',
      industry: 'Technology',
      companySize: '50-100 employees',
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const company2 = await addDoc(collection(db, 'users'), {
      email: 'recruitment@lesothobank.co.ls',
      firstName: 'Rethabile',
      lastName: 'Molefe',
      role: 'company',
      phone: '+266 5678 9012',
      companyName: 'Lesotho Bank',
      industry: 'Finance',
      companySize: '500+ employees',
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Institution Users
    const institution1 = await addDoc(collection(db, 'users'), {
      email: 'admin@nul.ac.ls',
      firstName: 'Dr. Mary',
      lastName: 'Mokhele',
      role: 'institute',
      phone: '+266 5678 9012',
      institutionName: 'National University of Lesotho',
      institutionType: 'University',
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // 2. Create Institutions
    console.log('Creating institutions...');
    
    const nul = await addDoc(collection(db, 'institutions'), {
      name: 'National University of Lesotho',
      type: 'University',
      location: 'Roma, Maseru',
      description: 'Lesotho\'s premier university offering comprehensive undergraduate and postgraduate programs',
      website: 'https://www.nul.ac.ls',
      phone: '+266 2234 0000',
      email: 'info@nul.ac.ls',
      established: '1945',
      accreditation: 'Council on Higher Education',
      facilities: ['Library', 'Laboratories', 'Sports Complex', 'Student Housing'],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const idm = await addDoc(collection(db, 'institutions'), {
      name: 'Institute of Development Management',
      type: 'College',
      location: 'Maseru',
      description: 'Leading institution for business and development studies',
      website: 'https://www.idm.ac.ls',
      phone: '+266 2231 2345',
      email: 'info@idm.ac.ls',
      established: '1974',
      accreditation: 'Council on Higher Education',
      facilities: ['Library', 'Computer Labs', 'Conference Hall'],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const lce = await addDoc(collection(db, 'institutions'), {
      name: 'Lesotho College of Education',
      type: 'College',
      location: 'Maseru',
      description: 'Premier teacher training institution',
      website: 'https://www.lce.ac.ls',
      phone: '+266 2232 3456',
      email: 'info@lce.ac.ls',
      established: '1975',
      accreditation: 'Council on Higher Education',
      facilities: ['Library', 'Teaching Labs', 'Student Dormitories'],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // 3. Create Companies
    console.log('Creating companies...');
    
    const techcorp = await addDoc(collection(db, 'companies'), {
      name: 'TechCorp Lesotho',
      industry: 'Technology',
      description: 'Leading technology company providing software solutions and IT services across Lesotho',
      website: 'https://www.techcorp.co.ls',
      phone: '+266 2234 5678',
      email: 'info@techcorp.co.ls',
      location: 'Maseru',
      size: '50-100 employees',
      founded: '2010',
      specialties: ['Software Development', 'IT Consulting', 'Digital Solutions'],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const lesothobank = await addDoc(collection(db, 'companies'), {
      name: 'Lesotho Bank',
      industry: 'Finance',
      description: 'Premier banking institution providing comprehensive financial services',
      website: 'https://www.lesothobank.co.ls',
      phone: '+266 2231 0000',
      email: 'info@lesothobank.co.ls',
      location: 'Maseru',
      size: '500+ employees',
      founded: '1975',
      specialties: ['Banking', 'Financial Services', 'Investment'],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const miningcorp = await addDoc(collection(db, 'companies'), {
      name: 'Lesotho Mining Corporation',
      industry: 'Mining',
      description: 'Leading diamond mining company with operations across Lesotho',
      website: 'https://www.lmc.co.ls',
      phone: '+266 2233 4567',
      email: 'info@lmc.co.ls',
      location: 'Maseru',
      size: '1000+ employees',
      founded: '1960',
      specialties: ['Diamond Mining', 'Geological Services', 'Environmental Management'],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // 4. Create Courses
    console.log('Creating courses...');
    
    const csCourse = await addDoc(collection(db, 'courses'), {
      name: 'Bachelor of Computer Science',
      description: 'Comprehensive computer science program covering programming, algorithms, data structures, and software engineering principles.',
      duration: '4 years',
      level: 'Bachelor\'s Degree',
      category: 'Technology',
      institutionId: nul.id,
      institutionName: 'National University of Lesotho',
      requirements: {
        minimumGrade: 'C+',
        subjects: ['Mathematics', 'English', 'Physics'],
        entranceExam: true
      },
      fees: {
        local: 15000,
        international: 25000,
        currency: 'LSL'
      },
      careerProspects: [
        'Software Developer',
        'Systems Analyst',
        'Database Administrator',
        'IT Consultant',
        'Web Developer'
      ],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const hrCourse = await addDoc(collection(db, 'courses'), {
      name: 'Diploma in Human Resource Management',
      description: 'Program designed to develop professional HR practitioners skilled in recruitment, training, and performance management.',
      duration: '2 years',
      level: 'Diploma',
      category: 'Social Sciences',
      institutionId: idm.id,
      institutionName: 'Institute of Development Management',
      requirements: {
        minimumGrade: 'C',
        subjects: ['English', 'Business Studies'],
        entranceExam: false
      },
      fees: {
        local: 9000,
        international: 14000,
        currency: 'LSL'
      },
      careerProspects: [
        'HR Assistant',
        'Recruitment Officer',
        'Training Coordinator',
        'Employee Relations Specialist'
      ],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const educationCourse = await addDoc(collection(db, 'courses'), {
      name: 'Bachelor of Education (Secondary)',
      description: 'Teacher education program preparing students to teach at secondary school level.',
      duration: '4 years',
      level: 'Bachelor\'s Degree',
      category: 'Education',
      institutionId: lce.id,
      institutionName: 'Lesotho College of Education',
      requirements: {
        minimumGrade: 'C+',
        subjects: ['English', 'Mathematics', 'Teaching Subject'],
        entranceExam: false
      },
      fees: {
        local: 10000,
        international: 18000,
        currency: 'LSL'
      },
      careerProspects: [
        'Secondary School Teacher',
        'Subject Specialist',
        'Education Administrator',
        'Curriculum Developer',
        'Educational Consultant'
      ],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // 5. Create Jobs
    console.log('Creating jobs...');
    
    const softwareDevJob = await addDoc(collection(db, 'jobs'), {
      title: 'Software Developer',
      description: 'We are looking for a skilled software developer to join our development team. You will be responsible for developing and maintaining web applications using modern technologies.',
      companyId: techcorp.id,
      companyName: 'TechCorp Lesotho',
      location: 'Maseru',
      type: 'Full-time',
      category: 'Technology',
      salary: 'M15,000 - M25,000',
      experienceLevel: 'Entry Level',
      requiredSkills: ['JavaScript', 'React', 'Node.js', 'Database Management'],
      qualifications: 'Bachelor\'s degree in Computer Science or related field',
      responsibilities: [
        'Develop and maintain web applications',
        'Collaborate with cross-functional teams',
        'Write clean, maintainable code',
        'Participate in code reviews'
      ],
      benefits: ['Health Insurance', 'Flexible Hours', 'Professional Development'],
      status: 'active',
      postedDate: serverTimestamp(),
      applicationDeadline: Timestamp.fromDate(new Date('2024-02-15T23:59:59Z')),
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const businessAnalystJob = await addDoc(collection(db, 'jobs'), {
      title: 'Business Analyst',
      description: 'Seeking a business analyst to analyze business processes and recommend improvements. You will work with stakeholders to understand requirements and translate them into technical specifications.',
      companyId: lesothobank.id,
      companyName: 'Lesotho Bank',
      location: 'Maseru',
      type: 'Full-time',
      category: 'Business',
      salary: 'M12,000 - M20,000',
      experienceLevel: 'Mid Level',
      requiredSkills: ['Business Analysis', 'Data Analysis', 'Communication', 'Problem Solving'],
      qualifications: 'Bachelor\'s degree in Business Administration or related field',
      responsibilities: [
        'Analyze business processes',
        'Gather and document requirements',
        'Create process flow diagrams',
        'Present findings to stakeholders'
      ],
      benefits: ['Health Insurance', 'Retirement Plan', 'Training Opportunities'],
      status: 'active',
      postedDate: serverTimestamp(),
      applicationDeadline: Timestamp.fromDate(new Date('2024-02-20T23:59:59Z')),
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const miningEngineerJob = await addDoc(collection(db, 'jobs'), {
      title: 'Mining Engineer',
      description: 'We are seeking a qualified mining engineer to oversee mining operations and ensure safety standards. You will work with geological teams to optimize extraction processes.',
      companyId: miningcorp.id,
      companyName: 'Lesotho Mining Corporation',
      location: 'Maseru',
      type: 'Full-time',
      category: 'Engineering',
      salary: 'M20,000 - M35,000',
      experienceLevel: 'Senior Level',
      requiredSkills: ['Mining Engineering', 'Safety Management', 'Project Management', 'Geological Analysis'],
      qualifications: 'Bachelor\'s degree in Mining Engineering or related field',
      responsibilities: [
        'Oversee mining operations',
        'Ensure safety compliance',
        'Optimize extraction processes',
        'Manage geological surveys'
      ],
      benefits: ['Health Insurance', 'Housing Allowance', 'Professional Development', 'Safety Bonuses'],
      status: 'active',
      postedDate: serverTimestamp(),
      applicationDeadline: Timestamp.fromDate(new Date('2024-03-01T23:59:59Z')),
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // 6. Create Sample Applications
    console.log('Creating sample applications...');
    
    const courseApplication = await addDoc(collection(db, 'applications'), {
      studentId: student1.id,
      studentName: 'Tshepo Mokoena',
      studentEmail: 'tshepo.mokoena@email.com',
      studentPhone: '+266 2345 6789',
      studentDateOfBirth: '2000-05-15',
      currentGrade: 'Grade 12',
      subjects: ['Mathematics', 'English', 'Physics', 'Chemistry'],
      previousSchool: 'Maseru High School',
      graduationYear: '2023',
      academicAchievements: 'Top 10% of class, Mathematics Olympiad winner',
      applicationType: 'course',
      courseId: csCourse.id,
      courseName: 'Bachelor of Computer Science',
      institutionId: nul.id,
      institutionName: 'National University of Lesotho',
      motivation: 'I am passionate about technology and want to pursue a career in software development.',
      coverLetter: 'I have always been interested in computers and programming. My experience with mathematics and problem-solving makes me well-suited for computer science.',
      additionalInfo: 'I have completed several online programming courses and built small projects.',
      status: 'pending',
      appliedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const jobApplication = await addDoc(collection(db, 'applications'), {
      studentId: student2.id,
      studentName: 'Palesa Motsoene',
      studentEmail: 'palesa.motsoene@email.com',
      studentPhone: '+266 3456 7890',
      studentDateOfBirth: '1999-08-22',
      currentGrade: 'Bachelor\'s Degree',
      subjects: ['Business Studies', 'Economics', 'English'],
      previousSchool: 'Lesotho College of Education',
      graduationYear: '2022',
      academicAchievements: 'Dean\'s List, Business Case Competition Winner',
      applicationType: 'job',
      jobId: businessAnalystJob.id,
      jobTitle: 'Business Analyst',
      companyId: lesothobank.id,
      companyName: 'Lesotho Bank',
      motivation: 'I am excited about the opportunity to work as a business analyst and contribute to process improvements.',
      coverLetter: 'I have strong analytical skills and experience with business processes from my studies and internship.',
      additionalInfo: 'I have completed a project management certification and have experience with data analysis tools.',
      status: 'pending',
      appliedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // 7. Create Sample Admissions
    console.log('Creating sample admissions...');
    
    const admission = await addDoc(collection(db, 'admissions'), {
      studentId: student1.id,
      studentName: 'Tshepo Mokoena',
      courseId: csCourse.id,
      courseName: 'Bachelor of Computer Science',
      institutionId: nul.id,
      institutionName: 'National University of Lesotho',
      status: 'accepted',
      admissionDate: serverTimestamp(),
      academicYear: '2024-2025',
      semester: '1',
      conditions: ['Maintain minimum GPA of 2.5', 'Complete all prerequisite courses'],
      notes: 'Congratulations on your admission! Please complete the enrollment process by February 15th.',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // 8. Create Sample Notifications
    console.log('Creating sample notifications...');
    
    await addDoc(collection(db, 'notifications'), {
      userId: student1.id,
      title: 'Application Status Update',
      message: 'Your application for Bachelor of Computer Science has been reviewed and accepted!',
      type: 'application_update',
      isRead: false,
      priority: 'high',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    await addDoc(collection(db, 'notifications'), {
      userId: student2.id,
      title: 'New Job Opportunity',
      message: 'A new job matching your qualifications has been posted: Business Analyst at Lesotho Bank.',
      type: 'job_opportunity',
      isRead: false,
      priority: 'medium',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // 9. Create System Settings
    console.log('Creating system settings...');
    
    await addDoc(collection(db, 'system_settings'), {
      key: 'application_deadline',
      value: '2024-03-31T23:59:59Z',
      description: 'Application deadline for current academic year',
      category: 'academic',
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    await addDoc(collection(db, 'system_settings'), {
      key: 'max_applications_per_student',
      value: '5',
      description: 'Maximum number of applications a student can submit',
      category: 'application',
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Comprehensive database seeding completed successfully!');
    console.log('Created:');
    console.log('- 6 Users (1 Admin, 2 Students, 2 Companies, 1 Institution)');
    console.log('- 3 Institutions');
    console.log('- 3 Companies');
    console.log('- 3 Courses');
    console.log('- 3 Jobs');
    console.log('- 2 Applications');
    console.log('- 1 Admission');
    console.log('- 2 Notifications');
    console.log('- 2 System Settings');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

export default comprehensiveDatabaseSeeder;
