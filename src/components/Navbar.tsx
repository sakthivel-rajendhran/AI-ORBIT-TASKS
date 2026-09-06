'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Plus, Sparkles, Orbit, ClipboardList, Trophy, Brain, Bot } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isTasksActive = pathname === '/tasks' || pathname?.startsWith('/tasks/');
  const isLeaderboardActive = pathname === '/leaderboard' || pathname?.startsWith('/leaderboard/');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orbit bg-orbit-surface/85 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex lg:hidden h-9 w-9 items-center justify-center rounded-lg border border-orbit bg-orbit-card text-orbit-secondary hover:text-orbit-primary transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <Link href="/tasks" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/35 text-[#8B5CF6] group-hover:scale-105 transition-transform shrink-0">
              <Orbit size={18} className="animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] sm:text-[15px] font-bold tracking-tight text-orbit-primary flex items-center gap-1.5">
                AI ORBIT
                <span className="hidden min-[360px]:inline text-[10px] font-medium px-1.5 py-0.2 rounded bg-orbit-subtle border border-orbit text-orbit-secondary font-mono">
                  TASKS
                </span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation links (Text-only on desktop) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
          <Link
            href="/tasks"
            prefetch={true}
            className={`text-[13px] font-semibold transition-colors flex items-center gap-1.5 ${
              isTasksActive
                ? 'text-orbit-primary'
                : 'text-orbit-secondary hover:text-orbit-primary'
            }`}
          >
            {isTasksActive && (
              <span className="nav-dot-active h-1.5 w-1.5 rounded-full bg-[#8B5CF6] shrink-0" />
            )}
            AI Tasks
          </Link>
          <Link
            href="/leaderboard"
            prefetch={true}
            className={`text-[13px] font-semibold transition-colors flex items-center gap-1.5 ${
              isLeaderboardActive
                ? 'text-orbit-primary'
                : 'text-orbit-secondary hover:text-orbit-primary'
            }`}
          >
            {isLeaderboardActive && (
              <span className="nav-dot-active h-1.5 w-1.5 rounded-full bg-[#8B5CF6] shrink-0" />
            )}
            Leaderboard
          </Link>
          <Link
            href="/tasks?category=Generative%20AI"
            prefetch={true}
            className="text-[13px] font-semibold text-orbit-secondary hover:text-orbit-primary transition-colors"
          >
            AI Models
          </Link>
          <Link
            href="/tasks?category=AI%20Agents"
            prefetch={true}
            className="text-[13px] font-semibold text-orbit-secondary hover:text-orbit-primary transition-colors"
          >
            Agents
          </Link>
          <Link
            href="/tasks?sort=newest"
            prefetch={true}
            className="text-[13px] font-semibold text-orbit-secondary hover:text-orbit-primary transition-colors"
          >
            New Tasks
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          <Link
            href="/tasks"
            prefetch={true}
            className="hidden xl:inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-orbit-secondary border border-orbit hover:border-orbit-hover hover:text-orbit-primary transition-colors"
          >
            <Sparkles size={13} className="text-[#8B5CF6]" />
            26 Challenges
          </Link>

          <Link
            href="/tasks"
            prefetch={true}
            className="btn-interaction inline-flex h-[32px] sm:h-[34px] items-center gap-1.5 rounded-full px-2.5 sm:px-4 text-xs font-semibold bg-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)] hover:brightness-110 shrink-0"
          >
            <Plus size={13} strokeWidth={2.5} />
            <span className="hidden min-[380px]:inline">Submit Task</span>
            <span className="min-[380px]:hidden">Submit</span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-b border-orbit bg-orbit-surface px-4 py-4 space-y-3">
          <Link
            href="/tasks"
            prefetch={true}
            onClick={() => setMobileOpen(false)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              isTasksActive
                ? 'text-orbit-primary bg-orbit-card border border-orbit'
                : 'text-orbit-secondary hover:text-orbit-primary'
            }`}
          >
            {isTasksActive && <span className="nav-dot-active h-1.5 w-1.5 rounded-full bg-[#8B5CF6] shrink-0" />}
            <ClipboardList size={16} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
            <span>AI Tasks</span>
          </Link>
          <Link
            href="/leaderboard"
            prefetch={true}
            onClick={() => setMobileOpen(false)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              isLeaderboardActive
                ? 'text-orbit-primary bg-orbit-card border border-orbit'
                : 'text-orbit-secondary hover:text-orbit-primary'
            }`}
          >
            {isLeaderboardActive && <span className="nav-dot-active h-1.5 w-1.5 rounded-full bg-[#8B5CF6] shrink-0" />}
            <Trophy size={16} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
            <span>Leaderboard</span>
          </Link>
          <Link
            href="/tasks?category=Generative%20AI"
            prefetch={true}
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-lg text-sm font-semibold text-orbit-secondary hover:text-orbit-primary transition-colors flex items-center gap-2"
          >
            <Brain size={16} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
            <span>AI Models</span>
          </Link>
          <Link
            href="/tasks?category=AI%20Agents"
            prefetch={true}
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-lg text-sm font-semibold text-orbit-secondary hover:text-orbit-primary transition-colors flex items-center gap-2"
          >
            <Bot size={16} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
            <span>Agents</span>
          </Link>
          <Link
            href="/tasks?sort=newest"
            prefetch={true}
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-lg text-sm font-semibold text-orbit-secondary hover:text-orbit-primary transition-colors flex items-center gap-2"
          >
            <Sparkles size={16} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
            <span>New Tasks</span>
          </Link>

          <div className="pt-2 border-t border-orbit flex items-center justify-between">
            <span className="text-xs text-orbit-secondary font-medium">Switch Theme</span>
            <ThemeToggle showLabel={true} />
          </div>
        </div>
      )}
    </header>
  );
}
