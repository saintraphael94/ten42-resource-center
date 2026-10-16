import { NextRequest, NextResponse } from 'next/server';
import { bookingRequestSchema } from '@/lib/validations';
import { db } from '@/lib/data/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = bookingRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const {
      facility_id,
      guest_name,
      guest_email,
      guest_phone,
      organization,
      start_time,
      end_time,
      purpose,
      attendee_count,
      estimated_price,
    } = validated.data;

    const result = await db.createBooking({
      facility_id,
      guest_name,
      guest_email,
      guest_phone,
      organization: organization || null,
      start_time,
      end_time,
      purpose,
      attendee_count,
      estimated_price,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'This time slot is unavailable due to an existing booking or buffer overlap.' },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Reservation request successfully received.',
      booking: result.booking,
    });
  } catch (err) {
    console.error('Booking creation error:', err);
    return NextResponse.json(
      { error: 'An unexpected internal error occurred while processing your booking.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const facilityId = searchParams.get('facility_id');
  const startTime = searchParams.get('start_time');
  const endTime = searchParams.get('end_time');

  if (facilityId && startTime && endTime) {
    const conflict = await db.checkBookingConflict(facilityId, startTime, endTime);
    return NextResponse.json(conflict);
  }

  const bookings = await db.getBookings();
  return NextResponse.json(bookings);
}

