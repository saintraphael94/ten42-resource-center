import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, admin_notes, cancellation_reason } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const updated = await db.updateBookingStatus(id, status, admin_notes, cancellation_reason);

    if (!updated) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking: updated,
    });
  } catch (err) {
    console.error('Booking status update error:', err);
    return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
  }
}

