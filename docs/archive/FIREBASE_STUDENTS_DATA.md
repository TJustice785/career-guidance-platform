# 👨‍🎓 STUDENT DATA - FIREBASE MANUAL ADD

## Copy & Paste These Directly into Firebase

Sample student profiles formatted for Firebase Firestore. These represent typical students in Lesotho's education system.

---

## 📋 How to Add to Firebase

1. Go to **Firebase Console** → **Firestore Database**
2. Click **"Start collection"** or open existing **"users"** collection
3. Click **"Add document"**
4. Set **Document ID** to **Auto-ID** (or use the email as ID)
5. **Copy the JSON** below for each student
6. **Paste** into Firebase
7. Click **"Save"**

---

## 👨‍🎓 STUDENT 1: Thabo Molefe

```json
{
  "uid": "student001",
  "email": "thabo.molefe@student.ls",
  "role": "student",
  "firstName": "Thabo",
  "lastName": "Molefe",
  "fullName": "Thabo Molefe",
  "phone": "+266 5888 1234",
  "dateOfBirth": "2003-05-15",
  "gender": "Male",
  "nationality": "Lesotho",
  "idNumber": "2003051512345",
  "address": {
    "street": "123 Kingsway Road",
    "city": "Maseru",
    "district": "Maseru",
    "country": "Lesotho"
  },
  "education": {
    "currentLevel": "High School Graduate",
    "institution": "Maseru High School",
    "graduationYear": 2021,
    "lgcseResults": {
      "english": "B",
      "mathematics": "C",
      "science": "B",
      "sesotho": "A",
      "history": "C"
    }
  },
  "interests": [
    "Computer Science",
    "Engineering",
    "Technology"
  ],
  "skills": [
    "Microsoft Office",
    "Basic Programming",
    "Problem Solving"
  ],
  "applications": [],
  "savedJobs": [],
  "documents": {
    "resume": "",
    "idCopy": "",
    "certificates": []
  },
  "profileComplete": 75,
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-10-23T19:00:00.000Z"
}
```

---

## 👩‍🎓 STUDENT 2: Lerato Mokhele

```json
{
  "uid": "student002",
  "email": "lerato.mokhele@student.ls",
  "role": "student",
  "firstName": "Lerato",
  "lastName": "Mokhele",
  "fullName": "Lerato Mokhele",
  "phone": "+266 5888 5678",
  "dateOfBirth": "2004-08-22",
  "gender": "Female",
  "nationality": "Lesotho",
  "idNumber": "2004082256789",
  "address": {
    "street": "45 Main Street",
    "city": "Maseru",
    "district": "Maseru",
    "country": "Lesotho"
  },
  "education": {
    "currentLevel": "University Student",
    "institution": "National University of Lesotho",
    "program": "Bachelor of Science in Nursing",
    "year": 2,
    "graduationYear": 2026,
    "lgcseResults": {
      "english": "A",
      "mathematics": "B",
      "biology": "A",
      "chemistry": "B",
      "sesotho": "A"
    }
  },
  "interests": [
    "Healthcare",
    "Nursing",
    "Community Health"
  ],
  "skills": [
    "Patient Care",
    "First Aid",
    "Communication",
    "Teamwork"
  ],
  "applications": [],
  "savedJobs": [],
  "documents": {
    "resume": "resumes/lerato_mokhele_resume.pdf",
    "idCopy": "ids/lerato_mokhele_id.pdf",
    "certificates": [
      "certificates/lgcse_certificate.pdf"
    ]
  },
  "profileComplete": 90,
  "isActive": true,
  "createdAt": "2024-02-10T08:30:00.000Z",
  "updatedAt": "2024-10-23T19:00:00.000Z"
}
```

---

## 👨‍🎓 STUDENT 3: Mpho Ramoeletsi

