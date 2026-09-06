'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TaskRecord, TaskAssignment, AssignmentStatus } from '@/lib/db';
import { ChevronRight, Home, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { TaskDetailHeader } from './TaskDetailHeader';
import { TaskOverview } from './TaskOverview';
import { TaskRequirements } from './TaskRequirements';
import { TaskConstraints } from './TaskConstraints';
import { TaskExpectedOutcome } from './TaskExpectedOutcome';
import { TaskEvaluation } from './TaskEvaluation';
import { TaskMetadataPanel } from './TaskMetadataPanel';
import { RelatedTasks } from './RelatedTasks';

interface TaskDetailViewProps {
  initialTask: TaskRecord;
  initialAssignment?: TaskAssignment | null;
}

function subscribeStorage(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getStoredStartedState(slug: string) {
  if (typeof window === 'undefined' || !slug) return false;
  return sessionStorage.getItem(`started_task_${slug.trim().toLowerCase()}`) === 'true';
}

export function TaskDetailView({ initialTask, initialAssignment }: TaskDetailViewProps) {
  const router = useRouter();
  const [task, setTask] = useState<TaskRecord>(initialTask);
  const [assignment, setAssignment] = useState<TaskAssignment | null>(initialAssignment || null);
  const [internalStarted, setInternalStarted] = useState(
    initialAssignment?.status === 'IN_PROGRESS' || initialAssignment?.status === 'COMPLETED'
  );
  const [isStarting, setIsStarting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const isSubmittingRef = React.useRef(false);

  const isSessionStarted = useSyncExternalStore(
    subscribeStorage,
    () => getStoredStartedState(task.slug),
    () => false
  );

  const isStarted =
    assignment?.status === 'IN_PROGRESS' ||
    assignment?.status === 'COMPLETED' ||
    internalStarted ||
    isSessionStarted;

  const currentStatus: AssignmentStatus =
    assignment?.status || (isStarted ? 'IN_PROGRESS' : 'NOT_STARTED');

  const handleParticipantUpdate = (newCount: number) => {
    setTask((prev) => ({
      ...prev,
      participants: newCount
    }));
  };

  const handleStartTask = async () => {
    const cleanSlug = task.slug.trim().toLowerCase();

    // If already started or completed, directly open workspace
    if (isStarted && !isStarting) {
      const targetUrl = `/tasks/${encodeURIComponent(cleanSlug)}/workspace`;
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = targetUrl;
      } else {
        router.push(targetUrl);
      }
      return;
    }

    if (isStarting || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsStarting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/tasks/${encodeURIComponent(cleanSlug)}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setInternalStarted(true);
        if (json.assignment) {
          setAssignment(json.assignment);
        }
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`started_task_${cleanSlug}`, 'true');
          window.dispatchEvent(new Event('storage'));
        }
        if (json.data?.participants) {
          handleParticipantUpdate(json.data.participants);
        }
        // Navigate directly to the task workspace
        const targetUrl = json.workspaceUrl || `/tasks/${encodeURIComponent(cleanSlug)}/workspace`;
        if (typeof window !== 'undefined') {
          window.location.href = targetUrl;
        } else {
          router.push(targetUrl);
        }
        // Keep loading state until transition completes or safety timeout fires
        setTimeout(() => {
          setIsStarting(false);
          isSubmittingRef.current = false;
        }, 3000);
      } else {
        setFeedback({
          type: 'error',
          message: json.message || 'Unable to start task. Please try again.'
        });
        setIsStarting(false);
        isSubmittingRef.current = false;
      }
    } catch (err) {
      console.error('Failed to start task:', err);
      setFeedback({
        type: 'error',
        message: 'Network connection failure. Please check your internet connection and try again.'
      });
      setIsStarting(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
      {/* 1. Breadcrumb and Back Navigation */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-1">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-400 flex-wrap">
          <Link
            href="/tasks"
            prefetch={true}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Home size={13} />
            <span>Tasks</span>
          </Link>

          <ChevronRight size={12} className="text-zinc-600 shrink-0" />

          <Link
            href={`/tasks?category=${encodeURIComponent(task.category)}`}
            prefetch={true}
            className="hover:text-white transition-colors truncate max-w-[150px] sm:max-w-none"
          >
            {task.category}
          </Link>

          <ChevronRight size={12} className="text-zinc-600 shrink-0" />

          <span className="text-white font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
            {task.title}
          </span>
        </nav>

        <Link
          href="/tasks"
          prefetch={true}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors group px-3 py-1.5 rounded-lg border border-[#1C1C21] bg-[#0c0c0f] hover:border-zinc-700 hover:bg-[#121216]"
        >
          <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Tasks</span>
        </Link>
      </div>

      {/* Inline Feedback Banner */}
      {feedback && (
        <div
          role="status"
          className={`rounded-xl border p-4 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200 ${
            feedback.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            {feedback.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-rose-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>

          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 transition-opacity px-2 py-1 rounded bg-black/20"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Task Header */}
      <TaskDetailHeader
        task={task}
        assignmentStatus={currentStatus}
        isStarted={isStarted}
        isStarting={isStarting}
        onStart={handleStartTask}
        onParticipantUpdate={handleParticipantUpdate}
      />


      {/* 3. Main Content & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column (8 cols): Overview, Requirements, Constraints, Expected Outcome, Evaluation */}
        <div className="lg:col-span-8 space-y-10">
          <TaskOverview task={task} />

          {task.requirements && task.requirements.length > 0 && (
            <TaskRequirements requirements={task.requirements} />
          )}

          {task.constraints && task.constraints.length > 0 && (
            <TaskConstraints constraints={task.constraints} />
          )}

          {task.expectedOutcome && (
            <TaskExpectedOutcome expectedOutcome={task.expectedOutcome} />
          )}

          {task.evaluationCriteria && task.evaluationCriteria.length > 0 && (
            <TaskEvaluation evaluations={task.evaluationCriteria} />
          )}
        </div>

        {/* Right Column (4 cols): Metadata, Required Skills, Technologies */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <TaskMetadataPanel
              task={task}
              assignmentStatus={currentStatus}
              isStarted={isStarted}
              isStarting={isStarting}
              onStart={handleStartTask}
              onParticipantUpdate={handleParticipantUpdate}
            />
          </div>
        </div>
      </div>

      {/* 4. Related Tasks */}
      {task.relatedTasks && task.relatedTasks.length > 0 && (
        <RelatedTasks relatedTasks={task.relatedTasks} />
      )}
    </div>
  );
}
