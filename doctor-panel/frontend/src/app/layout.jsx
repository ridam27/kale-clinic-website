import React from 'react';
import './globals.css';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Activity, Users, DollarSign, FileText, Calendar } from 'lucide-react';

export const metadata = {
  title: 'Doctor Portal | Kale Homeopathy Clinic',
  description: 'Doctor and administrative dashboard for clinical consultations, fees, and patient records.',
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
      <body className="min-h-screen flex bg-background text-text-main antialiased">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-surface flex flex-col justify-between p-4 hidden md:flex">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 px-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
                DK
              </div>
              <div>
                <h1 className="font-bold text-sm text-text-main leading-tight">Dr. Kale</h1>
                <p className="text-xs text-text-muted">Doctor & Admin Panel</p>
              </div>
            </div>

            <nav className="space-y-1 text-sm font-medium">
              <a
                href="#overview"
                className="flex items-center space-x-3 px-3 py-2 rounded-control bg-primary-soft text-primary transition-colors"
              >
                <Activity className="w-4 h-4" />
                <span>Overview</span>
              </a>
              <a
                href="#appointments"
                className="flex items-center space-x-3 px-3 py-2 rounded-control text-text-muted hover:text-text-main hover:bg-background transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Appointments</span>
              </a>
              <a
                href="#patients"
                className="flex items-center space-x-3 px-3 py-2 rounded-control text-text-muted hover:text-text-main hover:bg-background transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>Patient Database</span>
              </a>
              <a
                href="#prescriptions"
                className="flex items-center space-x-3 px-3 py-2 rounded-control text-text-muted hover:text-text-main hover:bg-background transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Prescription Maker</span>
              </a>
              <a
                href="#fees"
                className="flex items-center space-x-3 px-3 py-2 rounded-control text-text-muted hover:text-text-main hover:bg-background transition-colors"
              >
                <DollarSign className="w-4 h-4" />
                <span>Fee Management</span>
              </a>
            </nav>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-text-muted">Theme</span>
            <ThemeSwitcher />
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-border bg-surface px-6 flex items-center justify-between md:hidden">
            <span className="font-bold text-primary">Dr. Kale Admin</span>
            <ThemeSwitcher />
          </header>
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}

