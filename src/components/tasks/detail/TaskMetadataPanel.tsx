'use client';

import React from 'react';
import Link from 'next/link';
import { TaskRecord } from '@/lib/db';
import {
  BarChart3,
  Calendar,
  Clock,
  Flame,
  Layers,
  Shield,
  Users
} from 'lucide-react';
import { StartTaskModal } from '@/components/tasks/StartTaskModal';

import { TaskSkills } from './TaskSkills';
import { TaskTechnologies } from './TaskTechnologies';

import { AssignmentStatus } from '@/lib/db';

export interface TaskMetadataPanelProps {
  task: TaskRecord;
  assignmentStatus?: AssignmentStatus;
  isStarted?: boolean;
  isStarting?: boolean;
  onStart?: () => void;
  onParticipantUpdate?: (count: number) => void;
}

export function TaskMetadataPanel({
  task,
  assignmentStatus,
  isStarted,
  isStarting,
  onStart,
  onParticipantUpdate
}: TaskMetadataPanelProps) {
  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  });

  return (

    <div className="space-y-6 anim-fade-up anim-delay-2">
      {/* Task Attributes Panel */}
      <div className="card-hover-subtle rounded-2xl border border-orbit bg-orbit-card p-5 space-y-4 text-xs shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-orbit-muted pb-2 border-b border-orbit">
          Task Metadata
        </h3>

        <div className="space-y-3.5">
          {/* Difficulty */}
          <div className="flex items-center justify-between">
            <span className="text-orbit-muted flex items-center gap-1.5">
              <Shield size={13} className="text-orbit-muted" />
              Difficulty
            </span>
            <span className="font-semibold text-orbit-primary">{task.difficulty}</span>
          </div>

          {/* Estimated Time */}
          <div className="flex items-center justify-between">
            <span className="text-orbit-muted flex items-center gap-1.5">
              <Clock size={13} className="text-orbit-muted" />
              Estimated Time
            </span>
            <span className="text-orbit-secondary font-mono">{task.estimatedTime}</span>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between">
            <span className="text-orbit-muted flex items-center gap-1.5">
              <Layers size={13} className="text-orbit-muted" />
              Category
            </span>
            <Link
              href={`/tasks?category=${encodeURIComponent(task.category)}`}
              prefetch={true}
              className="font-medium text-orbit-primary hover:text-[var(--accent-secondary)] transition-colors"
            >
              {task.category}
            </Link>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-orbit-muted flex items-center gap-1.5">
              <BarChart3 size={13} className="text-orbit-muted" />
              Status
            </span>
            {assignmentStatus === 'COMPLETED' ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Completed
              </span>
            ) : assignmentStatus === 'IN_PROGRESS' || isStarted ? (
              <span className="inline-flex items-center gap-1 text-[var(--accent-secondary)] font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                In Progress
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {task.status}
              </span>
            )}
          </div>

          {/* Created Date */}
          <div className="flex items-center justify-between">
            <span className="text-orbit-muted flex items-center gap-1.5">
              <Calendar size={13} className="text-orbit-muted" />
              Created
            </span>
            <span className="text-orbit-secondary" suppressHydrationWarning>{formattedDate}</span>
          </div>

          {/* Participants */}
          <div className="flex items-center justify-between">
            <span className="text-orbit-muted flex items-center gap-1.5">
              <Users size={13} className="text-orbit-muted" />
              Participants
            </span>
            <span className="font-mono text-orbit-primary font-bold">{task.participants}</span>
          </div>

          {/* Popularity */}
          <div className="flex items-center justify-between">
            <span className="text-orbit-muted flex items-center gap-1.5">
              <Flame size={13} className="text-amber-500 dark:text-amber-400" />
              Popularity
            </span>
            <span className="text-amber-500 dark:text-amber-400 font-semibold">{task.popularity}</span>
          </div>
        </div>

        {/* Start Task Action in Sidebar */}
        <div className="pt-3 border-t border-orbit">
          <StartTaskModal
            taskSlug={task.slug}
            taskTitle={task.title}
            assignmentStatus={assignmentStatus}
            isStarted={isStarted}
            isStarting={isStarting}
            onStart={onStart}
            onStarted={onParticipantUpdate}
            className="w-full"
            buttonId="start-task-button-sidebar"
          />
        </div>

      </div>

      {/* Skills Required Panel */}
      <TaskSkills skills={task.skills} />

      {/* Technologies Panel */}
      <TaskTechnologies technologies={task.technologies} />
    </div>
  );
}
