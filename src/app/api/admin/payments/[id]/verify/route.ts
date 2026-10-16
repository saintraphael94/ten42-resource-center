import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const verifiedBy = body.verified_by || 'Admin / Front Desk';
    const notes = body.notes || 'Verified through official bank transfer alert';

    const verifiedPayment = await db.verifyPayment(id, verifiedBy, notes);

    if (!verifiedPayment) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully. Associated membership or booking updated.',
      payment: verifiedPayment,
    });
  } catch (err) {
    console.error('Payment verification error:', err);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}