```json
{
  "uid": "student003",
  "email": "mpho.ramoeletsi@student.ls",
  "role": "student",
  "firstName": "Mpho",
  "lastName": "Ramoeletsi",
  "fullName": "Mpho Ramoeletsi",
  "phone": "+266 5888 9012",
  "dateOfBirth": "2002-11-30",
  "gender": "Male",
  "nationality": "Lesotho",
  "idNumber": "2002113090123",
  "address": {
    "street": "78 Pioneer Road",
    "city": "Maseru",
    "district": "Maseru",
    "country": "Lesotho"
  },
  "education": {
    "currentLevel": "College Graduate",
    "institution": "Lerotholi Polytechnic",
    "program": "Diploma in Electrical Engineering",
    "graduationYear": 2023,
    "lgcseResults": {
      "english": "B",
      "mathematics": "A",
      "physics": "A",
      "chemistry": "B",
      "sesotho": "B"
    }
  },
  "interests": [
    "Electrical Engineering",
    "Renewable Energy",
    "Technology Innovation"
  ],
  "skills": [
    "Electrical Wiring",
    "Circuit Design",
    "AutoCAD",
    "Problem Solving",
    "Technical Drawing"
  ],
  "applications": [],
  "savedJobs": [],
  "documents": {
    "resume": "resumes/mpho_ramoeletsi_resume.pdf",
    "idCopy": "ids/mpho_ramoeletsi_id.pdf",
    "certificates": [
      "certificates/diploma_certificate.pdf",
      "certificates/lgcse_certificate.pdf"
    ]
  },
  "profileComplete": 95,
  "isActive": true,
  "createdAt": "2024-03-05T14:20:00.000Z",
  "updatedAt": "2024-10-23T19:00:00.000Z"
}
```

---

## 👩‍🎓 STUDENT 4: Palesa Nkuebe

```json
{
  "uid": "student004",
  "email": "palesa.nkuebe@student.ls",
  "role": "student",
  "firstName": "Palesa",
  "lastName": "Nkuebe",
  "fullName": "Palesa Nkuebe",
  "phone": "+266 5888 3456",
  "dateOfBirth": "2003-03-18",
  "gender": "Female",
  "nationality": "Lesotho",
  "idNumber": "2003031834567",
  "address": {
    "street": "12 Constitution Road",
    "city": "Maseru",
    "district": "Maseru",
    "country": "Lesotho"
  },
  "education": {
    "currentLevel": "University Student",
    "institution": "Limkokwing University",
    "program": "Bachelor of Business Administration",
    "year": 3,
    "graduationYear": 2025,
    "lgcseResults": {
      "english": "A",
      "mathematics": "B",
      "accounts": "A",
      "economics": "B",
      "sesotho": "A"
    }
  },
  "interests": [
    "Business Management",
    "Entrepreneurship",
    "Marketing",
    "Finance"
  ],
  "skills": [
    "Microsoft Excel",
    "Financial Analysis",
    "Marketing Strategy",
    "Public Speaking",
    "Project Management"
  ],
  "applications": [],
  "savedJobs": [],
  "documents": {
    "resume": "resumes/palesa_nkuebe_resume.pdf",
    "idCopy": "ids/palesa_nkuebe_id.pdf",
    "certificates": [
      "certificates/lgcse_certificate.pdf"
    ]
  },
  "profileComplete": 85,
  "isActive": true,
  "createdAt": "2024-04-12T11:15:00.000Z",
  "updatedAt": "2024-10-23T19:00:00.000Z"
}
```

---

## 👨‍🎓 STUDENT 5: Teboho Motloheloa

