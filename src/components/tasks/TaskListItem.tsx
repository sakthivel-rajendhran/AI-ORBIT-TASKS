'use client';

import React from 'react';
import Link from 'next/link';
import { TaskSummary } from '@/lib/db';
import { Clock, Users, ArrowRight, Sparkles } from 'lucide-react';

interface TaskListItemProps {
  task: TaskSummary;
  index?: number;
}

function TaskListItemComponent({ task, index = 0 }: TaskListItemProps) {
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
      className="group relative flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-orbit bg-orbit-card p-4 gap-3 sm:gap-6 block text-left outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/60 cursor-pointer card-entrance card-hover-task"
    >
      {/* Left section: Category, Title, Short Description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-orbit-muted group-hover:text-[var(--accent-secondary)] transition-colors">
            {task.category}
          </span>
          <span className="text-orbit-muted">•</span>
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${getDifficultyBadge(
              task.difficulty
            )}`}
          >
            {task.difficulty}
          </span>
          {task.featured && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.2 rounded border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300 shadow-xs">
              <Sparkles size={9} />
              Featured
            </span>
          )}
        </div>

        <h3 className="task-title text-sm sm:text-base font-bold text-orbit-primary group-hover:text-[var(--accent-secondary)] transition-colors duration-200 truncate">
          {task.title}
        </h3>

        <p className="text-xs text-orbit-secondary line-clamp-1 mt-1 transition-opacity duration-200 group-hover:opacity-90">
          {task.shortDescription}
        </p>
      </div>

      {/* Center/Right section: Tech pills, Time, Action */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-3 sm:gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-orbit">
        {/* Technologies */}
        <div className="hidden md:flex items-center gap-1.5">
          {task.technologies.slice(0, 2).map((tech) => (
            <span
              key={tech}
              className="task-tag text-[10px] font-mono px-2 py-0.5 rounded bg-orbit-surface border border-orbit text-orbit-secondary transition-all duration-200"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Time & Participants */}
        <div className="flex items-center gap-3 text-xs text-orbit-muted font-mono">
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-orbit-muted" />
            <span>{task.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} className="text-orbit-muted" />
            <span>{task.participants}</span>
          </div>
        </div>

        {/* View Task action */}
        <span className="btn-interaction inline-flex items-center gap-1 text-xs font-semibold text-orbit-primary px-3 py-1.5 rounded-lg border border-orbit bg-orbit-surface hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 transition-all shrink-0">
          View
          <ArrowRight
            size={12}
            className="task-arrow transition-transform duration-200"
          />
        </span>
      </div>
    </Link>
  );

}

export const TaskListItem = React.memo(TaskListItemComponent);

