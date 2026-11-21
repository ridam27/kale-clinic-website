'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Video,
  Award,
  Activity,
  Heart,
  Droplet,
  Feather,
  Wind,
  Smile,
  Star,
} from 'lucide-react';

export default function HomePage() {
  const trustHighlights = [
    {
      title: 'Qualified Homeopathic Practitioners',
      desc: 'Certified practitioners with dedicated classical training.',
      icon: Award,
    },
    {
      title: 'Personalized Consultations',
      desc: 'Individualized care tailored to your complete health history.',
      icon: Heart,
    },
    {
      title: 'Convenient Online Appointments',
      desc: 'Book easily and consult from the comfort of your home.',
      icon: Clock,
    },
    {
      title: 'Confidential Patient Care',
      desc: 'Private, secure 1-on-1 consultations with trusted confidentiality.',
      icon: ShieldCheck,
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Book Your Appointment',
      desc: 'Choose a suitable consultation slot and schedule your appointment online.',
      icon: Calendar,
    },
    {
      number: '02',
      title: 'Connect with Your Doctor',
      desc: 'Discuss your health concerns and medical history with your homeopathic practitioner.',
      icon: Video,
    },
    {
      number: '03',
      title: 'Receive Personalized Guidance',
      desc: 'Get individualized professional guidance and follow-up recommendations where appropriate.',
      icon: CheckCircle2,
    },
  ];

  const services = [
    {
      title: 'Skin & Hair Concerns',
      desc: 'Eczema, chronic acne, hair thinning, hives, and recurring skin allergies.',
      icon: Feather,
    },
    {
      title: 'Digestive Health',
      desc: 'Acid reflux, IBS, constipation, chronic gastritis, and sluggish digestion.',
      icon: Activity,
    },
    {
      title: "Women's Health",
      desc: 'PCOS/PCOD support, hormonal balance, menstrual health, and migraine management.',
      icon: Heart,
    },
    {
      title: "Children's Health",
      desc: 'Gentle pediatric care for recurrent colds, immunity support, and allergies.',
      icon: Smile,
    },
    {
      title: 'Respiratory Health',
      desc: 'Allergic rhinitis, sinusitis, chronic cough, wheezing, and seasonal sensitivity.',
      icon: Wind,
    },
    {
      title: 'Joint & Musculoskeletal',
      desc: 'Joint discomfort, arthritis care, morning stiffness, and chronic muscle pain.',
      icon: Droplet,
    },
    {
      title: 'General Health & Wellness',
      desc: 'Chronic fatigue, sleep disturbances, lifestyle stress, and holistic vitality.',
      icon: Sparkles,
    },
  ];

  const testimonials = [
    {
      quote:
        'The online consultation process was simple and convenient. The doctor listened carefully to my concerns and explained everything clearly.',
      name: 'Anjali Deshmukh',
      location: 'Pune, Maharashtra',
      rating: 5,
    },
    {
      quote:
        'I appreciated the personal attention during my consultation. Booking an appointment was quick and the overall experience was comfortable.',
      name: 'Amit Verma',
      location: 'Bengaluru, Karnataka',
      rating: 5,
    },
    {
      quote:
        'The platform made it easy to connect with a homeopathic doctor from home. I had a smooth and professional consultation experience.',
      name: 'Neha Kulkarni',
      location: 'Mumbai, Maharashtra',
      rating: 5,
    },
  ];

  return (
    <div className="bg-canvas min-h-screen transition-colors duration-200">
      {/* ============================================================ */}
      {/* 1. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section className="relative pt-16 pb-16 md:pt-24 md:pb-28 overflow-hidden bg-gradient-to-b from-canvas via-canvas-subtle to-canvas">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 md:space-y-8">
          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-extrabold text-txt-heading tracking-tight leading-[1.15] md:leading-[1.12]">
            Personalized Homeopathic Care,{' '}
            <span className="text-accent font-serif font-normal italic">Just a Click Away.</span>
          </h1>

          <p className="text-base sm:text-xl text-txt-body leading-relaxed max-w-2xl mx-auto">
            Connect with qualified homeopathic practitioners online. Discuss your health concerns and receive personalized consultation from the comfort of your home.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <Link
              href="/book"
              className="w-full sm:w-auto relative inline-flex items-center justify-center px-8 py-3.5 sm:py-4 text-sm font-semibold text-btn-primary-text bg-btn-primary-bg hover:bg-btn-primary-hover rounded-full overflow-hidden shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group"
            >
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
              <Calendar className="w-4 h-4 mr-2" />
              <span>Book a Consultation</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 sm:py-4 text-sm font-semibold text-btn-secondary-text bg-btn-secondary-bg hover:bg-btn-secondary-hover border border-btn-secondary-border rounded-full hover:border-accent hover:text-accent transition-all duration-200 shadow-sm"
            >
              <span>Know More About Us</span>
            </Link>
          </div>

          {/* Daily Availability Note */}
          <div className="pt-1 flex items-center justify-center space-x-2 text-xs text-txt-muted font-medium">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span>Daily Online Consultations: Monday to Saturday (9:00 AM – 12:00 PM IST)</span>
          </div>

          {/* 4 Trust Highlights: Compact 2x2 grid on mobile, 4-col on desktop */}
          <div className="pt-8 md:pt-12 border-t border-borderline">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-left">
              {trustHighlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="group p-3.5 sm:p-5 rounded-2xl bg-card border border-card-border hover:border-card-border-hover hover:bg-card-hover transition-all duration-300 hover:shadow-sm"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-2.5 sm:mb-3 group-hover:scale-110 group-hover:bg-accent group-hover:text-canvas transition-all duration-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h2 className="text-xs sm:text-sm font-bold text-txt-heading mb-1 group-hover:text-accent transition-colors leading-snug">
                      {item.title}
                    </h2>
                    <p className="text-[11px] sm:text-xs text-txt-muted leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. HOW IT WORKS                                              */}
      {/* ============================================================ */}
      <section className="py-16 md:py-28 bg-canvas-subtle border-y border-borderline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 space-y-2 md:space-y-3">
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
      {/* 3. OUR CONSULTATION SERVICES                                 */}
      {/* ============================================================ */}
      <section className="py-16 md:py-28 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 space-y-2 md:space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-txt-heading tracking-tight">
              Consultation for Your Healthcare Needs
            </h2>
            <p className="text-sm sm:text-base text-txt-body">
              Connect with homeopathic practitioners for personalized consultations across different areas of healthcare.
            </p>
            <p className="block md:hidden text-[11px] text-accent font-semibold pt-1">
              Swipe across all 7 areas of care →
            </p>
          </div>

          {/* Mobile Snap Carousel / Desktop 3-Column Grid */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-4 px-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible md:mx-0 md:px-0 md:pb-0 no-scrollbar">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={idx}
                  className="w-[78vw] sm:w-[320px] shrink-0 snap-center md:w-auto md:shrink group relative p-6 rounded-3xl bg-card border border-card-border hover:border-card-border-hover hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-card-subtle group-hover:bg-accent-soft border border-card-border group-hover:border-accent-border text-accent flex items-center justify-center mb-5 transition-colors duration-300">
                      <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    </div>

                    <h3 className="text-lg font-bold text-txt-heading mb-2 group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-txt-muted leading-relaxed mb-4">
                      {service.desc}
                    </p>
                  </div>

                  <div className="flex items-center text-xs font-semibold text-accent">
                    <span>Consult on this condition</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}

            {/* Comprehensive Care Action Card */}
            <div className="w-[78vw] sm:w-[320px] shrink-0 snap-center md:w-auto md:shrink p-6 rounded-3xl bg-btn-primary-bg text-white flex flex-col justify-between shadow-md">
              <div>
                <h3 className="text-xl font-bold mb-2 text-white !text-white">Have a unique health concern?</h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Homeopathy views your health as an interconnected whole. Book an initial consultation to discuss your specific concerns.
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center w-full px-5 py-3 rounded-full bg-white text-btn-primary-bg font-bold text-xs hover:bg-accent-soft transition-colors shadow-sm"
                >
                  <span>Book Your Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. FEATURED DOCTORS                                          */}
      {/* ============================================================ */}
      <section className="py-16 md:py-28 bg-canvas-subtle border-t border-borderline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 space-y-2 md:space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-txt-heading tracking-tight">
              Meet Our Homeopathic Practitioners
            </h2>
            <p className="text-sm sm:text-base text-txt-body">
              Get to know the qualified practitioners available on our platform.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="rounded-3xl bg-card border border-card-border p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-card-border-hover transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-btn-primary-bg text-white flex flex-col items-center justify-center shrink-0 shadow-md">
                <Users className="w-9 h-9 sm:w-10 sm:h-10 text-white/90 mb-1" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-white/80">Physician</span>
              </div>

              <div className="flex-1 space-y-3 text-center sm:text-left">
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <h3 className="text-xl font-bold text-txt-heading">Dr. Chetna Kale</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-accent-soft text-accent text-[11px] font-semibold">
                      BHMS, MD (Hom)
                    </span>
                  </div>
                  <p className="text-xs text-txt-muted font-medium">
                    Registered Homeopathic Practitioner • 3+ Years Clinical Experience
                  </p>
                </div>

                <div className="text-xs text-txt-body space-y-1">
                  <p>
                    <strong className="text-txt-heading">Areas of Practice:</strong> Chronic Skin Disorders, Digestive Health, Respiratory Allergies, and Constitutional Well-Being.
                  </p>
                </div>

                <div className="pt-3">
                  <Link
                    href="/book"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-btn-primary-bg hover:bg-btn-primary-hover text-btn-primary-text text-xs font-semibold shadow-sm transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>View / Book Consultation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. PATIENT TESTIMONIALS                                      */}
      {/* ============================================================ */}
      <section className="py-16 md:py-28 bg-canvas border-t border-borderline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 space-y-2 md:space-y-3">
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
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-4 px-4 pb-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:mx-0 md:px-0 md:pb-0 no-scrollbar">
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

          <div className="mt-10 md:mt-12 text-center">
            <Link
              href="/book"
              className="inline-flex items-center space-x-2 text-sm font-bold text-accent hover:text-accent-hover group"
            >
              <span>Book Your Consultation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
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
                Ready to Begin Your Consultation?
              </h2>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl mx-auto">
                Connect with a qualified homeopathic practitioner and take the first step towards a personalized consultation experience.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/book"
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-white hover:bg-accent-soft text-btn-primary-bg font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all duration-200"
                >
                  Contact & Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
