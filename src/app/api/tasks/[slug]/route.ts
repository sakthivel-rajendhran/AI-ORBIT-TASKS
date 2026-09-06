import { NextRequest, NextResponse } from 'next/server';
import { getTaskBySlug } from '@/lib/tasks-service';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const slug = resolvedParams?.slug;

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Task slug is required' },
        { status: 400 }
      );
    }

    const task = getTaskBySlug(slug);

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          error: 'Task not found',
          message: `No AI task found matching slug '${slug}'.`
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: task
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      }
    );
  } catch (error: unknown) {
    console.error('Error fetching task by slug:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Unable to retrieve task details at this time.'
      },
      { status: 500 }
    );
  }
}
