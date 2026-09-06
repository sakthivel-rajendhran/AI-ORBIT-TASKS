'use client';

import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';

export interface CategoryItem {
  name: string;
  count: number;
}

interface TaskFiltersProps {
  selectedCategory: string;
  selectedDifficulty: string;
  selectedStatus: string;
  selectedTech: string;
  onCategoryChange: (category: string) => void;
  onDifficultyChange: (difficulty: string) => void;
  onStatusChange: (status: string) => void;
  onTechChange: (tech: string) => void;
  onReset: () => void;
  activeCount: number;
  initialCategories?: CategoryItem[];
}

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
const STATUSES = ['All', 'Open', 'Active', 'Completed', 'Archived'];
const TECHNOLOGIES = [
  'All',
  'Python',
  'TypeScript',
  'JavaScript',
  'Next.js',
  'React',
  'OpenAI',
  'LLM',
  'PyTorch',
  'FastAPI',
  'OpenCV',
  'Docker',
  'LangChain',
  'Qdrant'
];

function TaskFiltersComponent({
  selectedCategory,
  selectedDifficulty,
  selectedStatus,
  selectedTech,
  onCategoryChange,
  onDifficultyChange,
  onStatusChange,
  onTechChange,
  onReset,
  activeCount,
  initialCategories
}: TaskFiltersProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories || []);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) return;

    let mounted = true;
    async function loadCategories() {
      try {
        const res = await fetch('/api/tasks/categories');
        const json = await res.json();
        if (mounted && json.success && Array.isArray(json.data)) {
          setCategories(json.data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
    return () => {
      mounted = false;
    };
  }, [initialCategories]);

  useEffect(() => {
    if (!mobileSheetOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileSheetOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileSheetOpen]);

  const totalTasksSum = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="w-full space-y-3">
      {/* 1. Category Chips Bar (Horizontal scrollable with clean scroll styling) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => onCategoryChange('All')}
          className={`btn-interaction card-hover-category h-8 px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            selectedCategory === 'All'
              ? 'bg-[var(--accent-primary)] text-white font-bold shadow-sm'
              : 'bg-orbit-card text-orbit-muted border border-orbit hover:text-orbit-primary hover:border-[var(--border-hover)]'
          }`}
        >
          All Categories
          {totalTasksSum > 0 && (
            <span
              className={`cat-badge text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedCategory === 'All'
                  ? 'bg-white/20 text-white'
                  : 'bg-orbit-surface text-orbit-muted border border-orbit'
              }`}
            >
              {totalTasksSum}
            </span>
          )}
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => onCategoryChange(cat.name)}
              className={`btn-interaction card-hover-category h-8 px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? 'bg-[var(--accent-primary)] text-white font-bold shadow-sm'
                  : 'bg-orbit-card text-orbit-muted border border-orbit hover:text-orbit-primary hover:border-[var(--border-hover)]'
              }`}
            >
              {cat.name}
              <span
                className={`cat-badge text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-orbit-surface text-orbit-muted border border-orbit'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Secondary Dropdowns for Desktop / Mobile Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        {/* Desktop Filter Dropdowns */}
        <div className="hidden sm:flex flex-wrap items-center gap-2">
          {/* Difficulty Dropdown */}
          <div className="relative">
            <select
              aria-label="Filter by Difficulty"
              value={selectedDifficulty}
              onChange={(e) => onDifficultyChange(e.target.value)}
              className="h-8.5 rounded-lg bg-orbit-card border border-orbit px-3 pr-7 text-xs text-orbit-secondary hover:border-[var(--border-hover)] focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer appearance-none transition-all duration-200 shadow-xs"
            >
              <option value="All" className="bg-orbit-card text-orbit-primary">Difficulty: All</option>
              {DIFFICULTIES.filter((d) => d !== 'All').map((d) => (
                <option key={d} value={d} className="bg-orbit-card text-orbit-primary">
                  Difficulty: {d}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-orbit-muted"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              aria-label="Filter by Status"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="h-8.5 rounded-lg bg-orbit-card border border-orbit px-3 pr-7 text-xs text-orbit-secondary hover:border-[var(--border-hover)] focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer appearance-none transition-all duration-200 shadow-xs"
            >
              <option value="All" className="bg-orbit-card text-orbit-primary">Status: All</option>
              {STATUSES.filter((s) => s !== 'All').map((s) => (
                <option key={s} value={s} className="bg-orbit-card text-orbit-primary">
                  Status: {s}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-orbit-muted"
            />
          </div>

          {/* Technology Dropdown */}
          <div className="relative">
            <select
              aria-label="Filter by Technology"
              value={selectedTech}
              onChange={(e) => onTechChange(e.target.value)}
              className="h-8.5 rounded-lg bg-orbit-card border border-orbit px-3 pr-7 text-xs text-orbit-secondary hover:border-[var(--border-hover)] focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer appearance-none transition-all duration-200 shadow-xs"
            >
              <option value="All" className="bg-orbit-card text-orbit-primary">Technology: All</option>
              {TECHNOLOGIES.filter((t) => t !== 'All').map((t) => (
                <option key={t} value={t} className="bg-orbit-card text-orbit-primary">
                  Tech: {t}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-orbit-muted"
            />
          </div>

          {/* Clear Filters button */}
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="btn-interaction h-8.5 px-3 rounded-lg text-xs font-semibold text-orbit-muted hover:text-orbit-primary border border-dashed border-orbit hover:border-[var(--border-hover)] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <X size={12} />
              Reset Filters ({activeCount})
            </button>
          )}
        </div>

        {/* Mobile Filter Button (Under 640px) */}
        <div className="sm:hidden flex items-center gap-2 w-full">
          <button
            type="button"
            onClick={() => setMobileSheetOpen(true)}
            className="btn-interaction flex-1 h-9 rounded-lg bg-orbit-card border border-orbit px-3 text-xs font-semibold text-orbit-secondary flex items-center justify-between shadow-xs"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-[var(--accent-primary)]" />
              Filter Options
            </span>
            {activeCount > 0 && (
              <span className="bg-[var(--accent-primary)] text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full">
                {activeCount}
              </span>
            )}
          </button>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="btn-interaction h-9 px-3 rounded-lg text-xs font-semibold text-orbit-muted border border-orbit flex items-center gap-1"
            >
              <X size={13} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal/Sheet */}
      {mobileSheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter AI Tasks"
          className="fixed inset-0 z-50 flex items-end sm:hidden bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="w-full bg-orbit-surface border-t border-orbit rounded-t-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-orbit">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-[var(--accent-primary)]" />
                <h3 className="text-sm font-bold text-orbit-primary">Filter AI Tasks</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileSheetOpen(false)}
                className="btn-interaction p-1 text-orbit-muted hover:text-orbit-primary"
                aria-label="Close filter drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-orbit-muted uppercase tracking-wider">
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => onDifficultyChange(d)}
                    className={`btn-interaction h-8 rounded-lg text-xs font-medium border transition-colors ${
                      selectedDifficulty === d
                        ? 'bg-[var(--accent-primary)] text-white font-bold border-[var(--accent-primary)]'
                        : 'bg-orbit-card text-orbit-secondary border-orbit'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-orbit-muted uppercase tracking-wider">
                Status
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onStatusChange(s)}
                    className={`btn-interaction h-8 rounded-lg text-xs font-medium border transition-colors ${
                      selectedStatus === s
                        ? 'bg-[var(--accent-primary)] text-white font-bold border-[var(--accent-primary)]'
                        : 'bg-orbit-card text-orbit-secondary border-orbit'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Technology */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-orbit-muted uppercase tracking-wider">
                Technology
              </label>
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {TECHNOLOGIES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onTechChange(t)}
                    className={`btn-interaction h-8 rounded-lg text-xs font-medium border transition-colors truncate px-2.5 text-left ${
                      selectedTech === t
                        ? 'bg-[var(--accent-primary)] text-white font-bold border-[var(--accent-primary)]'
                        : 'bg-orbit-card text-orbit-secondary border-orbit'
                    }`}
                  >
                    {t === 'All' ? 'All Tech' : t}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onReset}
                className="btn-interaction flex-1 h-10 rounded-xl border border-orbit text-xs font-semibold text-orbit-muted hover:text-orbit-primary"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setMobileSheetOpen(false)}
                className="btn-interaction flex-1 h-10 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-bold hover:brightness-110 shadow-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}

export const TaskFilters = React.memo(TaskFiltersComponent);

