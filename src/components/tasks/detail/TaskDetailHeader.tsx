'use client';

import React from 'react';
import Link from 'next/link';
import { TaskRecord } from '@/lib/db';
import { Sparkles } from 'lucide-react';
import { StartTaskModal } from '@/components/tasks/StartTaskModal';

import { AssignmentStatus } from '@/lib/db';

export interface TaskDetailHeaderProps {
  task: TaskRecord;
  assignmentStatus?: AssignmentStatus;
  isStarted?: boolean;
  isStarting?: boolean;
  onStart?: () => void;
  onParticipantUpdate?: (count: number) => void;
}

export function TaskDetailHeader({
  task,
  assignmentStatus,
  isStarted,
  isStarting,
  onStart,
  onParticipantUpdate
}: TaskDetailHeaderProps) {
  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'beginner':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'intermediate':
        return 'text-sky-400 border-sky-500/30 bg-sky-500/10';
      case 'advanced':
        return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      case 'expert':
        return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      default:
        return 'text-zinc-400 border-zinc-700 bg-zinc-800/40';
    }
  };

  return (
    <div className="pb-8 border-b border-orbit space-y-5 anim-fade-up anim-delay-1">
      {/* Badges Row */}
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/tasks?category=${encodeURIComponent(task.category)}`}
          prefetch={true}
          className="text-xs font-bold uppercase tracking-wider text-orbit-muted hover:text-orbit-primary px-2.5 py-1 rounded-md bg-orbit-surface border border-orbit hover:border-[var(--border-hover)] transition-colors"
        >
          {task.category}
        </Link>

        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getDifficultyBadge(
            task.difficulty
          )}`}
        >
          {task.difficulty}
        </span>

        {assignmentStatus === 'COMPLETED' ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Completed
          </span>
        ) : assignmentStatus === 'IN_PROGRESS' || isStarted ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/20 text-[var(--accent-secondary)] shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            In Progress
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {task.status}
          </span>
        )}

        {task.featured && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300 shadow-xs">
            <Sparkles size={12} />
            Featured Challenge
          </span>
        )}
      </div>

      {/* Main Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-orbit-primary">
        {task.title}
      </h1>

      {/* Short Description */}
      <p className="text-sm sm:text-base leading-relaxed text-orbit-secondary max-w-3xl">
        {task.shortDescription}
      </p>

      {/* Technologies & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3">
        {/* Technologies List */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-orbit-muted font-mono mr-1">Stack:</span>
          {task.technologies.map((tech) => (
            <Link
              key={tech}
              href={`/tasks?technology=${encodeURIComponent(tech)}`}
              prefetch={true}
              className="text-xs font-mono px-2.5 py-1 rounded-md bg-orbit-surface border border-orbit text-orbit-secondary hover:border-[var(--accent-primary)] hover:text-orbit-primary transition-colors"
            >
              {tech}
            </Link>
          ))}
        </div>

        {/* Start Task Action */}
        <div className="shrink-0">
          <StartTaskModal
            taskSlug={task.slug}
            taskTitle={task.title}
            assignmentStatus={assignmentStatus}
            isStarted={isStarted}
            isStarting={isStarting}
            onStart={onStart}
            onStarted={onParticipantUpdate}
            buttonId="start-task-button-header"
          />
        </div>
      </div>
    </div>
  );
}

