# 🚀 Quick Database Setup - 5 Minutes

## Step 1: Enable Firestore (2 minutes)

1. **Go to Firebase Console**:
   ```
   https://console.firebase.google.com/project/career-guidance-platform-7e18e/firestore
   ```

2. **Click "Create database"**

3. **Select "Start in production mode"**

4. **Choose location**: `nam5 (us-central)` or closest region

5. **Click "Enable"** and wait for it to finish

---

## Step 2: Deploy Firestore Rules (1 minute)

Open your terminal in the project root and run:

```bash
firebase deploy --only firestore
```

This will deploy your security rules to protect your data.

---

## Step 3: Seed Sample Data (2 minutes)

### Option A: Using the Seeder Page (Recommended)

1. **Start your app** (if not running):
   ```bash
   cd client
   npm start
   ```

2. **Navigate to**: `http://localhost:3000/admin/seed-database`

3. **Click "Seed All Data"** button

4. **Wait for success message**

### Option B: Using Browser Console

1. **Open your app** in browser
2. **Open Developer Console** (F12)
3. **Paste this code**:
   ```javascript
   import { seedAllData } from './utils/seedDatabase';
   seedAllData();
   ```

---

## Step 4: Verify Data (30 seconds)

1. **Go to Firestore Console**:
   ```
   https://console.firebase.google.com/project/career-guidance-platform-7e18e/firestore/data
   ```

2. **Check these collections exist**:
   - ✅ institutions (3 documents)
   - ✅ courses (3 documents)
   - ✅ jobs (3 documents)
   - ✅ careerTips (3 documents)
   - ✅ companies (3 documents)

---

## ✅ You're Done!

Your database is now ready with:
- 🏛️ 3 Institutions
- 📚 3 Courses
- 💼 3 Jobs
- 💡 3 Career Tips
- 🏢 3 Companies

---

## 🔗 Quick Links

- **Firestore Console**: https://console.firebase.google.com/project/career-guidance-platform-7e18e/firestore
- **Live App**: https://career-guidance-platform-7e18e.web.app
- **Full Guide**: See DATABASE_SETUP_GUIDE.md

---

## 🆘 Troubleshooting

**Problem**: "Permission denied" when seeding
- **Solution**: Make sure you're logged in to the app

**Problem**: "Database does not exist"
- **Solution**: Complete Step 1 first (Enable Firestore)

**Problem**: Seeding fails
- **Solution**: Check browser console for detailed error messages
