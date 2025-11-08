# Career Guidance Platform

A comprehensive web application to help high school students in Lesotho discover higher learning institutions, apply for courses, and connect with employers.

## 🚀 Features

- **4 User Modules**: Admin, Student, Institute, and Company dashboards
- **Complete CRUD Operations**: Full functionality for all entities
- **Real-time Data**: Firebase Firestore integration
- **File Management**: Document upload and storage
- **Modern UI**: Responsive design with Tailwind CSS
- **Role-based Access**: Secure authentication and authorization

## 🛠️ Technology Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Git

## 🚀 Quick Start

See [QUICK_START.md](QUICK_START.md) for detailed setup instructions.

### Quick Commands

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Start server (from server directory)
npm run dev

# Start client (from client directory)
npm start
```

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started in 5 minutes
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference
- **[ADMIN_SETUP_GUIDE.md](ADMIN_SETUP_GUIDE.md)** - Admin configuration
- **[FIRESTORE_STRUCTURE.md](FIRESTORE_STRUCTURE.md)** - Database schema
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Project overview
- **[DARK_MODE_GUIDE.md](DARK_MODE_GUIDE.md)** - Dark mode implementation
- **[ADMIN_CREDENTIALS.md](ADMIN_CREDENTIALS.md)** - Admin login credentials
- **[START_SERVER.md](START_SERVER.md)** - Server startup guide

## 📁 Project Structure

```
Career/
├── client/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── config/
│   └── public/
├── server/           # Node.js backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── config/
├── docs/             # Documentation
│   └── archive/      # Historical documentation
└── assets/           # Static assets
```

## 🔐 Environment Setup

Create a `.env` file in the `server` directory:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
JWT_SECRET=your-secret-key
```

## 👥 User Roles

1. **Admin**: Full system access and management
2. **Student**: Browse institutions, apply for courses and jobs
3. **Institute**: Manage courses and review applications
4. **Company**: Post jobs and manage candidates

## 📊 Database Collections

- users
- institutions
- courses
- applications
- admissions
- documents
- companies
- jobs
- jobApplications

## 🔥 Firebase Configuration

See [FIRESTORE_STRUCTURE.md](FIRESTORE_STRUCTURE.md) for complete database structure and rules.

## 📝 License

This project is proprietary software.

## 🤝 Support

For issues and questions, refer to the documentation files or contact the development team.
