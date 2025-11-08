import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase.config';

/**
 * Seed applications for Tsepang Tsehla
 * This will create course applications and job applications for testing
 */

const seedTsepangApplications = async () => {
  console.log('Starting to seed applications for Tsepang Tsehla...');

  try {
    // Find Tsepang's user account
    const usersQuery = query(
      collection(db, 'users'),
      where('email', '==', 'tsepangtsehla31@gmail.com')
    );
    const usersSnapshot = await getDocs(usersQuery);

    if (usersSnapshot.empty) {
      console.error('Tsepang Tsehla user not found with email: tsepangtsehla31@gmail.com');
      return { success: false, message: 'User not found. Please ensure tsepangtsehla31@gmail.com account exists.' };
    }

    const tsepangUser = usersSnapshot.docs[0];
    const tsepangData = tsepangUser.data();
    const tsepangId = tsepangUser.id;

    console.log('Found Tsepang:', tsepangData);

    // Get institutions and courses
    const institutionsSnapshot = await getDocs(collection(db, 'institutions'));
    const institutions = institutionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`Found ${institutions.length} institutions`);

    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    const courses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`Found ${courses.length} courses`);

    // Get jobs
    const jobsSnapshot = await getDocs(collection(db, 'jobs'));
    const jobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`Found ${jobs.length} jobs`);

    let courseAppsCreated = 0;
    let jobAppsCreated = 0;

    // Clear existing applications for Tsepang
    const existingAppsQuery = query(
      collection(db, 'applications'),
      where('studentId', '==', tsepangId)
    );
    const existingAppsSnapshot = await getDocs(existingAppsQuery);
    console.log(`Found ${existingAppsSnapshot.size} existing course applications to clear`);

    const existingJobAppsQuery = query(
      collection(db, 'jobApplications'),
      where('studentId', '==', tsepangId)
    );
    const existingJobAppsSnapshot = await getDocs(existingJobAppsQuery);
    console.log(`Found ${existingJobAppsSnapshot.size} existing job applications to clear`);

    // Create course applications (3-5 applications)
    const numCourseApps = Math.min(5, courses.length);
    const selectedCourses = courses.slice(0, numCourseApps);

    for (const course of selectedCourses) {
      const institution = institutions.find(inst => inst.id === course.institutionId);
      
      if (!institution) {
        console.warn(`Institution not found for course ${course.id}`);
        continue;
      }

      const statuses = ['pending', 'accepted', 'rejected'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      const applicationData = {
        studentId: tsepangId,
        studentName: `${tsepangData.firstName} ${tsepangData.lastName}`,
        studentEmail: tsepangData.email,
        institutionId: institution.id,
        institutionName: institution.name,
        courseId: course.id,
        courseName: course.title || course.name,
        status: randomStatus,
        createdAt: serverTimestamp(),
        qualifications: {
          currentGrade: tsepangData.currentGrade || 'Grade 12',
          subjects: tsepangData.subjects || ['Mathematics', 'English', 'Science'],
          certifications: tsepangData.certifications || []
        }
      };

      await addDoc(collection(db, 'applications'), applicationData);
      courseAppsCreated++;
      console.log(`Created ${randomStatus} course application for ${course.title || course.name}`);
    }

    // Create job applications (2-4 applications) - only if tertiary qualified
    const tertiaryLevels = ['Certificate', 'Diploma', "Bachelor's Degree", "Master's Degree", 'PhD'];
    const hasTertiary = tertiaryLevels.includes(tsepangData.currentGrade);

    if (hasTertiary && jobs.length > 0) {
      const numJobApps = Math.min(4, jobs.length);
      const selectedJobs = jobs.slice(0, numJobApps);

      for (const job of selectedJobs) {
        const statuses = ['pending', 'reviewing', 'shortlisted', 'rejected'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        const jobApplicationData = {
          studentId: tsepangId,
          studentName: `${tsepangData.firstName} ${tsepangData.lastName}`,
          studentEmail: tsepangData.email,
          jobId: job.id,
          jobTitle: job.title,
          companyName: job.companyName || job.company || 'Unknown Company',
          status: randomStatus,
          appliedAt: serverTimestamp(),
          qualifications: {
            currentGrade: tsepangData.currentGrade,
            subjects: tsepangData.subjects || [],
            certifications: tsepangData.certifications || []
          }
        };

        await addDoc(collection(db, 'jobApplications'), jobApplicationData);
        jobAppsCreated++;
        console.log(`Created ${randomStatus} job application for ${job.title}`);
      }
    } else if (!hasTertiary) {
      console.log('Tsepang does not have tertiary qualification. Skipping job applications.');
    }

    // Create some saved jobs
    if (jobs.length > 0) {
      const savedJobsCount = Math.min(3, jobs.length);
      const jobAppsCreatedCount = jobAppsCreated || 0;
      const savedJobs = jobs.slice(jobAppsCreatedCount, jobAppsCreatedCount + savedJobsCount);

      for (const job of savedJobs) {
        const savedJobData = {
          studentId: tsepangId,
          jobId: job.id,
          jobTitle: job.title,
          companyName: job.companyName || job.company || 'Unknown Company',
          savedAt: serverTimestamp()
        };

        await addDoc(collection(db, 'savedJobs'), savedJobData);
        console.log(`Saved job: ${job.title}`);
      }
    }

    console.log('\n✅ Seeding completed successfully!');
    console.log(`Created ${courseAppsCreated} course applications`);
    console.log(`Created ${jobAppsCreated} job applications`);

    return {
      success: true,
      message: `Created ${courseAppsCreated} course applications and ${jobAppsCreated} job applications for Tsepang Tsehla`,
      courseAppsCreated,
      jobAppsCreated
    };

  } catch (error) {
    console.error('Error seeding applications:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  }
};

export default seedTsepangApplications;
