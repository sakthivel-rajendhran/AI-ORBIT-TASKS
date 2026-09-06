'use client';

import React from 'react';
import Link from 'next/link';
import { LeaderboardEntry } from '@/lib/leaderboard-service';
import { User, Sparkles, ArrowRight } from 'lucide-react';

interface LeaderboardCurrentUserProps {
  currentUser: LeaderboardEntry | null;
}

export function LeaderboardCurrentUser({ currentUser }: LeaderboardCurrentUserProps) {
  if (!currentUser) {
    return (
      <div className="rounded-2xl border border-dashed border-orbit bg-orbit-card p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 card-entrance card-hover-subtle shadow-xs">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orbit-surface border border-orbit text-orbit-muted">
            <User size={18} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-orbit-primary uppercase tracking-wider">
              Your Leaderboard Standing
            </h3>
            <p className="text-xs text-orbit-secondary">
              Complete AI challenges to earn points and claim your spot on the global leaderboard!
            </p>
          </div>
        </div>

        <Link
          href="/tasks"
          prefetch={true}
          className="btn-interaction inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-semibold hover:brightness-110 transition-all shadow-sm shrink-0"
        >
          <Sparkles size={13} />
          <span>Explore Challenges</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-[var(--accent-primary)]/50 bg-orbit-card p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm card-entrance card-hover-leaderboard">
      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-primary)] text-white font-extrabold font-mono text-base shadow-xs">
          #{currentUser.rank}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-secondary)]">
              Your Rank
            </span>
            <span className="text-orbit-muted">•</span>
            <span className="text-xs text-orbit-muted">{currentUser.name}</span>
          </div>
          <div className="flex items-center gap-4 mt-1 flex-wrap">
            <span className="text-sm sm:text-base font-extrabold font-mono text-orbit-primary">
              {currentUser.score.toLocaleString()} <span className="text-xs font-normal text-[var(--accent-secondary)]">points</span>
            </span>
            <span className="text-orbit-muted">•</span>
            <span className="text-xs font-mono text-orbit-secondary">
              {currentUser.tasksCompleted} tasks completed
            </span>
            {currentUser.successRate > 0 && (
              <>
                <span className="text-orbit-muted">•</span>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                  {currentUser.successRate}% success
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <Link
        href="/tasks"
        prefetch={true}
        className="btn-interaction inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[var(--accent-primary)]/40 bg-orbit-surface text-xs font-semibold text-orbit-primary hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 transition-colors shrink-0 shadow-xs"
      >
        <span>Continue Challenge</span>
        <ArrowRight size={12} />
      </Link>
    </div>
  );
}
