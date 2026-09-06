'use client';

import React from 'react';
import { GraduationCap } from 'lucide-react';

interface TaskSkillsProps {
  skills: string[];
  className?: string;
}

export function TaskSkills({ skills, className = '' }: TaskSkillsProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className={`card-hover-subtle rounded-2xl border border-orbit bg-orbit-card p-5 space-y-3 shadow-xs ${className}`}>
      <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-orbit-muted flex items-center gap-1.5 pb-2 border-b border-orbit">
        <GraduationCap size={14} className="text-[var(--accent-primary)]" />
        Required Skills
      </h3>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {skills.map((skill) => (
          <span
            key={skill}
            className="card-hover-pill text-xs px-2.5 py-1 rounded-lg bg-orbit-surface border border-orbit text-orbit-secondary font-medium transition-all"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
