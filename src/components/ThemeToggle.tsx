'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn inline-flex items-center justify-center gap-2 rounded-xl p-2 border border-orbit text-orbit-secondary hover:text-orbit-primary hover:border-orbit-hover bg-orbit-card transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]/50 ${className}`}
      aria-label="Toggle dark and light theme"
      title="Toggle dark and light theme"
    >
      <Moon size={16} className="theme-icon-moon text-[#A78BFA] transition-transform duration-300 group-hover:-rotate-12" />
      <Sun size={16} className="theme-icon-sun text-amber-500 transition-transform duration-300 group-hover:rotate-45" />
      {showLabel && (
        <span className="text-xs font-semibold">
          <span className="theme-label-dark">Dark Theme</span>
          <span className="theme-label-light">Light Theme</span>
        </span>
      )}
    </button>
  );
}
