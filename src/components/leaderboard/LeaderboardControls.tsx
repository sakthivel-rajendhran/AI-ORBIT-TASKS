'use client';

import React from 'react';
import { ChevronDown, ArrowUpDown } from 'lucide-react';

interface LeaderboardControlsProps {
  period: 'all-time' | 'month' | 'week';
  category: string;
  sort: 'score' | 'tasks' | 'success_rate';
  onPeriodChange: (period: 'all-time' | 'month' | 'week') => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: 'score' | 'tasks' | 'success_rate') => void;
  categories: string[];
}

export function LeaderboardControls({
  period,
  category,
  sort,
  onPeriodChange,
  onCategoryChange,
  onSortChange,
  categories = []
}: LeaderboardControlsProps) {
  const periodOptions: { label: string; value: 'all-time' | 'month' | 'week' }[] = [
    { label: 'All Time', value: 'all-time' },
    { label: 'This Month', value: 'month' },
    { label: 'This Week', value: 'week' }
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-2 border-b border-orbit">
      {/* 1. Period Selector Segmented Control */}
      <div className="inline-flex items-center rounded-xl border border-orbit bg-orbit-card p-1 self-start shadow-xs">
        {periodOptions.map((opt) => {
          const isActive = period === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onPeriodChange(opt.value)}
              className={`btn-interaction px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[var(--accent-primary)] text-white font-bold shadow-sm'
                  : 'text-orbit-muted hover:text-orbit-primary'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* 2. Category & Sort Selectors */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Category Dropdown */}
        <div className="relative flex-1 sm:flex-initial">
          <select
            aria-label="Filter by Category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full sm:w-auto h-9 rounded-xl bg-orbit-card border border-orbit px-3 pr-8 text-xs text-orbit-secondary hover:border-[var(--border-hover)] focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer appearance-none font-medium transition-all duration-200 shadow-xs"
          >
            <option value="All" className="bg-orbit-card text-orbit-primary">Category: All</option>
            {categories.filter(c => c !== 'All').map((cat) => (
              <option key={cat} value={cat} className="bg-orbit-card text-orbit-primary">
                Category: {cat}
              </option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-orbit-muted"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex-1 sm:flex-initial">
          <select
            aria-label="Sort Leaderboard"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as 'score' | 'tasks' | 'success_rate')}
            className="w-full sm:w-auto h-9 rounded-xl bg-orbit-card border border-orbit px-3 pr-8 text-xs text-orbit-secondary hover:border-[var(--border-hover)] focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer appearance-none font-medium transition-all duration-200 shadow-xs"
          >
            <option value="score" className="bg-orbit-card text-orbit-primary">Sort: Highest Score</option>
            <option value="tasks" className="bg-orbit-card text-orbit-primary">Sort: Most Tasks Completed</option>
            <option value="success_rate" className="bg-orbit-card text-orbit-primary">Sort: Best Success Rate</option>
          </select>
          <ArrowUpDown
            size={12}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-orbit-muted"
          />
        </div>
      </div>
    </div>
  );
}
