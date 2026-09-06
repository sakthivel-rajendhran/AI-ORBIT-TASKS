'use client';

import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onReset: () => void;
  hasFilters: boolean;
}

export function EmptyState({ onReset, hasFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-[#1C1C21] bg-[#0c0c0f]/60 my-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-zinc-400 mb-4">
        <SearchX size={22} className="text-zinc-500" />
      </div>

      <h3 className="text-base font-bold text-white mb-1.5">
        No tasks match your current filters
      </h3>

      <p className="text-xs text-zinc-400 max-w-sm mb-6 leading-relaxed">
        Try adjusting your keywords, broadening your category selection, or resetting your filter criteria to discover more tasks.
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
        >
          <RotateCcw size={13} />
          Clear All Filters
        </button>
      )}
    </div>
  );
}
