import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getLeaderboard } from '@/lib/leaderboard-service';
import { getCategories } from '@/lib/tasks-service';
import { SESSION_COOKIE_NAME } from '@/lib/session';
import { LeaderboardClient } from './LeaderboardClient';
import { LeaderboardPodiumSkeleton, LeaderboardTableSkeleton } from '@/components/leaderboard/LeaderboardSkeleton';

export const metadata: Metadata = {
  title: 'Leaderboard — AI Orbit Tasks',
  description:
    'Track the top performers across AI challenges, autonomous agents, and practical evaluation benchmarks.',
  openGraph: {
    title: 'Leaderboard — AI Orbit Tasks',
    description:
      'Track the top performers across AI challenges, autonomous agents, and practical evaluation benchmarks.',
    type: 'website'
  }
};

interface LeaderboardPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}

export default async function LeaderboardPage(props: LeaderboardPageProps) {
  const resolvedParams = props.searchParams ? await Promise.resolve(props.searchParams) : {};

  const periodRaw = typeof resolvedParams.period === 'string' ? resolvedParams.period.toLowerCase() : undefined;
  let period: 'all-time' | 'month' | 'week' = 'all-time';
  if (periodRaw === 'month' || periodRaw === 'week') {
    period = periodRaw;
  }

  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : 'All';

  const sortRaw = typeof resolvedParams.sort === 'string' ? resolvedParams.sort.toLowerCase() : undefined;
  let sort: 'score' | 'tasks' | 'success_rate' = 'score';
  if (sortRaw === 'tasks' || sortRaw === 'success_rate') {
    sort = sortRaw;
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  const initialLeaderboard = getLeaderboard({
    period,
    category,
    sort,
    page: 1,
    limit: 20,
    userId
  });

  const categoriesData = getCategories();
  const categoryNames = ['All', ...categoriesData.map((c) => c.name)];

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="h-10 w-52 rounded skeleton-shimmer" />
          <div className="h-5 w-96 rounded skeleton-shimmer" />
          <LeaderboardPodiumSkeleton />
          <LeaderboardTableSkeleton count={8} />
        </div>
      }
    >
      <LeaderboardClient
        initialUsers={initialLeaderboard.users}
        initialPodium={initialLeaderboard.podium}
        initialCurrentUser={initialLeaderboard.currentUser}
        initialStats={initialLeaderboard.stats}
        initialPeriod={period}
        initialCategory={category}
        initialSort={sort}
        categories={categoryNames}
        currentUserId={userId}
      />
    </Suspense>
  );
}
