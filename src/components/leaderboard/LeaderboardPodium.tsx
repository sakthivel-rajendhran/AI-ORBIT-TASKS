'use client';

import React from 'react';
import { LeaderboardEntry } from '@/lib/leaderboard-service';
import { Flame, CheckCircle2 } from 'lucide-react';

interface LeaderboardPodiumProps {
  podium: LeaderboardEntry[];
}

export function LeaderboardPodium({ podium }: LeaderboardPodiumProps) {
  if (!podium || podium.length < 3) return null;

  const first = podium[0];
  const second = podium[1];
  const third = podium[2];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-orbit">
        <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-orbit-muted">
          Top Performers Podium
        </h2>
        <span className="text-[11px] font-mono text-orbit-muted">Live Standings</span>
      </div>

      {/* Desktop / Tablet: 3-column Podium Layout (#2 Left, #1 Center Elevated, #3 Right) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-end pt-4 sm:pt-6">
        {/* RANK 2: SILVER */}
        <div className="order-2 md:order-1 rounded-2xl border border-orbit bg-orbit-card p-5 flex flex-col items-center text-center relative card-hover-leaderboard anim-fade-up anim-delay-1 shadow-sm">
          <div className="absolute -top-3.5 flex items-center justify-center h-7 px-3 rounded-full bg-orbit-surface border border-zinc-400/50 text-orbit-primary text-xs font-bold shadow-xs">
            🥈 #2 Silver
          </div>

          <div className="mt-3 h-16 w-16 rounded-full bg-gradient-to-tr from-zinc-400 to-zinc-600 p-0.5 shadow-inner">
            <div className="h-full w-full rounded-full bg-orbit-card flex items-center justify-center font-mono font-bold text-base text-orbit-primary">
              {getInitials(second.name)}
            </div>
          </div>

          <h3 className="mt-3 text-base font-bold text-orbit-primary tracking-tight truncate max-w-[200px]">
            {second.name}
          </h3>
          <span className="text-xs text-orbit-muted font-mono">@{second.username}</span>

          <div className="mt-3 px-2.5 py-0.5 rounded-md bg-orbit-surface border border-orbit text-[11px] font-medium text-orbit-secondary">
            {second.category}
          </div>

          <div className="mt-4 pt-4 border-t border-orbit w-full flex items-center justify-around text-xs">
            <div>
              <div className="text-[10px] text-orbit-muted uppercase tracking-wider">Score</div>
              <div className="text-base font-extrabold font-mono text-orbit-primary">
                {second.score.toLocaleString()} <span className="text-xs font-normal text-orbit-muted">pts</span>
              </div>
            </div>
            <div className="h-6 w-px bg-orbit" />
            <div>
              <div className="text-[10px] text-orbit-muted uppercase tracking-wider">Tasks</div>
              <div className="text-base font-bold font-mono text-orbit-secondary">
                {second.tasksCompleted}
              </div>
            </div>
          </div>
        </div>

        {/* RANK 1: GOLD (ELEVATED) */}
        <div className="order-1 md:order-2 rounded-2xl border-2 border-[var(--accent-primary)]/60 bg-orbit-card p-6 sm:p-7 flex flex-col items-center text-center relative card-hover-leaderboard anim-fade-up anim-delay-0 shadow-lg md:-translate-y-2">
          <div className="absolute -top-4 flex items-center gap-1.5 justify-center h-8 px-4 rounded-full bg-[var(--accent-primary)] text-white text-xs font-bold shadow-md">
            <span>🥇</span>
            <span>#1 Champion</span>
          </div>

          <div className="mt-2 h-20 w-20 rounded-full bg-gradient-to-tr from-amber-400 to-[var(--accent-primary)] p-1 shadow-md">
            <div className="h-full w-full rounded-full bg-orbit-card flex items-center justify-center font-mono font-extrabold text-xl text-orbit-primary">
              {getInitials(first.name)}
            </div>
          </div>

          <h3 className="mt-3 text-lg font-extrabold text-orbit-primary tracking-tight truncate max-w-[220px]">
            {first.name}
          </h3>
          <span className="text-xs text-[var(--accent-secondary)] font-mono">@{first.username}</span>

          <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 text-xs font-semibold text-[var(--accent-secondary)]">
            <CheckCircle2 size={12} />
            <span>{first.badge || first.category}</span>
          </div>

          <div className="mt-5 pt-4 border-t border-orbit w-full flex items-center justify-around text-xs">
            <div>
              <div className="text-[10px] text-orbit-muted uppercase tracking-wider">Score</div>
              <div className="text-xl font-black font-mono text-orbit-primary">
                {first.score.toLocaleString()} <span className="text-xs font-normal text-[var(--accent-secondary)]">pts</span>
              </div>
            </div>
            <div className="h-8 w-px bg-orbit" />
            <div>
              <div className="text-[10px] text-orbit-muted uppercase tracking-wider">Tasks</div>
              <div className="text-xl font-bold font-mono text-orbit-primary">
                {first.tasksCompleted}
              </div>
            </div>
            <div className="h-8 w-px bg-orbit" />
            <div>
              <div className="text-[10px] text-orbit-muted uppercase tracking-wider">Streak</div>
              <div className="text-xl font-bold font-mono text-amber-500 dark:text-amber-400 flex items-center gap-0.5 justify-center">
                <Flame size={14} />
                <span>{first.streakDays}d</span>
              </div>
            </div>
          </div>
        </div>

        {/* RANK 3: BRONZE */}
        <div className="order-3 rounded-2xl border border-orbit bg-orbit-card p-5 flex flex-col items-center text-center relative card-hover-leaderboard anim-fade-up anim-delay-2 shadow-sm">
          <div className="absolute -top-3.5 flex items-center justify-center h-7 px-3 rounded-full bg-orbit-surface border border-amber-600/50 text-orbit-primary text-xs font-bold shadow-xs">
            🥉 #3 Bronze
          </div>

          <div className="mt-3 h-16 w-16 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 p-0.5 shadow-inner">
            <div className="h-full w-full rounded-full bg-orbit-card flex items-center justify-center font-mono font-bold text-base text-orbit-primary">
              {getInitials(third.name)}
            </div>
          </div>

          <h3 className="mt-3 text-base font-bold text-orbit-primary tracking-tight truncate max-w-[200px]">
            {third.name}
          </h3>
          <span className="text-xs text-orbit-muted font-mono">@{third.username}</span>

          <div className="mt-3 px-2.5 py-0.5 rounded-md bg-orbit-surface border border-orbit text-[11px] font-medium text-orbit-secondary">
            {third.category}
          </div>

          <div className="mt-4 pt-4 border-t border-orbit w-full flex items-center justify-around text-xs">
            <div>
              <div className="text-[10px] text-orbit-muted uppercase tracking-wider">Score</div>
              <div className="text-base font-extrabold font-mono text-orbit-primary">
                {third.score.toLocaleString()} <span className="text-xs font-normal text-orbit-muted">pts</span>
              </div>
            </div>
            <div className="h-6 w-px bg-orbit" />
            <div>
              <div className="text-[10px] text-orbit-muted uppercase tracking-wider">Tasks</div>
              <div className="text-base font-bold font-mono text-orbit-secondary">
                {third.tasksCompleted}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
