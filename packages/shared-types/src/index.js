/**
 * @kale/shared-types
 * Core domain constants, enums, and helpers shared across the platform (Pure JavaScript)
 */

export const ThemeMode = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
});

export const UserRole = Object.freeze({
  DOCTOR: 'DOCTOR',
  ADMIN: 'ADMIN',
  PATIENT: 'PATIENT',
});

export const Gender = Object.freeze({
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
  PREFER_NOT_TO_SAY: 'PREFER_NOT_TO_SAY',
});

export const AppointmentStatus = Object.freeze({
  HELD: 'HELD',
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  RESCHEDULED: 'RESCHEDULED',
  NO_SHOW: 'NO_SHOW',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  EXPIRED: 'EXPIRED',
});

export const PaymentStatus = Object.freeze({
  PENDING: 'PENDING',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
});

export const ConsultationStatus = Object.freeze({
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
});

export const MealTiming = Object.freeze({
  BEFORE_FOOD: 'BEFORE_FOOD',
  AFTER_FOOD: 'AFTER_FOOD',
  WITH_FOOD: 'WITH_FOOD',
  EMPTY_STOMACH: 'EMPTY_STOMACH',
  BEDTIME: 'BEDTIME',
  CUSTOM: 'CUSTOM',
});

export const PrescriptionStatus = Object.freeze({
  DRAFT: 'DRAFT',
  FINALIZED: 'FINALIZED',
});

export const EmailProvider = Object.freeze({
  GMAIL: 'gmail',
  RESEND: 'resend',
  FAILOVER: 'failover',
});

export const CLINIC_CONFIG = Object.freeze({
  DOCTOR_NAME: 'Dr. Kale',
  CLINIC_NAME: 'Kale Homeopathy Clinic',
  DEFAULT_TIMEZONE: 'Asia/Kolkata',
  DEFAULT_CONSULTATION_FEE_INR: 150,
  SLOT_DURATION_MINUTES: 30,
  HOLD_DURATION_MINUTES: 10,
  START_HOUR_IST: 9,
  END_HOUR_IST: 12,
});

