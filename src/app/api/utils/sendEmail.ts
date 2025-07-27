// utils/sendEmail.ts
import nodemailer from 'nodemailer'

export async function sendEmail({ to, subject, text }: { to: string, subject: string, text: string }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  await transporter.sendMail({
    from: `"Kamuit Team" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  })
}