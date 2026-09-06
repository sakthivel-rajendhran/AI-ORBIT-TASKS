import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/tasks-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = getCategories();
    return NextResponse.json(
      {
        success: true,
        data: categories
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
        }
      }
    );
  } catch (error: unknown) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
        message: 'Unable to retrieve category list.'
      },
      { status: 500 }
    );
  }
}
