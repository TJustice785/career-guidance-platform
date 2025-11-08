# Comprehensive Database Samples for Career Guidance Platform

## 1. USERS Collection Sample Data

### Admin Users
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

### Student Users
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

### Company Users
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

### Institution Users
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

## 2. INSTITUTIONS Collection Sample Data

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
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

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
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

## 3. COURSES Collection Sample Data

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
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

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
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

## 4. COMPANY Collection Sample Data

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
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

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
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

## 5. JOBS Collection Sample Data

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

## 6. APPLICATIONS Collection Sample Data

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
  "coverLetter": "I have always been interested in computers and programming...",
  "additionalInfo": "I have completed several online programming courses.",
  "status": "pending",
  "appliedAt": "2024-01-15T10:00:00Z",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

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
  "coverLetter": "I have strong programming skills and experience with web development...",
  "additionalInfo": "I have built several personal projects using React and Node.js.",
  "status": "pending",
  "appliedAt": "2024-01-15T10:00:00Z",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

## 7. DOCUMENTS Collection Sample Data

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

## 8. ADMISSIONS Collection Sample Data

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

## 9. NOTIFICATIONS Collection Sample Data

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

## 10. SYSTEM_SETTINGS Collection Sample Data

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

## Database Relationships

### User Relationships
- Users can have multiple applications (one-to-many)
- Users can have multiple documents (one-to-many)
- Users can have multiple admissions (one-to-many)
- Users can have multiple notifications (one-to-many)

### Application Relationships
- Applications belong to one user (many-to-one)
- Applications can be for courses or jobs (polymorphic)
- Applications can result in admissions (one-to-one)

### Institution Relationships
- Institutions can have multiple courses (one-to-many)
- Institutions can have multiple users (one-to-many)

### Company Relationships
- Companies can have multiple jobs (one-to-many)
- Companies can have multiple users (one-to-many)

## Indexes Required

### Firestore Indexes
```javascript
// Composite indexes for efficient querying
{
  "collectionGroup": "applications",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "studentId", "order": "ASCENDING"},
    {"fieldPath": "status", "order": "ASCENDING"},
    {"fieldPath": "appliedAt", "order": "DESCENDING"}
  ]
}

{
  "collectionGroup": "jobs",
  "queryScope": "COLLECTION", 
  "fields": [
    {"fieldPath": "status", "order": "ASCENDING"},
    {"fieldPath": "category", "order": "ASCENDING"},
    {"fieldPath": "createdAt", "order": "DESCENDING"}
  ]
}

{
  "collectionGroup": "courses",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "isActive", "order": "ASCENDING"},
    {"fieldPath": "category", "order": "ASCENDING"},
    {"fieldPath": "name", "order": "ASCENDING"}
  ]
}
```

This comprehensive database structure provides all the necessary data for the career guidance platform to function effectively with proper relationships and indexing for optimal performance.
