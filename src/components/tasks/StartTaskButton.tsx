'use client';

import React, { useState, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Play, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AssignmentStatus } from '@/lib/db';

export interface StartTaskButtonProps {
  taskSlug: string;
  taskTitle: string;
  assignmentStatus?: AssignmentStatus;
  isStarted?: boolean;
  isStarting?: boolean;
  onStart?: () => void | Promise<void>;
  onStarted?: (newParticipants: number) => void;
  className?: string;
  buttonId?: string;
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

export function StartTaskButton({
  taskSlug,
  taskTitle,
  assignmentStatus,
  isStarted: controlledIsStarted,
  isStarting: controlledIsStarting,
  onStart: controlledOnStart,
  onStarted,
  className = '',
  buttonId = 'start-task-button'
}: StartTaskButtonProps) {
  const router = useRouter();
  const [internalStarted, setInternalStarted] = useState(false);
  const [internalStarting, setInternalStarting] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);

  const cleanSlug = (taskSlug || '').trim().toLowerCase();

  const isSessionStarted = useSyncExternalStore(
    subscribeStorage,
    () => getStoredStartedState(cleanSlug),
    () => false
  );

  const isStarted =
    assignmentStatus === 'IN_PROGRESS' ||
    assignmentStatus === 'COMPLETED' ||
    (controlledIsStarted !== undefined
      ? controlledIsStarted
      : internalStarted || isSessionStarted);

  const isCompleted = assignmentStatus === 'COMPLETED';
  const isStarting =
    controlledIsStarting !== undefined ? controlledIsStarting : internalStarting;

  const handleButtonClick = async () => {
    // If task is already started or completed, directly navigate to workspace
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

    // Guard against multiple clicks while request is running
    if (isStarting || isSubmittingRef.current) {
      return;
    }

    if (controlledOnStart) {
      await controlledOnStart();
      return;
    }

    isSubmittingRef.current = true;
    setInternalStarting(true);
    setInternalError(null);

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
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`started_task_${cleanSlug}`, 'true');
          window.dispatchEvent(new Event('storage'));
        }
        if (onStarted && json.data?.participants) {
          onStarted(json.data.participants);
        }
        // Navigate to the task workspace
        const targetUrl = json.workspaceUrl || `/tasks/${encodeURIComponent(cleanSlug)}/workspace`;
        if (typeof window !== 'undefined') {
          window.location.href = targetUrl;
        } else {
          router.push(targetUrl);
        }
        setTimeout(() => {
          setInternalStarting(false);
          isSubmittingRef.current = false;
        }, 3000);
      } else {
        setInternalError(json.message || 'Unable to start task. Please try again.');
        setInternalStarting(false);
        isSubmittingRef.current = false;
      }
    } catch (err: unknown) {
      console.error('Failed to start task:', err);
      setInternalError('Unable to start task. Please check your connection and try again.');
      setInternalStarting(false);
      isSubmittingRef.current = false;
    }
  };

  // If already completed and not in starting transition, render Link
  if (isCompleted && !isStarting) {
    const targetUrl = `/tasks/${encodeURIComponent(cleanSlug)}/workspace`;
    return (
      <div className="flex flex-col gap-1.5 w-full sm:w-auto">
        <Link
          href={targetUrl}
          id={buttonId}
          prefetch={false}
          onClick={(e) => {
            if (typeof window !== 'undefined') {
              e.preventDefault();
              // eslint-disable-next-line @next/next/no-location-assign-relative-destination
              window.location.href = targetUrl;
            }
          }}
          aria-label={`View completed workspace: ${taskTitle}`}
          className={`btn-interaction btn-start-task group inline-flex items-center justify-center gap-2 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all select-none cursor-pointer bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/25 shadow-xs ${className}`}
        >
          <CheckCircle2 size={15} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
          <span className="tracking-wide font-bold">VIEW WORKSPACE</span>
          <ArrowRight size={14} className="btn-arrow shrink-0 transition-transform" />
        </Link>
      </div>
    );
  }

  // If already started and not in starting transition, render Link
  if (isStarted && !isStarting) {
    const targetUrl = `/tasks/${encodeURIComponent(cleanSlug)}/workspace`;
    return (
      <div className="flex flex-col gap-1.5 w-full sm:w-auto">
        <Link
          href={targetUrl}
          id={buttonId}
          prefetch={false}
          onClick={(e) => {
            if (typeof window !== 'undefined') {
              e.preventDefault();
              // eslint-disable-next-line @next/next/no-location-assign-relative-destination
              window.location.href = targetUrl;
            }
          }}
          aria-label={`Continue task workspace: ${taskTitle}`}
          className={`btn-interaction btn-start-task group inline-flex items-center justify-center gap-2 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all select-none cursor-pointer bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/40 text-[var(--accent-secondary)] hover:bg-[var(--accent-primary)]/25 shadow-xs ${className}`}
        >
          <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)] animate-pulse shrink-0" />
          <span className="tracking-wide font-bold">CONTINUE TASK</span>
          <ArrowRight size={14} className="btn-arrow shrink-0 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 w-full sm:w-auto">
      <button
        type="button"
        id={buttonId}
        onClick={handleButtonClick}
        disabled={isStarting}
        aria-label={
          isStarting
            ? `Starting task: ${taskTitle}`
            : `Start task: ${taskTitle}`
        }
        className={`btn-interaction btn-start-task inline-flex items-center justify-center gap-2 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all select-none cursor-pointer shadow-sm ${
          isStarting
            ? 'bg-[var(--accent-primary)]/80 text-white cursor-not-allowed opacity-90'
            : 'bg-[var(--accent-primary)] text-white hover:brightness-110 hover:shadow-md'
        } ${className}`}
      >
        {isStarting ? (
          <>
            <Loader2 size={15} className="animate-spin text-white shrink-0" />
            <span className="tracking-wide font-bold">STARTING...</span>
          </>
        ) : (
          <>
            <Play size={14} fill="currentColor" className="shrink-0" />
            <span className="tracking-wide font-bold">START TASK</span>
          </>
        )}
      </button>

      {internalError && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg mt-1 animate-in fade-in">
          <AlertCircle size={13} className="shrink-0" />
          <span>{internalError}</span>
        </div>
      )}
    </div>
  );
}

// Re-export for backwards compatibility
export const StartTaskModal = StartTaskButton;
