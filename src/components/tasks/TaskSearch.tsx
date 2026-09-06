'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface TaskSearchProps {
  value: string;
  onChange: (value: string) => void;
  isSearching?: boolean;
}

export function TaskSearch({ value, onChange, isSearching = false }: TaskSearchProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [prevPropValue, setPrevPropValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  if (value !== prevPropValue) {
    setPrevPropValue(value);
    setInternalValue(value);
  }

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (internalValue !== value) {
        onChangeRef.current(internalValue);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [internalValue, value]);

  // Support '/' keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setInternalValue('');
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-orbit-muted">
        {isSearching ? (
          <Loader2 size={16} className="animate-spin text-[var(--accent-primary)]" />
        ) : (
          <Search size={16} />
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder="Search AI tasks..."
        className="w-full h-10 sm:h-11 rounded-xl bg-orbit-card border border-orbit pl-10 pr-20 text-sm text-orbit-primary placeholder-orbit-muted transition-all duration-200 focus:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 shadow-sm"
      />

      <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
        {internalValue && (
          <button
            type="button"
            onClick={handleClear}
            className="text-orbit-muted hover:text-orbit-primary p-1 rounded-md transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
        <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono text-orbit-muted bg-orbit-surface border border-orbit rounded shadow-xs">
          /
        </kbd>
      </div>
    </div>
  );
}
