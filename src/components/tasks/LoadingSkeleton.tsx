'use client';

import React from 'react';

export function TaskGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-orbit bg-orbit-card p-5 space-y-4 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 rounded skeleton-shimmer" />
            <div className="h-4 w-16 rounded skeleton-shimmer" />
          </div>

          <div className="space-y-2">
            <div className="h-5 w-3/4 rounded skeleton-shimmer" />
            <div className="h-3.5 w-full rounded skeleton-shimmer" />
            <div className="h-3.5 w-4/5 rounded skeleton-shimmer" />
          </div>

          <div className="flex gap-2">
            <div className="h-5 w-14 rounded skeleton-shimmer" />
            <div className="h-5 w-16 rounded skeleton-shimmer" />
            <div className="h-5 w-12 rounded skeleton-shimmer" />
          </div>

          <div className="pt-3 border-t border-orbit flex justify-between">
            <div className="h-4 w-20 rounded skeleton-shimmer" />
            <div className="h-4 w-16 rounded skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TaskListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-orbit bg-orbit-card p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs"
        >
          <div className="space-y-2 flex-1 w-full">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-20 rounded skeleton-shimmer" />
              <div className="h-3.5 w-14 rounded skeleton-shimmer" />
            </div>
            <div className="h-5 w-1/2 rounded skeleton-shimmer" />
            <div className="h-3.5 w-3/4 rounded skeleton-shimmer" />
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="h-5 w-24 rounded skeleton-shimmer" />
            <div className="h-8 w-16 rounded skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TaskDetailSkeleton() {
  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="h-4 w-48 rounded skeleton-shimmer" />

      {/* Header */}
      <div className="space-y-4 pb-6 border-b border-orbit">
        <div className="flex gap-2">
          <div className="h-5 w-24 rounded skeleton-shimmer" />
          <div className="h-5 w-16 rounded skeleton-shimmer" />
        </div>
        <div className="h-8 w-2/3 rounded skeleton-shimmer" />
        <div className="h-4 w-full rounded skeleton-shimmer" />
        <div className="h-4 w-4/5 rounded skeleton-shimmer" />
        <div className="h-10 w-36 rounded-full skeleton-shimmer mt-4" />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-32 rounded-xl skeleton-shimmer" />
          <div className="h-44 rounded-xl skeleton-shimmer" />
          <div className="h-32 rounded-xl skeleton-shimmer" />
        </div>
        <div className="space-y-6">
          <div className="h-64 rounded-xl skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}
