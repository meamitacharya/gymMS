const nodemailer = require('nodemailer');

const sendEmail = async options => {
  //1) Create Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  //2) Define email options
  const mailOptions = {
    from: 'Amit Acharya <amitacharya975@gmail.com',
    to: options.email,
    sub: options.subject,
    text: options.message
  };
  //3) Actualy send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
