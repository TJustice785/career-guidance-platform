import { db } from '../config/firebase.config';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

// Sample Institutions
const sampleInstitutions = [
  {
    name: "National University of Lesotho",
    description: "The premier institution of higher learning in Lesotho, offering quality education since 1945",
    location: "Roma, Lesotho",
    type: "university",
    website: "https://www.nul.ls",
    email: "info@nul.ls",
    phone: "+266 2234 0601",
    logo: "https://via.placeholder.com/150?text=NUL",
    accreditation: "Council on Higher Education",
    established: 1945,
    featured: true
  },
  {
    name: "Limkokwing University of Creative Technology",
    description: "Leading private university offering innovative programs in technology and creative arts",
    location: "Maseru, Lesotho",
    type: "university",
    website: "https://www.limkokwing.net/lesotho",
    email: "info@limkokwing.ac.ls",
    phone: "+266 2231 2156",
    logo: "https://via.placeholder.com/150?text=Limkokwing",
    accreditation: "Council on Higher Education",
    established: 2007,
    featured: true
  },
  {
    name: "Lesotho College of Education",
    description: "Training the next generation of educators in Lesotho",
    location: "Maseru, Lesotho",
    type: "college",
    website: "https://www.lce.ac.ls",
    email: "info@lce.ac.ls",
    phone: "+266 2231 3045",
    logo: "https://via.placeholder.com/150?text=LCE",
    accreditation: "Ministry of Education",
    established: 1975,
    featured: false
  },
  {
    name: "Lerotholi Polytechnic",
    description: "Technical and vocational education excellence in engineering and applied sciences",
    location: "Maseru, Lesotho",
    type: "technical",
    website: "https://www.lerotholi.ac.ls",
    email: "admissions@lerotholi.ac.ls",
    phone: "+266 2231 2445",
    logo: "https://via.placeholder.com/150?text=LP",
    accreditation: "Council on Higher Education",
    established: 1980,
    featured: true
  },
  {
    name: "Botho University",
    description: "Modern private university focused on business, IT, and professional studies",
    location: "Maseru, Lesotho",
    type: "university",
    website: "https://www.bothouniversity.ac.ls",
    email: "info@bothouniversity.ac.ls",
    phone: "+266 2231 8900",
    logo: "https://via.placeholder.com/150?text=Botho",
    accreditation: "Council on Higher Education",
    established: 2010,
    featured: true
  },
  {
    name: "Institute of Development Management",
    description: "Specialized training in public administration and development management",
    location: "Maseru, Lesotho",
    type: "institute",
    website: "https://www.idm.ac.ls",
    email: "info@idm.ac.ls",
    phone: "+266 2231 4455",
    logo: "https://via.placeholder.com/150?text=IDM",
    accreditation: "Ministry of Public Service",
    established: 1974,
    featured: false
  },
  {
    name: "Lesotho Agricultural College",
    description: "Leading institution for agricultural education and research",
    location: "Maseru, Lesotho",
    type: "college",
    website: "https://www.lac.ac.ls",
    email: "info@lac.ac.ls",
    phone: "+266 2234 5678",
    logo: "https://via.placeholder.com/150?text=LAC",
    accreditation: "Ministry of Agriculture",
    established: 1955,
    featured: false
  },
  {
    name: "National Health Training College",
    description: "Training healthcare professionals for Lesotho's health sector",
    location: "Maseru, Lesotho",
    type: "college",
    website: "https://www.nhtc.ac.ls",
    email: "admissions@nhtc.ac.ls",
    phone: "+266 2231 7890",
    logo: "https://via.placeholder.com/150?text=NHTC",
    accreditation: "Ministry of Health",
    established: 1972,
    featured: true
  }
];

