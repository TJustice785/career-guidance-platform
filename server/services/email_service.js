const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email templates
const emailTemplates = {
  verification: (name, link) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Career Guidance Platform</h1>
          </div>
          <div class="content">
            <h2>Hello ${name || 'there'}!</h2>
            <p>Thank you for registering with Career Guidance Platform. Please verify your email address by clicking the button below:</p>
            <a href="${link}" class="button">Verify Email</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4F46E5;">${link}</p>
            <p>This link will expire in 24 hours.</p>
          </div>
          <div class="footer">
            <p>© 2025 Career Guidance Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `,

  notification: (title, message) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
          </div>
          <div class="content">
            <p>${message}</p>
          </div>
          <div class="footer">
            <p>© 2025 Career Guidance Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `,

  admission: (studentName, courseName, institutionName, status) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${status === 'admitted' ? '#10B981' : '#EF4444'}; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${status === 'admitted' ? 'Congratulations!' : 'Application Update'}</h1>
          </div>
          <div class="content">
            <h2>Dear ${studentName},</h2>
            ${status === 'admitted' 
              ? `<p>We are pleased to inform you that you have been <strong>admitted</strong> to <strong>${courseName}</strong> at <strong>${institutionName}</strong>.</p>
                 <p>Please log in to your account to view your admission details and accept your offer.</p>`
              : `<p>Thank you for your application to <strong>${courseName}</strong> at <strong>${institutionName}</strong>.</p>
                 <p>After careful consideration, we regret to inform you that we are unable to offer you admission at this time.</p>`
            }
            <p>Best regards,<br>${institutionName}</p>
          </div>
          <div class="footer">
            <p>© 2025 Career Guidance Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `,

  jobMatch: (studentName, jobTitle, companyName, jobUrl) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Job Opportunity</h1>
          </div>
          <div class="content">
            <h2>Hello ${studentName}!</h2>
            <p>Great news! We found a job opportunity that matches your profile:</p>
            <h3>${jobTitle}</h3>
            <p><strong>Company:</strong> ${companyName}</p>
            <p>This position matches your qualifications and experience. Click the button below to view details and apply:</p>
            <a href="${jobUrl}" class="button">View Job</a>
          </div>
          <div class="footer">
            <p>© 2025 Career Guidance Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
};

// Send verification email
const sendVerificationEmail = async (to, verificationLink, name) => {
  try {
    const mailOptions = {
      from: `"Career Guidance Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Verify Your Email - Career Guidance Platform',
      html: emailTemplates.verification(name, verificationLink)
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', to);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Send notification email
const sendNotificationEmail = async (to, title, message) => {
  try {
    const mailOptions = {
      from: `"Career Guidance Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject: title,
      html: emailTemplates.notification(title, message)
    };

    await transporter.sendMail(mailOptions);
    console.log('Notification email sent to:', to);
  } catch (error) {
    console.error('Error sending notification email:', error);
    throw error;
  }
};

// Send admission email
const sendAdmissionEmail = async (to, studentName, courseName, institutionName, status) => {
  try {
    const mailOptions = {
      from: `"Career Guidance Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject: status === 'admitted' 
        ? `Congratulations! Admission to ${courseName}` 
        : `Application Update - ${courseName}`,
      html: emailTemplates.admission(studentName, courseName, institutionName, status)
    };

    await transporter.sendMail(mailOptions);
    console.log('Admission email sent to:', to);
  } catch (error) {
    console.error('Error sending admission email:', error);
    throw error;
  }
};

// Send job match email
const sendJobMatchEmail = async (to, studentName, jobTitle, companyName, jobUrl) => {
  try {
    const mailOptions = {
      from: `"Career Guidance Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject: `New Job Match: ${jobTitle}`,
      html: emailTemplates.jobMatch(studentName, jobTitle, companyName, jobUrl)
    };

    await transporter.sendMail(mailOptions);
    console.log('Job match email sent to:', to);
  } catch (error) {
    console.error('Error sending job match email:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendNotificationEmail,
  sendAdmissionEmail,
  sendJobMatchEmail
};
