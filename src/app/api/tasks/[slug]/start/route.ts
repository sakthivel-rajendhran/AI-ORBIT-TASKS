import { NextRequest, NextResponse } from 'next/server';
import { startTask } from '@/lib/tasks-service';
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

    // Resolve user/session identifier from cookie or body
    let userId = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    try {
      const body = await request.json();
      if (body && typeof body.userId === 'string' && body.userId.trim()) {
        userId = body.userId.trim();
      }
    } catch {
      // Empty or non-JSON body is acceptable for anonymous demo trial
    }

    userId = getOrCreateSessionId(userId);

    const result = startTask(slug, userId);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: 'Task not found',
          message: `Unable to start task. No task found matching slug '${slug}'.`
        },
        { status: 404 }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        message: result.isExisting
          ? 'This task is already in progress.'
          : 'Task started successfully',
        assignment: result.assignment,
        data: result,
        workspaceUrl: `/tasks/${result.slug}/workspace`
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    );

    // Persist session cookie
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
    console.error('Error starting task:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to start task',
        message: 'A database error occurred while registering task progress.'
      },
      { status: 500 }
    );
  }
}
