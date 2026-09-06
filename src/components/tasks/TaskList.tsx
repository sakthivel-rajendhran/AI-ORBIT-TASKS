'use client';

import React from 'react';
import { TaskSummary } from '@/lib/db';
import { TaskListItem } from './TaskListItem';

interface TaskListProps {
  tasks: TaskSummary[];
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <div
      role="region"
      aria-label="Tasks list view"
      className="space-y-3"
    >
      {tasks.map((task, index) => (
        <TaskListItem key={task.id} task={task} index={index} />
      ))}
    </div>
  );
}
