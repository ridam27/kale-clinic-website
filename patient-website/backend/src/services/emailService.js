import nodemailer from 'nodemailer';
import { Resend } from 'resend';

// In-memory daily counter (in production, can be backed by Redis or PostgreSQL)
let dailyGmailCount = 0;
let lastResetDate = new Date().toISOString().slice(0, 10);

function getDailyCount() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== lastResetDate) {
    dailyGmailCount = 0;
    lastResetDate = today;
  }
  return dailyGmailCount;
}

function incrementDailyCount() {
  dailyGmailCount += 1;
}

/**
 * Creates Nodemailer Gmail Transport
 */
function createGmailTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransporter({
    service: 'gmail',
    auth: { user, pass },
  });
}

/**
 * Primary Email Sender: Gmail SMTP
 */
async function sendViaGmail({ to, subject, html, text }) {
  const transporter = createGmailTransporter();
  if (!transporter) {
    throw new Error('Gmail SMTP credentials not configured in environment.');
  }

  const fromName = process.env.CLINIC_FROM_NAME || 'Dr. Kale Clinic';
  const fromAddress = process.env.GMAIL_USER;

  const info = await transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]+>/g, ''),
  });

  incrementDailyCount();
  return { provider: 'gmail', messageId: info.messageId };
}

/**
 * Secondary / Fallback Email Sender: Resend
 */
async function sendViaResend({ to, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 're_placeholder_api_key') {
    throw new Error('Resend API key not configured in environment.');
  }

  const resend = new Resend(apiKey);
  const fromAddress = process.env.RESEND_FROM_ADDRESS || 'consultations@doctor-domain.com';
  const fromName = process.env.CLINIC_FROM_NAME || 'Dr. Kale Clinic';

  const response = await resend.emails.send({
    from: `${fromName} <${fromAddress}>`,
    to: [to],
    subject,
    html,
    text: text || html.replace(/<[^>]+>/g, ''),
  });

  if (response.error) {
    throw new Error(`Resend error: ${response.error.message}`);
  }

  return { provider: 'resend', messageId: response.data?.id };
}

/**
 * Dual Failover Email Dispatcher
 * Tries Primary (Gmail SMTP) -> On quota limit (480) or error -> Automatically falls back to Secondary (Resend)
 */
export async function sendEmailWithFailover({ to, subject, html, text }) {
  const currentCount = getDailyCount();
  const GMAIL_DAILY_SAFE_LIMIT = 480; // Safe threshold under Google's 500/day limit

  // 1. Try Primary: Gmail SMTP if under safe limit
  if (currentCount < GMAIL_DAILY_SAFE_LIMIT && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    try {
      const result = await sendViaGmail({ to, subject, html, text });
      console.log(`[Email] Successfully sent to ${to} via Gmail SMTP (Daily count: ${dailyGmailCount})`);
      return { success: true, ...result };
    } catch (gmailError) {
      console.warn(`[Email Failover] Gmail SMTP dispatch failed: ${gmailError.message}. Attempting rollover to Resend...`);
    }
  } else if (currentCount >= GMAIL_DAILY_SAFE_LIMIT) {
    console.warn(`[Email Failover] Gmail daily limit reached (${currentCount}/${GMAIL_DAILY_SAFE_LIMIT}). Automatically routing to Resend...`);
  }

  // 2. Secondary: Fallback to Resend
  try {
    const result = await sendViaResend({ to, subject, html, text });
    console.log(`[Email] Successfully sent to ${to} via Secondary Provider (Resend)`);
    return { success: true, ...result, failoverTriggered: true };
  } catch (resendError) {
    console.error(`[Email Failover Fatal] Both Gmail SMTP and Resend dispatch failed!`, resendError);
    throw new Error(`Email dispatch failed across all providers: ${resendError.message}`);
  }
}

