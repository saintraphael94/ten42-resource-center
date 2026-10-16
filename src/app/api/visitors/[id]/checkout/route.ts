import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updated = await db.recordGuestCheckOut(id);

    if (!updated) {
      return NextResponse.json({ error: 'Visit record not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Visitor checked out successfully.',
      visit: updated,
    });
  } catch (err) {
    console.error('Check-out error:', err);
    return NextResponse.json({ error: 'Failed to record check-out' }, { status: 500 });
  }
}

