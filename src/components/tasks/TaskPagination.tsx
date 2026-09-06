'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TaskPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange?: (page: number) => void;
}

export function TaskPagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange
}: TaskPaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const searchStr = typeof window !== 'undefined' ? window.location.search : (searchParams ? searchParams.toString() : '');
    const params = new URLSearchParams(searchStr);
    if (pageNumber > 1) {
      params.set('page', String(pageNumber));
    } else {
      params.delete('page');
    }
    const queryString = params.toString();
    const basePath = pathname || '/tasks';
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <nav
      aria-label="Tasks pagination navigation"
      className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-orbit mt-8"
    >
      {/* Items count summary */}
      <div className="text-xs text-orbit-muted">
        Showing page <span className="text-orbit-primary font-mono font-semibold">{currentPage}</span> of{' '}
        <span className="text-orbit-primary font-mono font-semibold">{totalPages}</span> ({totalItems} total tasks)
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button / Link */}
        {isFirstPage ? (
          <button
            type="button"
            disabled
            className="flex h-8.5 items-center gap-1 px-3 rounded-lg border border-orbit bg-orbit-card text-xs font-semibold text-orbit-muted opacity-40 cursor-not-allowed"
            aria-label="Go to previous page"
            aria-disabled="true"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">Previous</span>
          </button>
        ) : (
          <Link
            href={createPageUrl(currentPage - 1)}
            onClick={() => {
              if (onPageChange) onPageChange(currentPage - 1);
            }}
            className="btn-interaction flex h-8.5 items-center gap-1 px-3 rounded-lg border border-orbit bg-orbit-card text-xs font-semibold text-orbit-secondary hover:text-orbit-primary hover:border-[var(--border-hover)] transition-all cursor-pointer shadow-xs"
            aria-label="Go to previous page"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">Previous</span>
          </Link>
        )}

        {/* Desktop Page Numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`dots-${idx}`} className="px-2 text-xs text-orbit-muted">
                  ...
                </span>
              );
            }

            const pageNum = Number(p);
            const isActive = pageNum === currentPage;

            if (isActive) {
              return (
                <span
                  key={pageNum}
                  className="flex h-8.5 w-8.5 items-center justify-center rounded-lg text-xs font-bold font-mono bg-[var(--accent-primary)] text-white shadow-sm"
                  aria-current="page"
                  aria-label={`Current page, page ${pageNum}`}
                >
                  {pageNum}
                </span>
              );
            }

            return (
              <Link
                key={pageNum}
                href={createPageUrl(pageNum)}
                onClick={() => {
                  if (onPageChange) onPageChange(pageNum);
                }}
                className="btn-interaction flex h-8.5 w-8.5 items-center justify-center rounded-lg text-xs font-semibold font-mono bg-orbit-card text-orbit-muted border border-orbit hover:text-orbit-primary hover:border-[var(--border-hover)] transition-all cursor-pointer shadow-xs"
                aria-label={`Go to page ${pageNum}`}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>

        {/* Mobile Page indicator */}
        <div className="sm:hidden px-2 text-xs font-mono text-orbit-muted">
          {currentPage} / {totalPages}
        </div>

        {/* Next Button / Link */}
        {isLastPage ? (
          <button
            type="button"
            disabled
            className="flex h-8.5 items-center gap-1 px-3 rounded-lg border border-orbit bg-orbit-card text-xs font-semibold text-orbit-muted opacity-40 cursor-not-allowed"
            aria-label="Go to next page"
            aria-disabled="true"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={14} />
          </button>
        ) : (
          <Link
            href={createPageUrl(currentPage + 1)}
            onClick={() => {
              if (onPageChange) onPageChange(currentPage + 1);
            }}
            className="btn-interaction flex h-8.5 items-center gap-1 px-3 rounded-lg border border-orbit bg-orbit-card text-xs font-semibold text-orbit-secondary hover:text-orbit-primary hover:border-[var(--border-hover)] transition-all cursor-pointer shadow-xs"
            aria-label="Go to next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={14} />
          </Link>
        )}
      </div>
    </nav>
  );
}
