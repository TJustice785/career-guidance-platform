# Courses Data Structure for Firebase Firestore

## Collection: `courses`

### Document Structure:
```json
{
  "id": "SOC_001",
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

## Sample Courses Data:

### 1. Technology Courses
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

### 2. Business Courses
```json
{
  "id": "BUS_001", 
  "name": "Bachelor of Business Administration",
  "description": "Comprehensive business program covering management, marketing, finance, and entrepreneurship.",
  "duration": "3 years",
  "level": "Bachelor's Degree",
  "category": "Business",
  "institutionId": "NUL_001",
  "institutionName": "National University of Lesotho",
  "requirements": {
    "minimumGrade": "C",
    "subjects": ["English", "Mathematics", "Economics"],
    "entranceExam": false
  },
  "fees": {
    "local": 12000,
    "international": 20000,
    "currency": "LSL"
  },
  "careerProspects": [
    "Business Manager",
    "Marketing Manager",
    "Financial Analyst",
    "Entrepreneur",
    "HR Manager"
  ],
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### 3. Engineering Courses
```json
{
  "id": "ENG_001",
  "name": "Bachelor of Civil Engineering",
  "description": "Civil engineering program focusing on infrastructure, construction, and environmental engineering.",
  "duration": "4 years",
  "level": "Bachelor's Degree", 
  "category": "Engineering",
  "institutionId": "NUL_001",
  "institutionName": "National University of Lesotho",
  "requirements": {
    "minimumGrade": "B",
    "subjects": ["Mathematics", "Physics", "Chemistry"],
    "entranceExam": true
  },
  "fees": {
    "local": 18000,
    "international": 30000,
    "currency": "LSL"
  },
  "careerProspects": [
    "Civil Engineer",
    "Structural Engineer",
    "Project Manager",
    "Construction Manager",
    "Environmental Engineer"
  ],
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### 4. Health Sciences
```json
{
  "id": "MED_001",
  "name": "Bachelor of Medicine and Surgery",
  "description": "Medical degree program preparing students for careers in healthcare and medical practice.",
  "duration": "6 years",
  "level": "Bachelor's Degree",
  "category": "Health Sciences",
  "institutionId": "NUL_001", 
  "institutionName": "National University of Lesotho",
  "requirements": {
    "minimumGrade": "A",
    "subjects": ["Biology", "Chemistry", "Physics", "Mathematics"],
    "entranceExam": true
  },
  "fees": {
    "local": 25000,
    "international": 40000,
    "currency": "LSL"
  },
  "careerProspects": [
    "Medical Doctor",
    "Surgeon",
    "General Practitioner",
    "Medical Specialist",
    "Medical Researcher"
  ],
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### 5. Education
```json
{
  "id": "EDU_001",
  "name": "Bachelor of Education (Secondary)",
  "description": "Teacher education program preparing students to teach at secondary school level.",
  "duration": "4 years",
  "level": "Bachelor's Degree",
  "category": "Education",
  "institutionId": "NUL_001",
  "institutionName": "National University of Lesotho", 
  "requirements": {
    "minimumGrade": "C+",
    "subjects": ["English", "Mathematics", "Teaching Subject"],
    "entranceExam": false
  },
  "fees": {
    "local": 10000,
    "international": 18000,
    "currency": "LSL"
  },
  "careerProspects": [
    "Secondary School Teacher",
    "Subject Specialist",
    "Education Administrator",
    "Curriculum Developer",
    "Educational Consultant"
  ],
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

## Field Descriptions:

- **id**: Unique identifier for the course
- **name**: Full name of the course/program
- **description**: Detailed description of what the course covers
- **duration**: How long the program takes (e.g., "4 years", "2 years")
- **level**: Academic level (Bachelor's, Master's, Diploma, Certificate)
- **category**: Subject area (Technology, Business, Engineering, Health, Education)
- **institutionId**: Reference to the institution offering the course
- **institutionName**: Name of the institution (for easy display)
- **requirements**: Entry requirements including minimum grades and subjects
- **fees**: Tuition fees for local and international students
- **careerProspects**: Array of potential career paths after graduation
- **isActive**: Boolean to show/hide course
- **createdAt/updatedAt**: Timestamps for record keeping

## Categories Available:
- Technology
- Business  
- Engineering
- Health Sciences
- Education
- Arts & Humanities
- Agriculture
- Law
- Social Sciences
