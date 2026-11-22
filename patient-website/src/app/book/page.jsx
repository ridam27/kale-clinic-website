'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  Video,
  ArrowRight,
  ShieldCheck,
  Star,
  MessageSquare,
  Sparkles,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';

export default function BookConsultationPage() {
  const formId = useId();

  // Available Time Slots (Active Hours: 9:00 AM – 12:00 PM IST)
  const availableSlots = [
    '09:00 AM – 09:30 AM',
    '09:30 AM – 10:00 AM',
    '10:00 AM – 10:30 AM',
    '10:30 AM – 11:00 AM',
    '11:00 AM – 11:30 AM',
    '11:30 AM – 12:00 PM',
  ];

  // Quick Date Generation (Today + next 5 days excluding Sundays)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    let count = 0;
    let offset = 0;

    while (count < 6 && offset < 14) {
      const d = new Date(today);
      d.setDate(today.getDate() + offset);
      // Skip Sunday (0)
      if (d.getDay() !== 0) {
        dates.push({
          fullDate: d.toISOString().split('T')[0],
          dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
          dayNum: d.getDate(),
          monthName: d.toLocaleDateString('en-US', { month: 'short' }),
        });
        count++;
      }
      offset++;
    }
    return dates;
  };

  const availableDates = generateAvailableDates();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'Female',
    email: '',
    phone: '',
    date: availableDates[0]?.fullDate || '',
    slot: availableSlots[0],
    healthConcern: '',
    medicalHistory: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  // Field Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Form Validation & Submit
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }
    if (!formData.age || isNaN(formData.age) || Number(formData.age) < 1 || Number(formData.age) > 120) {
      errors.age = 'Please enter a valid age (1-120)';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone / WhatsApp Number is required';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Please enter a valid 10-digit number';
    }
    if (!formData.healthConcern.trim()) {
      errors.healthConcern = 'Please briefly describe your primary health concern';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    // Simulate booking confirmation feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingConfirmation({
        ...formData,
        appointmentId: `KC-${Math.floor(100000 + Math.random() * 900000)}`,
        bookedAt: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      });
      setIsBooked(true);
    }, 700);
  };

  // 3 Steps (Matching Homepage Structure)
  const steps = [
    {
      number: '01',
      title: 'Book Your Appointment',
      desc: 'Select your preferred consultation date, choose a time slot, and submit your appointment details online.',
      icon: Calendar,
    },
    {
      number: '02',
      title: 'Connect with Your Doctor',
      desc: 'Join the private video or teleconsultation call to discuss your health concerns and medical background in detail.',
      icon: Video,
    },
    {
      number: '03',
      title: 'Receive Personalized Guidance',
      desc: 'Receive tailored constitutional recommendations, clear dosage instructions, and ongoing follow-up care.',
      icon: CheckCircle2,
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Sunita Deshmukh',
      location: 'Pune, Maharashtra',
      rating: 5,
      quote:
        'Booking the appointment online was effortless. Dr. Kale listened patiently to all my chronic allergy complaints and explained the homeopathic plan with complete clarity.',
    },
    {
      name: 'Amit Verma',
      location: 'Bengaluru, Karnataka',
      rating: 5,
      quote:
        'I appreciated the individual care and punctual video consultation. No travel required, and the follow-up guidance was easy to follow.',
    },
    {
      name: 'Pooja Sharma',
      location: 'New Delhi',
      rating: 5,
      quote:
        'A very professional and patient-friendly experience. The intake form allowed me to summarize my symptoms beforehand so the doctor was fully prepared.',
    },
  ];

  return (
    <div className="bg-canvas min-h-screen transition-colors duration-200">
      {/* ============================================================ */}
      {/* 1. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section className="relative pt-16 pb-14 md:pt-24 md:pb-20 overflow-hidden bg-gradient-to-b from-canvas via-canvas-subtle to-canvas">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 md:space-y-8">
          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-extrabold text-txt-heading tracking-tight leading-[1.15] md:leading-[1.12]">
            Schedule Your{' '}
            <span className="text-accent font-serif font-normal italic">
              Online Consultation.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-txt-body leading-relaxed max-w-3xl mx-auto">
            Connect directly with qualified homeopathic practitioners from the comfort of your home. Select your preferred date, choose a convenient time slot, and share your health details for a personalized consultation.
          </p>

          {/* Quick Trust Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto pt-2 text-left">
            <div className="p-3.5 rounded-2xl bg-card border border-card-border flex items-center space-x-3">
              <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
              <span className="text-xs font-semibold text-txt-heading leading-tight">
                Verified Practitioners
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-card border border-card-border flex items-center space-x-3">
              <Clock className="w-5 h-5 text-accent shrink-0" />
              <span className="text-xs font-semibold text-txt-heading leading-tight">
                Mon – Sat (9 AM – 12 PM)
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-card border border-card-border flex items-center space-x-3">
              <Video className="w-5 h-5 text-accent shrink-0" />
              <span className="text-xs font-semibold text-txt-heading leading-tight">
                Secure Video & Audio
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-card border border-card-border flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
              <span className="text-xs font-semibold text-txt-heading leading-tight">
                Individual Attention
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. CONSULTATION FORM                                         */}
      {/* ============================================================ */}
      <section id="booking-form" className="py-14 md:py-24 bg-canvas-subtle border-t border-borderline scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14 space-y-2 md:space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-txt-heading tracking-tight">
              Book Your Consultation Slot
            </h2>
            <p className="text-sm sm:text-base text-txt-muted max-w-xl mx-auto">
              Please choose a date and time slot, then provide the patient details below.
            </p>
          </div>

          {/* Form Container with High-Contrast Elevated Shadow */}
          <div className="rounded-3xl bg-card border border-card-border shadow-xl md:shadow-2xl shadow-slate-200/80 dark:shadow-black/70 p-6 sm:p-10 transition-all">
            {isBooked && bookingConfirmation ? (
              /* Success / Confirmation Card */
              <div className="py-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2 max-w-lg mx-auto">
                  <h3 className="text-2xl font-bold text-txt-heading">
                    Appointment Successfully Requested!
                  </h3>
                  <p className="text-sm text-txt-body leading-relaxed">
                    Thank you, <strong className="text-txt-heading">{bookingConfirmation.fullName}</strong>. Your consultation details have been recorded. A confirmation message with the video link has been prepared.
                  </p>
                </div>

                {/* Booking Summary Box */}
                <div className="max-w-md mx-auto p-5 rounded-2xl bg-canvas-subtle border border-borderline text-left space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-borderline/60">
                    <span className="text-txt-muted">Booking Reference:</span>
                    <span className="font-mono font-bold text-accent">
                      {bookingConfirmation.appointmentId}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-txt-muted">Scheduled Date:</span>
                    <span className="font-semibold text-txt-heading">
                      {bookingConfirmation.date}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-txt-muted">Time Slot:</span>
                    <span className="font-semibold text-txt-heading">
                      {bookingConfirmation.slot} IST
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-txt-muted">Consultation Mode:</span>
                    <span className="font-semibold text-txt-heading">
                      Online Video / Teleconsultation
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-borderline/60">
                    <span className="text-txt-muted">Consultation Fee:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ₹150 INR (Payable on call)
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsBooked(false);
                      setBookingConfirmation(null);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-accent-soft text-accent font-semibold text-xs hover:bg-accent hover:text-canvas transition-colors"
                  >
                    Book Another Slot
                  </button>

                  <Link
                    href="/"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-btn-secondary-bg hover:bg-btn-secondary-hover border border-btn-secondary-border text-btn-secondary-text font-semibold text-xs transition-colors"
                  >
                    Return to Home
                  </Link>
                </div>
              </div>
            ) : (
              /* Active Booking Intake Form */
              <form onSubmit={handleBookingSubmit} noValidate className="space-y-8">
                {/* 1. Date Selection Rail */}
                <div className="space-y-3 text-left">
                  <label className="block text-xs font-bold uppercase tracking-wider text-txt-heading">
                    1. Select Consultation Date *
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                    {availableDates.map((item) => {
                      const isSelected = formData.date === item.fullDate;
                      return (
                        <button
                          key={item.fullDate}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, date: item.fullDate }))
                          }
                          className={`p-3 rounded-2xl border text-center transition-all duration-200 ${
                            isSelected
                              ? 'bg-btn-primary-bg text-btn-primary-text border-btn-primary-bg shadow-md scale-102 font-bold'
                              : 'bg-canvas border-borderline hover:border-accent hover:text-accent text-txt-body'
                          }`}
                        >
                          <span className="block text-[11px] uppercase tracking-wide opacity-80">
                            {item.dayName}
                          </span>
                          <span className="block text-lg font-extrabold my-0.5">
                            {item.dayNum}
                          </span>
                          <span className="block text-[10px] opacity-80">
                            {item.monthName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Slot Selection Rail */}
                <div className="space-y-3 text-left">
                  <label className="block text-xs font-bold uppercase tracking-wider text-txt-heading">
                    2. Select Time Slot (Morning IST) *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {availableSlots.map((slot) => {
                      const isSelected = formData.slot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, slot }))
                          }
                          className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                            isSelected
                              ? 'bg-accent text-btn-primary-text border-accent shadow-sm'
                              : 'bg-canvas border-borderline hover:border-accent hover:text-accent text-txt-body'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Patient Information */}
                <div className="space-y-5 text-left pt-2 border-t border-borderline">
                  <label className="block text-xs font-bold uppercase tracking-wider text-txt-heading">
                    3. Patient Details *
                  </label>

                  {/* Full Name & Age */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label
                        htmlFor={`${formId}-fullName`}
                        className="block text-xs font-semibold text-txt-heading"
                      >
                        Patient's Full Name *
                      </label>
                      <input
                        type="text"
                        id={`${formId}-fullName`}
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Sharma"
                        className={`w-full px-4 py-3 rounded-2xl bg-canvas border text-sm text-txt-heading placeholder:text-txt-faint focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all ${
                          formErrors.fullName ? 'border-alert-text' : 'border-borderline'
                        }`}
                      />
                      {formErrors.fullName && (
                        <p className="text-[11px] text-alert-text font-medium">
                          {formErrors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor={`${formId}-age`}
                        className="block text-xs font-semibold text-txt-heading"
                      >
                        Age *
                      </label>
                      <input
                        type="number"
                        id={`${formId}-age`}
                        name="age"
                        min="1"
                        max="120"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="e.g. 34"
                        className={`w-full px-4 py-3 rounded-2xl bg-canvas border text-sm text-txt-heading placeholder:text-txt-faint focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all ${
                          formErrors.age ? 'border-alert-text' : 'border-borderline'
                        }`}
                      />
                      {formErrors.age && (
                        <p className="text-[11px] text-alert-text font-medium">
                          {formErrors.age}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Gender & Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor={`${formId}-gender`}
                        className="block text-xs font-semibold text-txt-heading"
                      >
                        Gender
                      </label>
                      <select
                        id={`${formId}-gender`}
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-2xl bg-canvas border border-borderline text-sm text-txt-heading focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other / Prefer not to say</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor={`${formId}-phone`}
                        className="block text-xs font-semibold text-txt-heading"
                      >
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        id={`${formId}-phone`}
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={`w-full px-4 py-3 rounded-2xl bg-canvas border text-sm text-txt-heading placeholder:text-txt-faint focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all ${
                          formErrors.phone ? 'border-alert-text' : 'border-borderline'
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-[11px] text-alert-text font-medium">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor={`${formId}-email`}
                        className="block text-xs font-semibold text-txt-heading"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id={`${formId}-email`}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="patient@example.com"
                        className={`w-full px-4 py-3 rounded-2xl bg-canvas border text-sm text-txt-heading placeholder:text-txt-faint focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all ${
                          formErrors.email ? 'border-alert-text' : 'border-borderline'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-[11px] text-alert-text font-medium">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Primary Health Concern */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor={`${formId}-healthConcern`}
                      className="block text-xs font-semibold text-txt-heading"
                    >
                      Primary Health Concern & Symptoms *
                    </label>
                    <textarea
                      id={`${formId}-healthConcern`}
                      name="healthConcern"
                      rows={3}
                      value={formData.healthConcern}
                      onChange={handleChange}
                      placeholder="Please briefly describe your main health concern, symptom duration, or reasons for seeking care..."
                      className={`w-full px-4 py-3 rounded-2xl bg-canvas border text-sm text-txt-heading placeholder:text-txt-faint focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all resize-y ${
                        formErrors.healthConcern ? 'border-alert-text' : 'border-borderline'
                      }`}
                    ></textarea>
                    {formErrors.healthConcern && (
                      <p className="text-[11px] text-alert-text font-medium">
                        {formErrors.healthConcern}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto relative inline-flex items-center justify-center px-10 py-4 rounded-full bg-btn-primary-bg hover:bg-btn-primary-hover text-btn-primary-text font-bold text-sm shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 group overflow-hidden"
                  >
                    <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {isSubmitting ? 'Confirming Slot...' : 'Confirm Consultation Booking'}
                    </span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Underneath Query Callout (As explicitly requested by user) */}
          <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-card border border-card-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-txt-heading">
                  Have a query or need booking assistance?
                </p>
                <p className="text-[11px] sm:text-xs text-txt-muted">
                  Our care support team is here to guide you through the process.
                </p>
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-accent-soft hover:bg-accent text-accent hover:text-canvas text-xs font-semibold transition-all shrink-0"
            >
              <span>Contact Support</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. HOW IT WORKS (3 Simple Steps like Homepage)               */}
      {/* ============================================================ */}
      <section className="py-16 md:py-24 bg-canvas border-t border-borderline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14 space-y-2 md:space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-txt-heading tracking-tight">
              Your Consultation in 3 Simple Steps
            </h2>
            <p className="text-sm sm:text-base text-txt-body">
              Connecting with a homeopathic practitioner is easy, secure, and stress-free.
            </p>
            <p className="block md:hidden text-[11px] text-accent font-semibold pt-1">
              Swipe across to view steps →
            </p>
          </div>

          {/* Mobile Snap Carousel / Desktop 3-Column Grid */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-4 px-4 pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:mx-0 md:px-0 md:pb-0 no-scrollbar">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="w-[82vw] sm:w-[320px] shrink-0 snap-center md:w-auto md:shrink relative p-6 sm:p-8 rounded-3xl bg-card border border-card-border hover:border-card-border-hover hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <span className="text-2xl font-black text-accent/30 font-serif">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-accent-soft text-accent flex items-center justify-center group-hover:scale-110 group-hover:bg-accent group-hover:text-canvas transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-txt-heading mb-2 group-hover:text-accent transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-txt-muted leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. TESTIMONIALS & DUAL CTAS (Book Consultation, Contact)     */}
      {/* ============================================================ */}
      <section className="py-16 md:py-24 bg-canvas-subtle border-t border-borderline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14 space-y-2 md:space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-txt-heading tracking-tight">
              What Our Patients Say
            </h2>
            <p className="text-sm sm:text-base text-txt-body">
              Hear about the experiences of patients who have connected with our homeopathic practitioners.
            </p>
            <p className="block md:hidden text-[11px] text-accent font-semibold pt-1">
              Swipe across patient reviews →
            </p>
          </div>

          {/* Mobile Snap Carousel / Desktop 3-Column Grid */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-4 px-4 pb-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:mx-0 md:px-0 md:pb-0 no-scrollbar mb-14">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="w-[82vw] sm:w-[340px] shrink-0 snap-center md:w-auto md:shrink p-6 sm:p-8 rounded-3xl bg-card border border-card-border hover:border-card-border-hover hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-txt-body text-sm leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-6 border-t border-borderline mt-6 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-accent-soft text-accent font-bold text-xs flex items-center justify-center">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-txt-heading">{t.name}</h4>
                    <p className="text-[11px] text-txt-faint">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DUAL CTA BANNER (Book Consultation & Contact) */}
          <div className="relative rounded-3xl bg-gradient-to-br from-[var(--banner-from)] to-[var(--banner-to)] text-white p-8 sm:p-14 overflow-hidden shadow-xl text-center space-y-6 border border-borderline">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--banner-glow)] rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white !text-white">
                Ready to Prioritize Your Well-Being?
              </h3>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl mx-auto">
                Schedule your consultation slot today or get in touch with our team for any inquiries or booking guidance.
              </p>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#booking-form"
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-white hover:bg-accent-soft text-btn-primary-bg font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>

                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
