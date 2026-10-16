import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type') || 'bookings';

  let csvContent = '';
  let filename = `ten42_report_${type}_${new Date().toISOString().slice(0, 10)}.csv`;

  if (type === 'bookings') {
    const bookings = await db.getBookings();
    csvContent = 'Reference,Facility,Guest Name,Email,Phone,Start Time,End Time,Attendees,Estimated Price,Status,Payment Status\n';
    bookings.forEach((b) => {
      csvContent += `"${b.booking_reference}","${b.facility?.name || b.facility_id}","${b.guest_name}","${b.guest_email}","${b.guest_phone}","${b.start_time}","${b.end_time}",${b.attendee_count},${b.estimated_price},"${b.booking_status}","${b.payment_status}"\n`;
    });
  } else if (type === 'memberships') {
    const memberships = await db.getMemberships();
    csvContent = 'Membership Number,Plan,User ID,Status,Start Date,Expiry Date,Emergency Contact\n';
    memberships.forEach((m) => {
      const em = m.emergency_contact ? `${m.emergency_contact.name} (${m.emergency_contact.phone})` : '';
      csvContent += `"${m.membership_number}","${m.plan?.name || m.plan_id}","${m.user_id}","${m.status}","${m.start_date || ''}","${m.expiry_date || ''}","${em}"\n`;
    });
  } else if (type === 'visitors') {
    const visits = await db.getVisits();
    csvContent = 'Visit Reference,Guest Name,Phone,Email,Organization,Purpose,Host,Destination,Group Size,Check In,Check Out,Status\n';
    visits.forEach((v) => {
      csvContent += `"${v.visit_reference}","${v.guest?.full_name || ''}","${v.guest?.phone || ''}","${v.guest?.email || ''}","${v.guest?.organization || ''}","${v.purpose}","${v.host_person || ''}","${v.destination || ''}",${v.group_size},"${v.check_in_time}","${v.check_out_time || ''}","${v.status}"\n`;
    });
  } else if (type === 'payments') {
    const payments = await db.getPayments();
    csvContent = 'Payment Reference,Amount,Currency,Method,Payment Date,Status,Verified By,Receipt Reference,Notes\n';
    payments.forEach((p) => {
      csvContent += `"${p.payment_reference}",${p.amount},"${p.currency}","${p.payment_method}","${p.payment_date}","${p.status}","${p.verified_by || ''}","${p.receipt_reference || ''}","${p.notes || ''}"\n`;
    });
  }

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