// Sample Courses
const sampleCourses = [
  {
    title: "Bachelor of Science in Computer Science",
    description: "Comprehensive program covering software development, algorithms, data structures, and computer systems",
    institutionId: "nul-001",
    institutionName: "National University of Lesotho",
    duration: "4 years",
    level: "degree",
    field: "Computer Science",
    requirements: [
      "High School Certificate",
      "Mathematics Grade C or better",
      "English Grade C or better",
      "Physical Science recommended"
    ],
    fees: 15000,
    currency: "LSL",
    startDate: Timestamp.fromDate(new Date('2025-02-01')),
    applicationDeadline: Timestamp.fromDate(new Date('2025-01-15')),
    capacity: 50,
    enrolled: 0,
    status: "open"
  },
  {
    title: "Diploma in Business Administration",
    description: "Practical business skills for aspiring entrepreneurs and managers",
    institutionId: "limkokwing-001",
    institutionName: "Limkokwing University",
    duration: "2 years",
    level: "diploma",
    field: "Business",
    requirements: [
      "High School Certificate",
      "Mathematics Grade D or better",
      "English Grade C or better"
    ],
    fees: 12000,
    currency: "LSL",
    startDate: Timestamp.fromDate(new Date('2025-03-01')),
    applicationDeadline: Timestamp.fromDate(new Date('2025-02-15')),
    capacity: 40,
    enrolled: 0,
    status: "open"
  },
  {
    title: "Certificate in Early Childhood Education",
    description: "Foundation program for aspiring preschool and primary school teachers",
    institutionId: "lce-001",
    institutionName: "Lesotho College of Education",
    duration: "1 year",
    level: "certificate",
    field: "Education",
    requirements: [
      "High School Certificate",
      "English Grade C or better",
      "Passion for teaching"
    ],
    fees: 8000,
    currency: "LSL",
    startDate: Timestamp.fromDate(new Date('2025-02-15')),
    applicationDeadline: Timestamp.fromDate(new Date('2025-01-31')),
    capacity: 30,
    enrolled: 0,
    status: "open"
  },
  {
    title: "Diploma in Electrical Engineering",
    description: "Hands-on training in electrical systems, power distribution, and electronics",
    institutionId: "lerotholi-001",
    institutionName: "Lerotholi Polytechnic",
    duration: "3 years",
    level: "diploma",
    field: "Engineering",
    requirements: [
      "High School Certificate",
      "Mathematics Grade C or better",
      "Physical Science Grade C or better"
    ],
    fees: 14000,
    currency: "LSL",
    startDate: Timestamp.fromDate(new Date('2025-02-10')),
    applicationDeadline: Timestamp.fromDate(new Date('2025-01-25')),
    capacity: 35,
    enrolled: 0,
    status: "open"
  },
  {
    title: "Bachelor of Commerce in Accounting",
    description: "Professional accounting program preparing students for CPA certification",
    institutionId: "botho-001",
    institutionName: "Botho University",
    duration: "4 years",
    level: "degree",
    field: "Accounting",
    requirements: [
      "High School Certificate",
      "Mathematics Grade C or better",
      "English Grade C or better",
      "Accounting recommended"
    ],
    fees: 18000,
    currency: "LSL",
    startDate: Timestamp.fromDate(new Date('2025-03-01')),
    applicationDeadline: Timestamp.fromDate(new Date('2025-02-10')),
    capacity: 45,
    enrolled: 0,
    status: "open"
  },
  {
    title: "Certificate in Nursing Assistant",
    description: "Entry-level healthcare training for aspiring nurses",
    institutionId: "nhtc-001",
    institutionName: "National Health Training College",
    duration: "1 year",
    level: "certificate",
    field: "Healthcare",
    requirements: [
      "High School Certificate",
      "Biology Grade C or better",
      "English Grade C or better"
    ],
    fees: 9000,
    currency: "LSL",
    startDate: Timestamp.fromDate(new Date('2025-02-20')),
    applicationDeadline: Timestamp.fromDate(new Date('2025-02-05')),
    capacity: 40,
    enrolled: 0,
    status: "open"
  },
  {
    title: "Diploma in Agricultural Science",
    description: "Modern farming techniques, crop management, and sustainable agriculture",
    institutionId: "lac-001",
    institutionName: "Lesotho Agricultural College",
    duration: "2 years",
    level: "diploma",
    field: "Agriculture",
    requirements: [
      "High School Certificate",
      "Biology or Agricultural Science Grade C or better",
      "English Grade C or better"
    ],
    fees: 10000,
    currency: "LSL",
    startDate: Timestamp.fromDate(new Date('2025-03-15')),
    applicationDeadline: Timestamp.fromDate(new Date('2025-02-28')),
    capacity: 30,
    enrolled: 0,
    status: "open"
  },
  {
    title: "Bachelor of Arts in Graphic Design",
    description: "Creative program in visual communication, branding, and digital design",
    institutionId: "limkokwing-002",
    institutionName: "Limkokwing University",
    duration: "3 years",
    level: "degree",
    field: "Design",
    requirements: [
      "High School Certificate",
      "Portfolio submission required",
      "English Grade C or better"
    ],
    fees: 16000,
    currency: "LSL",
    startDate: Timestamp.fromDate(new Date('2025-03-01')),
    applicationDeadline: Timestamp.fromDate(new Date('2025-02-15')),
    capacity: 25,
    enrolled: 0,
    status: "open"
  },
  {
    title: "Certificate in Public Administration",
    description: "Foundation course in government operations and public service",
    institutionId: "idm-001",
    institutionName: "Institute of Development Management",
    duration: "6 months",
    level: "certificate",
    field: "Public Administration",
    requirements: [
      "High School Certificate",
      "English Grade C or better"
    ],
    fees: 7000,
    currency: "LSL",
    startDate: Timestamp.fromDate(new Date('2025-02-01')),
    applicationDeadline: Timestamp.fromDate(new Date('2025-01-20')),
    capacity: 50,
    enrolled: 0,
    status: "open"
  },
  {
    title: "Diploma in Information Technology",
    description: "Practical IT skills including networking, databases, and system administration",
    institutionId: "botho-002",
    institutionName: "Botho University",
    duration: "2 years",
    level: "diploma",
    field: "Information Technology",
    requirements: [
      "High School Certificate",
      "Mathematics Grade D or better",
      "Computer literacy"
    ],
    fees: 13000,
    currency: "LSL",
    startDate: Timestamp.fromDate(new Date('2025-03-01')),
    applicationDeadline: Timestamp.fromDate(new Date('2025-02-15')),
    capacity: 40,
    enrolled: 0,
    status: "open"
  }
];

