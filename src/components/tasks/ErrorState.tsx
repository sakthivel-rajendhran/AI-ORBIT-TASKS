'use client';

import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  title?: string;
}

export function ErrorState({
  message = 'An unexpected error occurred while loading tasks. Please try again.',
  onRetry,
  title = 'Unable to Load Tasks'
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-8 text-center space-y-4 max-w-xl mx-auto my-8"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto">
        <AlertCircle size={24} />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-white">{title}</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
          {message}
        </p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors cursor-pointer shadow-sm"
        >
          <RotateCcw size={13} />
          Retry Request
        </button>
      )}
    </div>
  );
}
