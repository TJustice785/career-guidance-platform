const admin = require('firebase-admin');
const serviceAccount = require('../career-guidance-platform-7e18e-firebase-adminsdk-fbsvc-a5b8af8773.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function restoreApplications() {
  try {
    const studentData = {
      studentId: 'oLlnrVD32CWOnqNdwg5VjCSyqOo2',
      studentName: 'TSEPANG TSEHLA',
      studentEmail: 'tsepangtsehla31@gmail.com'
    };

    // Define applications to restore
    const applications = [
      {
        ...studentData,
        institutionId: 'uu4koroLU9P3AZARkYP4',
        institutionName: 'Machabeng College',
        courseId: 'course1',
        courseName: 'Cambridge IGCSE',
        status: 'pending',
        createdAt: admin.firestore.Timestamp.now(),
        type: 'course',
        qualifications: {
          currentGrade: 'Grade 11',
          subjects: [
            'Mathematics - B',
            'English - A',
            'Science - B',
            'Geography - B'
          ]
        }
      },
      {
        ...studentData,
        institutionId: 'HBswB25Uuhql2YNKqQTj',
        institutionName: 'Limkokwing University',
        courseId: 'course2',
        courseName: 'Computer Science - Undergraduate',
        status: 'accepted',
        createdAt: admin.firestore.Timestamp.now(),
        type: 'course',
        qualifications: {
          currentGrade: 'Grade 12',
          subjects: [
            'Mathematics - A',
            'English - B',
            'Physics - B',
            'Computer Studies - A'
          ]
        }
      },
      {
        ...studentData,
        institutionId: 'D8PR2nDPXvAhkiqlk9tV',
        institutionName: 'Lesotho College of Education',
        courseId: 'course3',
        courseName: 'Education - Undergraduate',
        status: 'pending',
        createdAt: admin.firestore.Timestamp.now(),
        type: 'course',
        qualifications: {
          currentGrade: 'Grade 12',
          subjects: [
            'Mathematics - B',
            'English - B',
            'Biology - A',
            'Geography - A'
          ]
        }
      },
      {
        ...studentData,
        institutionId: 'mXZYeEZzdIW5vQoIuPXA',
        institutionName: 'Botho University',
        courseId: 'course4',
        courseName: 'Business Management',
        status: 'pending',
        createdAt: admin.firestore.Timestamp.now(),
        type: 'course',
        qualifications: {
          currentGrade: 'Grade 12',
          subjects: [
            'Mathematics - B',
            'English - B',
            'Business Studies - A',
            'Accounting - A'
          ]
        }
      }
    ];

    // Add each application
    for (const application of applications) {
      const docRef = await db.collection('applications').add(application);
      console.log('Created application:', {
        id: docRef.id,
        institution: application.institutionName,
        course: application.courseName,
        status: application.status
      });
    }

    console.log('\nAll applications restored successfully!');

  } catch (error) {
    console.error('Error:', error);
  }
}

restoreApplications();