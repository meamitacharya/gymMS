const nodemailer = require('nodemailer');

const sendEmail = async options => {
  //1) Create Transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  //2) Define email options
  const mailOptions = {
    from: 'Amit Acharya <askamit29@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  //3) Actualy send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
