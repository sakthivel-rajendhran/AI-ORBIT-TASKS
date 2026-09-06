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
      className={`theme-toggle-btn group inline-flex items-center justify-center rounded-xl border border-orbit text-orbit-secondary hover:text-orbit-primary hover:border-orbit-hover bg-orbit-card cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]/50 shrink-0 select-none ${
        showLabel ? 'gap-2 px-3 h-9' : 'w-9 h-9'
      } ${className}`}
      aria-label="Toggle dark and light theme"
      title="Toggle dark and light theme"
    >
      <span className="theme-icon-wrapper" aria-hidden="true">
        <Moon size={16} className="theme-icon-moon text-[#A78BFA] shrink-0" />
        <Sun size={16} className="theme-icon-sun text-amber-500 shrink-0" />
      </span>
      {showLabel && (
        <span className="text-xs font-semibold select-none">
          <span className="theme-label-dark">Dark Theme</span>
          <span className="theme-label-light">Light Theme</span>
        </span>
      )}
    </button>
  );
}
