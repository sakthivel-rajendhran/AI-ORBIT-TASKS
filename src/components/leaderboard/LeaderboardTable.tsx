'use client';

import React from 'react';
import { LeaderboardEntry } from '@/lib/leaderboard-service';
import { Flame, CheckCircle } from 'lucide-react';

interface LeaderboardTableProps {
  users: LeaderboardEntry[];
  currentUserId?: string | null;
}

export function LeaderboardTable({ users, currentUserId }: LeaderboardTableProps) {
  if (!users || users.length === 0) {
    return null;
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-amber-400 font-bold">🥇 #1</span>;
    if (rank === 2) return <span className="text-zinc-300 font-bold">🥈 #2</span>;
    if (rank === 3) return <span className="text-amber-600 font-bold">🥉 #3</span>;
    return <span className="font-mono text-zinc-400 font-bold">#{rank}</span>;
  };

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
      {/* Desktop & Tablet Table */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-orbit bg-orbit-card shadow-sm">
        <table className="w-full text-left border-collapse" aria-label="AI Orbit Leaderboard Standings">
          <thead>
            <tr className="border-b border-orbit text-[11px] font-bold uppercase tracking-wider text-orbit-muted bg-orbit-surface">
              <th className="py-3.5 px-4 w-16">Rank</th>
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4 text-center">Tasks</th>
              <th className="py-3.5 px-4 text-right">Score</th>
              <th className="py-3.5 px-4 text-center">Success Rate</th>
              <th className="py-3.5 px-4 text-right pr-6">Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orbit text-xs">
            {users.map((user, index) => {
              const isCurrent = user.isCurrentUser || (currentUserId && user.id === currentUserId);
              return (
                <tr
                  key={user.id}
                  style={{ '--row-delay': `${Math.min(index * 70, 500)}ms` } as React.CSSProperties}
                  className={`row-entrance card-hover-leaderboard-row transition-all cursor-default ${
                    isCurrent
                      ? 'bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/15 border-l-2 border-[var(--accent-primary)]'
                      : 'hover:bg-orbit-surface/80'
                  }`}
                >
                  {/* Rank */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="row-rank inline-block transition-transform duration-200">
                      {getRankBadge(user.rank)}
                    </span>
                  </td>

                  {/* User Profile */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="row-avatar h-8 w-8 rounded-lg bg-orbit-surface border border-orbit flex items-center justify-center font-mono font-bold text-xs text-orbit-secondary shrink-0 transition-transform duration-200">
                        {getInitials(user.name)}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 font-bold text-orbit-primary">
                          <span>{user.name}</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded bg-[var(--accent-primary)]/30 text-[var(--accent-secondary)] text-[10px] font-mono">
                              YOU
                            </span>
                          )}
                          {user.badge && !isCurrent && (
                            <span className="hidden md:inline-flex text-[10px] text-orbit-muted font-normal">
                              ({user.badge})
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-orbit-muted font-mono">
                          @{user.username}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-orbit-surface border border-orbit text-[11px] font-medium text-orbit-secondary">
                      {user.category}
                    </span>
                  </td>

                  {/* Tasks Completed */}
                  <td className="py-4 px-4 text-center font-mono font-bold text-orbit-secondary whitespace-nowrap">
                    {user.tasksCompleted}
                  </td>

                  {/* Score */}
                  <td className="py-4 px-4 text-right font-mono font-bold text-orbit-primary whitespace-nowrap">
                    <span className={`row-score transition-all duration-200 ${user.rank <= 3 ? 'text-amber-500 dark:text-amber-300' : 'text-orbit-primary'}`}>
                      {user.score.toLocaleString()}
                    </span>
                    <span className="text-orbit-muted text-[10px] font-normal ml-1">pts</span>
                  </td>

                  {/* Success Rate */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-1 font-mono text-xs text-orbit-secondary">
                      <CheckCircle size={12} className="text-emerald-600 dark:text-emerald-400" />
                      <span>{user.successRate}%</span>
                    </div>
                  </td>

                  {/* Streak */}
                  <td className="py-4 px-4 text-right pr-6 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1 font-mono text-xs text-amber-500 dark:text-amber-400 justify-end">
                      <Flame size={13} />
                      <span>{user.streakDays}d</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsive Cards Layout (Under 640px) */}
      <div className="sm:hidden space-y-2.5">
        {users.map((user, index) => {
          const isCurrent = user.isCurrentUser || (currentUserId && user.id === currentUserId);
          return (
            <div
              key={user.id}
              style={{ '--card-delay': `${Math.min(index * 70, 500)}ms` } as React.CSSProperties}
              className={`card-entrance card-hover-leaderboard rounded-xl border p-3.5 space-y-3 shadow-xs ${
                isCurrent
                  ? 'border-[var(--accent-primary)]/60 bg-[var(--accent-primary)]/10'
                  : 'border-orbit bg-orbit-card'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="text-xs font-bold">
                    {getRankBadge(user.rank)}
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-orbit-surface border border-orbit flex items-center justify-center font-mono font-bold text-[11px] text-orbit-secondary">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-orbit-primary flex items-center gap-1.5">
                      <span>{user.name}</span>
                      {isCurrent && (
                        <span className="px-1 rounded bg-[var(--accent-primary)] text-white text-[9px] font-mono">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-orbit-muted font-mono">
                      @{user.username}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold font-mono text-orbit-primary">
                    {user.score.toLocaleString()} <span className="text-[10px] text-orbit-muted">pts</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-orbit font-mono text-orbit-muted">
                <span className="truncate max-w-[120px] text-orbit-secondary">{user.category}</span>
                <span>{user.tasksCompleted} tasks</span>
                <span className="text-emerald-600 dark:text-emerald-400">{user.successRate}% acc</span>
                <span className="text-amber-500 dark:text-amber-400 flex items-center gap-0.5">
                  <Flame size={12} />
                  {user.streakDays}d
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
