import { NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export async function GET() {
  const plans = await db.getPlans();
  return NextResponse.json(plans);
}

