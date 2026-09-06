'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu } from 'lucide-react';

interface TaskTechnologiesProps {
  technologies: string[];
  className?: string;
}

export function TaskTechnologies({ technologies, className = '' }: TaskTechnologiesProps) {
  if (!technologies || technologies.length === 0) return null;

  return (
    <div className={`card-hover-subtle rounded-2xl border border-orbit bg-orbit-card p-5 space-y-3 shadow-xs ${className}`}>
      <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-orbit-muted flex items-center gap-1.5 pb-2 border-b border-orbit">
        <Cpu size={14} className="text-[var(--accent-secondary)]" />
        Technologies
      </h3>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {technologies.map((tech) => (
          <Link
            key={tech}
            href={`/tasks?technology=${encodeURIComponent(tech)}`}
            prefetch={true}
            className="card-hover-pill text-xs font-mono px-2.5 py-1 rounded-lg bg-orbit-surface border border-orbit text-orbit-secondary transition-all"
          >
            {tech}
          </Link>
        ))}
      </div>
    </div>
  );
}