// Sample Jobs
const sampleJobs = [
  {
    title: "Junior Software Developer",
    company: "Lesotho Tech Solutions",
    companyId: "lts-001",
    description: "Join our growing team as a Junior Software Developer. Work on exciting projects using modern technologies.",
    requirements: [
      "Bachelor's degree in Computer Science or related field",
      "Knowledge of JavaScript, React, and Node.js",
      "Strong problem-solving skills",
      "Good communication skills"
    ],
    responsibilities: [
      "Develop and maintain web applications",
      "Collaborate with senior developers and designers",
      "Write clean, maintainable code",
      "Participate in code reviews",
      "Debug and troubleshoot issues"
    ],
    location: "Maseru, Lesotho",
    type: "full-time",
    category: "Technology",
    salary: {
      min: 8000,
      max: 12000,
      currency: "LSL"
    },
    experience: "0-2 years",
    education: "Bachelor's Degree",
    skills: ["JavaScript", "React", "Node.js", "Git", "HTML/CSS"],
    benefits: ["Health Insurance", "Paid Leave", "Professional Development", "Flexible Hours"],
    applicationDeadline: Timestamp.fromDate(new Date('2025-02-28')),
    featured: true,
    trending: true,
    views: 0,
    applicants: 0,
    status: "open"
  },
  {
    title: "Marketing Manager",
    company: "Lesotho Retail Group",
    companyId: "lrg-001",
    description: "Lead our marketing team and drive brand awareness across Lesotho",
    requirements: [
      "Bachelor's degree in Marketing or Business",
      "3+ years marketing experience",
      "Digital marketing expertise",
      "Leadership skills"
    ],
    responsibilities: [
      "Develop marketing strategies",
      "Manage marketing team",
      "Oversee digital campaigns",
      "Analyze market trends",
      "Manage marketing budget"
    ],
    location: "Maseru, Lesotho",
    type: "full-time",
    category: "Marketing",
    salary: {
      min: 15000,
      max: 20000,
      currency: "LSL"
    },
    experience: "3-5 years",
    education: "Bachelor's Degree",
    skills: ["Digital Marketing", "SEO", "Social Media", "Analytics", "Leadership"],
    benefits: ["Health Insurance", "Retirement Plan", "Performance Bonus", "Car Allowance"],
    applicationDeadline: Timestamp.fromDate(new Date('2025-03-15')),
    featured: true,
    trending: false,
    views: 0,
    applicants: 0,
    status: "open"
  },
  {
    title: "Accounting Intern",
    company: "Lesotho Financial Services",
    companyId: "lfs-001",
    description: "Gain practical accounting experience in a professional environment",
    requirements: [
      "Currently pursuing accounting degree",
      "Basic knowledge of accounting principles",
      "Proficiency in Excel",
      "Attention to detail"
    ],
    responsibilities: [
      "Assist with bookkeeping",
      "Prepare financial reports",
      "Support audit processes",
      "Learn accounting software",
      "Administrative support"
    ],
    location: "Maseru, Lesotho",
    type: "internship",
    category: "Finance",
    salary: {
      min: 3000,
      max: 4000,
      currency: "LSL"
    },
    experience: "0-1 years",
    education: "Pursuing Degree",
    skills: ["Excel", "Accounting", "Communication", "Organization"],
    benefits: ["Training", "Mentorship", "Certificate", "Potential Full-time Offer"],
    applicationDeadline: Timestamp.fromDate(new Date('2025-02-15')),
    featured: false,
    trending: true,
    views: 0,
    applicants: 0,
    status: "open"
  },
  {
    title: "Registered Nurse",
    company: "Queen Mamohato Memorial Hospital",
    companyId: "qmmh-001",
    description: "Provide quality patient care in a modern healthcare facility",
    requirements: [
      "Nursing Diploma or Degree",
      "Valid nursing license",
      "2+ years clinical experience",
      "Strong interpersonal skills"
    ],
    responsibilities: [
      "Assess and monitor patient conditions",
      "Administer medications and treatments",
      "Collaborate with medical team",
      "Maintain patient records",
      "Educate patients and families"
    ],
    location: "Maseru, Lesotho",
    type: "full-time",
    category: "Healthcare",
    salary: {
      min: 12000,
      max: 16000,
      currency: "LSL"
    },
    experience: "2-4 years",
    education: "Diploma/Degree",
    skills: ["Patient Care", "Medical Procedures", "Communication", "Critical Thinking"],
    benefits: ["Health Insurance", "Pension", "Continuing Education", "Shift Allowance"],
    applicationDeadline: Timestamp.fromDate(new Date('2025-03-10')),
    featured: true,
    trending: true,
    views: 0,
    applicants: 0,
    status: "open"
  },
  {
    title: "Civil Engineer",
    company: "Lesotho Construction Ltd",
    companyId: "lcl-001",
    description: "Lead infrastructure projects across Lesotho",
    requirements: [
      "Bachelor's degree in Civil Engineering",
      "Professional Engineer registration",
      "5+ years experience",
      "Project management skills"
    ],
    responsibilities: [
      "Design and oversee construction projects",
      "Prepare technical drawings and specifications",
      "Manage project budgets and timelines",
      "Ensure compliance with regulations",
      "Supervise construction teams"
    ],
    location: "Maseru, Lesotho",
    type: "full-time",
    category: "Engineering",
    salary: {
      min: 20000,
      max: 28000,
      currency: "LSL"
    },
    experience: "5+ years",
    education: "Bachelor's Degree",
    skills: ["AutoCAD", "Project Management", "Structural Design", "Quality Control"],
    benefits: ["Health Insurance", "Car Allowance", "Performance Bonus", "Pension"],
    applicationDeadline: Timestamp.fromDate(new Date('2025-03-20')),
    featured: true,
    trending: false,
    views: 0,
    applicants: 0,
    status: "open"
  },
  {
    title: "Customer Service Representative",
    company: "Vodacom Lesotho",
    companyId: "vodacom-001",
    description: "Deliver exceptional customer service in telecommunications",
    requirements: [
      "High School Certificate",
      "Excellent communication skills",
      "Computer literacy",
      "Customer service experience preferred"
    ],
    responsibilities: [
      "Handle customer inquiries and complaints",
      "Process service requests",
      "Maintain customer records",
      "Meet service level targets",
      "Promote products and services"
    ],
    location: "Maseru, Lesotho",
    type: "full-time",
    category: "Customer Service",
    salary: {
      min: 6000,
      max: 8000,
      currency: "LSL"
    },
    experience: "0-2 years",
    education: "High School Certificate",
    skills: ["Communication", "Problem Solving", "Computer Skills", "Patience"],
    benefits: ["Health Insurance", "Performance Bonus", "Training", "Staff Discounts"],
    applicationDeadline: Timestamp.fromDate(new Date('2025-02-25')),
    featured: false,
    trending: true,
    views: 0,
    applicants: 0,
    status: "open"
  },
  {
    title: "Agricultural Extension Officer",
    company: "Ministry of Agriculture",
    companyId: "moa-001",
    description: "Support farmers with modern agricultural practices",
    requirements: [
      "Diploma in Agriculture or related field",
      "Knowledge of local farming practices",
      "Valid driver's license",
      "Willingness to travel to rural areas"
    ],
    responsibilities: [
      "Provide technical advice to farmers",
      "Conduct training workshops",
      "Promote sustainable farming methods",
      "Monitor crop and livestock health",
      "Prepare extension reports"
    ],
    location: "Leribe, Lesotho",
    type: "full-time",
    category: "Agriculture",
    salary: {
      min: 9000,
      max: 12000,
      currency: "LSL"
    },
    experience: "1-3 years",
    education: "Diploma",
    skills: ["Agriculture", "Training", "Communication", "Report Writing"],
    benefits: ["Government Benefits", "Transport Allowance", "Housing", "Pension"],
    applicationDeadline: Timestamp.fromDate(new Date('2025-03-05')),
    featured: false,
    trending: false,
    views: 0,
    applicants: 0,
    status: "open"
  },
  {
    title: "Graphic Designer",
    company: "Creative Media Lesotho",
    companyId: "cml-001",
    description: "Create stunning visual content for diverse clients",
    requirements: [
      "Diploma/Degree in Graphic Design",
      "Proficiency in Adobe Creative Suite",
      "Strong portfolio",
      "Creative thinking"
    ],
    responsibilities: [
      "Design marketing materials and branding",
      "Create social media graphics",
      "Develop visual concepts",
      "Collaborate with clients and team",
      "Manage multiple projects"
    ],
    location: "Maseru, Lesotho",
    type: "full-time",
    category: "Design",
    salary: {
      min: 10000,
      max: 14000,
      currency: "LSL"
    },
    experience: "2-4 years",
    education: "Diploma/Degree",
    skills: ["Adobe Photoshop", "Illustrator", "InDesign", "Creativity", "Time Management"],
    benefits: ["Health Insurance", "Creative Freedom", "Professional Development", "Flexible Hours"],
    applicationDeadline: Timestamp.fromDate(new Date('2025-03-01')),
    featured: true,
    trending: true,
    views: 0,
    applicants: 0,
    status: "open"
  },
  {
    title: "Human Resources Officer",
    company: "Lesotho Retail Group",
    companyId: "lrg-002",
    description: "Manage HR functions for growing retail company",
    requirements: [
      "Bachelor's degree in HR or related field",
      "2+ years HR experience",
      "Knowledge of labor laws",
      "Strong organizational skills"
    ],
    responsibilities: [
      "Recruit and onboard new employees",
      "Manage employee relations",
      "Administer payroll and benefits",
      "Ensure compliance with labor laws",
      "Develop HR policies"
    ],
    location: "Maseru, Lesotho",
    type: "full-time",
    category: "Human Resources",
    salary: {
      min: 13000,
      max: 17000,
      currency: "LSL"
    },
    experience: "2-4 years",
    education: "Bachelor's Degree",
    skills: ["Recruitment", "Employee Relations", "Payroll", "Communication", "HR Software"],
    benefits: ["Health Insurance", "Pension", "Performance Bonus", "Professional Development"],
    applicationDeadline: Timestamp.fromDate(new Date('2025-03-12')),
    featured: false,
    trending: false,
    views: 0,
    applicants: 0,
    status: "open"
  },
  {
    title: "Data Analyst",
    company: "Lesotho Tech Solutions",
    companyId: "lts-002",
    description: "Transform data into actionable business insights",
    requirements: [
      "Bachelor's degree in Statistics, Mathematics, or related field",
      "Proficiency in SQL and Python",
      "Experience with data visualization tools",
      "Analytical mindset"
    ],
    responsibilities: [
      "Analyze complex datasets",
      "Create dashboards and reports",
      "Identify trends and patterns",
      "Present findings to stakeholders",
      "Support data-driven decision making"
    ],
    location: "Maseru, Lesotho",
    type: "full-time",
    category: "Technology",
    salary: {
      min: 14000,
      max: 18000,
      currency: "LSL"
    },
    experience: "2-3 years",
    education: "Bachelor's Degree",
    skills: ["SQL", "Python", "Excel", "Tableau", "Statistics"],
    benefits: ["Health Insurance", "Remote Work Options", "Training", "Performance Bonus"],
    applicationDeadline: Timestamp.fromDate(new Date('2025-03-08')),
    featured: true,
    trending: true,
    views: 0,
    applicants: 0,
    status: "open"
  }
];

