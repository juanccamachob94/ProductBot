const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.FROM_MAIL,
    pass: process.env.FROM_MAIL_PASSWORD
  }
});

module.exports = {
  sendEmail: async (subject, message) => {
    return transporter.sendMail({
      from: process.env.FROM_MAIL,
      to: process.env.TO_MAIL,
      subject: subject,
      text: message
    });
  }
}

