import type { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

type TechnicianInfo = {
  name: string;
  rating: number;
  distance: string;
  duration: string;
};

const handler: Handler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};

    const {
      name,
      email,
      phone,
      device,
      repair_type,
      price,
      preferred_date,
      preferred_time,
      technician,
    }: {
      name?: string;
      email?: string;
      phone?: string;
      device?: string;
      repair_type?: string;
      price?: number;
      preferred_date?: string;
      preferred_time?: string;
      technician?: TechnicianInfo | null;
    } = body;

    // ⛔ REQUIRED FIELDS CHECK
    if (!name || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'Missing required fields: name or email',
        }),
      };
    }

    // ✅ Format technician block safely
    const technicianHtml = technician
      ? `
        <hr />
        <h4>Selected Technician</h4>
        <p><strong>Name:</strong> ${technician.name}</p>
        <p><strong>Rating:</strong> ⭐ ${technician.rating}</p>
        <p><strong>Distance:</strong> ${technician.distance}</p>
        <p><strong>ETA:</strong> ${technician.duration}</p>
      `
      : `
        <hr />
        <h4>Selected Technician</h4>
        <p>Not available</p>
      `;

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
      to: 'info@fyxters.com',
      bcc: 'benhamzamouline@gmail.com',
      subject: 'New Repair Submission',
      html: `
        <h3>New Repair Info Submitted</h3>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || '-'}</p>

        <hr />

        <p><strong>Device:</strong> ${device || '-'}</p>
        <p><strong>Repair Type:</strong> ${repair_type || '-'}</p>
        <p><strong>Price:</strong> ${price ? `$${price}` : '-'}</p>

        <hr />

        <p><strong>Date:</strong> ${preferred_date || 'ASAP'}</p>
        <p><strong>Time:</strong> ${preferred_time || 'ASAP'}</p>

        ${technicianHtml}
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Send email error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ success: false }),
    };
  }
};

export { handler };


