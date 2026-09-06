'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { LeaderboardEntry } from '@/lib/leaderboard-service';
import { LeaderboardHeader } from '@/components/leaderboard/LeaderboardHeader';
import { LeaderboardPodium } from '@/components/leaderboard/LeaderboardPodium';
import { LeaderboardControls } from '@/components/leaderboard/LeaderboardControls';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { LeaderboardCurrentUser } from '@/components/leaderboard/LeaderboardCurrentUser';
import { LeaderboardPodiumSkeleton, LeaderboardTableSkeleton } from '@/components/leaderboard/LeaderboardSkeleton';
import { Trophy, AlertCircle, RotateCcw, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface LeaderboardClientProps {
  initialUsers?: LeaderboardEntry[];
  initialPodium?: LeaderboardEntry[];
  initialCurrentUser?: LeaderboardEntry | null;
  initialStats?: {
    totalParticipants: number;
    totalChallenges: number;
    totalCategories: number;
  };
  initialPeriod?: 'all-time' | 'month' | 'week';
  initialCategory?: string;
  initialSort?: 'score' | 'tasks' | 'success_rate';
  categories?: string[];
  currentUserId?: string | null;
}

export function LeaderboardClient({
  initialUsers = [],
  initialPodium = [],
  initialCurrentUser = null,
  initialStats = { totalParticipants: 1245, totalChallenges: 26, totalCategories: 9 },
  initialPeriod = 'all-time',
  initialCategory = 'All',
  initialSort = 'score',
  categories = [],
  currentUserId = null
}: LeaderboardClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstMount = useRef(true);

  // Initialize state with fallback to URL query parameters
  const startPeriod = (searchParams.get('period') as 'all-time' | 'month' | 'week') || initialPeriod;
  const startCategory = searchParams.get('category') || initialCategory;
  const startSort = (searchParams.get('sort') as 'score' | 'tasks' | 'success_rate') || initialSort;

  const [period, setPeriod] = useState<'all-time' | 'month' | 'week'>(startPeriod);
  const [category, setCategory] = useState<string>(startCategory);
  const [sort, setSort] = useState<'score' | 'tasks' | 'success_rate'>(startSort);

  const [users, setUsers] = useState<LeaderboardEntry[]>(initialUsers);
  const [podium, setPodium] = useState<LeaderboardEntry[]>(initialPodium);
  const [currentUser, setCurrentUser] = useState<LeaderboardEntry | null>(initialCurrentUser);
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronize state with URL search params
  const updateUrl = useCallback(
    (params: { period?: string; category?: string; sort?: string }, replace = false) => {
      if (typeof window === 'undefined') return;
      const url = new URL(window.location.href);

      if (params.period !== undefined) {
        if (params.period !== 'all-time') url.searchParams.set('period', params.period);
        else url.searchParams.delete('period');
      }

      if (params.category !== undefined) {
        if (params.category && params.category !== 'All') url.searchParams.set('category', params.category);
        else url.searchParams.delete('category');
      }

      if (params.sort !== undefined) {
        if (params.sort !== 'score') url.searchParams.set('sort', params.sort);
        else url.searchParams.delete('sort');
      }

      const relativeUrl = (pathname || '/leaderboard') + url.search;
      if (replace) {
        window.history.replaceState(null, '', relativeUrl);
      } else {
        window.history.pushState(null, '', relativeUrl);
      }
    },
    [pathname]
  );

  // Handle browser Back & Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setPeriod((params.get('period') as 'all-time' | 'month' | 'week') || 'all-time');
      setCategory(params.get('category') || 'All');
      setSort((params.get('sort') as 'score' | 'tasks' | 'success_rate') || 'score');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch updated leaderboard from API on filter or sort change
  const fetchLeaderboard = useCallback(
    (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);

      const query = new URLSearchParams();
      if (period !== 'all-time') query.set('period', period);
      if (category !== 'All') query.set('category', category);
      if (sort !== 'score') query.set('sort', sort);

      fetch(`/api/leaderboard?${query.toString()}`, { signal })
        .then(async (res) => {
          const json = await res.json();
          if (res.ok && json.success) {
            setUsers(json.data || []);
            setPodium(json.podium || []);
            setCurrentUser(json.currentUser || null);
            if (json.stats) setStats(json.stats);
          } else {
            setError(json.message || 'Unable to load leaderboard data.');
          }
        })
        .catch((err: unknown) => {
          if ((err as { name?: string })?.name === 'AbortError') return;
          console.error('Leaderboard fetch error:', err);
          setError('Network connection error. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [period, category, sort]
  );

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const controller = new AbortController();
    fetchLeaderboard(controller.signal);

    return () => controller.abort();
  }, [period, category, sort, fetchLeaderboard]);

  const handlePeriodChange = (newPeriod: 'all-time' | 'month' | 'week') => {
    setPeriod(newPeriod);
    updateUrl({ period: newPeriod }, false);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    updateUrl({ category: newCategory }, false);
  };

  const handleSortChange = (newSort: 'score' | 'tasks' | 'success_rate') => {
    setSort(newSort);
    updateUrl({ sort: newSort }, false);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
      {/* 1. Leaderboard Header & Live Stats */}
      <LeaderboardHeader
        totalParticipants={stats.totalParticipants}
        totalChallenges={stats.totalChallenges}
        totalCategories={stats.totalCategories}
      />

      {/* 2. Current User Highlight Card */}
      <div className="anim-fade-up anim-delay-1">
        <LeaderboardCurrentUser currentUser={currentUser} />
      </div>

      {/* 3. Top 3 Podium */}
      <div className="anim-fade-up anim-delay-2">
        {loading ? (
          <LeaderboardPodiumSkeleton />
        ) : podium.length >= 3 ? (
          <LeaderboardPodium podium={podium} />
        ) : null}
      </div>

      {/* 4. Filter & Sort Controls */}
      <div className="anim-fade-up anim-delay-3">
        <LeaderboardControls
          period={period}
          category={category}
          sort={sort}
          onPeriodChange={handlePeriodChange}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          categories={categories}
        />
      </div>

      {/* 5. Main Rankings Content Area */}
      <div className="min-h-[350px] anim-fade-up anim-delay-4">
        {loading ? (
          <LeaderboardTableSkeleton count={8} />
        ) : error ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-8 text-center space-y-4 max-w-xl mx-auto my-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto">
              <AlertCircle size={24} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-orbit-primary">Unable to load leaderboard</h3>
              <p className="text-xs text-orbit-secondary max-w-md mx-auto leading-relaxed">
                {error}
              </p>
            </div>
            <button
              type="button"
              onClick={() => fetchLeaderboard()}
              className="btn-interaction inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-bold hover:brightness-110 transition-colors cursor-pointer shadow-sm"
            >
              <RotateCcw size={13} />
              Try Again
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-2xl border border-orbit bg-orbit-card p-12 text-center space-y-4 max-w-md mx-auto my-6 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orbit-surface border border-orbit text-orbit-muted mx-auto">
              <Trophy size={28} className="text-orbit-muted" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-orbit-primary">
                No Leaderboard Data
              </h3>
              <p className="text-xs text-orbit-secondary leading-relaxed">
                Complete AI tasks to appear on the leaderboard for this category or period.
              </p>
            </div>
            <Link
              href="/tasks"
              prefetch={true}
              className="btn-interaction inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-bold hover:brightness-110 transition-colors shadow-sm"
            >
              <Sparkles size={13} />
              Explore AI Tasks
            </Link>
          </div>
        ) : (
          <LeaderboardTable users={users} currentUserId={currentUserId} />
        )}
      </div>
    </div>
  );
}
