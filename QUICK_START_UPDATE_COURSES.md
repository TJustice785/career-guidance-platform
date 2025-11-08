# 🚀 Quick Start: Update Courses to Real Programs

## ✅ Deployed & Ready!

**Live URL:** https://career-guidance-platform-7e18e.web.app

Your app now has **29 real course programs** from Lesotho institutions including **Bachelor of Agriculture** from Botho University (as you requested)!

---

## 🎯 Update Your Firebase Database NOW

### Step 1: Clear Browser Cache (Important!)
```
Press: Ctrl + Shift + R (or Cmd + Shift + R on Mac)
```

### Step 2: Login as Admin
```
Go to: https://career-guidance-platform-7e18e.web.app/login
Login with your admin account
```

### Step 3: Navigate to Update Tool
```
Option A: Direct Link
https://career-guidance-platform-7e18e.web.app/admin/update-courses

Option B: From Dashboard
Admin Dashboard → Settings → Update Courses
```

### Step 4: Update Your Courses
```
1. You'll see a blue info box with all real programs listed
2. Click "Update All Courses to Real Programs" button
3. Wait 30-60 seconds
4. See progress: "Updated: Bachelor of Agriculture at Botho University"
5. Done! ✅
```

---

## 📚 What You're Getting

### Botho University (Your Request!)
- ✅ **Bachelor of Agriculture** (4 years, M45,000) ⭐
- ✅ Bachelor of Commerce in Accounting
- ✅ Bachelor of Information Technology
- ✅ Bachelor of Business Administration
- ✅ Diploma in Information Technology
- ✅ Diploma in Agriculture

### National University of Lesotho
- Bachelor of Science in Computer Science
- Bachelor of Education
- Bachelor of Agriculture
- Bachelor of Science in Nursing
- Bachelor of Commerce
- Bachelor of Law (LLB)

### Lerotholi Polytechnic
- National Diploma in Civil Engineering
- National Diploma in Electrical Engineering
- National Diploma in Mechanical Engineering
- Diploma in Business Management
- Certificate in Information Technology

### Lesotho College of Education
- Diploma in Primary Education
- Diploma in Secondary Education
- Bachelor of Education in Primary

### Limkokwing University
- Bachelor of Arts in Digital Media Design
- Bachelor of Science in Software Engineering
- Diploma in Graphic Design
- Bachelor of Business Administration

### Plus 5 More General Programs
- Diploma in Nursing Science
- Certificate in Agriculture and Animal Production
- Diploma in Accounting
- Certificate in Office Administration
- Diploma in Marketing Management

**Total: 29 Real Programs from 5 Institutions**

---

## 🎬 Quick Demo Video Steps

### What to Expect (30-60 seconds):

**Before Update:**
```
Courses show generic names like:
- "Computer Science - Undergraduate"
- "Business Administration - Undergraduate"
- "Agriculture - Diploma"
```

