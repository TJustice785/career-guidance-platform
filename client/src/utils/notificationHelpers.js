import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase.config';

/**
 * Create a notification in Firestore
 * @param {string} userId - The user ID to send notification to
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, warning, info)
 * @param {object} metadata - Additional metadata
 */
export const createNotification = async (userId, title, message, type = 'info', metadata = {}) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      title,
      message,
      type,
      read: false,
      metadata,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('Notification created successfully');
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Send application status notification
 */
export const notifyApplicationStatus = async (userId, courseName, status) => {
  const statusMessages = {
    pending: `Your application for ${courseName} is being reviewed.`,
    accepted: `Congratulations! Your application for ${courseName} has been accepted!`,
    rejected: `We're sorry, your application for ${courseName} was not successful this time.`,
    waitlisted: `You've been placed on the waitlist for ${courseName}.`
  };

  const types = {
    pending: 'info',
    accepted: 'success',
    rejected: 'error',
    waitlisted: 'warning'
  };

  await createNotification(
    userId,
    'Application Status Update',
    statusMessages[status] || `Your application for ${courseName} has been updated.`,
    types[status] || 'info',
    { courseName, status, type: 'application' }
  );
};

/**
 * Send new job matching notification
 */
export const notifyNewJob = async (userId, jobTitle, companyName) => {
  await createNotification(
    userId,
    'New Job Opportunity',
    `A new job matching your qualifications: ${jobTitle} at ${companyName}`,
    'info',
    { jobTitle, companyName, type: 'job' }
  );
};

/**
 * Send course enrollment notification
 */
export const notifyEnrollment = async (userId, courseName, institutionName) => {
  await createNotification(
    userId,
    'Enrollment Confirmed',
    `You have been successfully enrolled in ${courseName} at ${institutionName}`,
    'success',
    { courseName, institutionName, type: 'enrollment' }
  );
};

/**
 * Send document upload notification
 */
export const notifyDocumentStatus = async (userId, documentName, status) => {
  const messages = {
    approved: `Your document "${documentName}" has been approved.`,
    rejected: `Your document "${documentName}" needs revision.`,
    pending: `Your document "${documentName}" is being reviewed.`
  };

  await createNotification(
    userId,
    'Document Status Update',
    messages[status] || `Update on your document: ${documentName}`,
    status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info',
    { documentName, status, type: 'document' }
  );
};

/**
 * Send deadline reminder notification
 */
export const notifyDeadline = async (userId, itemName, deadline) => {
  await createNotification(
    userId,
    'Deadline Reminder',
    `Reminder: ${itemName} deadline is approaching on ${deadline}`,
    'warning',
    { itemName, deadline, type: 'deadline' }
  );
};

/**
 * Send welcome notification to new users
 */
export const sendWelcomeNotification = async (userId, userName, role) => {
  const roleMessages = {
    student: 'Start exploring courses and job opportunities that match your qualifications!',
    institute: 'Begin by adding your courses and managing student applications.',
    company: 'Post your first job opening and find talented candidates!',
    admin: 'You have full access to manage the platform.'
  };

  await createNotification(
    userId,
    `Welcome to CareerPath, ${userName}!`,
    roleMessages[role] || 'Thank you for joining our platform!',
    'info',
    { userName, role, type: 'welcome' }
  );
};

export default {
  createNotification,
  notifyApplicationStatus,
  notifyNewJob,
  notifyEnrollment,
  notifyDocumentStatus,
  notifyDeadline,
  sendWelcomeNotification
};