// Sample Career Tips
const sampleCareerTips = [
  {
    title: "How to Write a Winning Resume",
    content: "Your resume is your first impression. Keep it concise (1-2 pages), highlight achievements with numbers, use action verbs, and tailor it to each job. Include: contact info, summary, experience, education, and skills.",
    category: "resume",
    author: "CareerPath Team",
    featured: true,
    views: 0,
    likes: 0
  },
  {
    title: "Ace Your Job Interview: Top 10 Tips",
    content: "1. Research the company. 2. Practice common questions. 3. Dress professionally. 4. Arrive early. 5. Bring extra resumes. 6. Show enthusiasm. 7. Ask questions. 8. Use STAR method. 9. Follow up. 10. Be yourself!",
    category: "interview",
    author: "CareerPath Team",
    featured: true,
    views: 0,
    likes: 0
  },
  {
    title: "Building Your Professional Network",
    content: "Networking is key to career success. Attend industry events, join professional groups, use LinkedIn effectively, offer help to others, and maintain relationships. Remember: networking is about building genuine connections.",
    category: "career",
    author: "CareerPath Team",
    featured: false,
    views: 0,
    likes: 0
  },
  {
    title: "Essential Skills for the Modern Workplace",
    content: "Beyond technical skills, employers value: communication, teamwork, problem-solving, adaptability, time management, and digital literacy. Continuously develop these soft skills to stay competitive in today's job market.",
    category: "skills",
    author: "CareerPath Team",
    featured: true,
    views: 0,
    likes: 0
  },
  {
    title: "Negotiating Your Salary: A Guide",
    content: "Research market rates, know your worth, wait for the right time, be confident but flexible, consider the total package (benefits, growth opportunities), and always get it in writing. Don't be afraid to negotiate!",
    category: "career",
    author: "CareerPath Team",
    featured: false,
    views: 0,
    likes: 0
  },
  {
    title: "LinkedIn Profile Optimization",
    content: "Professional photo, compelling headline, detailed summary, showcase achievements, add skills, get recommendations, join groups, share content regularly, and engage with your network. Make your profile stand out!",
    category: "career",
    author: "CareerPath Team",
    featured: true,
    views: 0,
    likes: 0
  },
  {
    title: "Common Interview Questions & Answers",
    content: "Prepare for: Tell me about yourself, Why this company?, Your strengths/weaknesses, Where do you see yourself in 5 years?, Why should we hire you? Use the STAR method for behavioral questions.",
    category: "interview",
    author: "CareerPath Team",
    featured: false,
    views: 0,
    likes: 0
  }
];

