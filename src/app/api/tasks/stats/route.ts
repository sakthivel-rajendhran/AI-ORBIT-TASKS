import { NextResponse } from 'next/server';
import { getStats } from '@/lib/tasks-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = getStats();
    return NextResponse.json(
      {
        success: true,
        data: stats
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
        }
      }
    );
  } catch (error: unknown) {
    console.error('Error fetching task statistics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate stats',
        message: 'Unable to calculate live statistics.'
      },
      { status: 500 }
    );
  }
}
