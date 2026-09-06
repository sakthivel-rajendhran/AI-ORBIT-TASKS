import { NextRequest, NextResponse } from 'next/server';
import { getTasks } from '@/lib/tasks-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const pageRaw = searchParams.get('page');
    const limitRaw = searchParams.get('limit');
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const difficulty = searchParams.get('difficulty') || undefined;
    const status = searchParams.get('status') || undefined;
    const technology = searchParams.get('technology') || undefined;
    const skill = searchParams.get('skill') || undefined;
    const featuredRaw = searchParams.get('featured');
    const sort = searchParams.get('sort') || undefined;

    let page = pageRaw ? parseInt(pageRaw, 10) : 1;
    if (isNaN(page) || page < 1) page = 1;

    let limit = limitRaw ? parseInt(limitRaw, 10) : 12;
    if (isNaN(limit) || limit < 1) limit = 12;
    if (limit > 50) limit = 50;

    let featured: boolean | undefined = undefined;
    if (featuredRaw === 'true') featured = true;
    if (featuredRaw === 'false') featured = false;

    const result = getTasks({
      page,
      limit,
      search,
      category,
      difficulty,
      status,
      technology,
      skill,
      featured,
      sort
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error: unknown) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tasks',
        message: 'An unexpected error occurred while processing the request.'
      },
      { status: 500 }
    );
  }
}
