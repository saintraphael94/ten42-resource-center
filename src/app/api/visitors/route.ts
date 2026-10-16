import { NextRequest, NextResponse } from 'next/server';
import { visitorCheckInSchema } from '@/lib/validations';
import { db } from '@/lib/data/store';

export async function GET() {
  const visits = await db.getVisits();
  return NextResponse.json(visits);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = visitorCheckInSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid visitor check-in data', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const {
      full_name,
      phone,
      email,
      organization,
      purpose,
      host_person,
      destination,
      group_size,
      notes,
    } = validated.data;

    const visit = await db.recordGuestCheckIn(
      { full_name, phone, email, organization },
      { purpose, host_person, destination, group_size, notes }
    );

    return NextResponse.json({
      success: true,
      message: 'Visitor successfully registered and checked in.',
      visit,
    });
  } catch (err) {
    console.error('Visitor registration error:', err);
    return NextResponse.json(
      { error: 'Failed to record visitor check-in.' },
      { status: 500 }
    );
  }
}

