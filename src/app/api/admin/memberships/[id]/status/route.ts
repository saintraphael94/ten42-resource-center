import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, start_date, expiry_date } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const updated = await db.updateMembershipStatus(id, status, start_date, expiry_date);

    if (!updated) {
      return NextResponse.json({ error: 'Membership not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Membership status updated to ${status}`,
      membership: updated,
    });
  } catch (err) {
    console.error('Membership status update error:', err);
    return NextResponse.json({ error: 'Failed to update membership status' }, { status: 500 });
  }
}

