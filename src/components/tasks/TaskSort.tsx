'use client';

import React from 'react';
import { ArrowUpDown, ChevronDown } from 'lucide-react';

interface TaskSortProps {
  value: string;
  onChange: (value: string) => void;
}

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Most Popular', value: 'most-popular' },
  { label: 'Shortest Time', value: 'shortest-time' },
  { label: 'Longest Time', value: 'longest-time' },
  { label: 'Difficulty', value: 'difficulty' }
];

export function TaskSort({ value, onChange }: TaskSortProps) {
  return (
    <div className="relative inline-flex items-center">
      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-orbit-muted">
        <ArrowUpDown size={13} />
      </div>
      <select
        aria-label="Sort AI tasks"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8.5 rounded-lg bg-orbit-card border border-orbit pl-7 pr-7 text-xs font-medium text-orbit-secondary hover:border-[var(--border-hover)] focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer appearance-none transition-all duration-200 shadow-xs"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-orbit-card text-orbit-primary">
            Sort: {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-orbit-muted"
      />
    </div>
  );
}
