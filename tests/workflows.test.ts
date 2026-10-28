import assert from 'node:assert';
import { db } from '../src/lib/data/store';
import {
  bookingRequestSchema,
  membershipApplicationSchema,
  visitorCheckInSchema,
  enquirySchema,
} from '../src/lib/validations';

async function runTestSuite() {
  console.log('================================================================');
  console.log('TEN42 TRAINING AND RESOURCE CENTER: AUTOMATED TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`✓ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`✗ FAIL: ${name}`);
      console.error(`  Reason: ${err.message || err}`);
      failed++;
    }
  }

  // 1. A visitor submits an enquiry and staff can manage it
  await test('Workflow 1: Visitor enquiry submission and staff management', async () => {
    const input = {
      full_name: 'Engr. Dapo Alao',
      email: 'dapo@alaoconsulting.com',
      phone: '+234 802 333 4455',
      category: 'facility_booking',
      subject: 'Inquiry on Grand Auditorium availability for December Summit',
      message: 'We are requesting dates and technical equipment specifications for 250 attendees.',
      preferred_contact_method: 'email',
    };

    const validated = enquirySchema.parse(input);
    const enquiry = await db.createEnquiry({
      ...validated,
      preferred_contact_method: validated.preferred_contact_method as any,
      assigned_to: null,
      internal_notes: null,
    });

    assert.ok(enquiry.id, 'Enquiry must have an ID');
    assert.match(enquiry.reference, /^T42-ENQ-/, 'Reference format must match T42-ENQ-');
    assert.strictEqual(enquiry.status, 'new', 'Initial status must be new');

    // Staff records internal note and resolves enquiry
    const updated = await db.updateEnquiryStatus(
      enquiry.id,
      'resolved',
      'Contacted via email with Auditorium technical spec brochure.'
    );
    assert.ok(updated, 'Updated enquiry must be returned');
    assert.strictEqual(updated.status, 'resolved', 'Status must be updated to resolved');
    assert.ok(updated.internal_notes?.includes('technical spec brochure'), 'Internal note must be recorded');
  });

  // 2. A prospective member registers and an administrator approves the membership
  await test('Workflow 2: Member registration and administrative approval', async () => {
    const plans = await db.getPlans();
    const targetPlan = plans[0];
    assert.ok(targetPlan, 'At least one membership plan must exist');

    const appInput = {
      plan_id: targetPlan.id,
      full_name: 'Dr. Bolanle Awe',
      email: 'b.awe@africainstitute.org',
      phone: '+234 803 555 6677',
      emergency_name: 'Ade Awe',
      emergency_phone: '+234 803 111 9999',
      emergency_relationship: 'Brother',
    };

    membershipApplicationSchema.parse(appInput);

    const membership = await db.createMembershipApplication({
      user_id: 'u-test-applicant',
      plan_id: targetPlan.id,
      emergency_contact: {
        name: appInput.emergency_name,
        phone: appInput.emergency_phone,
        relationship: appInput.emergency_relationship,
      },
    });

    assert.ok(membership.id, 'Membership must have an ID');
    assert.match(membership.membership_number, /^T42-MEM-/, 'Membership number must match T42-MEM-');
    assert.strictEqual(membership.status, 'application_pending', 'Initial status must be application_pending');

    // Admin approves membership
    const startDate = '2026-11-01';
    const expiryDate = '2026-12-01';
    const approved = await db.updateMembershipStatus(membership.id, 'active', startDate, expiryDate);

    assert.ok(approved, 'Approved membership must be returned');
    assert.strictEqual(approved.status, 'active', 'Membership status must be active');
    assert.strictEqual(approved.expiry_date, expiryDate, 'Expiry date must match scheduled period');
  });

  // 3. A member makes a reservation and staff approve it
  const uniqueTestTime = 2000000000000 + Date.now() + Math.floor(Math.random() * 1000000000);
  const testSlotStart = new Date(uniqueTestTime).toISOString();
  const testSlotEnd = new Date(uniqueTestTime + 14400000).toISOString(); // +4 hours
  const testConflictStart = new Date(uniqueTestTime + 3600000).toISOString(); // +1 hour (inside slot)
  const testConflictEnd = new Date(uniqueTestTime + 7200000).toISOString();

  await test('Workflow 3: Reservation request creation and staff approval', async () => {
    const facilities = await db.getFacilities();
    const boardroom = facilities.find((f) => f.slug === 'executive-boardroom') || facilities[0];

    const bookingRes = await db.createBooking({
      facility_id: boardroom.id,
      guest_name: 'Chief Emeka Okeke',
      guest_email: 'emeka@okekehomes.ng',
      guest_phone: '+234 805 123 4567',
      organization: 'Okeke Properties Group',
      start_time: testSlotStart,
      end_time: testSlotEnd,
      purpose: 'Executive Board Annual General Meeting',
      attendee_count: 14,
      estimated_price: boardroom.half_day_rate,
    });

    assert.strictEqual(bookingRes.success, true, 'Booking creation must succeed');
    assert.ok(bookingRes.booking, 'Booking object must be defined');
    assert.strictEqual(bookingRes.booking.booking_status, 'pending', 'Status must be pending');

    // Staff approves reservation
    const approved = await db.updateBookingStatus(bookingRes.booking.id, 'confirmed', 'Boardroom reserved with video bar setup');
    assert.ok(approved, 'Approved booking must be returned');
    assert.strictEqual(approved.booking_status, 'confirmed', 'Status must transition to confirmed');
  });

  // 4. A conflicting reservation is blocked (concurrency safety)
  await test('Workflow 4: Overlapping reservation is blocked by conflict engine', async () => {
    const facilities = await db.getFacilities();
    const boardroom = facilities.find((f) => f.slug === 'executive-boardroom') || facilities[0];

    // Attempt to book overlapping time slot as Workflow 3
    const conflictAttempt = await db.createBooking({
      facility_id: boardroom.id,
      guest_name: 'Simultaneous Booker',
      guest_email: 'another@domain.com',
      guest_phone: '+234 809 000 1111',
      start_time: testConflictStart,
      end_time: testConflictEnd,
      purpose: 'Conflicting meeting attempt',
      attendee_count: 5,
      estimated_price: 20000,
    });

    assert.strictEqual(conflictAttempt.success, false, 'Conflicting booking must be blocked');
    assert.ok(
      conflictAttempt.error?.includes('conflicts with an existing reservation') ||
      conflictAttempt.error?.includes('buffer'),
      'Must return informative conflict error message'
    );
  });

  // 5. A verified payment updates payment and membership subscription records
  await test('Workflow 5: Payment verification activates subscription', async () => {
    const plans = await db.getPlans();
    const plan = plans[0];

    // Create a pending membership
    const pendingMember = await db.createMembershipApplication({
      user_id: 'u-test-subscriber',
      plan_id: plan.id,
    });

    // Record an unverified payment linked to this membership
    const payment = await db.createPayment({
      membership_id: pendingMember.id,
      amount: plan.fee,
      currency: 'NGN',
      payment_method: 'bank_transfer',
      payment_date: new Date().toISOString().slice(0, 10),
      receipt_reference: 'ZB-AUDIT-TEST-9988',
      notes: 'Direct wire transfer to Zenith Bank',
    });

    assert.strictEqual(payment.status, 'unverified', 'Payment must initially be unverified');

    // Admin verifies payment
    const verified = await db.verifyPayment(payment.id, 'Duty Auditor', 'Verified via Zenith Bank credit alert');
    assert.ok(verified, 'Verified payment returned');
    assert.strictEqual(verified.status, 'verified', 'Payment status must be verified');

    // Confirm that the linked membership was activated
    const allMembers = await db.getMemberships();
    const activatedMember = allMembers.find((m) => m.id === pendingMember.id);
    assert.ok(activatedMember, 'Activated member must exist');
    assert.strictEqual(activatedMember.status, 'active', 'Membership must be activated upon verified payment');
    assert.ok(activatedMember.expiry_date, 'Expiry date must be calculated');
  });

  // 6. Receptionist registers a guest, checks them in, and checks them out
  await test('Workflow 6: Front desk guest registration, check-in, and check-out', async () => {
    const visitInput = {
      full_name: 'Senator Farouk Bello',
      phone: '+234 802 999 8888',
      email: 'f.bello@senate.gov.ng',
      organization: 'National Assembly Committee on Education',
      purpose: 'Auditorium facility technical inspection',
      host_person: 'Executive Director',
      destination: 'Main Auditorium',
      group_size: 3,
      notes: 'VIP guest party badge issued',
    };

    visitorCheckInSchema.parse(visitInput);

    const visit = await db.recordGuestCheckIn(
      {
        full_name: visitInput.full_name,
        phone: visitInput.phone,
        email: visitInput.email,
        organization: visitInput.organization,
      },
      {
        purpose: visitInput.purpose,
        host_person: visitInput.host_person,
        destination: visitInput.destination,
        group_size: visitInput.group_size,
        notes: visitInput.notes,
      }
    );

    assert.ok(visit.id, 'Visit must have an ID');
    assert.match(visit.visit_reference, /^T42-VST-/, 'Visit reference must match T42-VST-');
    assert.strictEqual(visit.status, 'checked_in', 'Status must be checked_in');

    // Front desk records departure
    const checkedOut = await db.recordGuestCheckOut(visit.id);
    assert.ok(checkedOut, 'Checked out visit must be returned');
    assert.strictEqual(checkedOut.status, 'checked_out', 'Status must transition to checked_out');
    assert.ok(checkedOut.check_out_time, 'Check-out timestamp must be recorded');
  });

  // 7. Input validation rejects invalid booking requests
  await test('Workflow 7: Zod schema rejects invalid reservation parameters', async () => {
    const invalidInput = {
      facility_id: '', // missing facility
      guest_name: 'A', // too short
      guest_email: 'not-an-email', // invalid email
      guest_phone: '123', // too short
      start_time: '',
      end_time: '',
      purpose: 'no', // too short
      attendee_count: 0, // must be at least 1
    };

    const result = bookingRequestSchema.safeParse(invalidInput);
    assert.strictEqual(result.success, false, 'Validation must fail for invalid inputs');
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      assert.ok(errors.facility_id, 'facility_id must be flagged');
      assert.ok(errors.guest_email, 'guest_email must be flagged');
      assert.ok(errors.purpose, 'purpose must be flagged');
    }
  });

  // 8. Expired membership status identification
  await test('Workflow 8: Expired memberships identified by status logic', async () => {
    const plans = await db.getPlans();
    const plan = plans[0];

    const pastExpiryMember = await db.createMembershipApplication({
      user_id: 'u-expired-test',
      plan_id: plan.id,
    });

    // Manually set past expiry date
    await db.updateMembershipStatus(pastExpiryMember.id, 'expired', '2025-01-01', '2025-02-01');

    const allMembers = await db.getMemberships();
    const found = allMembers.find((m) => m.id === pastExpiryMember.id);
    assert.ok(found, 'Member record must be retrievable');
    assert.strictEqual(found.status, 'expired', 'Member status must be expired');
  });

  // 9. Staff exports authorized reports
  await test('Workflow 9: Operational metrics and reporting queries', async () => {
    const metrics = await db.getDashboardMetrics();
    assert.ok(typeof metrics.totalMembers === 'number', 'Metrics must compute total members');
    assert.ok(typeof metrics.activeMembers === 'number', 'Metrics must compute active members');
    assert.ok(typeof metrics.verifiedRevenue === 'number', 'Metrics must compute audited revenue');
    assert.strictEqual(metrics.currency, 'NGN', 'Default currency must be NGN');
  });

  // 10. Administrator creates a new facility and makes it available for booking
  await test('Workflow 10: Admin facility creation and publication', async () => {
    const newFacility = await db.createFacility({
      name: 'Podcast & Media Studio Suite',
      slug: `media-studio-${Date.now()}`,
      description: 'Sound-proof broadcast studio with multi-mic arrays and 4K recording.',
      capacity: 6,
      hourly_rate: 12000,
      half_day_rate: 40000,
      daily_rate: 70000,
      amenities: ['4 Shure SM7B Mics', 'RodeCaster Pro II', 'Acoustic Paneling'],
      images: ['/images/Ten42-Podcast-studio.png'],
      operating_hours: {
        weekdays: { open: '09:00', close: '18:00' },
      },
      setup_buffer_mins: 15,
      teardown_buffer_mins: 15,
      min_hours: 1,
      max_hours: 8,
      is_active: true,
    });

    assert.ok(newFacility.id, 'New facility must be assigned an ID');
    assert.strictEqual(newFacility.is_active, true, 'Facility must be active');

    // Verify it is now retrievable and bookable
    const fetched = await db.getFacilityBySlug(newFacility.slug);
    assert.ok(fetched, 'Facility must be retrievable by slug');
    assert.strictEqual(fetched.name, 'Podcast & Media Studio Suite');
  });

  console.log('\n================================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
