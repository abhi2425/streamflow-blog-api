require('dotenv').config()
const nodemailer = require('nodemailer')

const sendEmail = async (email, message) => {
   const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
         user: process.env.USER_MAIL,
         pass: process.env.PASS,
      },
   })

   const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Thanks For Joining In',
      text: message,
   }

   await transporter.sendMail(mailOptions).catch((error) => console.log(error))
}
module.exports = sendEmail
