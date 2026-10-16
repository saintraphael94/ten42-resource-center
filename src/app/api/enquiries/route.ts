import { NextRequest, NextResponse } from 'next/server';
import { enquirySchema } from '@/lib/validations';
import { db } from '@/lib/data/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = enquirySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid form inputs', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const {
      full_name,
      email,
      phone,
      category,
      subject,
      message,
      preferred_contact_method,
    } = validated.data;

    const enquiry = await db.createEnquiry({
      full_name,
      email,
      phone: phone || null,
      category,
      subject,
      message,
      preferred_contact_method,
      assigned_to: null,
      internal_notes: null,
    });

    return NextResponse.json({
      success: true,
      message: 'Enquiry successfully submitted.',
      enquiry,
    });
  } catch (err) {
    console.error('Enquiry creation error:', err);
    return NextResponse.json(
      { error: 'Failed to submit enquiry. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const enquiries = await db.getEnquiries();
  return NextResponse.json(enquiries);
}

