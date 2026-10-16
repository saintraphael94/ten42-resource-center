import { NextRequest, NextResponse } from 'next/server';
import { paymentRecordSchema } from '@/lib/validations';
import { db } from '@/lib/data/store';

export async function GET() {
  const payments = await db.getPayments();
  return NextResponse.json(payments);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = paymentRecordSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid payment data', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const payment = await db.createPayment(validated.data);
    return NextResponse.json({
      success: true,
      message: 'Payment record submitted.',
      payment,
    });
  } catch (err) {
    console.error('Payment creation error:', err);
    return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
  }
}

