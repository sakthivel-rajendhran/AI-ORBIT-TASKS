'use client';

import React, { useEffect, useState } from 'react';
import { Layers, Sparkles, CheckCircle2, FolderTree } from 'lucide-react';

export interface StatsData {
  totalTasks: number;
  totalCategories: number;
  featuredTasks: number;
  activeTasks: number;
}

interface TaskStatsProps {
  initialStats?: StatsData;
}

function TaskStatsComponent({ initialStats }: TaskStatsProps) {
  const [stats, setStats] = useState<StatsData | null>(initialStats || null);
  const [loading, setLoading] = useState(!initialStats);

  useEffect(() => {
    if (initialStats) return;

    let mounted = true;
    async function loadStats() {
      try {
        const res = await fetch('/api/tasks/stats');
        const json = await res.json();
        if (mounted && json.success && json.data) {
          setStats(json.data);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadStats();
    return () => {
      mounted = false;
    };
  }, [initialStats]);

  const statItems = [
    {
      label: 'TOTAL TASKS',
      value: stats?.totalTasks,
      icon: Layers,
      color: 'text-orbit-primary'
    },
    {
      label: 'CATEGORIES',
      value: stats?.totalCategories,
      icon: FolderTree,
      color: 'text-[var(--accent-primary)]'
    },
    {
      label: 'FEATURED',
      value: stats?.featuredTasks,
      icon: Sparkles,
      color: 'text-amber-500 dark:text-amber-400'
    },
    {
      label: 'ACTIVE',
      value: stats?.activeTasks,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-6">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="card-hover-stat rounded-xl border border-orbit bg-orbit-card p-3.5 sm:p-4 transition-all cursor-default"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.08em] uppercase text-orbit-muted">
                {item.label}
              </span>
              <Icon size={14} className={`${item.color} stat-icon transition-transform duration-200`} />
            </div>
            {loading ? (
              <div className="h-7 w-16 rounded skeleton-shimmer mt-1" />
            ) : (
              <div className="stat-number text-xl sm:text-2xl font-bold tracking-tight text-orbit-primary font-mono transition-all duration-200">
                {item.value ?? 0}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export const TaskStats = React.memo(TaskStatsComponent);

