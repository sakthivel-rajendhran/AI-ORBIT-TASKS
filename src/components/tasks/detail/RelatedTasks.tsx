'use client';

import React from 'react';
import Link from 'next/link';
import { TaskSummary } from '@/lib/db';
import { Sparkles, ArrowRight, Clock } from 'lucide-react';

interface RelatedTasksProps {
  relatedTasks: TaskSummary[];
}

export function RelatedTasks({ relatedTasks }: RelatedTasksProps) {
  if (!relatedTasks || relatedTasks.length === 0) return null;

  return (
    <div className="pt-10 border-t border-orbit space-y-6 anim-fade-up anim-delay-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-orbit-primary flex items-center gap-2">
          <Sparkles size={18} className="text-[var(--accent-primary)]" />
          Related Tasks & Challenges
        </h2>
        <Link
          href="/tasks"
          prefetch={true}
          className="btn-interaction text-xs font-semibold text-orbit-muted hover:text-orbit-primary flex items-center gap-1 transition-colors"
        >
          Browse All
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedTasks.map((task) => (
          <Link
            key={task.id}
            href={`/tasks/${task.slug}`}
            prefetch={true}
            className="group flex flex-col justify-between rounded-xl border border-orbit bg-orbit-card p-4.5 card-hover-related transition-all shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orbit-muted truncate">
                  {task.category}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded border border-orbit bg-orbit-surface text-orbit-secondary font-medium">
                  {task.difficulty}
                </span>
              </div>

              <h4 className="text-sm font-bold text-orbit-primary group-hover:text-[var(--accent-secondary)] transition-colors line-clamp-1 mb-1.5">
                {task.title}
              </h4>

              <p className="text-xs text-orbit-secondary line-clamp-2 leading-relaxed mb-3">
                {task.shortDescription}
              </p>
            </div>

            <div className="pt-3 border-t border-orbit flex items-center justify-between text-[11px] text-orbit-muted mt-auto">
              <div className="flex items-center gap-1">
                <Clock size={11} className="text-orbit-muted" />
                <span>{task.estimatedTime}</span>
              </div>
              <span className="text-orbit-secondary group-hover:text-orbit-primary font-medium flex items-center gap-0.5 transition-colors">
                Inspect <ArrowRight size={11} className="related-arrow transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
