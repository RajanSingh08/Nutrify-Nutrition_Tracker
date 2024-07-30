const nodemailer = require('nodemailer');

// Replace these values with your actual SMTP configuration
const SMTP_HOST = 'smtp.ethereal.email';
const SMTP_PORT = 587; // or 465 for secure
const SMTP_USER = 'yoshiko.denesik55@ethereal.email';
const SMTP_PASS = 'TaUhCRTWUBeG7YUan2';
const SMTP_MAIL = 'rajansingh2003.rs@gmail.com';

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    }
});

const sendMail = async (email, subject, content) => {
    try {
        var mailOptions = {
            from: SMTP_MAIL,
            to: email,
            subject: subject,
            html: content
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = { sendMail };
