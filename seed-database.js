const admin = require('firebase-admin');
const serviceAccount = require('./career-guidance-platform-7e18e-firebase-adminsdk-fbsvc-a5b8af8773.json');
const seedData = require('./firebase_data_import.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://career-guidance-platform-7e18e-default-rtdb.firebaseio.com"
  });
}

const db = admin.firestore();
const auth = admin.auth();

async function seedDatabase() {
  try {
    console.log('🚀 Starting database seeding...');

    // Seed Users and create Auth accounts
    console.log('📝 Seeding users...');
    for (const userData of seedData.users) {
      try {
        // Create auth user
        const userRecord = await auth.createUser({
          email: userData.email,
          password: 'TempPass123!',
          displayName: `${userData.firstName} ${userData.lastName}`,
          phoneNumber: userData.phone,
          disabled: false
        });

        // Add user data to Firestore
        const userDoc = {
          uid: userRecord.uid,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          phone: userData.phone,
          isActive: userData.isActive,
          createdAt: admin.firestore.Timestamp.fromDate(new Date(userData.createdAt)),
          updatedAt: admin.firestore.Timestamp.fromDate(new Date(userData.updatedAt))
        };

        // Add role-specific fields
        if (userData.role === 'student') {
          userDoc.dateOfBirth = userData.dateOfBirth;
          userDoc.currentGrade = userData.currentGrade;
          userDoc.subjects = userData.subjects;
          userDoc.previousSchool = userData.previousSchool;
          userDoc.graduationYear = userData.graduationYear;
          userDoc.academicAchievements = userData.academicAchievements;
          userDoc.certifications = userData.certifications;
          userDoc.skills = userData.skills;
          userDoc.languages = userData.languages;
          userDoc.workExperience = userData.workExperience;
          userDoc.address = userData.address;
          userDoc.emergencyContact = userData.emergencyContact;
          userDoc.emergencyPhone = userData.emergencyPhone;
        } else if (userData.role === 'company') {
          userDoc.companyName = userData.companyName;
          userDoc.industry = userData.industry;
          userDoc.companySize = userData.companySize;
        } else if (userData.role === 'institute') {
          userDoc.institutionName = userData.institutionName;
          userDoc.institutionType = userData.institutionType;
        }

        await db.collection('users').doc(userRecord.uid).set(userDoc);
        console.log(`✅ Created user: ${userData.email}`);
      } catch (error) {
        if (error.code === 'auth/email-already-exists') {
          console.log(`⚠️  User already exists: ${userData.email}`);
        } else {
          console.error(`❌ Error creating user ${userData.email}:`, error.message);
        }
      }
    }

    // Seed Institutions
    console.log('🏫 Seeding institutions...');
    for (const institution of seedData.institutions) {
      const docRef = await db.collection('institutions').add({
        ...institution,
        createdAt: admin.firestore.Timestamp.fromDate(new Date(institution.createdAt)),
        updatedAt: admin.firestore.Timestamp.fromDate(new Date(institution.updatedAt))
      });
      console.log(`✅ Created institution: ${institution.name}`);
    }

    // Seed Companies
    console.log('🏢 Seeding companies...');
    for (const company of seedData.company) {
      const docRef = await db.collection('companies').add({
        ...company,
        createdAt: admin.firestore.Timestamp.fromDate(new Date(company.createdAt)),
        updatedAt: admin.firestore.Timestamp.fromDate(new Date(company.updatedAt))
      });
      console.log(`✅ Created company: ${company.name}`);
    }

    // Seed Courses
    console.log('📚 Seeding courses...');
    for (const course of seedData.courses) {
      const docRef = await db.collection('courses').add({
        ...course,
        createdAt: admin.firestore.Timestamp.fromDate(new Date(course.createdAt)),
        updatedAt: admin.firestore.Timestamp.fromDate(new Date(course.updatedAt))
      });
      console.log(`✅ Created course: ${course.name}`);
    }

    // Seed Jobs
    console.log('💼 Seeding jobs...');
    for (const job of seedData.jobs) {
      const docRef = await db.collection('jobs').add({
        ...job,
        createdAt: admin.firestore.Timestamp.fromDate(new Date(job.createdAt)),
        updatedAt: admin.firestore.Timestamp.fromDate(new Date(job.updatedAt)),
        postedDate: admin.firestore.Timestamp.fromDate(new Date(job.postedDate)),
        applicationDeadline: admin.firestore.Timestamp.fromDate(new Date(job.applicationDeadline))
      });
      console.log(`✅ Created job: ${job.title}`);
    }

    // Seed Applications
    console.log('📄 Seeding applications...');
    for (const application of seedData.applications) {
      const docRef = await db.collection('applications').add({
        ...application,
        createdAt: admin.firestore.Timestamp.fromDate(new Date(application.createdAt)),
        updatedAt: admin.firestore.Timestamp.fromDate(new Date(application.updatedAt)),
        appliedAt: admin.firestore.Timestamp.fromDate(new Date(application.appliedAt))
      });
      console.log(`✅ Created application for: ${application.studentName}`);
    }

    // Seed Admissions
    console.log('🎓 Seeding admissions...');
    for (const admission of seedData.admissions) {
      const docRef = await db.collection('admissions').add({
        ...admission,
        createdAt: admin.firestore.Timestamp.fromDate(new Date(admission.createdAt)),
        updatedAt: admin.firestore.Timestamp.fromDate(new Date(admission.updatedAt)),
        admissionDate: admin.firestore.Timestamp.fromDate(new Date(admission.admissionDate))
      });
      console.log(`✅ Created admission for: ${admission.studentName}`);
    }

    // Seed Notifications
    console.log('🔔 Seeding notifications...');
    for (const notification of seedData.notifications) {
      const docRef = await db.collection('notifications').add({
        ...notification,
        createdAt: admin.firestore.Timestamp.fromDate(new Date(notification.createdAt)),
        updatedAt: admin.firestore.Timestamp.fromDate(new Date(notification.updatedAt))
      });
      console.log(`✅ Created notification: ${notification.title}`);
    }

    // Seed System Settings
    console.log('⚙️  Seeding system settings...');
    for (const setting of seedData.system_settings) {
      const docRef = await db.collection('system_settings').add({
        ...setting,
        createdAt: admin.firestore.Timestamp.fromDate(new Date(setting.createdAt)),
        updatedAt: admin.firestore.Timestamp.fromDate(new Date(setting.updatedAt))
      });
      console.log(`✅ Created system setting: ${setting.key}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${seedData.users.length}`);
    console.log(`   - Institutions: ${seedData.institutions.length}`);
    console.log(`   - Companies: ${seedData.company.length}`);
    console.log(`   - Courses: ${seedData.courses.length}`);
    console.log(`   - Jobs: ${seedData.jobs.length}`);
    console.log(`   - Applications: ${seedData.applications.length}`);
    console.log(`   - Admissions: ${seedData.admissions.length}`);
    console.log(`   - Notifications: ${seedData.notifications.length}`);
    console.log(`   - System Settings: ${seedData.system_settings.length}`);

    console.log('\n🔐 Default login credentials:');
    console.log('   Admin: thabotsehla31@gmail.com / TempPass123!');
    console.log('   Student: john.doe@email.com / TempPass123!');
    console.log('   Company: hr@techcorp.co.ls / TempPass123!');
    console.log('   Institute: admin@nul.ac.ls / TempPass123!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

// Run the seeding
seedDatabase();
