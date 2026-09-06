import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { getTaskBySlug, getAssignmentBySlug } from '@/lib/tasks-service';
import { SESSION_COOKIE_NAME } from '@/lib/session';
import { TaskDetailView } from '@/components/tasks/detail/TaskDetailView';
import { FileQuestion, ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(props.params);
  const slug = resolvedParams?.slug;

  if (!slug) {
    return { title: 'Task Details — AI Orbit' };
  }

  const task = getTaskBySlug(slug);
  if (!task) {
    return { title: 'Task Not Found — AI Orbit' };
  }

  return {
    title: `${task.title} — AI Orbit Tasks`,
    description: task.shortDescription || task.description.slice(0, 160)
  };
}

export default async function TaskDetailPage(props: PageProps) {
  const resolvedParams = await Promise.resolve(props.params);
  const slug = resolvedParams?.slug;

  const task = slug ? getTaskBySlug(slug) : null;

  if (!task) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center space-y-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-zinc-400">
          <FileQuestion size={32} className="text-zinc-500" />
        </div>

        <div className="space-y-2 max-w-md">
          <h1 className="text-2xl font-bold text-white">Task not found.</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The task you&apos;re looking for may have been removed or does not exist.
          </p>
        </div>

        <Link
          href="/tasks"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors shadow-sm mt-4"
        >
          <ArrowLeft size={14} />
          Back to Tasks
        </Link>
      </div>
    );
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const initialAssignment = getAssignmentBySlug(task.slug, userId);

  return <TaskDetailView initialTask={task} initialAssignment={initialAssignment} />;
}
