const nodemailer = require('nodemailer');

const sendEmail = async options =>{
    //1) create a transporter
    var transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: 'bc7b6f3882eb7c',
          pass: '29b5041b22ec0a'
        }
      });
      
    //2) define the email options
    const mailOptions = {
        from: 'Pranay Pandey <pypy1401@gmail.com',
        to : options.email,
        subject : options.subject,
        text : options.message
    }

    //3)actually send mail
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;