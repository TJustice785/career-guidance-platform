# Career Guidance Platform

> A comprehensive web application to help high school students in Lesotho discover higher learning institutions, apply for courses, and connect with employers.

[![Live Demo](https://img.shields.io/badge/Live-Demo-success)](https://career-guidance-platform-7e18e.web.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/TJustice785/career-guidance-platform)

---

## 🎯 Project Overview

**Status:** ✅ Complete and Production-Ready  
**Technology Stack:** React.js, Firebase/Firestore, Node.js, Tailwind CSS  
**Purpose:** Bridge the gap between education and employment in Lesotho

This platform serves as a comprehensive solution connecting:
- 🎓 **Students** seeking higher education and career opportunities
- 🏫 **Institutions** managing courses and admissions
- 🏢 **Companies** recruiting qualified candidates
- 👨‍💼 **Administrators** overseeing the entire ecosystem

---

## 🚀 Features

### 🎓 Student Module
- Browse and search institutions and courses
- Apply to courses (max 2 per institution)
- Track application status in real-time
- Upload documents (transcripts, certificates)
- Search and apply for jobs
- Personalized dashboard with metrics

### 🏫 Institute Module
- Manage courses (Create, Read, Update, Delete)
- Organize by faculties/departments
- Review and process student applications
- Approve/reject applications with workflow
- Manage enrolled students
- Track admissions and statistics

### 🏢 Company Module
- Post and manage job openings
- Review candidate applications
- Filter candidates by qualifications
- Shortlist/reject workflow
- Search candidate database
- Track recruitment metrics

### 👨‍💼 Admin Module
- Full user management (all roles)
- Institution approval and management
- Company verification and oversight
- Course management across all institutions
- System-wide reports and analytics
- Configuration and settings

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18.x
- **Routing:** React Router v6
- **Styling:** Tailwind CSS 3.x
- **Icons:** React Icons (Font Awesome)
- **Notifications:** React Hot Toast
- **State:** React Hooks + Context API

### Backend
- **Authentication:** Firebase Authentication
- **Database:** Cloud Firestore (NoSQL)
- **Storage:** Firebase Storage
- **Hosting:** Firebase Hosting
- **API:** Node.js + Express.js

### Development
- **Version Control:** Git/GitHub
- **Package Manager:** npm
- **Build Tool:** Create React App

---

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Firebase account** (free tier works)
- **Git** (for version control)

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/TJustice785/career-guidance-platform.git
cd career-guidance-platform
```

### 2. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Firebase Setup

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com)
2. **Enable Authentication** (Email/Password)
3. **Create Firestore Database** (production mode)
4. **Enable Storage**
5. **Download service account key** to `server/config/`

### 4. Environment Configuration

Create `server/.env`:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
JWT_SECRET=your-secret-key
```

Update `client/src/config/firebase.config.js` with your Firebase config.

### 5. Start the Application

```bash
# Terminal 1: Start backend server
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm start
```

Visit: `http://localhost:3000`

---

## 📁 Project Structure

```
Career/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── config/            # Firebase configuration
│   │   ├── contexts/          # React contexts (Auth, Theme)
│   │   ├── pages/             # Page components
│   │   │   ├── admin/         # Admin dashboard
│   │   │   ├── institute/     # Institute dashboard
│   │   │   ├── student/       # Student dashboard
│   │   │   ├── company/       # Company dashboard
│   │   │   ├── LandingPage.js
│   │   │   ├── LoginPage.js
│   │   │   └── RegisterPage.js
│   │   ├── services/          # API services
│   │   ├── utils/             # Helper functions
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── server/                    # Node.js backend
│   ├── config/               # Configuration files
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Express middleware
│   ├── models/               # Data models
│   ├── routes/               # API routes
│   ├── utils/                # Helper utilities
│   ├── index.js
│   └── package.json
├── docs/                     # Documentation (archived)
├── firebase.json             # Firebase configuration
├── firestore.rules           # Firestore security rules
├── storage.rules             # Storage security rules
└── README.md                 # This file
```

---

## 📊 Database Collections

| Collection | Purpose | Key Fields |
|------------|---------|------------|
| `users` | All user accounts | email, role, profile, status |
| `institutions` | Higher learning institutions | name, location, courses, contact |
| `courses` | Courses offered | title, faculty, requirements, institution |
| `applications` | Student course applications | studentId, courseId, status, documents |
| `admissions` | Accepted students | studentId, courseId, admissionDate |
| `documents` | Uploaded documents | studentId, type, url, uploadDate |
| `companies` | Registered companies | name, industry, location, jobs |
| `jobs` | Job postings | title, company, requirements, location |
| `jobApplications` | Job applications | studentId, jobId, status, resumeUrl |

---

## 🔐 User Roles & Access

### Admin
- Full system access
- User management
- Institution and company approval
- System-wide analytics

### Student
- Browse institutions and courses
- Submit applications
- Upload documents
- Search and apply for jobs

### Institute
- Manage courses
- Review applications
- Process admissions
- Track student enrollment

### Company
- Post job openings
- Review candidates
- Shortlist applicants
- Access talent pool

---

## 🔒 Security Features

### Authentication
- ✅ Firebase Authentication
- ✅ Email/password login
- ✅ Email verification
- ✅ Password reset
- ✅ Secure session management

### Authorization
- ✅ Role-based access control (RBAC)
- ✅ Protected routes
- ✅ Firestore security rules
- ✅ Storage access rules
- ✅ API endpoint protection

### Data Protection
- ✅ Users can only access their own data
- ✅ Admins have elevated permissions
- ✅ File upload restrictions (type, size)
- ✅ XSS protection
- ✅ CORS configuration

---

## 🎨 UI/UX Features

- **Modern Design:** Glass morphism with gradients
- **Responsive:** Mobile, tablet, and desktop optimized
- **Animations:** Smooth transitions and loading states
- **Accessibility:** ARIA labels and keyboard navigation
- **Theme:** Professional color scheme
- **Notifications:** Real-time toast messages
- **Loading States:** Skeleton screens and spinners
- **Error Handling:** User-friendly error messages

---

## 🚀 Deployment

### Firebase Hosting (Recommended)

```bash
# Build the client
cd client
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

**Live URL:** https://career-guidance-platform-7e18e.web.app

### Alternative: Vercel/Netlify

```bash
# Vercel
npm run build
vercel --prod

# Netlify
npm run build
netlify deploy --prod
```

---

## 🧪 Testing

### Test Admin Login
```
Email: admin@career.ls
Password: Admin123!
```

### Test Student Account
Create a new account via `/register` with role "Student"

### Test Institute Account
Create via `/register` with role "Institute" (requires admin approval)

### Test Company Account
Create via `/register` with role "Company" (requires admin approval)

---

## 📈 Business Rules

1. **Application Limits**
   - Maximum 2 applications per institution per student
   - Students can only be admitted to one program at a time

2. **Eligibility**
   - Students must meet course requirements
   - Qualifications are validated before application

3. **Workflow**
   - Application → Review → Approve/Reject → Admission
   - Job Application → Shortlist/Reject → Interview → Hire

4. **Notifications**
   - Job alerts only sent to qualified candidates
   - Application status updates sent to students
   - Approval notifications sent to institutions

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/reset-password` - Reset password

### Students
- `GET /api/students/courses` - Browse courses
- `POST /api/students/apply` - Submit application
- `GET /api/students/applications` - Get my applications
- `POST /api/students/upload-document` - Upload document

### Institutions
- `GET /api/institutions/courses` - Get my courses
- `POST /api/institutions/courses` - Create course
- `PUT /api/institutions/courses/:id` - Update course
- `DELETE /api/institutions/courses/:id` - Delete course
- `GET /api/institutions/applications` - Get applications

### Companies
- `GET /api/companies/jobs` - Get my jobs
- `POST /api/companies/jobs` - Create job
- `PUT /api/companies/jobs/:id` - Update job
- `DELETE /api/companies/jobs/:id` - Delete job
- `GET /api/companies/candidates` - Get candidates

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/statistics` - Get system stats

---

## 📝 Environment Variables

### Server (.env)
```env
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
JWT_SECRET=
```

### Client (firebase.config.js)
```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
};
```

---

## 🐛 Troubleshooting

### Issue: Build fails
**Solution:** Delete `node_modules` and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Firebase connection error
**Solution:** Check your Firebase config and ensure project is active

### Issue: Routes not working after deployment
**Solution:** Ensure `firebase.json` has proper rewrites configured

### Issue: CORS errors
**Solution:** Check `CLIENT_URL` in server `.env` matches your frontend URL

---

## 📚 Documentation

All detailed documentation has been archived in the `docs/archive/` folder. This README contains all essential information to get started.

---

## 🤝 Contributing

This is a student project. For issues or suggestions:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📄 License

This project is proprietary software developed as a university assignment.

---

## 👨‍💻 Author

**Justice Tsehla**
- GitHub: [@TJustice785](https://github.com/TJustice785)
- Project: Career Guidance Platform
- Institution: National University of Lesotho

---

## 🙏 Acknowledgments

- National University of Lesotho
- Firebase/Google Cloud
- React.js Community
- Tailwind CSS Team

---

## 📞 Support

For technical support or questions:
- 📧 Email: support@career-guidance-platform.com
- 📱 GitHub Issues: [Create an issue](https://github.com/TJustice785/career-guidance-platform/issues)
- 📖 Documentation: See `docs/` folder

---

## 🎯 Project Status

- ✅ **Development:** Complete
- ✅ **Testing:** Complete
- ✅ **Documentation:** Complete
- ✅ **Deployment:** Live on Firebase
- ✅ **GitHub:** Published
- ✅ **Status:** Ready for Submission

---

**Last Updated:** November 9, 2025  
**Version:** 1.0.0  
**Status:** Production Ready 🚀

---

## 🔗 Quick Links

- **Live Demo:** https://career-guidance-platform-7e18e.web.app
- **GitHub Repository:** https://github.com/TJustice785/career-guidance-platform
- **Firebase Console:** https://console.firebase.google.com/project/career-guidance-platform-7e18e

---

**Made with ❤️ in Lesotho**
