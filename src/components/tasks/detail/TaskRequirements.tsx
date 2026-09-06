'use client';

import React from 'react';
import { ListChecks } from 'lucide-react';

interface Requirement {
  order: number;
  content: string;
}

interface TaskRequirementsProps {
  requirements: Requirement[];
}

export function TaskRequirements({ requirements }: TaskRequirementsProps) {
  if (!requirements || requirements.length === 0) return null;

  return (
    <div className="space-y-4 anim-fade-up anim-delay-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-orbit-primary flex items-center gap-2">
          <ListChecks size={18} className="text-[var(--accent-primary)]" />
          Requirements
        </h2>
        <span className="text-xs font-mono text-orbit-muted">
          {requirements.length} Core Specifications
        </span>
      </div>

      <div className="space-y-2.5">
        {requirements.map((req) => (
          <div
            key={req.order}
            className="card-hover-subtle flex items-start gap-4 rounded-xl border border-orbit bg-orbit-card p-4 transition-all shadow-xs"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orbit-surface border border-orbit text-xs font-mono font-bold text-[var(--accent-secondary)]">
              {String(req.order).padStart(2, '0')}
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-orbit-secondary pt-0.5">
              {req.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
