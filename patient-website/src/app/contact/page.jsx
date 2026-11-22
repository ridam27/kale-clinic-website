'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  ChevronDown,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Facebook,
  Instagram,
  Linkedin,
  MessageSquare,
} from 'lucide-react';

export default function ContactPage() {
  // Contact Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ Accordion State (only one open at a time, null by default)
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Form Handling & Validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone Number is required';
    }
    if (!formData.message.trim()) {
      errors.message = 'Please enter your message';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    // Simulate fast submission feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
      });
    }, 600);
  };

  // 4 Contact Information Channels
  const contactChannels = [
    {
      title: 'Phone Number',
      detail: '+91 91586 51044',
      action: 'tel:+919158651044',
      actionLabel: 'Call Our Team',
      icon: Phone,
    },
    {
      title: 'Email Address',
      detail: 'kaleclinic1@gmail.com',
      action: 'mailto:kaleclinic1@gmail.com',
      actionLabel: 'Send an Email',
      icon: Mail,
    },
    {
      title: 'Office Address',
      detail: 'Kale Practice, India & Global Teleconsultations',
      action: null,
      actionLabel: 'Virtual Practice',
      icon: MapPin,
    },
    {
      title: 'Working Hours',
      detail: 'Mon – Sat, 9:00 AM – 6:00 PM IST',
      action: null,
      actionLabel: 'Support Available',
      icon: Clock,
    },
  ];

  // 8 FAQs as specified
  const faqList = [
    {
      q: 'How can I book an online consultation?',
      a: 'You can book an appointment by visiting our Book Consultation page, selecting an available practitioner and suitable time slot, and completing the booking process.',
    },
    {
      q: 'How will I receive my consultation details?',
      a: 'Once your appointment is successfully booked, you will receive the consultation confirmation and relevant details through your registered contact information.',
    },
    {
      q: 'Can I reschedule or cancel my appointment?',
      a: 'Yes, appointment rescheduling and cancellation may be available according to our appointment and cancellation policies. Please contact our support team for assistance.',
    },
    {
      q: 'How can I make a payment for my consultation?',
      a: 'You can complete your consultation payment through the payment options available on our website during the booking process.',
    },
    {
      q: 'What should I do if I face technical issues during my consultation?',
      a: 'If you experience technical difficulties, contact our support team through phone or email. We will guide you on the next steps.',
    },
    {
      q: 'Is my personal information kept confidential?',
      a: 'We respect your privacy and handle personal information according to our Privacy Policy and applicable data protection requirements.',
    },
    {
      q: 'How can I contact a practitioner after my consultation?',
      a: 'For follow-up consultations or further communication, please refer to the consultation arrangements provided by your practitioner.',
    },
    {
      q: 'How long will it take to receive a response from the support team?',
      a: 'Our team aims to respond to inquiries as soon as possible during working hours. Response times may vary depending on the nature of your query.',
    },
  ];

  // Social Media Links with Unique Platform Accent Hovers
  const socialPlatforms = [
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      icon: Facebook,
      handle: 'KaleClinicOfficial',
      hoverStyle:
        'hover:text-social-fb hover:border-social-fb/40 hover:bg-social-fb/5 hover:-translate-y-1.5 hover:rotate-2',
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      icon: Instagram,
      handle: '@kaleclinic',
      hoverStyle:
        'hover:text-social-ig hover:border-social-ig/40 hover:bg-social-ig/5 hover:-translate-y-1.5 hover:-rotate-2',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: Linkedin,
      handle: 'Kale Clinic Homeopathy',
      hoverStyle:
        'hover:text-social-li hover:border-social-li/40 hover:bg-social-li/5 hover:-translate-y-1.5 hover:rotate-2',
    },
  ];

  return (
    <div className="bg-canvas min-h-screen transition-colors duration-200">
      {/* ============================================================ */}
      {/* 1. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section className="relative pt-12 pb-14 md:pt-24 md:pb-28 overflow-hidden bg-gradient-to-b from-canvas via-canvas-subtle to-canvas">
        {/* Mobile Background Ambient Glow (Zero effect on desktop) */}
        <div className="md:hidden absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-accent/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 md:space-y-8">
          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-extrabold text-txt-heading tracking-tight leading-[1.15] md:leading-[1.12]">
            We're Here to{' '}
            <span className="text-accent font-serif font-normal italic">Help You.</span>
          </h1>

          <p className="text-sm sm:text-xl text-txt-body leading-relaxed max-w-3xl mx-auto">
            Have questions about our online consultation services, appointment booking, or need assistance? Get in touch with us. Our support team is here to help you with your queries and guide you through the consultation process.
          </p>

          {/* MOBILE ONLY: Engaging Interactive Care & Quick-Action Hub */}
          <div className="block md:hidden pt-1">
            <div className="p-4 rounded-3xl bg-card/95 border border-card-border shadow-lg shadow-slate-200/50 dark:shadow-black/40 text-left space-y-3.5 backdrop-blur-sm">
              {/* Header Status Bar */}
              <div className="flex items-center justify-between pb-2.5 border-b border-borderline">
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-txt-heading">
                    Support Desk Online
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-accent bg-accent-soft px-2.5 py-0.5 rounded-full">
                  Mon – Sat (9 AM – 6 PM)
                </span>
              </div>

              {/* 3 Quick Tap Action Tiles */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href="tel:+919158651044"
                  className="p-2.5 rounded-2xl bg-canvas border border-borderline hover:border-accent active:scale-95 transition-all text-center flex flex-col items-center justify-center space-y-1 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-accent-soft text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-canvas transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-txt-heading block leading-tight">
                    Quick Call
                  </span>
                  <span className="text-[9px] text-txt-muted block leading-tight">
                    Direct Line
                  </span>
                </a>

                <a
                  href="#contact-form"
                  className="p-2.5 rounded-2xl bg-canvas border border-borderline hover:border-accent active:scale-95 transition-all text-center flex flex-col items-center justify-center space-y-1 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-accent-soft text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-canvas transition-colors">
                    <Send className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-txt-heading block leading-tight">
                    Message
                  </span>
                  <span className="text-[9px] text-txt-muted block leading-tight">
                    Write Form
                  </span>
                </a>

                <Link
                  href="/book"
                  className="p-2.5 rounded-2xl bg-canvas border border-borderline hover:border-accent active:scale-95 transition-all text-center flex flex-col items-center justify-center space-y-1 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-accent-soft text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-canvas transition-colors">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-txt-heading block leading-tight">
                    Book Slot
                  </span>
                  <span className="text-[9px] text-txt-muted block leading-tight">
                    Online Care
                  </span>
                </Link>
              </div>

              {/* Bottom Reassurance Strip */}
              <div className="pt-1 flex items-center justify-between text-[10px] text-txt-muted px-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-accent" />
                  100% Confidential
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Prompt Response
                </span>
              </div>
            </div>
          </div>

          {/* CTA Buttons (Desktop layout remains 100% identical) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <a
              href="#contact-form"
              className="w-full sm:w-auto relative inline-flex items-center justify-center px-8 py-3.5 sm:py-4 text-sm font-semibold text-btn-primary-text bg-btn-primary-bg hover:bg-btn-primary-hover rounded-full overflow-hidden shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group"
            >
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
              <MessageSquare className="w-4 h-4 mr-2" />
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>

            <Link
              href="/book"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 sm:py-4 text-sm font-semibold text-btn-secondary-text bg-btn-secondary-bg hover:bg-btn-secondary-hover border border-btn-secondary-border rounded-full hover:border-accent hover:text-accent transition-all duration-200 shadow-sm"
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span>Book a Consultation</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. GET IN TOUCH (4 Elegant Contact Cards)                    */}
      {/* ============================================================ */}
      <section className="py-16 md:py-24 bg-canvas-subtle border-y border-borderline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 space-y-2 md:space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-txt-heading tracking-tight">
              We'd Love to Hear From You
            </h2>
            <p className="text-sm sm:text-base text-txt-body leading-relaxed">
              Whether you have questions about our services, need help booking an appointment, or require assistance with an existing consultation, we're happy to help. Reach out to us through any of the following channels, and our team will get back to you.
            </p>
          </div>

          {/* 4 Cards: Compact 2x2 grid on mobile, 4-col on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {contactChannels.map((item, idx) => {
              const Icon = item.icon;
              const CardContent = (
                <div className="p-4 sm:p-6 rounded-3xl bg-card border border-card-border hover:border-card-border-hover hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-accent-soft text-accent flex items-center justify-center group-hover:scale-110 group-hover:bg-accent group-hover:text-canvas transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-txt-heading mb-1">
                        {item.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-txt-body font-medium leading-relaxed break-words">
                        {item.detail}
                      </p>
                    </div>
                  </div>

                  {item.action && (
                    <span className="text-[11px] font-semibold text-accent mt-3 inline-flex items-center group-hover:translate-x-0.5 transition-transform">
                      {item.actionLabel} →
                    </span>
                  )}
                </div>
              );

              return item.action ? (
                <a
                  key={idx}
                  href={item.action}
                  className="block h-full transition-transform active:scale-98"
                >
                  {CardContent}
                </a>
              ) : (
                <div key={idx} className="h-full">
                  {CardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. CONTACT FORM                                              */}
      {/* ============================================================ */}
      <section id="contact-form" className="py-16 md:py-28 bg-canvas scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14 space-y-2 md:space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-txt-heading tracking-tight">
              Send Us a Message
            </h2>
            <p className="text-sm sm:text-base text-txt-muted max-w-xl mx-auto">
              Fill out the form below, and our support team will get in touch with you as soon as possible.
            </p>
          </div>

          <div className="p-6 sm:p-10 rounded-3xl bg-card border border-card-border shadow-xl md:shadow-2xl shadow-slate-200/80 dark:shadow-black/70">
            {isSubmitted ? (
              <div className="py-10 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-txt-heading">
                  Thank You for Contacting Us!
                </h3>
                <p className="text-sm text-txt-body max-w-md mx-auto leading-relaxed">
                  We have received your message, and our support team will get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-full bg-accent-soft text-accent font-semibold text-xs hover:bg-accent hover:text-canvas transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-semibold text-txt-heading"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Ramesh Sharma"
                      className={`w-full px-4 py-3 rounded-2xl bg-canvas border text-sm text-txt-heading placeholder:text-txt-faint focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all ${
                        formErrors.fullName
                          ? 'border-alert-text'
                          : 'border-borderline'
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="text-[11px] text-alert-text font-medium">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold text-txt-heading"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className={`w-full px-4 py-3 rounded-2xl bg-canvas border text-sm text-txt-heading placeholder:text-txt-faint focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all ${
                        formErrors.email
                          ? 'border-alert-text'
                          : 'border-borderline'
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-[11px] text-alert-text font-medium">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone Number */}
                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="phone"
                      className="block text-xs font-semibold text-txt-heading"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      className={`w-full px-4 py-3 rounded-2xl bg-canvas border text-sm text-txt-heading placeholder:text-txt-faint focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all ${
                        formErrors.phone
                          ? 'border-alert-text'
                          : 'border-borderline'
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-[11px] text-alert-text font-medium">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="subject"
                      className="block text-xs font-semibold text-txt-heading"
                    >
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl bg-canvas border border-borderline text-sm text-txt-heading focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Appointment Booking Assistance">
                        Appointment Booking Assistance
                      </option>
                      <option value="Consultation-Related Query">
                        Consultation-Related Query
                      </option>
                      <option value="Payment & Refund Query">
                        Payment & Refund Query
                      </option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5 text-left">
                  <label
                    htmlFor="message"
                    className="block text-xs font-semibold text-txt-heading"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please tell us how we can assist you..."
                    className={`w-full px-4 py-3 rounded-2xl bg-canvas border text-sm text-txt-heading placeholder:text-txt-faint focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all resize-y ${
                      formErrors.message
                        ? 'border-alert-text'
                        : 'border-borderline'
                    }`}
                  ></textarea>
                  {formErrors.message && (
                    <p className="text-[11px] text-alert-text font-medium">
                      {formErrors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2 text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto relative inline-flex items-center justify-center px-9 py-3.5 rounded-full bg-btn-primary-bg hover:bg-btn-primary-hover text-btn-primary-text font-bold text-sm shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 group overflow-hidden"
                  >
                    <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                    <Send className="w-4 h-4 mr-2" />
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. FREQUENTLY ASKED QUESTIONS (Accordion: 1 open at a time) */}
      {/* ============================================================ */}
      <section className="py-16 md:py-28 bg-canvas-subtle border-t border-borderline">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14 space-y-2 md:space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-txt-heading tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-txt-muted max-w-xl mx-auto">
              Find answers to some common questions about our platform and consultation services.
            </p>
          </div>

          {/* Accordion Stack */}
          <div className="space-y-3">
            {faqList.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl sm:rounded-3xl bg-card border border-card-border overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-card-subtle transition-colors focus:outline-none"
                  >
                    <span className="text-sm sm:text-base font-bold text-txt-heading leading-snug">
                      {faq.q}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full bg-accent-soft text-accent flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 ring-2 ring-accent/30' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Expandable Answer */}
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-txt-body leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="pt-2 border-t border-borderline/60">
                        {faq.a}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. FIND US ON SOCIAL MEDIA (Interactive Distinct Hovers)    */}
      {/* ============================================================ */}
      <section className="py-16 md:py-24 bg-canvas border-t border-borderline">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="space-y-2 md:space-y-3 mb-8">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-txt-heading tracking-tight">
              Find Us on Social Media
            </h2>
            <p className="text-sm sm:text-base text-txt-muted max-w-xl mx-auto">
              Stay connected with us! Follow our social media pages for updates, healthcare information, consultation announcements, and more.
            </p>
          </div>

          {/* Social Platforms Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2">
            {socialPlatforms.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow Kale Clinic on ${social.name}`}
                  className={`flex items-center space-x-3 px-6 py-4 rounded-2xl bg-card border border-card-border text-txt-body transition-all duration-300 shadow-sm ${social.hoverStyle}`}
                >
                  <Icon className="w-5 h-5 shrink-0 transition-transform duration-300" />
                  <div className="text-left">
                    <span className="block text-xs font-bold text-txt-heading leading-tight">
                      {social.name}
                    </span>
                    <span className="block text-[11px] text-txt-faint">
                      {social.handle}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. FINAL CALL TO ACTION                                      */}
      {/* ============================================================ */}
      <section className="py-16 md:py-24 bg-canvas border-t border-borderline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-[var(--banner-from)] to-[var(--banner-to)] text-white p-8 sm:p-14 lg:p-16 overflow-hidden shadow-xl text-center space-y-6 border border-borderline">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--banner-glow)] rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white !text-white">
                Need Assistance? We're Just a Message Away!
              </h2>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl mx-auto">
                We're committed to making your online consultation experience smooth and convenient. Whether you have a question, need booking assistance, or require support, don't hesitate to reach out to us.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#contact-form"
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-white hover:bg-accent-soft text-btn-primary-bg font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Contact Support</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>

                <Link
                  href="/book"
                  className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