**During Update (You'll see):**
```
Creating courses for 5 institutions...
✅ Updated: Bachelor of Agriculture at Botho University
✅ Updated: Bachelor of Information Technology at Botho University
✅ Updated: Bachelor of Science in Computer Science at NUL
✅ Updated: National Diploma in Civil Engineering at Lerotholi
...
```

**After Update:**
```
Courses show real names:
- "Bachelor of Agriculture - Undergraduate" (Botho University)
- "Bachelor of Information Technology - Undergraduate" (Botho)
- "Bachelor of Science in Computer Science - Undergraduate" (NUL)
- "National Diploma in Civil Engineering - Diploma" (Lerotholi)
```

---

## 📊 Statistics Display

You'll see a dashboard showing:
```
┌─────────────┬──────────┬─────────┐
│ Total       │ Updated  │ Deleted │
│ Courses     │ Courses  │ Courses │
├─────────────┼──────────┼─────────┤
│    80       │    80    │    0    │
└─────────────┴──────────┴─────────┘
```

---

## ⚡ Two Options to Choose From

### Option 1: Update Existing Courses ⭐ (Recommended)
**Pros:**
- ✅ Keeps all existing applications
- ✅ Updates course names in-place
- ✅ No data loss
- ✅ Fast (30-60 seconds)

**Cons:**
- Some courses might not match perfectly

**When to use:** If you have applications and want to keep them

---

### Option 2: Fresh Start (Delete & Reseed)
**Pros:**
- ✅ Clean, perfect course data
- ✅ All courses perfectly matched to institutions
- ✅ No old/duplicate data

**Cons:**
- ⚠️ Deletes existing applications
- ⚠️ Need to recreate test data

**When to use:** If you're okay deleting applications and want fresh data

**Steps:**
```
1. Go to /admin/update-courses
2. Click "Delete All Courses" (confirm twice)
3. Go to /admin/seed-database
4. Click "Seed Institutions" (if needed)
5. Click "Seed Courses"
6. Done! Fresh real courses created
```

---

## 🧪 Verify It Worked

### Check 1: Admin View
```
1. Go to /admin/courses
2. Look at course names
3. Should see: "Bachelor of Agriculture", "Bachelor of Commerce in Accounting", etc.
4. NOT: "Computer Science", "Business Administration"
```

### Check 2: Student View
```
1. Go to /student/browse-schools
2. Filter by "Botho University"
3. Should see:
   - Bachelor of Agriculture (M45,000, 4 years)
   - Bachelor of Information Technology (M50,000, 4 years)
   - Diploma in Agriculture (M28,000, 2 years)
```

### Check 3: Fees
```
All course fees should be realistic:
- Public institutions: M10,000 - M30,000
- Private institutions: M28,000 - M55,000
- NO courses with M100,000+ fees
```

---

## 🔍 Troubleshooting

### Issue: "No institutions found"
**Solution:**
```
1. Go to /admin/seed-database
2. Click "Seed Institutions" first
3. Then try updating courses
```

### Issue: Update button not working
**Solution:**
```
1. Clear browser cache (Ctrl + Shift + R)
2. Refresh page
3. Check browser console (F12) for errors
4. Verify you're logged in as admin
```

### Issue: Some courses didn't update
**Solution:**
```
1. Run update again (safe to run multiple times)
2. Or use Option 2 (delete and reseed)
```

---

## 📱 Mobile Access

Update tool works on mobile too:
```
1. Open app on phone
2. Login as admin
3. Menu → Settings → Update Courses
4. Tap "Update All Courses"
5. Done!
```

---

## 🎓 Example: Botho Agriculture

### Before:
```json
{
  "name": "Agriculture",
  "title": "Agriculture - Diploma",
  "fees": 8000,
  "duration": "2 years",
  "institutionName": "Botho University"
}
```

### After:
```json
{
  "name": "Bachelor of Agriculture",
  "title": "Bachelor of Agriculture - Undergraduate",
  "fees": 45000,
  "duration": "4 years",
  "level": "Undergraduate",
  "institutionName": "Botho University",
  "description": "Comprehensive Bachelor of Agriculture program offered by Botho University. This program equips students with essential knowledge and skills in agriculture."
}
```

---

## ⏱️ How Long Does It Take?

**Update Existing Courses:**
- Small database (10-50 courses): ~10 seconds
- Medium database (50-100 courses): ~30 seconds
- Large database (100+ courses): ~60 seconds

**Delete & Reseed:**
- Delete all: ~5 seconds
- Seed new: ~20 seconds
- Total: ~25 seconds

---

## 💡 Pro Tips

1. **Run Preview First** - Click "Preview Real Courses" to see what will be created
2. **Check Console** - Press F12 to see detailed logs
3. **Take Screenshot** - Capture before/after for comparison
4. **Test on Student View** - Always verify from student perspective
5. **Clear Cache** - Always clear cache after deployment

---

## ✅ Final Checklist

Before you start:
- [ ] Deployed app is live
- [ ] Cleared browser cache
- [ ] Logged in as admin
- [ ] Ready to update courses

After update:
- [ ] Course names are real (e.g., "Bachelor of Agriculture")
- [ ] Botho has Agriculture program
- [ ] Fees are realistic (M10,000 - M55,000)
- [ ] Student view shows correct courses
- [ ] Search and filter still work

---

## 🎯 Summary

**What You Need to Do:**
1. Clear cache (Ctrl + Shift + R)
2. Go to `/admin/update-courses`
3. Click "Update All Courses to Real Programs"
4. Wait 30 seconds
5. Verify courses updated

**What You Get:**
- ✅ 29 real programs from 5 institutions
- ✅ Botho University Agriculture (your specific request)
- ✅ Realistic fees in LSL
- ✅ Proper program levels and durations
- ✅ All applications preserved

**Time Required:** 2 minutes
**Difficulty:** Easy (just click a button!)
**Risk:** Low (can run multiple times, no data loss)

---

**Ready? Go to:** https://career-guidance-platform-7e18e.web.app/admin/update-courses

**Clear cache first!** Ctrl + Shift + R

🚀 Let's update those courses to real Lesotho programs!
