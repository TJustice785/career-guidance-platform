# Career Guidance and Employment Integration Platform

A comprehensive web application for connecting high school students with higher learning institutions and employment opportunities in Lesotho.

## 🚀 Features

### Admin Module
- Manage institutions, faculties, and courses
- Monitor user registrations and applications
- Approve/suspend company accounts
- Generate system reports

### Institute Module
- Manage faculty and course offerings
- Process student applications
- Publish admission results
- Update institution profiles

### Student Module
- Apply to multiple institutions (max 2 courses per institution)
- View admission results
- Upload transcripts and certificates
- Apply for jobs with intelligent matching
- Receive personalized job notifications

### Company Module
- Post job opportunities
- View auto-filtered qualified candidates
- Manage job postings
- Update company profiles

## 🛠️ Tech Stack

- **Frontend:** React.js with modern hooks and context API
- **Backend:** Node.js with Express.js
- **Database:** Firebase Firestore
- **Authentication:** Firebase Authentication
- **Hosting:** Firebase Hosting (Frontend) + Firebase Functions or Railway (Backend)
- **Version Control:** Git & GitHub

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd career-guidance-platform
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable the following services:
   - **Authentication** (Email/Password)
   - **Firestore Database**
   - **Storage** (for file uploads)
   - **Hosting** (optional, for frontend)

4. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click on Web app icon (</>)
   - Copy the configuration object

5. Create a service account:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file as `serviceAccountKey.json` in `server/src/config/`

### 3. Backend Setup

```bash
cd server
npm install

# Create .env file
cat > .env << EOF
PORT=5000
NODE_ENV=development

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email

# SMTP for emails (optional - use Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL
CLIENT_URL=http://localhost:3000
EOF

# Start development server
npm run dev
```

### 4. Frontend Setup

```bash
cd client
npm install

# Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
EOF

# Start development server
npm start
```

## 🚀 Deployment

### Deploy Backend (Railway)

1. Create account on [Railway](https://railway.app/)
2. Connect your GitHub repository
3. Add environment variables from `.env`
4. Deploy

Alternatively, use Firebase Functions:

```bash
cd server
npm install -g firebase-tools
firebase login
firebase init functions
firebase deploy --only functions
```

### Deploy Frontend (Vercel)

1. Create account on [Vercel](https://vercel.com/)
2. Import your GitHub repository
3. Set environment variables
4. Deploy

Or use Firebase Hosting:

```bash
cd client
npm run build
firebase init hosting
firebase deploy --only hosting
```

## 📱 Usage

### Default Admin Credentials
- Email: admin@career-platform.com
- Password: Admin@123

**⚠️ Change these credentials immediately after first login!**

### User Registration Flow
1. Users register with email verification
2. Admin approves company accounts
3. Students apply for courses
4. Institutions process applications
5. Graduates upload transcripts
6. Companies post jobs
7. System matches qualified candidates

## 🗄️ Database Structure

### Collections

- **users** - All user accounts (admin, students, institutes, companies)
- **institutions** - Higher learning institutions
- **faculties** - Academic faculties
- **courses** - Available courses
- **applications** - Student applications
- **admissions** - Admission results
- **jobs** - Job postings
- **jobApplications** - Job applications
- **notifications** - User notifications

## 🔐 Security Features

- Email verification for all users
- JWT authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- Secure file uploads
- Rate limiting
- CORS protection

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 📊 Key Features Implementation

### Intelligent Application System
- Students can't apply for courses they don't qualify for
- Maximum 2 applications per institution
- Auto-rejection of duplicate admissions
- Waiting list management

### Smart Job Matching
- Automatic filtering based on academic performance
- Certificate verification
- Experience matching
- Profile relevance scoring

### Notification System
- Email notifications for admissions
- Job opportunity alerts
- Application status updates
- Real-time in-app notifications

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed for academic purposes.

## 👥 Team Members

- Student 1 - [Role]
- Student 2 - [Role]
- Student 3 - [Role]

## 📧 Contact

For questions or support:
- Email: liteboho.molaoa@limkokwing.ac.ls
- Email: tsekiso.thokoana@limkokwing.ac.ls

## 🙏 Acknowledgments

- Limkokwing University of Creative Technology
- Faculty of Information & Communication Technology
- Mr. Thokoana & Mr. 'Molaoa

---

**Project Course:** BSc. in Information Technology - Web Application Development (B/DIWA2110)