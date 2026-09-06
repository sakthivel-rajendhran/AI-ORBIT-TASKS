import { randomUUID } from 'crypto';
import { TaskAssignment } from './db';

export const SESSION_COOKIE_NAME = 'orbit_session_id';

/**
 * Ensures a valid session/user identifier exists.
 */
export function getOrCreateSessionId(existingId?: string | null): string {
  if (existingId && typeof existingId === 'string' && existingId.trim()) {
    return existingId.trim();
  }
  return `user_sess_${randomUUID().replace(/-/g, '').slice(0, 16)}`;
}

/**
 * Generates an assignment fallback object if database start falls through.
 */
export function createFallbackAssignment(
  taskId: string,
  taskSlug: string,
  userId: string
): TaskAssignment {
  const timestamp = new Date().toISOString();
  return {
    id: `asgn_${randomUUID().replace(/-/g, '').slice(0, 12)}`,
    taskId,
    taskSlug,
    userId,
    status: 'IN_PROGRESS',
    startedAt: timestamp,
    completedAt: null,
    updatedAt: timestamp,
    notes: null
  };
}
