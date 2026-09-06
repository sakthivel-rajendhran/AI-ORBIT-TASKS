'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TaskRecord, TaskAssignment } from '@/lib/db';
import {
  ChevronRight,
  Home,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  CheckSquare,
  Square,
  Save,
  Loader2,
  FileCode2,
  Award
} from 'lucide-react';

interface TaskWorkspaceClientProps {
  task: TaskRecord;
  initialAssignment: TaskAssignment;
}

export function TaskWorkspaceClient({ task, initialAssignment }: TaskWorkspaceClientProps) {
  const [assignment, setAssignment] = useState<TaskAssignment>(initialAssignment);
  const [completedReqs, setCompletedReqs] = useState<Record<number, boolean>>({});
  const [notes, setNotes] = useState(initialAssignment.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedFeedback, setNotesSavedFeedback] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const isCompleted = assignment.status === 'COMPLETED';

  const toggleReq = (idx: number) => {
    setCompletedReqs((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    setNotesSavedFeedback(false);
    try {
      const res = await fetch(`/api/tasks/${encodeURIComponent(task.slug)}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: assignment.userId,
          notes
        })
      });
      if (res.ok) {
        setNotesSavedFeedback(true);
        setTimeout(() => setNotesSavedFeedback(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleMarkComplete = async () => {
    if (isCompleting) return;
    setIsCompleting(true);
    setActionFeedback(null);

    try {
      const res = await fetch(`/api/tasks/${encodeURIComponent(task.slug)}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: assignment.userId,
          notes
        })
      });

      const json = await res.json();
      if (res.ok && json.success && json.assignment) {
        setAssignment(json.assignment);
        setActionFeedback({
          type: 'success',
          message: 'Congratulations! Task successfully verified and marked as COMPLETED.'
        });
      } else {
        setActionFeedback({
          type: 'error',
          message: json.message || 'Unable to update task status. Please try again.'
        });
      }
    } catch (err) {
      console.error('Failed to complete task:', err);
      setActionFeedback({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const formattedStartedDate = new Date(assignment.startedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const totalReqs = task.requirements?.length || 0;
  const checkedCount = Object.values(completedReqs).filter(Boolean).length;
  const progressPercent = totalReqs > 0 ? Math.round((checkedCount / totalReqs) * 100) : 0;

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* 1. Breadcrumbs & Top Navigation */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-1 anim-fade-up anim-delay-0">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-orbit-muted flex-wrap">
          <Link href="/tasks" prefetch={true} className="flex items-center gap-1 hover:text-orbit-primary transition-colors">
            <Home size={13} />
            <span>Tasks</span>
          </Link>
          <ChevronRight size={12} className="text-orbit-muted shrink-0" />
          <Link
            href={`/tasks?category=${encodeURIComponent(task.category)}`}
            prefetch={true}
            className="hover:text-orbit-primary transition-colors truncate max-w-[140px] sm:max-w-none"
          >
            {task.category}
          </Link>
          <ChevronRight size={12} className="text-orbit-muted shrink-0" />
          <Link
            href={`/tasks/${task.slug}`}
            prefetch={true}
            className="hover:text-orbit-primary transition-colors truncate max-w-[180px] sm:max-w-none"
          >
            {task.title}
          </Link>
          <ChevronRight size={12} className="text-orbit-muted shrink-0" />
          <span className="text-[var(--accent-secondary)] font-semibold" aria-current="page">
            Workspace
          </span>
        </nav>

        <Link
          href={`/tasks/${task.slug}`}
          prefetch={true}
          className="btn-interaction inline-flex items-center gap-1.5 text-xs font-semibold text-orbit-secondary hover:text-orbit-primary transition-colors px-3 py-1.5 rounded-lg border border-orbit bg-orbit-card hover:border-[var(--border-hover)] shadow-xs"
        >
          <ArrowLeft size={13} />
          <span>Task Details</span>
        </Link>
      </div>

      {/* 2. Workspace Hero Banner */}
      <div className="relative rounded-2xl border border-orbit bg-orbit-card p-6 sm:p-8 space-y-5 overflow-hidden shadow-sm anim-fade-up anim-delay-1">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-primary)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap anim-fade-up anim-delay-1">
              {isCompleted ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 shadow-xs">
                  <CheckCircle2 size={13} className="text-emerald-500 dark:text-emerald-400" />
                  COMPLETED
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/20 text-[var(--accent-secondary)] shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                  IN PROGRESS
                </span>
              )}

              <span className="text-xs text-orbit-muted font-mono">
                Started: <span className="text-orbit-primary font-semibold">{formattedStartedDate}</span>
              </span>

              <span className="text-orbit-muted">•</span>

              <span className="text-xs font-mono text-orbit-muted truncate max-w-[200px]">
                ID: {assignment.id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-orbit-primary anim-fade-up anim-delay-2">
              {task.title}
            </h1>

            <p className="text-sm sm:text-base text-orbit-secondary max-w-3xl leading-relaxed anim-fade-up anim-delay-3">
              {task.shortDescription}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 anim-fade-up anim-delay-3">
            {!isCompleted ? (
              <button
                type="button"
                onClick={handleMarkComplete}
                disabled={isCompleting}
                className="btn-interaction inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isCompleting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>VERIFYING...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} />
                    <span>MARK AS COMPLETE</span>
                  </>
                )}
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-bold shadow-xs">
                <Award size={15} className="text-emerald-500 dark:text-emerald-400" />
                <span>Challenge Finished</span>
              </div>
            )}
          </div>
        </div>

        {/* Requirements checklist progress bar */}
        {totalReqs > 0 && (
          <div className="pt-2 space-y-1.5 border-t border-orbit anim-fade-up anim-delay-4">
            <div className="flex items-center justify-between text-xs text-orbit-muted">
              <span>Task Checklist Progress</span>
              <span className="font-mono text-orbit-primary font-bold">{checkedCount}/{totalReqs} completed ({progressPercent}%)</span>
            </div>
            <div className="w-full h-1.5 bg-orbit-surface rounded-full overflow-hidden border border-orbit">
              <div
                className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Inline Feedback Notification */}
      {actionFeedback && (
        <div
          role="status"
          className={`rounded-xl border p-4 flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
            actionFeedback.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
              : 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            <CheckCircle2 size={18} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span>{actionFeedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionFeedback(null)}
            className="btn-interaction text-xs opacity-70 hover:opacity-100 transition-opacity px-2 py-1 rounded bg-black/20"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column (8 cols): Overview, Requirements Checklist, Outcome, Working Notes */}
        <div className="lg:col-span-8 space-y-8">
          {/* A. Task Overview */}
          <section className="card-hover-workspace rounded-2xl border border-orbit bg-orbit-card p-6 space-y-4 shadow-sm anim-fade-up anim-delay-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-orbit-muted flex items-center gap-2">
              <FileCode2 size={16} className="text-[var(--accent-primary)]" />
              TASK OVERVIEW
            </h2>
            <p className="text-sm leading-relaxed text-orbit-secondary">
              {task.description}
            </p>
          </section>

          {/* B. Interactive Requirements Checklist */}
          {task.requirements && task.requirements.length > 0 && (
            <section className="card-hover-workspace rounded-2xl border border-orbit bg-orbit-card p-6 space-y-4 shadow-sm anim-fade-up anim-delay-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-orbit-muted flex items-center gap-2">
                  <CheckSquare size={16} className="text-[var(--accent-primary)]" />
                  REQUIREMENTS CHECKLIST
                </h2>
                <span className="text-xs font-mono text-orbit-muted">
                  Click items to mark completed
                </span>
              </div>

              <div className="space-y-2.5">
                {task.requirements.map((req, idx) => {
                  const isChecked = !!completedReqs[idx];
                  return (
                    <button
                      key={req.order}
                      type="button"
                      onClick={() => toggleReq(idx)}
                      className={`btn-interaction w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-orbit-primary'
                          : 'bg-orbit-surface border-orbit text-orbit-primary hover:border-[var(--border-hover)]'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isChecked ? (
                          <CheckSquare size={16} className="text-emerald-500 dark:text-emerald-400" />
                        ) : (
                          <Square size={16} className="text-orbit-muted" />
                        )}
                      </div>
                      <span className={`text-xs sm:text-sm leading-relaxed ${isChecked ? 'line-through opacity-80 text-orbit-muted' : ''}`}>
                        {req.content}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* C. Expected Outcome */}
          <section className="card-hover-workspace rounded-2xl border border-orbit bg-orbit-card p-6 space-y-3 shadow-sm anim-fade-up anim-delay-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-orbit-muted flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500 dark:text-amber-400" />
              EXPECTED OUTCOME
            </h2>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm leading-relaxed text-amber-700 dark:text-amber-200/90">
              {task.expectedOutcome}
            </div>
          </section>

          {/* D. Working Notes / Solution Workspace */}
          <section className="card-hover-workspace rounded-2xl border border-orbit bg-orbit-card p-6 space-y-4 shadow-sm anim-fade-up anim-delay-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-orbit-muted flex items-center gap-2">
                <Save size={16} className="text-[var(--accent-secondary)]" />
                SOLUTION NOTES & REPOSITORY
              </h2>
              {notesSavedFeedback && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 size={13} />
                  Notes saved!
                </span>
              )}
            </div>

            <p className="text-xs text-orbit-muted">
              Record your repository link, architectural decisions, evaluation notes, or implementation details for this challenge.
            </p>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. GitHub repo link, deployment URL, benchmark metrics, or implementation summary..."
              rows={5}
              className="w-full rounded-xl bg-orbit-surface border border-orbit p-3.5 text-xs sm:text-sm text-orbit-primary placeholder-orbit-muted focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]/40 leading-relaxed font-mono transition-all"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="btn-interaction inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-semibold hover:brightness-110 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {isSavingNotes ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={13} />
                    <span>Save Notes</span>
                  </>
                )}
              </button>
            </div>
          </section>
        </div>

        {/* Right Column (4 cols, sticky): Metadata, Technologies, Evaluation */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* Status & Action Card */}
            <div className="card-hover-workspace rounded-2xl border border-orbit bg-orbit-card p-5 space-y-4 shadow-sm anim-fade-up anim-delay-2">
              <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-orbit-muted pb-3 border-b border-orbit">
                ASSIGNMENT STATUS
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-orbit-muted">Status</span>
                  <span className={`font-bold ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--accent-secondary)]'}`}>
                    {assignment.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-orbit-muted">Difficulty</span>
                  <span className="text-orbit-primary font-semibold">{task.difficulty}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-orbit-muted">Estimated Time</span>
                  <span className="text-orbit-secondary font-mono">{task.estimatedTime}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-orbit-muted">Active Participants</span>
                  <span className="text-orbit-primary font-mono">{task.participants}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-orbit space-y-2">
                {!isCompleted ? (
                  <button
                    type="button"
                    onClick={handleMarkComplete}
                    disabled={isCompleting}
                    className="btn-interaction w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
                  >
                    {isCompleting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={14} />
                    )}
                    <span>MARK AS COMPLETE</span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-500 dark:text-emerald-400" />
                    <span>TASK COMPLETED</span>
                  </div>
                )}

                <Link
                  href={`/tasks/${task.slug}`}
                  prefetch={true}
                  className="btn-interaction w-full py-2 rounded-xl bg-orbit-surface hover:bg-orbit-card border border-orbit text-orbit-secondary hover:text-orbit-primary font-medium text-xs text-center block transition-colors shadow-xs"
                >
                  View Task Details
                </Link>
              </div>
            </div>

            {/* Technologies */}
            <div className="card-hover-workspace rounded-2xl border border-orbit bg-orbit-card p-5 space-y-3 shadow-sm anim-fade-up anim-delay-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-orbit-muted pb-2 border-b border-orbit">
                TECHNOLOGIES
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {task.technologies.map((tech) => (
                  <Link
                    key={tech}
                    href={`/tasks?technology=${encodeURIComponent(tech)}`}
                    prefetch={true}
                    className="card-hover-pill text-xs font-mono px-2.5 py-1 rounded-md bg-orbit-surface border border-orbit text-orbit-secondary transition-all"
                  >
                    {tech}
                  </Link>
                ))}
              </div>
            </div>

            {/* Evaluation Criteria */}
            {task.evaluationCriteria && task.evaluationCriteria.length > 0 && (
              <div className="card-hover-workspace rounded-2xl border border-orbit bg-orbit-card p-5 space-y-3 shadow-sm anim-fade-up anim-delay-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-orbit-muted pb-2 border-b border-orbit">
                  EVALUATION CRITERIA
                </h3>
                <ul className="space-y-2 text-xs text-orbit-secondary">
                  {task.evaluationCriteria.map((crit) => (
                    <li key={crit.order} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] mt-1.5 shrink-0" />
                      <span>{crit.criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