// Sample Companies
const sampleCompanies = [
  {
    name: "Lesotho Tech Solutions",
    description: "Leading technology company providing innovative software solutions",
    industry: "Technology",
    size: "50-100 employees",
    location: "Maseru, Lesotho",
    website: "https://www.lesothotech.com",
    logo: "https://via.placeholder.com/150?text=LTS",
    featured: true,
    activeJobs: 3
  },
  {
    name: "Lesotho Retail Group",
    description: "Major retail chain operating across Lesotho",
    industry: "Retail",
    size: "200-500 employees",
    location: "Maseru, Lesotho",
    website: "https://www.lesothoretail.com",
    logo: "https://via.placeholder.com/150?text=LRG",
    featured: true,
    activeJobs: 5
  },
  {
    name: "Lesotho Financial Services",
    description: "Trusted financial services provider",
    industry: "Finance",
    size: "100-200 employees",
    location: "Maseru, Lesotho",
    website: "https://www.lesothofinance.com",
    logo: "https://via.placeholder.com/150?text=LFS",
    featured: false,
    activeJobs: 2
  },
  {
    name: "Queen Mamohato Memorial Hospital",
    description: "Premier healthcare facility providing quality medical services",
    industry: "Healthcare",
    size: "500+ employees",
    location: "Maseru, Lesotho",
    website: "https://www.qmmh.ls",
    logo: "https://via.placeholder.com/150?text=QMMH",
    featured: true,
    activeJobs: 4
  },
  {
    name: "Lesotho Construction Ltd",
    description: "Leading construction and engineering company",
    industry: "Construction",
    size: "100-200 employees",
    location: "Maseru, Lesotho",
    website: "https://www.lesothoconstruction.com",
    logo: "https://via.placeholder.com/150?text=LCL",
    featured: true,
    activeJobs: 3
  },
  {
    name: "Vodacom Lesotho",
    description: "Major telecommunications provider",
    industry: "Telecommunications",
    size: "200-500 employees",
    location: "Maseru, Lesotho",
    website: "https://www.vodacom.co.ls",
    logo: "https://via.placeholder.com/150?text=Vodacom",
    featured: true,
    activeJobs: 6
  },
  {
    name: "Ministry of Agriculture",
    description: "Government department promoting agricultural development",
    industry: "Government",
    size: "500+ employees",
    location: "Maseru, Lesotho",
    website: "https://www.agriculture.gov.ls",
    logo: "https://via.placeholder.com/150?text=MOA",
    featured: false,
    activeJobs: 2
  },
  {
    name: "Creative Media Lesotho",
    description: "Innovative media and design agency",
    industry: "Media & Design",
    size: "10-50 employees",
    location: "Maseru, Lesotho",
    website: "https://www.creativemedia.ls",
    logo: "https://via.placeholder.com/150?text=CML",
    featured: false,
    activeJobs: 2
  }
];

