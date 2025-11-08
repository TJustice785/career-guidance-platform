# Application Management Seed Data Guide

## 📋 What's Included

Created **8 sample student applications** with diverse statuses:

### Application Statuses:
- ✅ **Pending** (2 applications) - Just submitted, awaiting review
- 🔍 **Under Review** (2 applications) - Being evaluated by admissions
- ✅ **Accepted** (2 applications) - Approved with student numbers
- ❌ **Rejected** (1 application) - Did not meet requirements
- ⏳ **Waitlisted** (1 application) - On waiting list

### Detailed Fields in Each Application:

**Basic Info:**
- Application number, student details, institution, course
- Application date, academic year, semester

**Qualifications:**
- LGCSE results with individual subject grades
- Overall grade, school name, year completed

**Documents:**
- Transcript, ID copy, birth certificate
- Medical certificate, passport photo, police check (where required)

**Additional Details:**
- Personal statement
- Guardian information
- Application fee payment details
- Review status (documents verified, academic review, interview)
- Notes from admissions officers
- Priority level

**Status-Specific Info:**
- **Accepted**: Student number, tuition fees, scholarship details, registration deadline
- **Rejected**: Rejection reason, appeal deadline, alternative courses
- **Waitlisted**: Position in queue, notification deadline

## 🚀 How to Seed This Data

### Option 1: Using Firebase Console (Manual)
1. Go to Firebase Console → Firestore Database
2. Create collection: `applications`
3. Add each application as a document
4. Use the application ID as document ID

### Option 2: Create Admin Seeder Page
I can create a page at `/admin/seed-applications` that:
- Reads the JSON file
- Adds each application to Firestore
- Shows progress and results

### Option 3: Server-Side Script
Run a Node.js script that seeds the database directly.

## 📊 Application Statistics

**Total Applications:** 8

**By Status:**
- Pending: 2
- Under Review: 2
- Accepted: 2
- Rejected: 1
- Waitlisted: 1

**By Institution:**
- National University of Lesotho (NUL): 5
- Lesotho College of Education (LCE): 1
- Institute of Development Management (IDM): 2
- Lerotholi Technical College (LTC): 1

**By Type:**
- Undergraduate: 6
- Diploma: 2

## 🎯 Sample Applications Overview

1. **Thabo Molefe** - NUL Computer Science (Pending)
2. **Palesa Nteso** - LCE Primary Education (Under Review) - Interview scheduled
3. **Mpho Sekhonyana** - IDM Business Admin (Accepted) - With payment plan
4. **Lineo Mokhele** - NUL Law (Rejected) - Below academic requirements
5. **Teboho Ramonotsi** - LTC Civil Engineering (Waitlisted) - Position #5
6. **Refiloe Mokotjo** - NUL Nursing (Under Review) - Interview scheduled
7. **Tumelo Ramathebane** - IDM IT Diploma (Pending)
8. **Keabetswe Mofolo** - NUL Agriculture (Accepted) - 50% scholarship

## 🔧 Next Steps

1. **Create Admin Interface** to view and manage applications
2. **Add filtering** by status, institution, date
3. **Enable status updates** (approve, reject, schedule interview)
4. **Add email notifications** when status changes
5. **Generate reports** on application statistics

Would you like me to create:
1. ✅ Admin page to view all applications
2. ✅ Application seeder function
3. ✅ Application management endpoints
