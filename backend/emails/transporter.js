// import nodemailer from 'nodemailer'

// // /Configure your email transport
// export const transporter = nodemailer.createTransport({
//   // Configure based on your email service
//   service: 'gmail',
//   auth: {
//     user: 'ebenezer.idowu.ojeba@gmail.com',
//     pass: 'qhkmyqmrnuyxritn',
//   },
// })

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true, // use TLS
  auth: {
    user: process.env.EMAIL_USER, // Use environment variable
    pass: process.env.EMAIL_PASS, // Use environment variable
  },
  tls: {
    rejectUnauthorized: false, // Bypass the certificate verification
  },
});







  
