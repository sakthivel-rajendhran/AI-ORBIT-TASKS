'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { TaskSummary } from '@/lib/db';
import { TaskStats, StatsData } from '@/components/tasks/TaskStats';
import { TaskSearch } from '@/components/tasks/TaskSearch';
import { TaskFilters, CategoryItem } from '@/components/tasks/TaskFilters';
import { TaskSort } from '@/components/tasks/TaskSort';
import { TaskViewToggle } from '@/components/tasks/TaskViewToggle';
import { TaskGrid } from '@/components/tasks/TaskGrid';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskPagination } from '@/components/tasks/TaskPagination';
import { EmptyState } from '@/components/tasks/EmptyState';
import { ErrorState } from '@/components/tasks/ErrorState';
import { TaskGridSkeleton, TaskListSkeleton } from '@/components/tasks/LoadingSkeleton';

interface TasksClientProps {
  initialTasks?: TaskSummary[];
  initialPagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  initialStats?: StatsData;
  initialCategories?: CategoryItem[];
  initialSearch?: string;
  initialCategory?: string;
  initialDifficulty?: string;
  initialStatus?: string;
  initialTech?: string;
  initialSort?: string;
  initialPage?: number;
}

export function TasksClient({
  initialTasks,
  initialPagination,
  initialStats,
  initialCategories,
  initialSearch = '',
  initialCategory = 'All',
  initialDifficulty = 'All',
  initialStatus = 'All',
  initialTech = 'All',
  initialSort = 'featured',
  initialPage = 1
}: TasksClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [reloadKey, setReloadKey] = useState(0);
  const isFirstMount = React.useRef(true);

  // Initial values from props with searchParams fallback
  const startSearch = initialSearch || searchParams.get('search') || '';
  const startCategory = initialCategory !== 'All' ? initialCategory : (searchParams.get('category') || 'All');
  const startDifficulty = initialDifficulty !== 'All' ? initialDifficulty : (searchParams.get('difficulty') || 'All');
  const startStatus = initialStatus !== 'All' ? initialStatus : (searchParams.get('status') || 'All');
  const startTech = initialTech !== 'All' ? initialTech : (searchParams.get('technology') || 'All');
  const startSort = initialSort !== 'featured' ? initialSort : (searchParams.get('sort') || 'featured');
  const startPage = initialPage > 1 ? initialPage : (parseInt(searchParams.get('page') || '1', 10) || 1);
  const startView = (searchParams.get('view') as 'grid' | 'list') || 'grid';

  const [search, setSearch] = useState(startSearch);
  const [category, setCategory] = useState(startCategory);
  const [difficulty, setDifficulty] = useState(startDifficulty);
  const [status, setStatus] = useState(startStatus);
  const [tech, setTech] = useState(startTech);
  const [sort, setSort] = useState(startSort);
  const [page, setPage] = useState(startPage);
  const [view, setView] = useState<'grid' | 'list'>(startView);

  // Data fetching state - preloaded from server component props when available
  const [tasks, setTasks] = useState<TaskSummary[]>(initialTasks || []);
  const [pagination, setPagination] = useState(
    initialPagination || {
      page: startPage,
      limit: 12,
      total: 0,
      totalPages: 1
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state to URL with pushState / replaceState to keep UI interactive and history intact
  const updateUrl = useCallback(
    (
      params: {
        search?: string;
        category?: string;
        difficulty?: string;
        status?: string;
        technology?: string;
        sort?: string;
        page?: number;
        view?: 'grid' | 'list';
      },
      replace = false
    ) => {
      if (typeof window === 'undefined') return;
      const url = new URL(window.location.href);

      if (params.search !== undefined) {
        if (params.search.trim()) url.searchParams.set('search', params.search.trim());
        else url.searchParams.delete('search');
      }

      if (params.category !== undefined) {
        if (params.category && params.category !== 'All') url.searchParams.set('category', params.category);
        else url.searchParams.delete('category');
      }

      if (params.difficulty !== undefined) {
        if (params.difficulty && params.difficulty !== 'All') url.searchParams.set('difficulty', params.difficulty);
        else url.searchParams.delete('difficulty');
      }

      if (params.status !== undefined) {
        if (params.status && params.status !== 'All') url.searchParams.set('status', params.status);
        else url.searchParams.delete('status');
      }

      if (params.technology !== undefined) {
        if (params.technology && params.technology !== 'All') url.searchParams.set('technology', params.technology);
        else url.searchParams.delete('technology');
      }

      if (params.sort !== undefined) {
        if (params.sort && params.sort !== 'featured') url.searchParams.set('sort', params.sort);
        else url.searchParams.delete('sort');
      }

      if (params.page !== undefined) {
        if (params.page > 1) url.searchParams.set('page', String(params.page));
        else url.searchParams.delete('page');
      }

      if (params.view !== undefined) {
        if (params.view !== 'grid') url.searchParams.set('view', params.view);
        else url.searchParams.delete('view');
      }

      const relativeUrl = (pathname || url.pathname) + url.search;
      if (replace) {
        window.history.replaceState(null, '', relativeUrl);
      } else {
        window.history.pushState(null, '', relativeUrl);
      }
    },
    [pathname]
  );

  // Listen to browser Back and Forward navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSearch(params.get('search') || '');
      setCategory(params.get('category') || 'All');
      setDifficulty(params.get('difficulty') || 'All');
      setStatus(params.get('status') || 'All');
      setTech(params.get('technology') || 'All');
      setSort(params.get('sort') || 'featured');
      setPage(parseInt(params.get('page') || '1', 10) || 1);
      setView((params.get('view') as 'grid' | 'list') || 'grid');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronize state if server props change on Link navigation
  const [prevServerProps, setPrevServerProps] = useState({
    search: initialSearch,
    category: initialCategory,
    difficulty: initialDifficulty,
    status: initialStatus,
    tech: initialTech,
    sort: initialSort,
    page: initialPage
  });

  if (
    initialSearch !== prevServerProps.search ||
    initialCategory !== prevServerProps.category ||
    initialDifficulty !== prevServerProps.difficulty ||
    initialStatus !== prevServerProps.status ||
    initialTech !== prevServerProps.tech ||
    initialSort !== prevServerProps.sort ||
    initialPage !== prevServerProps.page
  ) {
    setPrevServerProps({
      search: initialSearch,
      category: initialCategory,
      difficulty: initialDifficulty,
      status: initialStatus,
      tech: initialTech,
      sort: initialSort,
      page: initialPage
    });
    setSearch(initialSearch || '');
    setCategory(initialCategory || 'All');
    setDifficulty(initialDifficulty || 'All');
    setStatus(initialStatus || 'All');
    setTech(initialTech || 'All');
    setSort(initialSort || 'featured');
    setPage(initialPage || 1);
    if (initialTasks) setTasks(initialTasks);
    if (initialPagination) setPagination(initialPagination);
  }

  // Fetch tasks from backend API with AbortController cancellation on user interactions
  useEffect(() => {
    // Skip redundant initial fetch if server component already provided initialTasks
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const query = new URLSearchParams();
    query.set('page', String(page));
    query.set('limit', '12');

    if (search.trim()) query.set('search', search.trim());
    if (category && category !== 'All') query.set('category', category);
    if (difficulty && difficulty !== 'All') query.set('difficulty', difficulty);
    if (status && status !== 'All') query.set('status', status);
    if (tech && tech !== 'All') query.set('technology', tech);
    if (sort && sort !== 'featured') query.set('sort', sort);

    fetch(`/api/tasks?${query.toString()}`, { signal: controller.signal })
      .then(async (res) => {
        const json = await res.json();
        if (res.ok && json.success) {
          setTasks(json.data || []);
          setPagination(
            json.pagination || { page: 1, limit: 12, total: 0, totalPages: 1 }
          );
        } else {
          setError(json.message || 'Failed to retrieve tasks from server.');
        }
      })
      .catch((err: unknown) => {
        if ((err as { name?: string })?.name === 'AbortError') {
          return;
        }
        console.error('Fetch error:', err);
        setError('Network connection error. Please check your internet connection.');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [page, search, category, difficulty, status, tech, sort, reloadKey]);

  // Stable handlers for user interactions
  const handleSearchChange = useCallback(
    (val: string) => {
      setSearch(val);
      setPage(1);
      updateUrl({ search: val, page: 1 }, true);
    },
    [updateUrl]
  );

  const handleCategoryChange = useCallback(
    (val: string) => {
      setCategory(val);
      setPage(1);
      updateUrl({ category: val, page: 1 }, false);
    },
    [updateUrl]
  );

  const handleDifficultyChange = useCallback(
    (val: string) => {
      setDifficulty(val);
      setPage(1);
      updateUrl({ difficulty: val, page: 1 }, false);
    },
    [updateUrl]
  );

  const handleStatusChange = useCallback(
    (val: string) => {
      setStatus(val);
      setPage(1);
      updateUrl({ status: val, page: 1 }, false);
    },
    [updateUrl]
  );

  const handleTechChange = useCallback(
    (val: string) => {
      setTech(val);
      setPage(1);
      updateUrl({ technology: val, page: 1 }, false);
    },
    [updateUrl]
  );

  const handleSortChange = useCallback(
    (val: string) => {
      setSort(val);
      setPage(1);
      updateUrl({ sort: val, page: 1 }, false);
    },
    [updateUrl]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      setPagination((prev) => ({ ...prev, page: newPage }));
      updateUrl({ page: newPage }, false);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
    },
    [updateUrl]
  );

  const handleViewChange = useCallback(
    (newView: 'grid' | 'list') => {
      setView(newView);
      updateUrl({ view: newView }, true);
    },
    [updateUrl]
  );

  const handleResetFilters = useCallback(() => {
    setSearch('');
    setCategory('All');
    setDifficulty('All');
    setStatus('All');
    setTech('All');
    setSort('featured');
    setPage(1);
    updateUrl(
      {
        search: '',
        category: 'All',
        difficulty: 'All',
        status: 'All',
        technology: 'All',
        sort: 'featured',
        page: 1
      },
      false
    );
  }, [updateUrl]);


  const activeFiltersCount =
    (category !== 'All' ? 1 : 0) +
    (difficulty !== 'All' ? 1 : 0) +
    (status !== 'All' ? 1 : 0) +
    (tech !== 'All' ? 1 : 0) +
    (search.trim() ? 1 : 0);

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* 1. Page Header with subtle staggered entrance */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 text-xs font-semibold text-[var(--accent-secondary)] anim-fade-up anim-delay-0">
          <span>AI Orbit Discovery</span>
          <span className="text-orbit-muted">•</span>
          <span>Ecosystem Challenges</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-orbit-primary anim-fade-up anim-delay-1">
          AI Tasks
        </h1>

        <p className="text-sm sm:text-base text-orbit-secondary max-w-2xl leading-relaxed anim-fade-up anim-delay-2">
          Explore practical AI tasks, challenges, and projects designed to help you build and evaluate AI skills.
        </p>
      </div>

      {/* 2. Statistics Panel */}
      <div className="anim-fade-up anim-delay-3">
        <TaskStats initialStats={initialStats} />
      </div>

      {/* 3. Search and View Toggle Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 anim-fade-up anim-delay-4">
        <div className="flex-1 max-w-xl">
          <TaskSearch
            value={search}
            onChange={handleSearchChange}
            isSearching={loading}
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <TaskSort value={sort} onChange={handleSortChange} />
          <TaskViewToggle view={view} onChange={handleViewChange} />
        </div>
      </div>

      {/* 4. Filters Bar */}
      <div className="anim-fade-up anim-delay-4">
        <TaskFilters
          selectedCategory={category}
          selectedDifficulty={difficulty}
          selectedStatus={status}
          selectedTech={tech}
          onCategoryChange={handleCategoryChange}
          onDifficultyChange={handleDifficultyChange}
          onStatusChange={handleStatusChange}
          onTechChange={handleTechChange}
          onReset={handleResetFilters}
          activeCount={activeFiltersCount}
          initialCategories={initialCategories}
        />
      </div>

      {/* 5. Main Content Area */}
      <div className="min-h-[400px] anim-fade-up anim-delay-5">
        {loading ? (
          view === 'grid' ? (
            <TaskGridSkeleton count={6} />
          ) : (
            <TaskListSkeleton count={6} />
          )
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={() => setReloadKey((k) => k + 1)}
          />
        ) : tasks.length === 0 ? (
          <EmptyState
            onReset={handleResetFilters}
            hasFilters={activeFiltersCount > 0}
          />
        ) : view === 'grid' ? (
          <TaskGrid tasks={tasks} />
        ) : (
          <TaskList tasks={tasks} />
        )}
      </div>

      {/* 6. Real Pagination */}
      {tasks.length > 0 && (
        <TaskPagination
          currentPage={pagination.page || page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
