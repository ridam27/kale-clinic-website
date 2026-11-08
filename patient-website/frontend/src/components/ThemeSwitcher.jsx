'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme-preference') || 'system';
    setTheme(storedTheme);
    applyTheme(storedTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const currentStored = localStorage.getItem('theme-preference');
      if (currentStored === 'system' || !currentStored) {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applyTheme = (mode) => {
    const root = document.documentElement;
    if (mode === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.setAttribute('data-theme', 'dark');
        root.classList.add('dark');
      } else {
        root.setAttribute('data-theme', 'light');
        root.classList.remove('dark');
      }
    } else if (mode === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
    }
  };

  const handleSelect = (mode) => {
    setTheme(mode);
    localStorage.setItem('theme-preference', mode);
    applyTheme(mode);
  };

  if (!mounted) {
    return (
      <div className="flex items-center space-x-1 p-1 bg-surface border border-border rounded-control opacity-0">
        <div className="w-7 h-7" />
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Theme switcher"
      className="inline-flex items-center space-x-1 p-1 bg-surface border border-border rounded-control shadow-sm transition-colors"
    >
      <button
        type="button"
        onClick={() => handleSelect('light')}
        title="Light Mode"
        className={`p-1.5 rounded-md text-xs font-medium transition-all ${
          theme === 'light'
            ? 'bg-primary text-white shadow-sm'
            : 'text-text-muted hover:text-text-main'
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => handleSelect('dark')}
        title="Dark Mode"
        className={`p-1.5 rounded-md text-xs font-medium transition-all ${
          theme === 'dark'
            ? 'bg-primary text-white shadow-sm'
            : 'text-text-muted hover:text-text-main'
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => handleSelect('system')}
        title="System Preference"
        className={`p-1.5 rounded-md text-xs font-medium transition-all ${
          theme === 'system'
            ? 'bg-primary text-white shadow-sm'
            : 'text-text-muted hover:text-text-main'
        }`}
      >
        <Laptop className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

