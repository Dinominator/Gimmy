// gimmy/backend/services/emailService.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config(); // Ensure environment variables are loaded

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: parseInt(process.env.EMAIL_PORT, 10) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Add timeout settings if needed, e.g. connectionTimeout, greetingTimeout, socketTimeout
  // tls: {
  //   rejectUnauthorized: false // Useful for local development with self-signed certs, remove for production
  // }
});

transporter.verify((error, success) => {
  if (error) {
      console.error('Error with email transporter configuration:', error);
      console.error('Please check your .env file for EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS.');
  } else {
      console.log('Email transporter is configured correctly and ready to send emails.');
  }
});

const sendEmail = async (to, subject, htmlContent, textContent = '') => {
  const mailOptions = {
    from: process.env.EMAIL_FROM, // Sender address e.g. '"Gimmy App" <noreply@gimmy.com>'
    to, // List of receivers (string or array)
    subject, // Subject line
    text: textContent || htmlContent.replace(/<[^>]*>?/gm, ''), // Plain text body
    html: htmlContent, // HTML body content
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    // Do not throw error here to prevent crashing the main process if email fails,
    // but log it for debugging. Depending on criticality, you might want to handle it differently.
    return null;
  }
};

module.exports = { sendEmail };
