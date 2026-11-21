'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Clock,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Facebook,
  Instagram,
  Linkedin,
} from 'lucide-react';

export function Footer() {
  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Book Consultation', href: '/book' },
    { label: 'Contact & Support', href: '/contact' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/contact#privacy' },
    { label: 'Terms & Conditions', href: '/contact#terms' },
    { label: 'Medical Disclaimer', href: '/contact#disclaimer' },
    { label: 'Refund & Cancellation Policy', href: '/contact#refund' },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com',
      icon: Facebook,
      color: 'hover:text-[#1877F2] hover:border-[#1877F2]/30',
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      icon: Instagram,
      color: 'hover:text-[#E4405F] hover:border-[#E4405F]/30',
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: Linkedin,
      color: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/30',
    },
  ];

  return (
    <footer className="relative bg-card border-t border-borderline text-txt-muted transition-colors overflow-hidden">
      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Clinic Profile & Brand */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-2xl bg-btn-primary-bg flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
                <div className="w-4 h-4 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-txt-heading group-hover:text-accent transition-colors">
                  Kale Clinic
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-txt-muted">
                  Online Homeopathic Care
                </span>
              </div>
            </Link>

            <p className="text-sm text-txt-body leading-relaxed max-w-sm">
              Connecting you directly with qualified homeopathic practitioners online. Experience personalized, gentle, and constitutional care tailored to your unique wellness journey from the comfort of home.
            </p>

            {/* Operating Hours Card */}
            <div className="p-3.5 rounded-2xl bg-card-subtle border border-borderline space-y-1.5 max-w-sm">
              <div className="flex items-center space-x-2 text-xs font-semibold text-txt-heading">
                <Clock className="w-3.5 h-3.5 text-accent" />
                <span>Consultation Hours</span>
              </div>
              <p className="text-xs text-txt-body">
                Monday to Saturday: <strong className="text-txt-heading">9:00 AM – 12:00 PM IST</strong>
              </p>
              <p className="text-[11px] text-txt-muted">
                Slots automatically converted to your local timezone during booking.
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-txt-heading">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-sm text-txt-muted hover:text-accent transition-colors"
                  >
                    <span className="w-0 opacity-0 -ml-2 group-hover:w-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-accent mr-1">
                      →
                    </span>
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Policies */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-txt-heading">
              Legal & Transparency
            </h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-sm text-txt-muted hover:text-accent transition-colors"
                  >
                    <span className="w-0 opacity-0 -ml-2 group-hover:w-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-accent mr-1">
                      →
                    </span>
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Information & Socials */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-txt-heading">
              Contact & Support
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:kaleclinic1@gmail.com"
                className="group flex items-start space-x-3 text-txt-body hover:text-accent transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-card-subtle border border-borderline flex items-center justify-center text-txt-muted group-hover:text-accent group-hover:border-accent-border group-hover:bg-accent-soft transition-colors shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs text-txt-faint">Email Inquiries</span>
                  <span className="font-medium text-txt-heading">kaleclinic1@gmail.com</span>
                </div>
              </a>

              <a
                href="tel:+919158651044"
                className="group flex items-start space-x-3 text-txt-body hover:text-accent transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-card-subtle border border-borderline flex items-center justify-center text-txt-muted group-hover:text-accent group-hover:border-accent-border group-hover:bg-accent-soft transition-colors shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs text-txt-faint">Direct Support</span>
                  <span className="font-medium text-txt-heading">+91 91586 51044</span>
                </div>
              </a>

              <div className="flex items-start space-x-3 text-txt-body">
                <div className="w-8 h-8 rounded-lg bg-card-subtle border border-borderline flex items-center justify-center text-txt-muted shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs text-txt-faint">Virtual Clinic Office</span>
                  <span className="text-xs text-txt-body leading-snug">
                    Kale Classical Homeopathy Practice, India & Global Teleconsultations
                  </span>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="block text-xs text-txt-muted font-semibold mb-2">Connect With Us</span>
              <div className="flex items-center space-x-2.5">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className={`w-9 h-9 rounded-xl bg-card border border-borderline text-txt-muted flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 ${social.color}`}
                    >
                      <Icon className="w-4 h-4 transition-transform duration-300 hover:scale-110" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Medical Disclaimer Card */}
        <div className="mt-12 p-4 rounded-2xl bg-alert-bg border border-alert-border text-alert-text flex items-start space-x-3.5">
          <AlertCircle className="w-5 h-5 text-alert-icon shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-alert-title">Important Medical Notice & Emergency Care</p>
            <p className="text-alert-text leading-relaxed">
              Online homeopathic consultations are intended for chronic, recurrent, sub-acute, and non-emergency health conditions. If you or someone you care for is experiencing an acute, life-threatening medical emergency (such as severe chest pain, sudden difficulty breathing, stroke symptoms, or severe trauma), please immediately contact your local hospital emergency room or dial your emergency services (<strong>112 in India, 911 in the USA, or 999 in the UK</strong>).
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-10 pt-6 border-t border-borderline flex flex-col sm:flex-row items-center justify-between text-xs text-txt-muted gap-4">
          <p>© 2026 Kale Clinic. All Rights Reserved.</p>

          <div className="flex items-center space-x-5 text-xs">
            <span className="flex items-center space-x-1.5 text-txt-body font-medium">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Registered Homeopathic Practice</span>
            </span>
            <span className="text-borderline">•</span>
            <span>Personalized Online Care</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
