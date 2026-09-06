'use client';

import React from 'react';
import { Trophy, Users, Layers, Award } from 'lucide-react';

interface LeaderboardHeaderProps {
  totalParticipants?: number;
  totalChallenges?: number;
  totalCategories?: number;
}

export function LeaderboardHeader({
  totalParticipants = 1245,
  totalChallenges = 26,
  totalCategories = 9
}: LeaderboardHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Badge & Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 text-xs font-semibold text-[var(--accent-secondary)] anim-fade-up anim-delay-0">
          <Trophy size={13} className="text-[var(--accent-primary)]" />
          <span>AI Orbit Ecosystem</span>
          <span className="text-orbit-muted">•</span>
          <span>Global Leaderboard</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-orbit-primary anim-fade-up anim-delay-1">
          Leaderboard
        </h1>

        <p className="text-sm sm:text-base text-orbit-secondary max-w-2xl leading-relaxed anim-fade-up anim-delay-2">
          Track the top performers across AI challenges, autonomous agents, and practical evaluation benchmarks.
        </p>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xl anim-fade-up anim-delay-3">
        <div className="card-hover-stat rounded-xl border border-orbit bg-orbit-card p-3.5 sm:p-4 cursor-default">
          <div className="flex items-center gap-1.5 text-orbit-muted text-xs font-medium">
            <Users size={13} className="stat-icon transition-transform duration-200" />
            <span>Participants</span>
          </div>
          <div className="mt-1 text-lg sm:text-2xl font-bold font-mono text-orbit-primary stat-number transition-all duration-200">
            {totalParticipants.toLocaleString()}
          </div>
        </div>

        <div className="card-hover-stat rounded-xl border border-orbit bg-orbit-card p-3.5 sm:p-4 cursor-default">
          <div className="flex items-center gap-1.5 text-orbit-muted text-xs font-medium">
            <Award size={13} className="stat-icon transition-transform duration-200" />
            <span>Challenges</span>
          </div>
          <div className="mt-1 text-lg sm:text-2xl font-bold font-mono text-orbit-primary stat-number transition-all duration-200">
            {totalChallenges}
          </div>
        </div>

        <div className="card-hover-stat rounded-xl border border-orbit bg-orbit-card p-3.5 sm:p-4 cursor-default">
          <div className="flex items-center gap-1.5 text-orbit-muted text-xs font-medium">
            <Layers size={13} className="stat-icon transition-transform duration-200" />
            <span>Categories</span>
          </div>
          <div className="mt-1 text-lg sm:text-2xl font-bold font-mono text-orbit-primary stat-number transition-all duration-200">
            {totalCategories}
          </div>
        </div>
      </div>
    </div>
  );
}
