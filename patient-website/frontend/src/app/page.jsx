import React from 'react';
import { Calendar, ShieldCheck, Video, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export default function PatientHomePage() {
  return (
    <div className="space-y-16 py-12 px-4 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-border bg-surface text-xs text-primary font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Online Homeopathic Consultation</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-main max-w-3xl mx-auto">
          Personalized Homeopathic Care for Chronic & Acute Wellness
        </h1>

        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          Consult directly with Dr. Kale via a secure, unrecorded video session. Available for patients across India and approved international regions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="#book"
            className="w-full sm:w-auto px-6 py-3.5 rounded-control bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment (Guest Checkout)</span>
          </a>

          <a
            href="#portal"
            className="w-full sm:w-auto px-6 py-3.5 rounded-control border border-border bg-surface hover:border-primary text-text-main font-medium text-sm transition-all flex items-center justify-center space-x-2"
          >
            <span>Access Previous Records</span>
            <ArrowRight className="w-4 h-4 text-text-muted" />
          </a>
        </div>
      </section>

      {/* Trust & Key Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <div className="p-6 rounded-card border border-border bg-surface space-y-3">
          <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-primary">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="font-semibold text-base text-text-main">Doctor Schedule</h2>
          <p className="text-sm text-text-muted">
            Consultations available from <strong>9:00 AM – 12:00 PM IST</strong> (Asia/Kolkata). Timezone automatically converts to your local time.
          </p>
        </div>

        <div className="p-6 rounded-card border border-border bg-surface space-y-3">
          <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="font-semibold text-base text-text-main">Transparent Fee</h2>
          <p className="text-sm text-text-muted">
            Standard India consultation fee is <strong>₹150</strong>. Secure online checkout with instant confirmation.
          </p>
        </div>

        <div className="p-6 rounded-card border border-border bg-surface space-y-3">
          <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-primary">
            <Video className="w-5 h-5" />
          </div>
          <h2 className="font-semibold text-base text-text-main">Private Video Room</h2>
          <p className="text-sm text-text-muted">
            Independent, encrypted, unrecorded video consultations equipped with interactive whiteboard and doctor note-taking.
          </p>
        </div>
      </section>

      {/* Guest Booking Section Overview */}
      <section id="book" className="p-8 rounded-card border border-border bg-surface max-w-2xl mx-auto space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-text-main">Book Your Consultation</h2>
          <p className="text-sm text-text-muted">
            No password required. Book directly as a guest and receive your dynamic meeting link by email.
          </p>
        </div>

        <div className="p-4 rounded-control bg-background border border-border text-sm space-y-2">
          <div className="flex items-center space-x-2 text-text-main font-medium">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>Consultation Fee: ₹150 INR</span>
          </div>
          <p className="text-xs text-text-muted">
            Doctor availability: 9:00 AM – 12:00 PM IST. 30-minute consultation slots.
          </p>
        </div>

        <div className="pt-2 text-center">
          <button
            type="button"
            className="w-full py-3 rounded-control bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-colors shadow-sm"
          >
            Select Date & Time Slot
          </button>
        </div>
      </section>
    </div>
  );
}

