import React from 'react';
import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-center space-y-5">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-zinc-400">
        <FileQuestion size={32} className="text-zinc-500" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl font-bold text-white">Page not found</h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          The page or challenge you are searching for does not exist or has been relocated.
        </p>
      </div>

      <Link
        href="/tasks"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors shadow-sm"
      >
        <ArrowLeft size={14} />
        Explore AI Tasks
      </Link>
    </div>
  );
}
