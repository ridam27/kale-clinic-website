import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '@kale/database';
import { sendEmailWithFailover } from './services/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PATIENT_API_PORT || 4000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    // Verify database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'healthy',
      service: 'patient-website-backend',
      database: 'connected (PostgreSQL)',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
    });
  }
});

// Test Email Failover Endpoint
app.post('/api/test-email', async (req, res) => {
  const { to } = req.body;
  if (!to) {
    return res.status(400).json({ error: 'Recipient "to" email is required' });
  }

  try {
    const result = await sendEmailWithFailover({
      to,
      subject: 'Dr. Kale Clinic - Test Notification',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1F2D2A;">
          <h2 style="color: #176B63;">Dr. Kale Homeopathy Clinic</h2>
          <p>This is a test notification confirming your email delivery service is operational.</p>
          <p><strong>Doctor working hours:</strong> 9:00 AM – 12:00 PM IST</p>
        </div>
      `,
    });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Patient Backend API] Running on port ${PORT}`);
});

