import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { replyMessage } = await request.json();

    if (!replyMessage?.trim()) {
      return NextResponse.json({ error: 'Reply message is required' }, { status: 400 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('EMAIL_USER or EMAIL_PASS environment variables are not set');
      return NextResponse.json({ error: 'Email is not configured. Please set EMAIL_USER and EMAIL_PASS in Vercel environment variables.' }, { status: 500 });
    }

    const enquiry = await prisma.contactEnquiry.findUnique({ where: { id: params.id } });
    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.mail.yahoo.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"RCCG Signs & Wonders Jönköping" <${process.env.EMAIL_USER}>`,
      to: enquiry.email,
      subject: `Re: ${enquiry.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1e3a5f; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">RCCG Signs &amp; Wonders</h1>
            <p style="color: #cbd5e1; margin: 4px 0 0;">Jönköping, Sweden</p>
          </div>
          <div style="padding: 32px; background: #ffffff; border: 1px solid #e2e8f0;">
            <p style="color: #374151; margin: 0 0 16px;">Dear ${enquiry.name},</p>
            <div style="color: #374151; white-space: pre-wrap; line-height: 1.6;">${replyMessage}</div>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #6b7280; font-size: 13px; margin: 0;">
              This is a reply to your enquiry: <em>"${enquiry.subject}"</em>
            </p>
          </div>
          <div style="padding: 16px; background: #f8fafc; text-align: center; border: 1px solid #e2e8f0; border-top: none;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              RCCG Signs &amp; Wonders &bull; Västra storgatan 12, Jönköping, Sweden
            </p>
          </div>
        </div>
      `,
    });

    // Mark as read once replied
    await prisma.contactEnquiry.update({ where: { id: params.id }, data: { read: true } });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error sending reply:', message);
    return NextResponse.json({ error: `Failed to send reply: ${message}` }, { status: 500 });
  }
}
