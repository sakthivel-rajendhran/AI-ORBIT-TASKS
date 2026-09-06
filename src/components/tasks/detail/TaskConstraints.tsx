'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface Constraint {
  order: number;
  content: string;
}

interface TaskConstraintsProps {
  constraints: Constraint[];
}

export function TaskConstraints({ constraints }: TaskConstraintsProps) {
  if (!constraints || constraints.length === 0) return null;

  return (
    <div className="space-y-4 anim-fade-up anim-delay-3">
      <h2 className="text-lg font-bold text-orbit-primary flex items-center gap-2">
        <ShieldCheck size={18} className="text-amber-500 dark:text-amber-400" />
        System & Operational Constraints
      </h2>

      <div className="card-hover-subtle rounded-xl border border-orbit bg-orbit-card p-5 shadow-xs">
        <ul className="space-y-3">
          {constraints.map((c) => (
            <li key={c.order} className="flex items-start gap-3 text-xs sm:text-sm text-orbit-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400 mt-2 shrink-0" />
              <span className="leading-relaxed">{c.content}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
