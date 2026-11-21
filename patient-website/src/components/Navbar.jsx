'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Book Consultation', href: '/book' },
    { label: 'Contact & Support', href: '/contact' },
  ];

  return (
    <>
      {/* Main Sticky Navigation */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-card/95 backdrop-blur-md shadow-sm border-b border-borderline py-3'
          : 'bg-canvas border-b border-borderline/80 py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link
              href="/"
              className="group flex items-center space-x-3 transition-transform duration-300 hover:scale-[1.01]"
            >
              <div className="relative w-10 h-10 rounded-2xl bg-btn-primary-bg flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:rotate-1">
                <div className="relative">
                  <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full group-hover:scale-125 transition-transform"></div>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-txt-heading group-hover:text-accent transition-colors leading-tight">
                  Kale Clinic
                </span>
                <span className="text-[10px] tracking-wider font-semibold uppercase text-txt-muted">
                  Online Homeopathic Care
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 group overflow-hidden ${isActive
                      ? 'text-accent font-semibold bg-accent-soft'
                      : 'text-txt-body hover:text-txt-heading'
                      }`}
                  >
                    <span
                      className={`absolute inset-0 bg-accent-soft rounded-full transition-transform duration-300 ease-out origin-center ${isActive
                        ? 'scale-100 opacity-100'
                        : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100'
                        }`}
                    ></span>

                    <span className="relative z-10 flex items-center gap-1.5">
                      {link.label}
                      <span
                        className={`w-1 h-1 rounded-full bg-accent transition-all duration-300 ${isActive
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'
                          }`}
                      ></span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Action Area: Theme Switcher & CTA */}
            <div className="hidden md:flex items-center space-x-3">
              <ThemeSwitcher />

              <Link
                href="/book"
                className="relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-btn-primary-text bg-btn-primary-bg hover:bg-btn-primary-hover rounded-full overflow-hidden shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group"
              >
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>

                <Calendar className="w-4 h-4 mr-2 text-white/90 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Book Consultation</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            </div>

            {/* Mobile Controls: Theme Switcher + Hamburger */}
            <div className="flex md:hidden items-center space-x-2">
              <ThemeSwitcher />

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="p-2 rounded-xl text-txt-body hover:text-accent hover:bg-accent-soft transition-colors focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 animate-in fade-in zoom-in duration-200" />
                ) : (
                  <Menu className="w-6 h-6 animate-in fade-in zoom-in duration-200" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-borderline bg-card px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-in slide-in-from-top-3 duration-200">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                    ? 'bg-accent-soft text-accent font-semibold'
                    : 'text-txt-body hover:bg-card-subtle hover:text-accent'
                    }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${isActive ? 'text-accent translate-x-1' : 'text-txt-faint'
                      }`}
                  />
                </Link>
              );
            })}

            <div className="pt-3">
              <Link
                href="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-btn-primary-bg hover:bg-btn-primary-hover text-btn-primary-text font-semibold text-sm shadow-md active:scale-98 transition-transform"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Consultation</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
