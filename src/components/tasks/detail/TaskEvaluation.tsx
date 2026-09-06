'use client';

import React from 'react';
import { CheckSquare } from 'lucide-react';

interface EvaluationItem {
  order: number;
  criterion: string;
}

interface TaskEvaluationProps {
  evaluations: EvaluationItem[];
}

export function TaskEvaluation({ evaluations }: TaskEvaluationProps) {
  if (!evaluations || evaluations.length === 0) return null;

  return (
    <div className="space-y-4 anim-fade-up anim-delay-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-orbit-primary flex items-center gap-2">
          <CheckSquare size={18} className="text-[var(--accent-primary)]" />
          Evaluation Criteria & Rubric
        </h2>
        <span className="text-xs font-mono text-orbit-muted">
          {evaluations.length} Assessment Dimensions
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {evaluations.map((item) => (
          <div
            key={item.order}
            className="card-hover-subtle flex items-start gap-3 rounded-xl border border-orbit bg-orbit-card p-3.5 transition-all shadow-xs"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-orbit-surface border border-orbit text-[11px] font-mono font-bold text-orbit-secondary">
              {String(item.order).padStart(2, '0')}
            </div>

            <p className="text-xs sm:text-sm text-orbit-secondary pt-0.5 leading-snug">
              {item.criterion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
