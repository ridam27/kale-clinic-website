import React from 'react';
import './globals.css';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export const metadata = {
  title: 'Kale Homeopathy Clinic | Online Consultations',
  description: 'Confidential, individualized online homeopathic consultation for patients in India and abroad.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme-preference');
                  var isDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-text-main antialiased">
        <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-lg text-primary tracking-tight">
                Kale Clinic
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-soft text-primary font-medium">
                Homeopathy Care
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-6 text-sm text-text-muted">
                <a href="#about" className="hover:text-primary transition-colors">About Doctor</a>
                <a href="#services" className="hover:text-primary transition-colors">Consultations & Fees</a>
                <a href="#portal" className="hover:text-primary transition-colors">Patient Portal</a>
              </nav>
              <ThemeSwitcher />
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border bg-surface py-8 mt-16 text-center text-xs text-text-muted">
          <div className="max-w-6xl mx-auto px-4 space-y-2">
            <p>© {new Date().getFullYear()} Kale Homeopathy Clinic. Confidential & Professional Telemedicine.</p>
            <p>Doctor availability: 9:00 AM – 12:00 PM IST (Asia/Kolkata). India Consultation: ₹150.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

