const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: "cortez2@ethereal.email",
        pass: "g1UuddDqJ3D92eHjfq"
    }
});

module.exports = {
    generateVerificationCode(user_id) {
        return `${crypto.randomBytes(5).toString('hex').toUpperCase()}${user_id}`;
    },

    async sendVerificationEmail(email, verificationCode) {
        const mailOptions = {
            from: "cortez2@ethereal.email",
            to: email,
            subject: 'Verify your email address',
            text: `Your verification code is ${verificationCode}`
        };
        await transporter.sendMail(mailOptions);
    }
};

