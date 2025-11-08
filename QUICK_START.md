# Quick Start Guide - Career Guidance Platform

## 🚀 Get Started in 5 Minutes

### Step 1: Create Server Environment File (2 minutes)

1. Navigate to the server directory:
```bash
cd server
```

2. Create a `.env` file:
```bash
# On Windows PowerShell
New-Item -Path ".env" -ItemType File

# Or manually create the file in your editor
```

3. Add these variables to `.env`:
```env
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=career-guidance-platform-7e18e
FIREBASE_PRIVATE_KEY_ID=get-from-firebase-console
FIREBASE_PRIVATE_KEY="get-from-firebase-console"
FIREBASE_CLIENT_EMAIL=get-from-firebase-console
FIREBASE_CLIENT_ID=get-from-firebase-console
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=get-from-firebase-console

PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
JWT_SECRET=your-secret-key-change-this
```

### Step 2: Get Firebase Credentials (1 minute)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `career-guidance-platform-7e18e`
3. Go to **Project Settings** (gear icon) > **Service Accounts**
4. Click **"Generate New Private Key"**
5. Download the JSON file
6. Copy values from the JSON to your `.env` file:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key_id` → `FIREBASE_PRIVATE_KEY_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and \n)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `client_id` → `FIREBASE_CLIENT_ID`
   - `client_x509_cert_url` → `FIREBASE_CLIENT_X509_CERT_URL`

### Step 3: Start the Server (1 minute)

```bash
# In the server directory
npm install  # Only needed first time
npm run dev
```

You should see:
```
🚀 Server running on port 5000
🔗 API URL: http://localhost:5000
```

### Step 4: Start the Client (1 minute)

Open a new terminal:

```bash
cd client
npm install  # Only needed first time
npm start
```

Browser should open at `http://localhost:3000`

### Step 5: Test It Works

1. Open browser to `http://localhost:3000`
2. Click "Browse Institutions"
3. You should see institutions from your Firebase database

---

## ✅ Verification Checklist

- [ ] Server running on port 5000
- [ ] Client running on port 3000
- [ ] No errors in server console
- [ ] No errors in browser console
- [ ] Institutions page loads successfully

---

## 🐛 Quick Troubleshooting

### Server won't start?
**Error:** "Service account object must contain a string 'project_id' property"

**Fix:** Check your `.env` file has all Firebase variables set correctly

### Can't see institutions?
**Check:**
1. Server is running
2. Browser console for errors (F12)
3. Network tab shows successful API call to `/api/institutions`
4. Firebase has data in `institutions` collection

### CORS Error?
**Fix:** Server CORS is set to allow `http://localhost:3000`. If using different port, update `server/index.js` line 13.

---

## 📝 Admin Credentials

**Email:** thabotsehla31@gmail.com  
**Password:** vegetarian@31

To create admin account:
1. Go to `http://localhost:3000/create-admin`
2. Click "Create Admin Account"

---

## 🎯 What's Fixed

✅ Institutions now load from correct Firestore collection  
✅ All CRUD operations working  
✅ Public API endpoints accessible  
✅ Proper error handling  
✅ Consistent API responses  
✅ Firebase configuration complete  

---

## 📚 Full Documentation

- **API Endpoints:** See `API_DOCUMENTATION.md`
- **Complete Setup:** See `SETUP_GUIDE.md`
- **All Fixes:** See `FIXES_APPLIED.md`
- **Admin Guide:** See `ADMIN_SETUP_GUIDE.md`

---

## 🆘 Need Help?

1. Check the error message in console
2. Look in `FIXES_APPLIED.md` for known issues
3. Check `SETUP_GUIDE.md` troubleshooting section
4. Verify `.env` file has all required variables

---

## 🎉 You're Ready!

Your Career Guidance Platform is now set up and running!

**Next Steps:**
1. Login as admin
2. Add more institutions
3. Create company accounts
4. Add job postings
5. Test student workflows

---

**Last Updated:** October 25, 2024
