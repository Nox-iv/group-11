const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

exports.sendVerificationEmail = async (recipient, verificationCode) => {
  const verifyLink = `${process.env.USER_SERVICE_URL || 'http://localhost:8080'}/verify-email/${verificationCode}`;
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: recipient,
    subject: 'Verify Your Email',
    text: `Please verify your email by clicking the link: ${verifyLink}`,
  });
};
