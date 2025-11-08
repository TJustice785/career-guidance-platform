# 👨‍💼 ADMIN USER SETUP - COMPLETE GUIDE

## ✅ Admin Credentials

I've set up the admin user with these exact credentials:

```
📧 Email:    thabotsehla31@gmail.com
🔑 Password: vegetarian@31
👤 Name:     Thabo
🎯 Role:     admin
```

---

## 🚀 How to Create the Admin User

### Method 1: Using the Create Admin Page (Recommended)

#### Step 1: Start the Development Server
```bash
cd client
npm start
```

#### Step 2: Navigate to Create Admin Page
Open your browser and go to:
```
http://localhost:3000/create-admin
```

#### Step 3: Click the Button
- You'll see a page with the admin credentials displayed
- Click the **"Create Admin User"** button
- Wait for the success message
- The admin user will be created in Firebase

#### Step 4: Login
- Click **"Go to Login Page"** or navigate to `/login`
- Use the credentials:
  - Email: `thabotsehla31@gmail.com`
  - Password: `vegetarian@31`

---

### Method 2: Using Firebase Console (Manual)

If the automatic method doesn't work, you can create the admin manually:

#### Step 1: Create Authentication User
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Authentication** → **Users**
4. Click **"Add user"**
5. Enter:
   - Email: `thabotsehla31@gmail.com`
   - Password: `vegetarian@31`
6. Click **"Add user"**
7. Copy the **User UID** (you'll need this)

#### Step 2: Create Firestore Document
1. Go to **Firestore Database**
2. Go to the `users` collection
3. Click **"Add document"**
4. Document ID: **Paste the User UID from Step 1**
5. Add these fields:

```javascript
uid: "paste-the-uid-here"
email: "thabotsehla31@gmail.com"
firstName: "Thabo"
lastName: "Admin"
fullName: "Justice"
role: "admin"
isActive: true
createdAt: (timestamp) - Click "Add field" → Select "timestamp"
updatedAt: (timestamp) - Click "Add field" → Select "timestamp"
```

6. Click **"Save"**

---

## 📋 Files Created

### 1. **CreateAdmin.js** (`client/src/pages/CreateAdmin.js`)
- Visual page to create admin user
- Shows credentials
- One-click creation
- Success confirmation

### 2. **createAdmin.js** (`client/src/utils/createAdmin.js`)
- Utility function for creating admin
- Can be imported and used anywhere
- Error handling included

### 3. **App.js** (Updated)
- Added route: `/create-admin`
- Accessible without login

---

## 🔒 Security Notes

### After Creating the Admin:

1. **Remove the Create Admin Route** (Important!)
   
   In `client/src/App.js`, remove or comment out:
   ```javascript
   {/* Admin Setup - Remove this route after creating admin */}
   <Route path="/create-admin" element={<CreateAdmin />} />
   ```

2. **Delete the CreateAdmin Files** (Optional but recommended)
   ```bash
   rm client/src/pages/CreateAdmin.js
   rm client/src/utils/createAdmin.js
   ```

3. **Change Password After First Login**
   - Login with the default password
   - Go to profile settings
   - Change to a more secure password

---

## 🧪 Testing the Admin User

### Step 1: Login
1. Go to `/login`
2. Enter:
   - Email: `thabotsehla31@gmail.com`
   - Password: `vegetarian@31`
3. Click **"Login"**

### Step 2: Verify Access
You should be redirected to `/admin` and see:
- ✅ Admin Dashboard
- ✅ User Management
- ✅ Institution Management
- ✅ Company Management
- ✅ System Statistics

### Step 3: Test Admin Functions
- View all users
- Create institutions
- Manage system settings
- Access all admin features

---

## 🐛 Troubleshooting

### Issue: "Email already in use"
**Solution:** The admin user already exists. Just login with the credentials.

### Issue: "Cannot create user"
**Solution:** 
1. Check Firebase connection
2. Verify Firebase config in `firebase.config.js`
3. Check browser console for errors
4. Use Method 2 (Manual creation)

### Issue: "User created but can't login"
**Solution:**
1. Check if Firestore document was created
2. Verify the `role` field is set to `"admin"`
3. Check if `uid` matches between Auth and Firestore

### Issue: "Redirected to home page after login"
**Solution:**
1. Check the `role` field in Firestore
2. Make sure it's exactly `"admin"` (lowercase)
3. Clear browser cache and try again

---

## 📊 Admin User Structure

### Firebase Authentication:
```javascript
{
  uid: "auto-generated-uid",
  email: "tsepangtsehla31@gmail.com",
  emailVerified: false,
  displayName: null,
  photoURL: null,
  disabled: false
}
```

### Firestore Document (`users/{uid}`):
```javascript
{
  uid: "same-as-auth-uid",
  email: "tsepangtsehla31@gmail.com",
  firstName: "Justice",
  lastName: "Admin",
  fullName: "Justice",
  role: "admin",
  isActive: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🎯 What the Admin Can Do

### User Management:
- ✅ View all users
- ✅ Filter by role (admin, student, institute, company)
- ✅ Search users
- ✅ Activate/deactivate users
- ✅ Delete users

### Institution Management:
- ✅ Add new institutions
- ✅ View all institutions
- ✅ Edit institution details
- ✅ Delete institutions

### Company Management:
- ✅ View all companies
- ✅ Manage company accounts
- ✅ Monitor job postings

### System Overview:
- ✅ Total users count
- ✅ Active jobs count
- ✅ Total courses count
- ✅ Applications statistics
- ✅ Platform analytics

---

## 🔐 Password Requirements

The password `vegetarian@31` meets these requirements:
- ✅ At least 8 characters (13 characters)
- ✅ Contains lowercase letters (vegetarian)
- ✅ Contains number (31)
- ✅ Contains special character (@)

**Recommendation:** Change to a stronger password after first login!

---

## 📝 Quick Reference

### Admin Credentials:
```
Email:    tsepangtsehla31@gmail.com
Password: vegetarian@31
Name:     Justice
Role:     admin
```

### Access URLs:
```
Create Admin: http://localhost:3000/create-admin
Login:        http://localhost:3000/login
Admin Panel:  http://localhost:3000/admin
```

### Commands:
```bash
# Start dev server
cd client
npm start

# Open create admin page
# Navigate to: http://localhost:3000/create-admin
```

---

## ✅ Checklist

Before going live:

- [ ] Admin user created successfully
- [ ] Tested login with admin credentials
- [ ] Admin dashboard accessible
- [ ] All admin features working
- [ ] Changed default password
- [ ] Removed `/create-admin` route
- [ ] Deleted CreateAdmin files
- [ ] Verified Firebase security rules

---

## 🎉 Success!

Once you complete the setup:

1. ✅ Admin user: `thabotsehla31@gmail.com` is ready
2. ✅ Password: `vegetarian@31` works
3. ✅ Name: Thabo is displayed
4. ✅ Full admin access granted
5. ✅ Can manage entire platform

---

**Your admin user is ready to use! 🚀✨**

**Just visit `/create-admin` to create it, then login!**
