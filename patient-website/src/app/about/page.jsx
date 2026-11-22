'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  ArrowRight,
  ShieldCheck,
  Heart,
  Clock,
  Award,
  Target,
  Eye,
  UserCheck,
  MessageSquareHeart,
  Sparkles,
  MessageCircle,
  ShieldAlert,
  Video,
  Lock,
  PhoneCall,
  X,
} from 'lucide-react';

export default function AboutPage() {
  const [activeModalCard, setActiveModalCard] = useState(null);

  // Prevent background scrolling when mobile card modal is active
  useEffect(() => {
    if (activeModalCard) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModalCard]);

  const whyChooseItems = [
    {
      title: 'Qualified Homeopathic Practitioners',
      desc: 'Connect with practitioners whose qualifications and professional credentials are appropriately verified.',
      icon: Award,
    },
    {
      title: 'Convenient Online Consultations',
      desc: 'Schedule appointments and discuss your health concerns without needing to travel for an online consultation.',
      icon: Video,
    },
    {
      title: 'Individualized Attention',
      desc: 'Discuss your health concerns and medical history during a consultation tailored to your individual needs.',
      icon: Heart,
    },
    {
      title: 'Simple Appointment Booking',
      desc: 'Choose a suitable appointment slot through an easy-to-use online booking process.',
      icon: Calendar,
    },
    {
      title: 'Patient Privacy',
      desc: 'We value the privacy and confidentiality of patient information and aim to handle personal information responsibly.',
      icon: Lock,
    },
    {
      title: 'Ongoing Communication',
      desc: 'Where appropriate, patients can connect with practitioners for follow-up consultations and further professional guidance.',
      icon: PhoneCall,
    },
  ];

  // Combined Section: 6 Cards combining Approach and Commitment
  const combinedCards = [
    {
      id: 1,
      title: 'Individual Attention',
      desc: 'Every consultation provides a dedicated opportunity to discuss personal health concerns, unique symptoms, and individual healthcare needs without feeling rushed.',
      icon: UserCheck,
    },
    {
      id: 2,
      title: 'Detailed Health Discussion',
      desc: 'Practitioners take time to thoroughly understand relevant physical symptoms, emotional well-being, lifestyle habits, and complete medical history.',
      icon: MessageSquareHeart,
    },
    {
      id: 3,
      title: 'Personalized Guidance',
      desc: 'Receive individualized professional guidance and constitutional recommendations tailored precisely to your specific health background and wellness goals.',
      icon: Sparkles,
    },
    {
      id: 4,
      title: 'Respectful Communication',
      desc: 'We foster open, transparent, and compassionate conversations between patients and practitioners throughout every stage of the consultation.',
      icon: MessageCircle,
    },
    {
      id: 5,
      title: 'Privacy & Confidentiality',
      desc: 'We value the trust you place in us, handling your personal records, consultation discussions, and healthcare information with utmost discretion and security.',
      icon: ShieldCheck,
    },
    {
      id: 6,
      title: 'Responsible Healthcare',
      desc: 'We encourage informed patient decisions and readily recognize when conventional medical evaluation or emergency hospital treatment is appropriate.',
      icon: ShieldAlert,
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
            Making Personalized Homeopathic Consultation{' '}
            <span className="text-accent font-serif font-normal italic">Accessible to Everyone.</span>
          </h1>

          <p className="text-base sm:text-xl text-txt-body leading-relaxed max-w-3xl mx-auto">
            We are dedicated to making homeopathic consultations more accessible and convenient by connecting individuals with qualified homeopathic practitioners through a simple and secure online platform.
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

            <a
              href="#approach-and-commitment"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 sm:py-4 text-sm font-semibold text-btn-secondary-text bg-btn-secondary-bg hover:bg-btn-secondary-hover border border-btn-secondary-border rounded-full hover:border-accent hover:text-accent transition-all duration-200 shadow-sm"
            >
              <span>Explore Our Approach</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. OUR MISSION & VISION                                      */}
      {/* ============================================================ */}
      <section className="py-16 md:py-28 bg-canvas-subtle border-y border-borderline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 space-y-2 md:space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-txt-heading tracking-tight">
              Our Mission & Vision
            </h2>
            <p className="text-base sm:text-lg text-txt-muted">
              Guided by Purpose, Driven by Patient-Centred Care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Card 1: Our Mission */}
            <div className="p-8 sm:p-10 rounded-3xl bg-card border border-card-border hover:border-card-border-hover hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-accent-soft text-accent flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-txt-heading">
                  Our Mission
                </h3>
                <div className="space-y-3 text-sm sm:text-base text-txt-body leading-relaxed">
                  <p>
                    Our mission is to make homeopathic consultations more accessible and convenient through online healthcare services.
                  </p>
                  <p className="text-txt-muted text-xs sm:text-sm">
                    We aim to connect patients with qualified homeopathic practitioners, providing a comfortable platform to discuss their health concerns and receive individualized professional guidance.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Our Vision */}
            <div className="p-8 sm:p-10 rounded-3xl bg-card border border-card-border hover:border-card-border-hover hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-accent-soft text-accent flex items-center justify-center">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-txt-heading">
                  Our Vision
                </h3>
                <div className="space-y-3 text-sm sm:text-base text-txt-body leading-relaxed">
                  <p>
                    Our vision is to build a trusted online platform where individuals can conveniently connect with qualified homeopathic practitioners, regardless of their location.
                  </p>
                  <p className="text-txt-muted text-xs sm:text-sm">
                    We aspire to create a more accessible, transparent, and patient-friendly consultation experience through technology and professional care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. WHY CHOOSE KALE CLINIC?                                   */}
      {/* ============================================================ */}
      <section className="py-16 md:py-28 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 space-y-2 md:space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-txt-heading tracking-tight">
              Why Choose Kale Clinic?
            </h2>
            <p className="text-sm sm:text-base text-txt-muted">
              We aim to make your homeopathic consultation experience simple, convenient, and comfortable.
            </p>
            <p className="block md:hidden text-[11px] text-accent font-semibold pt-1">
              Swipe across key highlights →
            </p>
          </div>

          {/* 6 Highlights: Swipeable on mobile / 3-column grid on desktop */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-4 px-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible md:mx-0 md:px-0 md:pb-0 no-scrollbar">
            {whyChooseItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="w-[78vw] sm:w-[320px] shrink-0 snap-center md:w-auto md:shrink p-6 sm:p-8 rounded-3xl bg-card border border-card-border hover:border-card-border-hover hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-card-subtle border border-card-border flex items-center justify-center text-accent mb-4">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-txt-heading">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-txt-muted leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. COMBINED: OUR APPROACH & COMMITMENT TO PATIENT CARE        */}
      {/* ============================================================ */}
      <section
        id="approach-and-commitment"
        className="py-16 md:py-28 bg-canvas-subtle border-t border-borderline scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-txt-heading tracking-tight">
              Our Approach & Commitment to Patient Care
            </h2>
            <div className="space-y-2 text-sm sm:text-base text-txt-body leading-relaxed max-w-2xl mx-auto">
              <p>
                We believe that every patient deserves to be heard, understood, and guided with care.
              </p>
              <p className="text-txt-muted text-xs sm:text-sm">
                Our practice is built on individualized consultations, meaningful communication, and an unwavering commitment to responsible clinical standards.
              </p>
            </div>
            <p className="block md:hidden text-[11px] text-accent font-semibold pt-1">
              Tap any card to view complete details
            </p>
          </div>

          {/* MOBILE VIEW: Compact Icon + Heading only (Tapping pops up modal) */}
          <div className="grid grid-cols-2 gap-3 md:hidden max-w-md mx-auto">
            {combinedCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setActiveModalCard(card)}
                  className="p-4 rounded-2xl bg-card border border-card-border active:scale-95 transition-all text-left flex flex-col justify-between h-36 shadow-sm hover:border-accent group"
                >
                  <div className="w-9 h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center group-hover:scale-110 group-hover:bg-accent group-hover:text-canvas transition-all">
                    <Icon className="w-4 h-4" />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-txt-heading line-clamp-2 leading-snug">
                      {card.title}
                    </h3>
                    <span className="text-[10px] text-accent font-semibold mt-1 inline-flex items-center">
                      Tap details →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* DESKTOP VIEW: Full cards with heading, graphics, and description */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {combinedCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className="p-6 sm:p-8 rounded-3xl bg-card border border-card-border hover:border-card-border-hover hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent-soft text-accent flex items-center justify-center group-hover:scale-110 group-hover:bg-accent group-hover:text-canvas transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-bold text-txt-heading group-hover:text-accent transition-colors">
                      {card.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-txt-muted leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Summary Sanctuary Box */}
          <div className="mt-16 max-w-4xl mx-auto text-center p-8 sm:p-12 rounded-3xl bg-card border border-borderline space-y-6 shadow-sm">
            <p className="text-base sm:text-lg text-txt-heading font-medium leading-relaxed max-w-2xl mx-auto">
              "Our goal is to make accessing a homeopathic consultation easier while keeping patient well-being at the centre of the experience."
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book"
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-btn-primary-bg hover:bg-btn-primary-hover text-btn-primary-text font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Consultation</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                href="/contact"
                className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-full bg-btn-secondary-bg hover:bg-btn-secondary-hover border border-btn-secondary-border text-btn-secondary-text font-semibold text-sm transition-all duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MOBILE POPUP MODAL                                           */}
      {/* ============================================================ */}
      {activeModalCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveModalCard(null)}
        >
          <div
            className="bg-card border border-card-border rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-borderline">
              <div className="w-11 h-11 rounded-2xl bg-accent-soft text-accent flex items-center justify-center">
                {React.createElement(activeModalCard.icon, { className: 'w-5 h-5' })}
              </div>

              <button
                type="button"
                onClick={() => setActiveModalCard(null)}
                aria-label="Close details modal"
                className="p-2 rounded-xl text-txt-muted hover:text-txt-heading hover:bg-card-subtle transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-txt-heading">
                {activeModalCard.title}
              </h3>
              <p className="text-xs sm:text-sm text-txt-body leading-relaxed">
                {activeModalCard.desc}
              </p>
            </div>

            {/* Modal Action Button */}
            <button
              type="button"
              onClick={() => setActiveModalCard(null)}
              className="w-full py-2.5 rounded-full bg-btn-primary-bg hover:bg-btn-primary-hover text-btn-primary-text font-semibold text-xs shadow-sm transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
