const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.email",
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
        user: 'javalab4us@gmail.com',
        pass: 'ckixpymnzebv smsj'
    }
});

module.exports = transporter;