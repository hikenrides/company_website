const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cephas@hikenrides.com', 
    pass: 'programmer1303', 
  },
});

module.exports = transporter;
