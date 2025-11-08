# Firebase Database Templates for Career Guidance Platform

## 🗄️ **Complete Database Structure for All Functionalities**

This document provides comprehensive database templates to populate your Firebase Firestore for optimal functionality across all user types.

---

## 📊 **1. USERS Collection**

### **Admin User Template**
```json
{
  "id": "admin_001",
  "email": "thabotsehla31@gmail.com",
  "firstName": "Thabo",
  "lastName": "Tsehla",
  "role": "admin",
  "phone": "+266 1234 5678",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### **Student User Template**
```json
{
  "id": "student_001",
  "email": "john.doe@email.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "phone": "+266 2345 6789",
  "dateOfBirth": "2000-05-15",
  "currentGrade": "Grade 12",
  "subjects": ["Mathematics", "English", "Physics", "Chemistry"],
  "previousSchool": "Maseru High School",
  "graduationYear": "2023",
  "academicAchievements": "Top 10% of class, Mathematics Olympiad winner",
  "certifications": ["Microsoft Office Specialist", "Python Programming"],
  "skills": ["Programming", "Data Analysis", "Communication"],
  "languages": ["English", "Sesotho", "French"],
  "workExperience": [
    {
      "position": "Part-time Tutor",
      "company": "Local Learning Center",
      "duration": "2022-2023",
      "description": "Tutored mathematics and science to junior students"
    }
  ],
  "address": "123 Main Street, Maseru",
  "emergencyContact": "Jane Doe",
  "emergencyPhone": "+266 3456 7890",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### **Company User Template**
```json
{
  "id": "company_001",
  "email": "hr@techcorp.co.ls",
  "firstName": "Sarah",
  "lastName": "Johnson",
  "role": "company",
  "phone": "+266 4567 8901",
  "companyName": "TechCorp Lesotho",
  "industry": "Technology",
  "companySize": "50-100 employees",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### **Institution User Template**
```json
{
  "id": "institution_001",
  "email": "admin@nul.ac.ls",
  "firstName": "Dr. Mary",
  "lastName": "Mokhele",
  "role": "institute",
  "phone": "+266 5678 9012",
  "institutionName": "National University of Lesotho",
  "institutionType": "University",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

## 🏫 **2. INSTITUTIONS Collection**

### **University Template**
```json
{
  "id": "NUL_001",
  "name": "National University of Lesotho",
  "type": "University",
  "location": "Roma, Maseru",
  "description": "Lesotho's premier university offering comprehensive undergraduate and postgraduate programs",
  "website": "https://www.nul.ac.ls",
  "phone": "+266 2234 0000",
  "email": "info@nul.ac.ls",
  "established": "1945",
  "accreditation": "Council on Higher Education",
  "facilities": ["Library", "Laboratories", "Sports Complex", "Student Housing"],
  "faculties": ["Faculty of Science", "Faculty of Social Sciences", "Faculty of Education"],
  "programs": ["Bachelor's Degrees", "Master's Degrees", "PhD Programs"],
  "admissionRequirements": {
    "diploma": "Grade 12 with minimum C+ average",
    "degree": "Grade 12 with minimum B average or equivalent"
  },
  "tuitionFees": {
    "diploma": "M8,000 - M12,000 per year",
    "degree": "M15,000 - M25,000 per year"
  },
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### **College Template**
```json
{
  "id": "IDM_001",
  "name": "Institute of Development Management",
  "type": "College",
  "location": "Maseru",
  "description": "Leading institution for business and development studies",
  "website": "https://www.idm.ac.ls",
  "phone": "+266 2231 2345",
  "email": "info@idm.ac.ls",
  "established": "1974",
  "accreditation": "Council on Higher Education",
  "facilities": ["Library", "Computer Labs", "Conference Hall"],
  "faculties": ["Business Studies", "Development Studies", "Management"],
  "programs": ["Diplomas", "Certificates", "Short Courses"],
  "admissionRequirements": {
    "diploma": "Grade 12 with minimum C average",
    "degree": "Diploma with minimum B average"
  },
  "tuitionFees": {
    "diploma": "M6,000 - M10,000 per year",
    "degree": "M12,000 - M18,000 per year"
  },
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

## 🎓 **3. COURSES Collection**

### **Bachelor's Degree Template**
```json
{
  "id": "CS_001",
  "name": "Bachelor of Computer Science",
  "description": "Comprehensive computer science program covering programming, algorithms, data structures, and software engineering principles.",
  "duration": "4 years",
  "level": "Bachelor's Degree",
  "category": "Technology",
  "institutionId": "NUL_001",
  "institutionName": "National University of Lesotho",
  "requirements": {
    "minimumGrade": "C+",
    "subjects": ["Mathematics", "English", "Physics"],
    "entranceExam": true
  },
  "fees": {
    "local": 15000,
    "international": 25000,
    "currency": "LSL"
  },
  "careerProspects": [
    "Software Developer",
    "Systems Analyst",
    "Database Administrator",
    "IT Consultant",
    "Web Developer"
  ],
  "curriculum": [
    "Programming Fundamentals",
    "Data Structures and Algorithms",
    "Database Management",
    "Software Engineering",
    "Web Development",
    "Mobile App Development"
  ],
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### **Diploma Template**
```json
{
  "id": "BUS_001",
  "name": "Diploma in Human Resource Management",
  "description": "Program designed to develop professional HR practitioners skilled in recruitment, training, and performance management.",
  "duration": "2 years",
  "level": "Diploma",
  "category": "Social Sciences",
  "institutionId": "IDM_001",
  "institutionName": "Institute of Development Management",
  "requirements": {
    "minimumGrade": "C",
    "subjects": ["English", "Business Studies"],
    "entranceExam": false
  },
  "fees": {
    "local": 9000,
    "international": 14000,
    "currency": "LSL"
  },
  "careerProspects": [
    "HR Assistant",
    "Recruitment Officer",
    "Training Coordinator",
    "Employee Relations Specialist"
  ],
  "curriculum": [
    "Introduction to HR Management",
    "Recruitment and Selection",
    "Training and Development",
    "Performance Management",
    "Employee Relations",
    "HR Information Systems"
  ],
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

## 🏢 **4. COMPANY Collection**

### **Technology Company Template**
```json
{
  "id": "Com1",
  "name": "TechCorp Lesotho",
  "industry": "Technology",
  "description": "Leading technology company providing software solutions and IT services across Lesotho",
  "website": "https://www.techcorp.co.ls",
  "phone": "+266 2234 5678",
  "email": "info@techcorp.co.ls",
  "location": "Maseru",
  "size": "50-100 employees",
  "founded": "2010",
  "specialties": ["Software Development", "IT Consulting", "Digital Solutions"],
  "benefits": ["Health Insurance", "Flexible Hours", "Professional Development", "Remote Work"],
  "departments": ["Engineering", "Sales", "Marketing", "HR", "Finance"],
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### **Banking Company Template**
```json
{
  "id": "Com2",
  "name": "Lesotho Bank",
  "industry": "Finance",
  "description": "Premier banking institution providing comprehensive financial services",
  "website": "https://www.lesothobank.co.ls",
  "phone": "+266 2231 0000",
  "email": "info@lesothobank.co.ls",
  "location": "Maseru",
  "size": "500+ employees",
  "founded": "1975",
  "specialties": ["Banking", "Financial Services", "Investment"],
  "benefits": ["Health Insurance", "Retirement Plan", "Training Opportunities", "Banking Benefits"],
  "departments": ["Retail Banking", "Corporate Banking", "Risk Management", "IT", "HR"],
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

## 💼 **5. JOBS Collection**

### **Entry Level Job Template**
```json
{
  "id": "job_001",
  "title": "Software Developer",
  "description": "We are looking for a skilled software developer to join our development team. You will be responsible for developing and maintaining web applications using modern technologies.",
  "companyId": "Com1",
  "companyName": "TechCorp Lesotho",
  "location": "Maseru",
  "type": "Full-time",
  "category": "Technology",
  "salary": "M15,000 - M25,000",
  "experienceLevel": "Entry Level",
  "requiredSkills": ["JavaScript", "React", "Node.js", "Database Management"],
  "qualifications": "Bachelor's degree in Computer Science or related field",
  "responsibilities": [
    "Develop and maintain web applications",
    "Collaborate with cross-functional teams",
    "Write clean, maintainable code",
    "Participate in code reviews"
  ],
  "benefits": ["Health Insurance", "Flexible Hours", "Professional Development"],
  "status": "active",
  "postedDate": "2024-01-15T10:00:00Z",
  "applicationDeadline": "2024-02-15T23:59:59Z",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### **Mid Level Job Template**
```json
{
  "id": "job_002",
  "title": "Business Analyst",
  "description": "Seeking a business analyst to analyze business processes and recommend improvements. You will work with stakeholders to understand requirements and translate them into technical specifications.",
  "companyId": "Com2",
  "companyName": "Lesotho Bank",
  "location": "Maseru",
  "type": "Full-time",
  "category": "Business",
  "salary": "M12,000 - M20,000",
  "experienceLevel": "Mid Level",
  "requiredSkills": ["Business Analysis", "Data Analysis", "Communication", "Problem Solving"],
  "qualifications": "Bachelor's degree in Business Administration or related field",
  "responsibilities": [
    "Analyze business processes",
    "Gather and document requirements",
    "Create process flow diagrams",
    "Present findings to stakeholders"
  ],
  "benefits": ["Health Insurance", "Retirement Plan", "Training Opportunities"],
  "status": "active",
  "postedDate": "2024-01-15T10:00:00Z",
  "applicationDeadline": "2024-02-20T23:59:59Z",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

## 📝 **6. APPLICATIONS Collection**

### **Course Application Template**
```json
{
  "id": "app_001",
  "studentId": "student_001",
  "studentName": "John Doe",
  "studentEmail": "john.doe@email.com",
  "studentPhone": "+266 2345 6789",
  "studentDateOfBirth": "2000-05-15",
  "currentGrade": "Grade 12",
  "subjects": ["Mathematics", "English", "Physics", "Chemistry"],
  "previousSchool": "Maseru High School",
  "graduationYear": "2023",
  "academicAchievements": "Top 10% of class, Mathematics Olympiad winner",
  "applicationType": "course",
  "courseId": "CS_001",
  "courseName": "Bachelor of Computer Science",
  "institutionId": "NUL_001",
  "institutionName": "National University of Lesotho",
  "motivation": "I am passionate about technology and want to pursue a career in software development.",
  "coverLetter": "I have always been interested in computers and programming. My experience with mathematics and problem-solving makes me well-suited for computer science.",
  "additionalInfo": "I have completed several online programming courses and built small projects.",
  "status": "pending",
  "appliedAt": "2024-01-15T10:00:00Z",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### **Job Application Template**
```json
{
  "id": "app_002",
  "studentId": "student_001",
  "studentName": "John Doe",
  "studentEmail": "john.doe@email.com",
  "studentPhone": "+266 2345 6789",
  "studentDateOfBirth": "2000-05-15",
  "currentGrade": "Grade 12",
  "subjects": ["Mathematics", "English", "Physics", "Chemistry"],
  "previousSchool": "Maseru High School",
  "graduationYear": "2023",
  "academicAchievements": "Top 10% of class, Mathematics Olympiad winner",
  "applicationType": "job",
  "jobId": "job_001",
  "jobTitle": "Software Developer",
  "companyId": "Com1",
  "companyName": "TechCorp Lesotho",
  "motivation": "I am excited about the opportunity to work as a software developer and contribute to innovative projects.",
  "coverLetter": "I have strong programming skills and experience with web development. I am eager to learn and grow in a professional environment.",
  "additionalInfo": "I have built several personal projects using React and Node.js.",
  "status": "pending",
  "appliedAt": "2024-01-15T10:00:00Z",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

## 📄 **7. DOCUMENTS Collection**

### **Academic Document Template**
```json
{
  "id": "doc_001",
  "userId": "student_001",
  "fileName": "academic_transcript.pdf",
  "fileType": "application/pdf",
  "fileSize": 1024000,
  "fileUrl": "https://firebasestorage.googleapis.com/...",
  "category": "Academic",
  "description": "High School Academic Transcript",
  "uploadDate": "2024-01-15T10:00:00Z",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### **Identity Document Template**
```json
{
  "id": "doc_002",
  "userId": "student_001",
  "fileName": "national_id.pdf",
  "fileType": "application/pdf",
  "fileSize": 512000,
  "fileUrl": "https://firebasestorage.googleapis.com/...",
  "category": "Identity",
  "description": "National ID Document",
  "uploadDate": "2024-01-15T10:00:00Z",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

## 🎓 **8. ADMISSIONS Collection**

### **Accepted Admission Template**
```json
{
  "id": "adm_001",
  "studentId": "student_001",
  "studentName": "John Doe",
  "courseId": "CS_001",
  "courseName": "Bachelor of Computer Science",
  "institutionId": "NUL_001",
  "institutionName": "National University of Lesotho",
  "status": "accepted",
  "admissionDate": "2024-01-20T10:00:00Z",
  "academicYear": "2024-2025",
  "semester": "1",
  "conditions": ["Maintain minimum GPA of 2.5", "Complete all prerequisite courses"],
  "notes": "Congratulations on your admission! Please complete the enrollment process by February 15th.",
  "createdAt": "2024-01-20T10:00:00Z",
  "updatedAt": "2024-01-20T10:00:00Z"
}
```

---

## 🔔 **9. NOTIFICATIONS Collection**

### **Application Update Notification Template**
```json
{
  "id": "notif_001",
  "userId": "student_001",
  "title": "Application Status Update",
  "message": "Your application for Bachelor of Computer Science has been reviewed and is currently pending.",
  "type": "application_update",
  "isRead": false,
  "priority": "medium",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### **Job Opportunity Notification Template**
```json
{
  "id": "notif_002",
  "userId": "student_001",
  "title": "New Job Opportunity",
  "message": "A new job matching your qualifications has been posted: Software Developer at TechCorp Lesotho.",
  "type": "job_opportunity",
  "isRead": false,
  "priority": "high",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

## ⚙️ **10. SYSTEM_SETTINGS Collection**

### **Application Settings Template**
```json
{
  "id": "settings_001",
  "key": "application_deadline",
  "value": "2024-03-31T23:59:59Z",
  "description": "Application deadline for current academic year",
  "category": "academic",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### **System Limits Template**
```json
{
  "id": "settings_002",
  "key": "max_applications_per_student",
  "value": "5",
  "description": "Maximum number of applications a student can submit",
  "category": "application",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

## 🔗 **Database Relationships**

### **User Relationships**
- Users (1) ←→ (Many) Applications
- Users (1) ←→ (Many) Documents
- Users (1) ←→ (Many) Notifications

### **Application Relationships**
- Applications belong to one User (many-to-one)
- Applications can be for Courses or Jobs (polymorphic)
- Applications can result in Admissions (one-to-one)

### **Institution Relationships**
- Institutions (1) ←→ (Many) Courses
- Institutions (1) ←→ (Many) Users (institution staff)

### **Company Relationships**
- Companies (1) ←→ (Many) Jobs
- Companies (1) ←→ (Many) Users (company staff)

---

## 📊 **Required Firestore Indexes**

### **Composite Indexes for Efficient Querying**
```javascript
// Applications by student and status
{
  "collectionGroup": "applications",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "studentId", "order": "ASCENDING"},
    {"fieldPath": "status", "order": "ASCENDING"},
    {"fieldPath": "appliedAt", "order": "DESCENDING"}
  ]
}

// Jobs by company and status
{
  "collectionGroup": "jobs",
  "queryScope": "COLLECTION", 
  "fields": [
    {"fieldPath": "companyId", "order": "ASCENDING"},
    {"fieldPath": "status", "order": "ASCENDING"},
    {"fieldPath": "createdAt", "order": "DESCENDING"}
  ]
}

// Courses by institution and category
{
  "collectionGroup": "courses",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "institutionId", "order": "ASCENDING"},
    {"fieldPath": "category", "order": "ASCENDING"},
    {"fieldPath": "isActive", "order": "ASCENDING"}
  ]
}

// Users by role and status
{
  "collectionGroup": "users",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "role", "order": "ASCENDING"},
    {"fieldPath": "isActive", "order": "ASCENDING"},
    {"fieldPath": "createdAt", "order": "DESCENDING"}
  ]
}
```

---

## 🚀 **How to Use These Templates**

### **1. Manual Data Entry**
- Copy each template into your Firebase Console
- Modify the data according to your specific needs
- Ensure all required fields are populated

### **2. Automated Seeding**
- Use the comprehensive database seeder in the admin panel
- Navigate to "Seed Database" after creating admin user
- Click "Seed Comprehensive Database" to populate all data

### **3. Data Validation**
- Ensure all IDs are unique across collections
- Verify all foreign key relationships are correct
- Test all CRUD operations after data population

---

## ✅ **Expected Functionality After Population**

### **Student Features**
- ✅ Browse and apply for courses and jobs
- ✅ View personalized recommendations
- ✅ Manage qualifications and documents
- ✅ Track application status
- ✅ Receive notifications

### **Company Features**
- ✅ Post and manage job listings
- ✅ Review and manage applications
- ✅ Track candidate progress
- ✅ View company analytics

### **Institution Features**
- ✅ Manage courses and programs
- ✅ Review student applications
- ✅ Process admissions
- ✅ Track enrollment statistics

### **Admin Features**
- ✅ Manage all users and content
- ✅ Monitor system activity
- ✅ Generate comprehensive reports
- ✅ Configure system settings

This comprehensive database structure ensures all functionalities work seamlessly across the entire platform! 🎉


---

## 🧠 **11. RECOMMENDATIONS Collection**

### **Personalized Recommendation Template**
```json
{
  "id": "rec_001",
  "userId": "student_001",
  "targetType": "course",
  "targetId": "CS_001",
  "reason": ["matches_skills", "interest_in_technology", "strong_math_background"],
  "score": 0.87,
  "explained": "Based on your skills (Programming, Mathematics) and previous interactions.",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

## ⭐ **12. SAVED_ITEMS Collection**

### **Saved Item Template**
```json
{
  "id": "save_001",
  "userId": "student_001",
  "itemType": "job",
  "itemId": "job_001",
  "note": "Apply this weekend",
  "createdAt": "2024-01-16T08:30:00Z"
}
```

---

## 💬 **13. MESSAGES Collection**

### **Conversation Template**
```json
{
  "id": "conv_001",
  "participants": ["student_001", "company_001"],
  "topic": "Application follow-up",
  "lastMessageAt": "2024-01-18T14:10:00Z",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-18T14:10:00Z"
}
```

### **Messages Subcollection Example (`conversations/{convId}/messages`)**
```json
{
  "id": "msg_001",
  "senderId": "company_001",
  "text": "Thanks for applying. Can you share your portfolio?",
  "attachments": [],
  "sentAt": "2024-01-16T12:00:00Z",
  "isReadBy": ["student_001"]
}
```

---

## 🗓️ **14. INTERVIEWS Collection**

### **Interview Schedule Template**
```json
{
  "id": "int_001",
  "applicationId": "app_002",
  "jobId": "job_001",
  "companyId": "Com1",
  "candidateId": "student_001",
  "type": "virtual",
  "platform": "Google Meet",
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "scheduledAt": "2024-01-25T09:00:00Z",
  "timezone": "Africa/Maseru",
  "status": "scheduled",
  "notes": "Prepare system design basics",
  "createdAt": "2024-01-18T09:00:00Z",
  "updatedAt": "2024-01-18T09:00:00Z"
}
```

---

## 🎓💰 **15. SCHOLARSHIPS Collection**

### **Scholarship Template**
```json
{
  "id": "sch_001",
  "title": "Tech Excellence Scholarship",
  "provider": "TechCorp Foundation",
  "description": "Scholarship for outstanding students in technology-related fields.",
  "eligibility": ["Grade 12 minimum B average", "Lesotho citizen"],
  "amount": 20000,
  "currency": "LSL",
  "applicationDeadline": "2024-04-15T23:59:59Z",
  "link": "https://scholarships.techcorp.co.ls/tech-excellence",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

## 📅 **16. EVENTS Collection**

### **Career Event Template**
```json
{
  "id": "evt_001",
  "title": "Career Fair 2024",
  "organizer": "National University of Lesotho",
  "location": "Roma Campus, Hall A",
  "description": "Meet top employers and learn about internships and graduate roles.",
  "startAt": "2024-03-10T08:00:00Z",
  "endAt": "2024-03-10T15:00:00Z",
  "tags": ["career", "networking", "students"],
  "isActive": true,
  "createdAt": "2024-01-20T10:00:00Z",
  "updatedAt": "2024-01-20T10:00:00Z"
}
```

---

## ⭐📝 **17. REVIEWS Collection**

### **Review Template**
```json
{
  "id": "rev_001",
  "authorId": "student_001",
  "targetType": "company",
  "targetId": "Com1",
  "rating": 4.5,
  "title": "Great internship experience",
  "text": "Learned a lot, supportive mentors, modern tech stack.",
  "isPublished": true,
  "createdAt": "2024-01-22T10:00:00Z",
  "updatedAt": "2024-01-22T10:00:00Z"
}
```

---

## 📈 **18. REPORTS Collection**

### **Admin Report Template**
```json
{
  "id": "rpt_001",
  "title": "Monthly Applications Overview",
  "parameters": {
    "from": "2024-01-01T00:00:00Z",
    "to": "2024-01-31T23:59:59Z"
  },
  "generatedBy": "admin_001",
  "status": "completed",
  "exportUrl": "https://storage.googleapis.com/.../reports/rpt_001.pdf",
  "createdAt": "2024-02-01T08:00:00Z",
  "updatedAt": "2024-02-01T08:05:00Z"
}
```

---

## 🔍 **19. AUDIT_LOGS Collection**

### **Audit Log Template**
```json
{
  "id": "audit_001",
  "actorId": "admin_001",
  "action": "update",
  "entityType": "job",
  "entityId": "job_001",
  "changes": {
    "salary": {"from": "M15,000 - M25,000", "to": "M18,000 - M28,000"}
  },
  "ip": "192.0.2.10",
  "userAgent": "Firefox/121.0",
  "occurredAt": "2024-01-21T11:10:00Z"
}
```

---

## 🆘 **20. SUPPORT_TICKETS Collection**

### **Support Ticket Template**
```json
{
  "id": "tick_001",
  "userId": "student_001",
  "subject": "Cannot upload transcript",
  "description": "Upload fails at 90% with an error.",
  "status": "open",
  "priority": "high",
  "assignedTo": "admin_001",
  "createdAt": "2024-01-19T12:30:00Z",
  "updatedAt": "2024-01-19T12:30:00Z"
}
```

---

## 📊🔧 **Additional Composite Indexes**

```javascript
// Recommendations by user and score
{
  "collectionGroup": "recommendations",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "userId", "order": "ASCENDING"},
    {"fieldPath": "score", "order": "DESCENDING"},
    {"fieldPath": "createdAt", "order": "DESCENDING"}
  ]
}

// Saved items by user and createdAt
{
  "collectionGroup": "saved_items",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "userId", "order": "ASCENDING"},
    {"fieldPath": "createdAt", "order": "DESCENDING"}
  ]
}

// Conversations by participant (requires array-contains on participants)
// No composite index required for single array-contains, but add time ordering
{
  "collectionGroup": "conversations",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "lastMessageAt", "order": "DESCENDING"}
  ]
}

// Interviews by company and status
{
  "collectionGroup": "interviews",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "companyId", "order": "ASCENDING"},
    {"fieldPath": "status", "order": "ASCENDING"},
    {"fieldPath": "scheduledAt", "order": "DESCENDING"}
  ]
}

// Scholarships active and deadline
{
  "collectionGroup": "scholarships",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "isActive", "order": "ASCENDING"},
    {"fieldPath": "applicationDeadline", "order": "ASCENDING"}
  ]
}

// Events by start date and active
{
  "collectionGroup": "events",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "isActive", "order": "ASCENDING"},
    {"fieldPath": "startAt", "order": "ASCENDING"}
  ]
}

// Reviews by target and published
{
  "collectionGroup": "reviews",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "targetType", "order": "ASCENDING"},
    {"fieldPath": "targetId", "order": "ASCENDING"},
    {"fieldPath": "isPublished", "order": "ASCENDING"},
    {"fieldPath": "createdAt", "order": "DESCENDING"}
  ]
}

// Support tickets by status and priority
{
  "collectionGroup": "support_tickets",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "status", "order": "ASCENDING"},
    {"fieldPath": "priority", "order": "ASCENDING"},
    {"fieldPath": "createdAt", "order": "DESCENDING"}
  ]
}
```

---

## 🧪 **Validation Notes for New Collections**

- Ensure `targetType` fields are one of: `course`, `job`, `company`, `institution` where applicable
- Prefer numeric `score` in `recommendations` for sorting and thresholds
- For `messages`, use subcollections to keep conversation documents lean and scalable
- Normalize references via `*_Id` fields and denormalize critical display fields sparingly