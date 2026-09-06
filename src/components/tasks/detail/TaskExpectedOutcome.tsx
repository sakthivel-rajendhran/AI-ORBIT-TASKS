'use client';

import React from 'react';
import { Award, Check } from 'lucide-react';

interface TaskExpectedOutcomeProps {
  expectedOutcome: string;
}

export function TaskExpectedOutcome({ expectedOutcome }: TaskExpectedOutcomeProps) {
  return (
    <div className="space-y-4 anim-fade-up anim-delay-4">
      <h2 className="text-lg font-bold text-orbit-primary flex items-center gap-2">
        <Award size={18} className="text-emerald-500 dark:text-emerald-400" />
        Expected Outcome
      </h2>

      <div className="card-hover-subtle rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 mt-0.5">
            <Check size={14} strokeWidth={2.5} />
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-orbit-primary">
            {expectedOutcome}
          </p>
        </div>
      </div>
    </div>
  );
}
