# 🏢 COMPANY LOGIN FIX GUIDE

## Problem: Company Login Shows Nothing

When you try to log in as a company, the dashboard doesn't display. This is because you need to create a company user account in Firebase.

---

## ✅ SOLUTION: Create Company User in Firebase

### Step 1: Create Authentication Account

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com
   - Select your project

2. **Go to Authentication**
   - Click "Authentication" in left sidebar
   - Click "Users" tab
   - Click "Add user" button

3. **Create Company Account**
   - **Email:** `company@test.com` (or any email)
   - **Password:** `Company123!` (or any password)
   - Click "Add user"
   - **Copy the UID** (you'll need this)

---

### Step 2: Create User Profile in Firestore

1. **Go to Firestore Database**
   - Click "Firestore Database" in left sidebar
   - Click "users" collection (or create it if it doesn't exist)

2. **Add Document**
   - Click "Add document"
   - **Document ID:** Paste the UID you copied from Authentication
   
3. **Add Fields** (one by one):

```
Field: uid
Type: string
Value: [paste the UID]

Field: email
Type: string
Value: company@test.com

Field: role
Type: string
Value: company

Field: firstName
Type: string
Value: Company

Field: lastName
Type: string
Value: Admin

Field: fullName
Type: string
Value: Company Admin

Field: phone
Type: string
Value: +266 2231 0000

Field: companyId
Type: string
Value: company001

Field: companyName
Type: string
Value: Test Company

Field: position
Type: string
Value: HR Manager

Field: isActive
Type: boolean
Value: true

Field: createdAt
Type: timestamp
Value: [Click "Set to current time"]

Field: updatedAt
Type: timestamp
Value: [Click "Set to current time"]
```

4. **Click "Save"**

---

## 📋 Quick Copy-Paste JSON Format

If your Firebase supports JSON import, use this:

```json
{
  "uid": "YOUR_UID_HERE",
  "email": "company@test.com",
  "role": "company",
  "firstName": "Company",
  "lastName": "Admin",
  "fullName": "Company Admin",
  "phone": "+266 2231 0000",
  "companyId": "company001",
  "companyName": "Test Company",
  "position": "HR Manager",
  "isActive": true,
  "createdAt": "2024-10-23T20:00:00.000Z",
  "updatedAt": "2024-10-23T20:00:00.000Z"
}
```

---

## 🚀 Test the Login

1. **Go to your app:** `http://localhost:3000/login`

2. **Enter credentials:**
   - Email: `company@test.com`
   - Password: `Company123!`

3. **Click "Login"**

4. **You should see:**
   - Company Dashboard
   - Welcome message: "Welcome, Test Company! 🏢"
   - Stats cards (Active Jobs, Applications, etc.)
   - Sidebar navigation
   - Job postings management

---

## 🔍 Troubleshooting

### Issue 1: "User profile not found"
**Solution:** Make sure the UID in Firestore matches the UID in Authentication exactly.

### Issue 2: "User role not assigned"
**Solution:** Make sure the `role` field is set to `"company"` (lowercase, string type).

### Issue 3: Still shows nothing
**Solution:** 
1. Open browser console (F12)
2. Check for errors
3. Make sure you're using the correct email/password
4. Try logging out and logging in again

### Issue 4: Redirects to wrong page
**Solution:** Check that `role` field is exactly `"company"` (not "Company" or "COMPANY").

---

## 📊 Create Multiple Company Users

Want more test accounts? Repeat the process with different emails:

### Company User 2:
```
Email: hr@vodacom.co.ls
Password: Vodacom123!
Role: company
CompanyName: Vodacom Lesotho
```

### Company User 3:
```
Email: hr@standardbank.co.ls
Password: Bank123!
Role: company
CompanyName: Standard Lesotho Bank
```

---

## ✅ What You'll See After Login

### Dashboard Home:
- **Header:** "Welcome, [Company Name]! 🏢"
- **Stats Cards:**
  - Active Jobs: 12
  - Total Applications: 156
  - Shortlisted: 34
  - Hired: 8

### Sidebar Navigation:
- Dashboard
- Job Postings
- Applications
- Candidates
- Profile Settings
- Logout button

### Features Available:
- ✅ View job postings
- ✅ Post new jobs
- ✅ View applications
- ✅ Manage candidates
- ✅ Update company profile

---

## 🎯 Quick Test Credentials

Use these to test immediately:

**Email:** `company@test.com`  
**Password:** `Company123!`  
**Role:** company

---

## 📝 Important Notes

1. **Role must be lowercase:** `"company"` not `"Company"`
2. **UID must match:** Authentication UID = Firestore document ID
3. **Email must match:** Same email in both Authentication and Firestore
4. **Required fields:**
   - uid
   - email
   - role (must be "company")
   - firstName
   - lastName

---

## 🔐 Security Note

These are test credentials. For production:
- Use strong passwords
- Use real company emails
- Enable email verification
- Add proper security rules

---

## 📱 Alternative: Use Register Page

You can also create a company account through the register page:

1. Go to: `http://localhost:3000/register`
2. Fill in the form
3. Select role: "Company"
4. Submit
5. Manually update the Firestore document to add:
   - `companyId`
   - `companyName`
   - `position`

---

**After following these steps, your company login should work perfectly! 🏢✨**
