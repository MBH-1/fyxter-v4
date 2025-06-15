import type { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

const handler: Handler = async (event) => {
  const { name, email, phone, preferred_date, preferred_time } = JSON.parse(event.body || '{}');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Fyxters Notifications" <${process.env.MAIL_USER}>`,
    to: 'info@fyxters.com', // ✅ where you want to receive alerts
    subject: 'New Repair Submission',
    html: `
      <h3>New Repair Info Submitted</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Date:</strong> ${preferred_date || 'ASAP'}</p>
      <p><strong>Time:</strong> ${preferred_time || 'ASAP'}</p>
    `
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};

export { handler };
