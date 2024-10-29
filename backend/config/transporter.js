import nodemailer from 'nodemailer'

// /Configure your email transport
export const transporter = nodemailer.createTransport({
  // Configure based on your email service
  service: 'gmail',
  auth: {
    user: 'ebenezer.idowu.ojeba@gmail.com',
    pass: 'qhkmyqmrnuyxritn',
  },
})