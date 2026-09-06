'use client';

import React from 'react';

export function LeaderboardPodiumSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-end pt-6">
      {/* 2nd place skeleton */}
      <div className="order-2 md:order-1 h-64 rounded-2xl border border-orbit bg-orbit-card p-5 flex flex-col items-center justify-between shadow-xs">
        <div className="h-6 w-20 rounded-full skeleton-shimmer" />
        <div className="h-16 w-16 rounded-full skeleton-shimmer" />
        <div className="h-4 w-32 rounded skeleton-shimmer" />
        <div className="h-3 w-20 rounded skeleton-shimmer" />
        <div className="h-10 w-full rounded-xl skeleton-shimmer" />
      </div>

      {/* 1st place skeleton */}
      <div className="order-1 md:order-2 h-76 rounded-2xl border border-orbit bg-orbit-card p-6 flex flex-col items-center justify-between md:-translate-y-2 shadow-xs">
        <div className="h-7 w-28 rounded-full skeleton-shimmer" />
        <div className="h-20 w-20 rounded-full skeleton-shimmer" />
        <div className="h-5 w-40 rounded skeleton-shimmer" />
        <div className="h-3.5 w-24 rounded skeleton-shimmer" />
        <div className="h-12 w-full rounded-xl skeleton-shimmer" />
      </div>

      {/* 3rd place skeleton */}
      <div className="order-3 h-64 rounded-2xl border border-orbit bg-orbit-card p-5 flex flex-col items-center justify-between shadow-xs">
        <div className="h-6 w-20 rounded-full skeleton-shimmer" />
        <div className="h-16 w-16 rounded-full skeleton-shimmer" />
        <div className="h-4 w-32 rounded skeleton-shimmer" />
        <div className="h-3 w-20 rounded skeleton-shimmer" />
        <div className="h-10 w-full rounded-xl skeleton-shimmer" />
      </div>
    </div>
  );
}

export function LeaderboardTableSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="rounded-2xl border border-orbit bg-orbit-card p-4 space-y-3 shadow-xs">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2.5 px-2 border-b border-orbit last:border-b-0">
          <div className="flex items-center gap-3">
            <div className="h-5 w-7 rounded skeleton-shimmer" />
            <div className="h-8 w-8 rounded-lg skeleton-shimmer" />
            <div className="space-y-1.5">
              <div className="h-4 w-28 rounded skeleton-shimmer" />
              <div className="h-3 w-16 rounded skeleton-shimmer" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="h-4 w-16 rounded skeleton-shimmer hidden sm:block" />
            <div className="h-4 w-12 rounded skeleton-shimmer hidden sm:block" />
            <div className="h-5 w-20 rounded skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
