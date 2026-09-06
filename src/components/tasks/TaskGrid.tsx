'use client';

import React from 'react';
import { TaskSummary } from '@/lib/db';
import { TaskCard } from './TaskCard';

interface TaskGridProps {
  tasks: TaskSummary[];
}

export function TaskGrid({ tasks }: TaskGridProps) {
  return (
    <div
      role="region"
      aria-label="Tasks grid view"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {tasks.map((task, index) => (
        <TaskCard key={task.id} task={task} index={index} />
      ))}
    </div>
  );
}
