import React from 'react';
import './globals.css';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export const metadata = {
  title: 'Online Consultation Platform',
  description: 'Confidential online consultation room.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full w-full" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
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
      <body className="fixed inset-0 w-full h-full overflow-hidden flex flex-col bg-background text-text-main antialiased select-none">
        <header className="h-12 sm:h-14 border-b border-border bg-surface px-3 sm:px-4 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center space-x-2 min-w-0 pr-2">
            <span className="font-bold text-xs sm:text-sm tracking-tight text-primary truncate">
              Online Consultation Platform
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <ThemeSwitcher />
          </div>
        </header>

        <main className="flex-1 min-h-0 w-full overflow-hidden flex flex-col relative">{children}</main>
      </body>
    </html>
  );
}
