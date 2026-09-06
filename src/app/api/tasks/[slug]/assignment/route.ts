import { NextRequest, NextResponse } from 'next/server';
import { getAssignmentBySlug } from '@/lib/tasks-service';
import { SESSION_COOKIE_NAME } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(
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
    const { searchParams } = new URL(request.url);

    // Resolve user/session identifier from cookie or query
    const userId =
      searchParams.get('userId') ||
      request.cookies.get(SESSION_COOKIE_NAME)?.value;

    const assignment = getAssignmentBySlug(slug, userId);

    return NextResponse.json({
      success: true,
      assignment: assignment || null
    });
  } catch (error: unknown) {
    console.error('Error fetching assignment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve assignment' },
      { status: 500 }
    );
  }
}
