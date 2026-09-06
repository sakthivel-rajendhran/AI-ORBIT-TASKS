import { NextRequest, NextResponse } from 'next/server';
import { completeTask, updateAssignmentNotes } from '@/lib/tasks-service';
import { getOrCreateSessionId, SESSION_COOKIE_NAME } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const rawSlug = resolvedParams?.slug;

    if (!rawSlug || typeof rawSlug !== 'string' || !rawSlug.trim()) {
      return NextResponse.json(
        { success: false, error: 'Task slug is required' },
        { status: 400 }
      );
    }

    const slug = decodeURIComponent(rawSlug.trim());

    let userId = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    let notes: string | undefined = undefined;

    try {
      const body = await request.json();
      if (body?.userId && typeof body.userId === 'string') {
        userId = body.userId.trim();
      }
      if (body?.notes && typeof body.notes === 'string') {
        notes = body.notes.trim();
      }
    } catch {
      // Body is optional
    }

    userId = getOrCreateSessionId(userId);

    const assignment = completeTask(slug, userId, notes);

    if (!assignment) {
      return NextResponse.json(
        { success: false, error: 'Task not found or unable to complete assignment' },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Task successfully marked as completed!',
      assignment
    });

    response.cookies.set({
      name: 'orbit_session_id',
      value: userId,
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
      httpOnly: false
    });

    return response;
  } catch (error: unknown) {
    console.error('Error completing task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete task' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const rawSlug = resolvedParams?.slug;
    if (!rawSlug) {
      return NextResponse.json({ success: false, error: 'Slug required' }, { status: 400 });
    }

    const slug = decodeURIComponent(rawSlug.trim());
    let userId = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const body = await request.json();

    if (body?.userId) userId = body.userId;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'User session required' }, { status: 400 });
    }

    const notes = typeof body?.notes === 'string' ? body.notes : '';
    const assignment = updateAssignmentNotes(slug, userId, notes);

    return NextResponse.json({
      success: true,
      assignment
    });
  } catch (error: unknown) {
    console.error('Error updating assignment:', error);
    return NextResponse.json({ success: false, error: 'Failed to update assignment' }, { status: 500 });
  }
}
