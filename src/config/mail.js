require("dotenv").config();
const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});


async function sendEmail (toEmail, subject, message) {
    await transporter.sendMail({
        from: process.env.MAIL_USERNAME, // sender address
        to: toEmail, // list of receivers
        subject: subject, // Subject line // plain text body
        html: message, // html body
    });
}
module.exports = sendEmail;

