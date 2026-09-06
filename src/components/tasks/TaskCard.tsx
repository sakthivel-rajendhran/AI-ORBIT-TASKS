'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { TaskSummary } from '@/lib/db';
import { Clock, Users, ArrowRight, Sparkles } from 'lucide-react';

interface TaskCardProps {
  task: TaskSummary;
  index?: number;
}

function TaskCardComponent({ task, index = 0 }: TaskCardProps) {
  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'beginner':
        return 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'intermediate':
        return 'text-sky-600 dark:text-sky-400 border-sky-500/30 bg-sky-500/10';
      case 'advanced':
        return 'text-purple-600 dark:text-purple-400 border-purple-500/30 bg-purple-500/10';
      case 'expert':
        return 'text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-500/10';
      default:
        return 'text-orbit-muted border-orbit bg-orbit-surface';
    }
  };

  const delay = `${Math.min(index * 35, 280)}ms`;

  return (
    <Link
      href={`/tasks/${task.slug}`}
      prefetch={true}
      style={{ '--card-delay': delay } as React.CSSProperties}
      className="group relative flex flex-col justify-between rounded-xl border border-orbit bg-orbit-card p-5 block text-left outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/60 cursor-pointer card-entrance card-hover-task"
    >
      {/* Top row: Category, Featured Pill, and Difficulty */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-orbit-muted group-hover:text-[var(--accent-secondary)] transition-colors">
            {task.category}
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            {task.featured && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300 shadow-xs">
                <Sparkles size={10} />
                Featured
              </span>
            )}
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getDifficultyBadge(
                task.difficulty
              )}`}
            >
              {task.difficulty}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="task-title text-base font-bold text-orbit-primary group-hover:text-[var(--accent-secondary)] transition-colors duration-200 line-clamp-1 mb-2">
          {task.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs leading-relaxed text-orbit-secondary line-clamp-2 mb-4 transition-opacity duration-200 group-hover:opacity-90">
          {task.shortDescription}
        </p>

        {/* Technologies Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {task.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="task-tag text-[11px] font-mono px-2 py-0.5 rounded bg-orbit-surface border border-orbit text-orbit-secondary transition-all duration-200"
            >
              {tech}
            </span>
          ))}
          {task.technologies.length > 3 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orbit-surface text-orbit-muted border border-orbit">
              +{task.technologies.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Metadata & Action */}
      <div className="pt-3.5 border-t border-orbit flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-3 text-[11px] text-orbit-muted">
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-orbit-muted" />
            <span>{task.estimatedTime}</span>
          </div>

          <div className="flex items-center gap-1">
            <Users size={12} className="text-orbit-muted" />
            <span>{task.participants}</span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-semibold text-orbit-primary group-hover:text-[var(--accent-primary)] transition-colors">
          View Task
          <ArrowRight
            size={13}
            className="task-arrow transition-transform duration-200"
          />
        </span>
      </div>
    </Link>
  );

}

export const TaskCard = memo(TaskCardComponent);
