'use client';

import React from 'react';
import Link from 'next/link';
import { Orbit, ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-orbit-surface text-orbit-primary pt-12 pb-8 border-t border-orbit mt-auto transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-8 sm:gap-12 lg:gap-20">
          {/* Brand Column */}
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)]">
                <Orbit size={16} />
              </div>
              <span className="text-[16px] font-bold tracking-tight text-orbit-primary">
                AI ORBIT
              </span>
            </div>
            <p className="text-[13px] text-orbit-secondary mb-2 font-medium">
              The Home of Everything AI.
            </p>
            <p className="text-[12px] leading-relaxed text-orbit-muted mb-6 max-w-[320px]">
              Discover practical AI tasks, challenges, benchmark problems, and skills shaping the global artificial intelligence ecosystem.
            </p>
          </div>

          {/* Links Grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex flex-col">
              <div className="mb-3">
                <h4 className="text-[11px] font-bold text-orbit-primary tracking-[0.08em] uppercase mb-2">
                  EXPLORE
                </h4>
                <div className="h-px w-10 bg-[var(--border-subtle)]" />
              </div>
              <ul className="space-y-2 text-[12px] text-orbit-secondary">
                <li><Link href="/tasks" prefetch={true} className="hover:text-orbit-primary transition-colors">AI Tasks</Link></li>
                <li><Link href="/tasks?category=AI%20Agents" prefetch={true} className="hover:text-orbit-primary transition-colors">AI Agents</Link></li>
                <li><Link href="/tasks?category=Generative%20AI" prefetch={true} className="hover:text-orbit-primary transition-colors">AI Models</Link></li>
                <li><Link href="/tasks?difficulty=Advanced" prefetch={true} className="hover:text-orbit-primary transition-colors">Advanced Tasks</Link></li>
              </ul>
            </div>

            <div className="flex flex-col">
              <div className="mb-3">
                <h4 className="text-[11px] font-bold text-orbit-primary tracking-[0.08em] uppercase mb-2">
                  DISCOVER
                </h4>
                <div className="h-px w-10 bg-[var(--border-subtle)]" />
              </div>
              <ul className="space-y-2 text-[12px] text-orbit-secondary">
                <li><Link href="/leaderboard" prefetch={true} className="hover:text-orbit-primary transition-colors">Leaderboard</Link></li>
                <li><Link href="/tasks?sort=featured" prefetch={true} className="hover:text-orbit-primary transition-colors">Featured Challenges</Link></li>
                <li><Link href="/tasks?sort=newest" prefetch={true} className="hover:text-orbit-primary transition-colors">New Additions</Link></li>
                <li><Link href="/tasks?difficulty=Beginner" prefetch={true} className="hover:text-orbit-primary transition-colors">Beginner Friendly</Link></li>
              </ul>
            </div>

            <div className="flex flex-col">
              <div className="mb-3">
                <h4 className="text-[11px] font-bold text-orbit-primary tracking-[0.08em] uppercase mb-2">
                  CATEGORIES
                </h4>
                <div className="h-px w-10 bg-[var(--border-subtle)]" />
              </div>
              <ul className="space-y-2 text-[12px] text-orbit-secondary">
                <li><Link href="/tasks?category=Generative%20AI" prefetch={true} className="hover:text-orbit-primary transition-colors">Generative AI</Link></li>
                <li><Link href="/tasks?category=AI%20Agents" prefetch={true} className="hover:text-orbit-primary transition-colors">AI Agents</Link></li>
                <li><Link href="/tasks?category=Computer%20Vision" prefetch={true} className="hover:text-orbit-primary transition-colors">Computer Vision</Link></li>
                <li><Link href="/tasks?category=Robotics" prefetch={true} className="hover:text-orbit-primary transition-colors">Robotics</Link></li>
              </ul>
            </div>

            <div className="flex flex-col">
              <div className="mb-3">
                <h4 className="text-[11px] font-bold text-orbit-primary tracking-[0.08em] uppercase mb-2">
                  PLATFORM
                </h4>
                <div className="h-px w-10 bg-[var(--border-subtle)]" />
              </div>
              <ul className="space-y-2 text-[12px] text-orbit-secondary">
                <li><Link href="/tasks" prefetch={true} className="hover:text-orbit-primary transition-colors">Browse Challenges</Link></li>
                <li><Link href="/api/tasks" target="_blank" className="hover:text-orbit-primary transition-colors">API Docs</Link></li>
                <li><Link href="/tasks" prefetch={true} className="hover:text-orbit-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/tasks" prefetch={true} className="hover:text-orbit-primary transition-colors">Privacy Policy</Link></li>
              </ul>

            </div>
          </div>
        </div>

        {/* Bottom copyright & Scroll To Top */}
        <div className="mt-10 pt-6 border-t border-orbit flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-orbit-muted">
            &copy; 2026 AI Orbit. Built for the Full Stack Trial.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="btn-interaction flex h-9 w-9 items-center justify-center rounded-full border border-orbit bg-orbit-card text-orbit-secondary hover:text-orbit-primary hover:border-[var(--border-hover)] hover:bg-orbit-surface transition-all cursor-pointer shadow-sm"
            aria-label="Scroll to top"
          >
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}
