'use client';

import React from 'react';
import { TaskRecord } from '@/lib/db';
import { Wrench, ShieldAlert, Target } from 'lucide-react';

interface TaskOverviewProps {
  task: TaskRecord;
}

export function TaskOverview({ task }: TaskOverviewProps) {
  return (
    <div className="space-y-6 anim-fade-up anim-delay-2">
      <div>
        <h2 className="text-lg font-bold text-orbit-primary mb-2 flex items-center gap-2">
          <Target size={18} className="text-[var(--accent-primary)]" />
          Overview
        </h2>
        <p className="text-sm leading-relaxed text-orbit-secondary">
          {task.description}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* What needs to be built */}
        <div className="card-hover-subtle rounded-xl border border-orbit bg-orbit-card p-4.5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orbit-muted">
            <Wrench size={14} className="text-[var(--accent-secondary)]" />
            What needs to be built
          </div>
          <p className="text-xs leading-relaxed text-orbit-secondary">
            Design, assemble, and test an autonomous component using <span className="text-orbit-primary font-medium">{task.technologies.slice(0, 3).join(', ')}</span>.
            The system must be capable of processing input feeds, applying AI reasoning logic, and providing verifiable programmatic output.
          </p>
        </div>

        {/* What problem does it solve */}
        <div className="card-hover-subtle rounded-xl border border-orbit bg-orbit-card p-4.5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orbit-muted">
            <ShieldAlert size={14} className="text-amber-500 dark:text-amber-400" />
            What problem does it solve
          </div>
          <p className="text-xs leading-relaxed text-orbit-secondary">
            Solves the complexity of productionizing <span className="text-orbit-primary font-medium">{task.category}</span> algorithms by eliminating manual interventions, reducing inference latency, and establishing verifiable output guarantees.
          </p>
        </div>
      </div>
    </div>
  );
}
