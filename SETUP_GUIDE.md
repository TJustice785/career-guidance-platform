# Career Guidance Platform - Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Git

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Career
```

## Step 2: Firebase Setup

### 2.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `career-guidance-platform`
4. Follow the setup wizard

### 2.2 Enable Firebase Services

1. **Authentication:**
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication

2. **Firestore Database:**
   - Go to Firestore Database
   - Click "Create database"
   - Start in production mode
   - Choose a location closest to your users

3. **Storage:**
   - Go to Storage
   - Click "Get started"
   - Use default security rules

### 2.3 Get Firebase Configuration

#### For Client (Web App):
1. Go to Project Settings > General
2. Scroll to "Your apps"
3. Click "Add app" > Web
4. Register your app
5. Copy the configuration object

#### For Server (Admin SDK):
1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Keep this file secure (never commit to Git)

### 2.4 Set Up Firestore Security Rules

1. Go to Firestore Database > Rules
2. Replace with the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Institutions collection
    match /institutions/{institutionId} {
      allow read: if true; // Public read access
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Companies collection
    match /companies/{companyId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (
        request.auth.uid == companyId ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
    
    // Courses collection
    match /courses/{courseId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'institute' ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
    
    // Jobs collection
    match /jobs/{jobId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'company' ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
    
    // Applications collection
    match /applications/{applicationId} {
      allow read: if request.auth != null && (
        resource.data.studentId == request.auth.uid ||
        resource.data.institutionId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
      allow create: if request.auth != null && request.resource.data.studentId == request.auth.uid;
      allow update, delete: if request.auth != null && (
        resource.data.institutionId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
    
    // Job Applications collection
    match /jobApplications/{applicationId} {
      allow read: if request.auth != null && (
        resource.data.studentId == request.auth.uid ||
        resource.data.companyId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
      allow create: if request.auth != null && request.resource.data.studentId == request.auth.uid;
      allow update: if request.auth != null && (
        resource.data.companyId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
    
    // Admissions collection
    match /admissions/{admissionId} {
      allow read: if request.auth != null && (
        resource.data.studentId == request.auth.uid ||
        resource.data.institutionId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
      allow write: if request.auth != null && (
        resource.data.institutionId == request.auth.uid ||
        resource.data.studentId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
    
    // Documents collection
    match /documents/{documentId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click "Publish"

## Step 3: Server Setup

### 3.1 Navigate to Server Directory

```bash
cd server
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Create Environment File

Create a `.env` file in the `server` directory:

```bash
# Copy the example file
cp .env.example .env
```

### 3.4 Configure Environment Variables

Edit the `.env` file with your Firebase credentials:

```env
# Firebase Admin SDK Configuration
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email@project-id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your-client-cert-url

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Important Notes:**
- Replace all placeholder values with your actual Firebase credentials
- Get the private key from the service account JSON file you downloaded
- The private key should include `\n` for line breaks
- Never commit the `.env` file to version control

### 3.5 Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server should start on `http://localhost:5000`

## Step 4: Client Setup

### 4.1 Navigate to Client Directory

```bash
cd ../client
```

### 4.2 Install Dependencies

```bash
npm install
```

### 4.3 Create Environment File

Create a `.env` file in the `client` directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Firebase Configuration (from Firebase Console)
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Environment
REACT_APP_ENV=development
```

### 4.4 Start the Client

```bash
# Development mode
npm start

# Build for production
npm run build
```

The client should start on `http://localhost:3000`

## Step 5: Create Admin User

### 5.1 Access the Create Admin Page

1. Start both server and client
2. Navigate to `http://localhost:3000/create-admin`
3. Click "Create Admin Account"
4. Note the credentials displayed

### 5.2 Login as Admin

1. Go to `http://localhost:3000/login`
2. Use the admin credentials:
   - Email: `thabotsehla31@gmail.com`
   - Password: `vegetarian@31`

## Step 6: Initial Data Setup

### 6.1 Add Institutions

1. Login as admin
2. Navigate to Admin Dashboard > Institutions
3. Click "Add Institution"
4. Fill in the details:
   - Name: National University of Lesotho
   - Email: info@nul.ls
   - Phone: +266 2234 0601
   - Address: Roma, Lesotho
   - Website: https://www.nul.ls
   - Description: Premier institution of higher learning in Lesotho

### 6.2 Add Companies

1. Navigate to Admin Dashboard > Companies
2. Click "Add Company"
3. Fill in company details

## Step 7: Testing

### 7.1 Test API Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# Get institutions (public endpoint)
curl http://localhost:5000/api/institutions
```

### 7.2 Test Authentication

1. Create a student account
2. Login with student credentials
3. Browse institutions
4. Apply for courses

### 7.3 Test File Uploads

1. Login as student
2. Upload transcript
3. Upload certificates
4. Verify files in Firebase Storage

## Step 8: Deployment

### 8.1 Deploy to Firebase Hosting (Client)

```bash
cd client

# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init hosting

# Build the app
npm run build

# Deploy
firebase deploy --only hosting
```

### 8.2 Deploy to Cloud Platform (Server)

#### Option 1: Firebase Cloud Functions

```bash
cd server

# Initialize Cloud Functions
firebase init functions

# Deploy
firebase deploy --only functions
```

#### Option 2: Heroku

```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set FIREBASE_PROJECT_ID=your-project-id
# ... set all other env variables

# Deploy
git push heroku main
```

#### Option 3: DigitalOcean/AWS/Azure

Follow the platform-specific deployment guides for Node.js applications.

## Troubleshooting

### Issue: Firebase Admin SDK Initialization Error

**Solution:**
- Verify all environment variables are set correctly
- Check that the private key includes proper line breaks (`\n`)
- Ensure the service account has proper permissions

### Issue: CORS Errors

**Solution:**
- Update CORS configuration in `server/index.js`
- Add your production domain to allowed origins
- Verify API URL in client `.env` file

### Issue: Authentication Errors

**Solution:**
- Check Firebase Authentication is enabled
- Verify email/password provider is enabled
- Check token expiration settings

### Issue: File Upload Errors

**Solution:**
- Verify Firebase Storage is initialized
- Check storage bucket permissions
- Ensure file size is under 5MB limit

### Issue: Database Query Errors

**Solution:**
- Check Firestore security rules
- Verify collection names match exactly
- Ensure indexes are created for complex queries

## Security Checklist

- [ ] Change default admin credentials
- [ ] Set strong JWT secret
- [ ] Enable Firebase App Check
- [ ] Configure proper CORS settings
- [ ] Set up rate limiting
- [ ] Enable HTTPS in production
- [ ] Secure environment variables
- [ ] Review Firestore security rules
- [ ] Enable Firebase Security Rules
- [ ] Set up monitoring and alerts

## Maintenance

### Regular Tasks

1. **Weekly:**
   - Review error logs
   - Check application performance
   - Monitor database usage

2. **Monthly:**
   - Update dependencies
   - Review security rules
   - Backup database

3. **Quarterly:**
   - Security audit
   - Performance optimization
   - User feedback review

## Support

For issues or questions:
- Email: support@careerpath.com
- Documentation: See API_DOCUMENTATION.md
- GitHub Issues: [repository-url]/issues

## License

[Your License Here]
