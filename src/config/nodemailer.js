const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.email",
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASS
    }
});

module.exports = transporter;