import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { TasksClient } from './TasksClient';
import { TaskGridSkeleton } from '@/components/tasks/LoadingSkeleton';
import { getTasks, getStats, getCategories } from '@/lib/tasks-service';

export const metadata: Metadata = {
  title: 'AI Tasks — Practical AI Challenges & Benchmarks',
  description:
    'Explore practical AI tasks, challenges, and projects designed to help you build and evaluate AI skills across Generative AI, Agents, Vision, and Robotics.',
  openGraph: {
    title: 'AI Tasks — Practical AI Challenges & Benchmarks',
    description:
      'Explore practical AI tasks, challenges, and projects designed to help you build and evaluate AI skills.',
    type: 'website'
  }
};

interface TasksPageProps {

  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}

export default async function TasksPage(props: TasksPageProps) {
  const resolvedParams = props.searchParams ? await Promise.resolve(props.searchParams) : {};
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : undefined;
  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;
  const difficulty = typeof resolvedParams.difficulty === 'string' ? resolvedParams.difficulty : undefined;
  const status = typeof resolvedParams.status === 'string' ? resolvedParams.status : undefined;
  const technology = typeof resolvedParams.technology === 'string' ? resolvedParams.technology : undefined;
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : undefined;
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) || 1 : 1;

  const initialStats = getStats();
  const initialCategories = getCategories();
  const initialTasksResult = getTasks({
    search,
    category,
    difficulty,
    status,
    technology,
    sort,
    page,
    limit: 12
  });

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="h-10 w-48 rounded skeleton-shimmer" />
          <div className="h-6 w-96 rounded skeleton-shimmer" />
          <TaskGridSkeleton count={6} />
        </div>
      }
    >
      <TasksClient
        initialTasks={initialTasksResult.data}
        initialPagination={initialTasksResult.pagination}
        initialStats={initialStats}
        initialCategories={initialCategories}
        initialSearch={search || ''}
        initialCategory={category || 'All'}
        initialDifficulty={difficulty || 'All'}
        initialStatus={status || 'All'}
        initialTech={technology || 'All'}
        initialSort={sort || 'featured'}
        initialPage={page}
      />
    </Suspense>
  );
}

