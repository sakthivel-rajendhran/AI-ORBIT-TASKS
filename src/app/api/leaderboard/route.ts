import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/leaderboard-service';
import { SESSION_COOKIE_NAME } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const periodRaw = searchParams.get('period')?.toLowerCase();
    let period: 'all-time' | 'month' | 'week' = 'all-time';
    if (periodRaw === 'month' || periodRaw === 'week') {
      period = periodRaw;
    }

    const category = searchParams.get('category') || undefined;

    const sortRaw = searchParams.get('sort')?.toLowerCase();
    let sort: 'score' | 'tasks' | 'success_rate' = 'score';
    if (sortRaw === 'tasks' || sortRaw === 'success_rate') {
      sort = sortRaw;
    }

    const pageRaw = searchParams.get('page');
    let page = pageRaw ? parseInt(pageRaw, 10) : 1;
    if (isNaN(page) || page < 1) page = 1;

    const limitRaw = searchParams.get('limit');
    let limit = limitRaw ? parseInt(limitRaw, 10) : 20;
    if (isNaN(limit) || limit < 1) limit = 20;
    if (limit > 50) limit = 50;

    // Current user identifier from cookie
    const userId = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    const result = getLeaderboard({
      period,
      category,
      sort,
      page,
      limit,
      userId
    });

    return NextResponse.json({
      success: true,
      data: result.users,
      podium: result.podium,
      currentUser: result.currentUser,
      stats: result.stats,
      pagination: result.pagination
    });
  } catch (error: unknown) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch leaderboard',
        message: 'An unexpected error occurred while calculating rankings.'
      },
      { status: 500 }
    );
  }
}
