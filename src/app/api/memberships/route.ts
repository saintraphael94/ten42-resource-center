import { NextRequest, NextResponse } from 'next/server';
import { membershipApplicationSchema } from '@/lib/validations';
import { db } from '@/lib/data/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = membershipApplicationSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid application data', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const {
      plan_id,
      full_name,
      email,
      phone,
      emergency_name,
      emergency_phone,
      emergency_relationship,
    } = validated.data;

    // Create membership application record
    const membership = await db.createMembershipApplication({
      user_id: `u-${Date.now()}`,
      plan_id,
      emergency_contact: {
        name: emergency_name,
        phone: emergency_phone,
        relationship: emergency_relationship,
      },
      supporting_documents: [],
    });

    return NextResponse.json({
      success: true,
      message: 'Membership application submitted successfully.',
      membership,
      applicant: { full_name, email, phone },
    });
  } catch (err) {
    console.error('Membership application error:', err);
    return NextResponse.json(
      { error: 'Failed to process membership application.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const memberships = await db.getMemberships();
  return NextResponse.json(memberships);
}

