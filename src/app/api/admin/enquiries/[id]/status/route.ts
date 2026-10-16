import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, internal_notes } = body;

    const updated = await db.updateEnquiryStatus(id, status, internal_notes);

    if (!updated) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Enquiry status updated successfully',
      enquiry: updated,
    });
  } catch (err) {
    console.error('Enquiry update error:', err);
    return NextResponse.json({ error: 'Failed to update enquiry' }, { status: 500 });
  }
}