// Seed Functions
export const seedInstitutions = async () => {
  try {
    console.log('Seeding institutions...');
    for (const institution of sampleInstitutions) {
      await addDoc(collection(db, 'institutions'), {
        ...institution,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    console.log('✅ Institutions seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding institutions:', error);
  }
};

export const seedCourses = async () => {
  try {
    console.log('Seeding courses...');
    for (const course of sampleCourses) {
      await addDoc(collection(db, 'courses'), {
        ...course,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    console.log('✅ Courses seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
  }
};

export const seedJobs = async () => {
  try {
    console.log('Seeding jobs...');
    for (const job of sampleJobs) {
      await addDoc(collection(db, 'jobs'), {
        ...job,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    console.log('✅ Jobs seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
  }
};

export const seedCareerTips = async () => {
  try {
    console.log('Seeding career tips...');
    for (const tip of sampleCareerTips) {
      await addDoc(collection(db, 'careerTips'), {
        ...tip,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    console.log('✅ Career tips seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding career tips:', error);
  }
};

export const seedCompanies = async () => {
  try {
    console.log('Seeding companies...');
    for (const company of sampleCompanies) {
      await addDoc(collection(db, 'companies'), {
        ...company,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    console.log('✅ Companies seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding companies:', error);
  }
};

// Seed all data
export const seedAllData = async () => {
  console.log('🌱 Starting database seeding...');
  await seedInstitutions();
  await seedCourses();
  await seedJobs();
  await seedCareerTips();
  await seedCompanies();
  console.log('🎉 All data seeded successfully!');
};

export default {
  seedInstitutions,
  seedCourses,
  seedJobs,
  seedCareerTips,
  seedCompanies,
  seedAllData
};