```json
{
  "uid": "student005",
  "email": "teboho.motloheloa@student.ls",
  "role": "student",
  "firstName": "Teboho",
  "lastName": "Motloheloa",
  "fullName": "Teboho Motloheloa",
  "phone": "+266 5888 7890",
  "dateOfBirth": "2004-06-25",
  "gender": "Male",
  "nationality": "Lesotho",
  "idNumber": "2004062578901",
  "address": {
    "street": "56 Airport Road",
    "city": "Maseru",
    "district": "Maseru",
    "country": "Lesotho"
  },
  "education": {
    "currentLevel": "College Student",
    "institution": "Lesotho College of Education",
    "program": "Diploma in Primary Education",
    "year": 2,
    "graduationYear": 2025,
    "lgcseResults": {
      "english": "B",
      "mathematics": "C",
      "sesotho": "A",
      "geography": "B",
      "history": "B"
    }
  },
  "interests": [
    "Education",
    "Child Development",
    "Teaching",
    "Community Service"
  ],
  "skills": [
    "Classroom Management",
    "Lesson Planning",
    "Communication",
    "Patience",
    "Creative Teaching"
  ],
  "applications": [],
  "savedJobs": [],
  "documents": {
    "resume": "resumes/teboho_motloheloa_resume.pdf",
    "idCopy": "ids/teboho_motloheloa_id.pdf",
    "certificates": [
      "certificates/lgcse_certificate.pdf"
    ]
  },
  "profileComplete": 80,
  "isActive": true,
  "createdAt": "2024-05-20T09:45:00.000Z",
  "updatedAt": "2024-10-23T19:00:00.000Z"
}
```

---

## 👩‍🎓 STUDENT 6: Mamello Khethisa

```json
{
  "uid": "student006",
  "email": "mamello.khethisa@student.ls",
  "role": "student",
  "firstName": "Mamello",
  "lastName": "Khethisa",
  "fullName": "Mamello Khethisa",
  "phone": "+266 5888 2345",
  "dateOfBirth": "2003-09-10",
  "gender": "Female",
  "nationality": "Lesotho",
  "idNumber": "2003091023456",
  "address": {
    "street": "89 Industrial Road",
    "city": "Maseru",
    "district": "Maseru",
    "country": "Lesotho"
  },
  "education": {
    "currentLevel": "University Student",
    "institution": "National University of Lesotho",
    "program": "Bachelor of Science in Computer Science",
    "year": 3,
    "graduationYear": 2025,
    "lgcseResults": {
      "english": "A",
      "mathematics": "A",
      "physics": "A",
      "chemistry": "B",
      "sesotho": "B"
    }
  },
  "interests": [
    "Software Development",
    "Artificial Intelligence",
    "Web Development",
    "Mobile Apps"
  ],
  "skills": [
    "Python Programming",
    "Java",
    "HTML/CSS",
    "JavaScript",
    "Database Management",
    "Git/GitHub"
  ],
  "applications": [],
  "savedJobs": [],
  "documents": {
    "resume": "resumes/mamello_khethisa_resume.pdf",
    "idCopy": "ids/mamello_khethisa_id.pdf",
    "certificates": [
      "certificates/lgcse_certificate.pdf",
      "certificates/python_certification.pdf"
    ]
  },
  "profileComplete": 100,
  "isActive": true,
  "createdAt": "2024-06-08T13:00:00.000Z",
  "updatedAt": "2024-10-23T19:00:00.000Z"
}
```

---

## 👨‍🎓 STUDENT 7: Katleho Molapo

```json
{
  "uid": "student007",
  "email": "katleho.molapo@student.ls",
  "role": "student",
  "firstName": "Katleho",
  "lastName": "Molapo",
  "fullName": "Katleho Molapo",
  "phone": "+266 5888 6789",
  "dateOfBirth": "2002-12-05",
  "gender": "Male",
  "nationality": "Lesotho",
  "idNumber": "2002120567890",
  "address": {
    "street": "34 Moshoeshoe Road",
    "city": "Maseru",
    "district": "Maseru",
    "country": "Lesotho"
  },
  "education": {
    "currentLevel": "College Graduate",
    "institution": "Lesotho Agricultural College",
    "program": "Diploma in Agriculture",
    "graduationYear": 2023,
    "lgcseResults": {
      "english": "B",
      "mathematics": "C",
      "biology": "B",
      "agriculture": "A",
      "sesotho": "A"
    }
  },
  "interests": [
    "Sustainable Farming",
    "Crop Production",
    "Agricultural Business",
    "Environmental Conservation"
  ],
  "skills": [
    "Crop Management",
    "Soil Analysis",
    "Farm Planning",
    "Agricultural Economics",
    "Irrigation Systems"
  ],
  "applications": [],
  "savedJobs": [],
  "documents": {
    "resume": "resumes/katleho_molapo_resume.pdf",
    "idCopy": "ids/katleho_molapo_id.pdf",
    "certificates": [
      "certificates/diploma_agriculture.pdf",
      "certificates/lgcse_certificate.pdf"
    ]
  },
  "profileComplete": 88,
  "isActive": true,
  "createdAt": "2024-07-15T10:30:00.000Z",
  "updatedAt": "2024-10-23T19:00:00.000Z"
}
```

