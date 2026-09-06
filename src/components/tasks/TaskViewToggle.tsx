'use client';

import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

interface TaskViewToggleProps {
  view: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
}

export function TaskViewToggle({ view, onChange }: TaskViewToggleProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-orbit bg-orbit-card p-0.5 shadow-xs">
      <button
        type="button"
        onClick={() => onChange('grid')}
        className={`btn-interaction flex h-7.5 w-8 items-center justify-center rounded-md transition-all cursor-pointer ${
          view === 'grid'
            ? 'bg-orbit-surface text-orbit-primary shadow-xs border border-orbit font-semibold'
            : 'text-orbit-muted hover:text-orbit-secondary'
        }`}
        aria-label="Switch to Grid View"
        title="Grid View"
      >
        <LayoutGrid size={15} />
      </button>

      <button
        type="button"
        onClick={() => onChange('list')}
        className={`btn-interaction flex h-7.5 w-8 items-center justify-center rounded-md transition-all cursor-pointer ${
          view === 'list'
            ? 'bg-orbit-surface text-orbit-primary shadow-xs border border-orbit font-semibold'
            : 'text-orbit-muted hover:text-orbit-secondary'
        }`}
        aria-label="Switch to List View"
        title="List View"
      >
        <List size={16} />
      </button>
    </div>
  );
}
