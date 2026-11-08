import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '@kale/database';
import { uploadPrescriptionPdf, getPrescriptionSignedUrl } from './services/storageService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.DOCTOR_API_PORT || 4001;

app.use(cors());
app.use(express.json());

// Health Check & Shared Database verification
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'healthy',
      service: 'doctor-panel-backend',
      database: 'connected (Shared PostgreSQL)',
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

// Fee Management: Get current consultation fees
app.get('/api/fees', async (req, res) => {
  try {
    const feeRules = await prisma.consultationFeeRule.findMany({
      orderBy: { countryCode: 'asc' },
    });
    res.json({ success: true, feeRules });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fee Management: Update consultation fees
app.post('/api/fees', async (req, res) => {
  const { countryCode, currency, initialFeeMinorUnits, followUpFeeMinorUnits } = req.body;
  try {
    const updated = await prisma.consultationFeeRule.upsert({
      where: { countryCode: countryCode || 'IN' },
      update: {
        currency: currency || 'INR',
        initialFeeMinorUnits: Number(initialFeeMinorUnits),
        followUpFeeMinorUnits: Number(followUpFeeMinorUnits),
      },
      create: {
        countryCode: countryCode || 'IN',
        currency: currency || 'INR',
        initialFeeMinorUnits: Number(initialFeeMinorUnits) || 15000,
        followUpFeeMinorUnits: Number(followUpFeeMinorUnits) || 15000,
      },
    });
    res.json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Patient Database: Search & fetch patients
app.get('/api/patients', async (req, res) => {
  const { search } = req.query;
  try {
    const patients = await prisma.patient.findMany({
      where: search
        ? {
            OR: [
              { fullName: { contains: String(search), mode: 'insensitive' } },
              { email: { contains: String(search), mode: 'insensitive' } },
              { phone: { contains: String(search) } },
            ],
          }
        : undefined,
      include: {
        appointments: {
          orderBy: { slotStartUtc: 'desc' },
          take: 5,
        },
        prescriptions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ success: true, patients });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Dynamic Video Link Dispatch for an appointment
app.post('/api/appointments/:id/generate-video-link', async (req, res) => {
  const { id } = req.params;
  const videoServiceUrl = process.env.VIDEO_API_URL || 'http://localhost:4002';

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { patient: true, doctor: true },
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Call independent video platform link generation API
    const response = await fetch(`${videoServiceUrl}/api/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appointmentId: appointment.id,
        doctorName: appointment.doctor.fullName,
        patientName: appointment.patient.fullName,
        slotStartUtc: appointment.slotStartUtc,
        slotEndUtc: appointment.slotEndUtc,
      }),
    });

    if (!response.ok) {
      throw new Error(`Video platform response status: ${response.status}`);
    }

    const data = await response.json();

    // Store session reference in shared PostgreSQL DB
    const session = await prisma.videoSession.upsert({
      where: { appointmentId: appointment.id },
      update: {
        roomId: data.roomId,
        doctorUrl: data.doctorMeetingUrl,
        patientUrl: data.patientMeetingUrl,
      },
      create: {
        appointmentId: appointment.id,
        roomId: data.roomId,
        doctorUrl: data.doctorMeetingUrl,
        patientUrl: data.patientMeetingUrl,
      },
    });

    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Doctor Backend API] Running on port ${PORT}`);
});