---

## 👩‍🎓 STUDENT 8: Rethabile Sekhonyana

```json
{
  "uid": "student008",
  "email": "rethabile.sekhonyana@student.ls",
  "role": "student",
  "firstName": "Rethabile",
  "lastName": "Sekhonyana",
  "fullName": "Rethabile Sekhonyana",
  "phone": "+266 5888 4567",
  "dateOfBirth": "2004-04-14",
  "gender": "Female",
  "nationality": "Lesotho",
  "idNumber": "2004041445678",
  "address": {
    "street": "67 United Nations Road",
    "city": "Maseru",
    "district": "Maseru",
    "country": "Lesotho"
  },
  "education": {
    "currentLevel": "High School Graduate",
    "institution": "St. Mary's High School",
    "graduationYear": 2022,
    "lgcseResults": {
      "english": "A",
      "mathematics": "B",
      "biology": "A",
      "chemistry": "A",
      "sesotho": "A"
    }
  },
  "interests": [
    "Medicine",
    "Healthcare",
    "Research",
    "Community Health"
  ],
  "skills": [
    "Research Skills",
    "Critical Thinking",
    "Communication",
    "Time Management"
  ],
  "applications": [],
  "savedJobs": [],
  "documents": {
    "resume": "resumes/rethabile_sekhonyana_resume.pdf",
    "idCopy": "ids/rethabile_sekhonyana_id.pdf",
    "certificates": [
      "certificates/lgcse_certificate.pdf"
    ]
  },
  "profileComplete": 70,
  "isActive": true,
  "createdAt": "2024-08-22T15:45:00.000Z",
  "updatedAt": "2024-10-23T19:00:00.000Z"
}
```

---

## 👨‍🎓 STUDENT 9: Neo Tsotetsi

```json
{
  "uid": "student009",
  "email": "neo.tsotetsi@student.ls",
  "role": "student",
  "firstName": "Neo",
  "lastName": "Tsotetsi",
  "fullName": "Neo Tsotetsi",
  "phone": "+266 5888 8901",
  "dateOfBirth": "2003-07-20",
  "gender": "Male",
  "nationality": "Lesotho",
  "idNumber": "2003072089012",
  "address": {
    "street": "23 Parliament Road",
    "city": "Maseru",
    "district": "Maseru",
    "country": "Lesotho"
  },
  "education": {
    "currentLevel": "University Student",
    "institution": "Botho University",
    "program": "Bachelor of Accounting",
    "year": 2,
    "graduationYear": 2026,
    "lgcseResults": {
      "english": "B",
      "mathematics": "A",
      "accounts": "A",
      "economics": "B",
      "sesotho": "B"
    }
  },
  "interests": [
    "Accounting",
    "Finance",
    "Auditing",
    "Tax Management"
  ],
  "skills": [
    "Financial Accounting",
    "Excel Advanced",
    "QuickBooks",
    "Financial Reporting",
    "Attention to Detail"
  ],
  "applications": [],
  "savedJobs": [],
  "documents": {
    "resume": "resumes/neo_tsotetsi_resume.pdf",
    "idCopy": "ids/neo_tsotetsi_id.pdf",
    "certificates": [
      "certificates/lgcse_certificate.pdf"
    ]
  },
  "profileComplete": 82,
  "isActive": true,
  "createdAt": "2024-09-10T12:00:00.000Z",
  "updatedAt": "2024-10-23T19:00:00.000Z"
}
```

