import React from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getTaskBySlug, getAssignmentBySlug, startTask } from '@/lib/tasks-service';
import { getOrCreateSessionId, createFallbackAssignment, SESSION_COOKIE_NAME } from '@/lib/session';
import { TaskWorkspaceClient } from '@/components/tasks/workspace/TaskWorkspaceClient';

interface WorkspacePageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateMetadata(props: WorkspacePageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(props.params);
  const slug = resolvedParams?.slug;

  if (!slug) {
    return { title: 'Workspace — AI Orbit' };
  }

  const task = getTaskBySlug(slug);
  if (!task) {
    return { title: 'Task Not Found — AI Orbit' };
  }

  return {
    title: `${task.title} — Workspace | AI Orbit`,
    description: `Active task workspace for ${task.title}. Track requirements, evaluation, and implementation progress.`
  };
}

export default async function TaskWorkspacePage(props: WorkspacePageProps) {
  const resolvedParams = await Promise.resolve(props.params);
  const slug = resolvedParams?.slug;

  if (!slug) {
    notFound();
  }

  const task = getTaskBySlug(slug);
  if (!task) {
    notFound();
  }

  const cookieStore = await cookies();
  const rawCookieId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const userId = getOrCreateSessionId(rawCookieId);

  let assignment = getAssignmentBySlug(slug, userId);

  // Auto-create assignment if direct navigation to workspace
  if (!assignment) {
    const started = startTask(slug, userId);
    if (started?.assignment) {
      assignment = started.assignment;
    } else {
      assignment = createFallbackAssignment(task.id, task.slug, userId);
    }
  }

  return <TaskWorkspaceClient task={task} initialAssignment={assignment} />;
}