---

## 👩‍🎓 STUDENT 10: Lineo Makhetha

```json
{
  "uid": "student010",
  "email": "lineo.makhetha@student.ls",
  "role": "student",
  "firstName": "Lineo",
  "lastName": "Makhetha",
  "fullName": "Lineo Makhetha",
  "phone": "+266 5888 0123",
  "dateOfBirth": "2004-01-28",
  "gender": "Female",
  "nationality": "Lesotho",
  "idNumber": "2004012801234",
  "address": {
    "street": "91 Lancer's Road",
    "city": "Maseru",
    "district": "Maseru",
    "country": "Lesotho"
  },
  "education": {
    "currentLevel": "College Student",
    "institution": "National Health Training College",
    "program": "Diploma in Midwifery",
    "year": 1,
    "graduationYear": 2026,
    "lgcseResults": {
      "english": "B",
      "mathematics": "C",
      "biology": "A",
      "chemistry": "B",
      "sesotho": "A"
    }
  },
  "interests": [
    "Maternal Health",
    "Midwifery",
    "Women's Health",
    "Community Healthcare"
  ],
  "skills": [
    "Patient Care",
    "Medical Terminology",
    "Empathy",
    "Communication",
    "First Aid"
  ],
  "applications": [],
  "savedJobs": [],
  "documents": {
    "resume": "resumes/lineo_makhetha_resume.pdf",
    "idCopy": "ids/lineo_makhetha_id.pdf",
    "certificates": [
      "certificates/lgcse_certificate.pdf"
    ]
  },
  "profileComplete": 78,
  "isActive": true,
  "createdAt": "2024-10-01T08:00:00.000Z",
  "updatedAt": "2024-10-23T19:00:00.000Z"
}
```

---

## 📊 SUMMARY

**10 Student Profiles Ready:**

| # | Name | Gender | Program | Institution | Year |
|---|------|--------|---------|-------------|------|
| 1 | Thabo Molefe | M | High School Graduate | Maseru High School | 2021 |
| 2 | Lerato Mokhele | F | BSc Nursing | NUL | Year 2 |
| 3 | Mpho Ramoeletsi | M | Electrical Engineering | Lerotholi Polytechnic | Graduate |
| 4 | Palesa Nkuebe | F | Business Admin | Limkokwing | Year 3 |
| 5 | Teboho Motloheloa | M | Primary Education | LCE | Year 2 |
| 6 | Mamello Khethisa | F | Computer Science | NUL | Year 3 |
| 7 | Katleho Molapo | M | Agriculture | LAC | Graduate |
| 8 | Rethabile Sekhonyana | F | High School Graduate | St. Mary's | 2022 |
| 9 | Neo Tsotetsi | M | Accounting | Botho University | Year 2 |
| 10 | Lineo Makhetha | F | Midwifery | NHTC | Year 1 |

---

## ✅ Each Student Profile Includes:

- ✅ Unique ID and email
- ✅ Role: "student"
- ✅ Personal information (name, phone, DOB, gender)
- ✅ National ID number
- ✅ Complete address
- ✅ Education details (institution, program, year)
- ✅ LGCSE results
- ✅ Interests and skills
- ✅ Application tracking arrays
- ✅ Document references
- ✅ Profile completion percentage
- ✅ Active status
- ✅ Timestamps

---

## 🚀 Quick Add Instructions

1. **Open Firebase Console** → Firestore Database
2. **Open/Create "users" collection**
3. **Click "Add document"**
4. **Copy JSON** for each student
5. **Paste** into Firebase
6. **Save**
7. **Repeat** for all 10 students

---

## 🔐 Authentication Note

These are **data profiles only**. For authentication:
- Create accounts in **Firebase Authentication** first
- Use the same email addresses
- Set passwords for each student
- Link the UID from Authentication to these profiles

---

**All students have realistic Lesotho names, addresses, and educational backgrounds! 👨‍🎓✨**
