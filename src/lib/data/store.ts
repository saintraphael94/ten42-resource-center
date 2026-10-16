import fs from 'fs';
import path from 'path';
import {
  Facility,
  FacilityCategory,
  Booking,
  MembershipPlan,
  Membership,
  Guest,
  Visit,
  Payment,
  Invoice,
  Enquiry,
  Program,
  SystemSetting,
  UserRole,
} from '@/types/database';

interface DatabaseData {
  categories: FacilityCategory[];
  facilities: Facility[];
  plans: MembershipPlan[];
  bookings: Booking[];
  memberships: Membership[];
  guests: Guest[];
  visits: Visit[];
  payments: Payment[];
  invoices: Invoice[];
  enquiries: Enquiry[];
  programs: Program[];
  settings: Record<string, unknown>;
  users: Array<{
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
  }>;
}

const DB_FILE_PATH = path.join(process.cwd(), '.data', 'ten42_db.json');

// Initial seed data aligned with Ten42 facilities, brand identity, and programs
const INITIAL_DATA: DatabaseData = {
  categories: [
    {
      id: 'c1111111-1111-1111-1111-111111111111',
      name: 'Conference & Auditorium',
      slug: 'auditorium',
      description: 'Large capacity halls for summits, general assemblies, and symposiums.',
      sort_order: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 'c2222222-2222-2222-2222-222222222222',
      name: 'Executive Boardrooms',
      slug: 'boardrooms',
      description: 'High-level meeting spaces for board discussions and strategic negotiations.',
      sort_order: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: 'c3333333-3333-3333-3333-333333333333',
      name: 'Training & Computer Labs',
      slug: 'training-labs',
      description: 'Equipped learning spaces for practical workshops and technical certifications.',
      sort_order: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: 'c4444444-4444-4444-4444-444444444444',
      name: 'Meeting Suites',
      slug: 'meeting-suites',
      description: 'Focus-oriented rooms for client pitches and team strategy breakouts.',
      sort_order: 4,
      created_at: new Date().toISOString(),
    },
  ],
  facilities: [
    {
      id: 'f1111111-1111-1111-1111-111111111111',
      category_id: 'c1111111-1111-1111-1111-111111111111',
      name: 'Main Auditorium & Grand Conference Hall',
      slug: 'main-auditorium',
      description: 'Flagship multi-level conference hall featuring a mezzanine gallery, stage podium with integrated digital screen, surround sound acoustics, dual ceiling projector arrays, and ergonomic auditorium seating. Ideal for summits, conventions, graduations, and institutional assemblies.',
      capacity: 280,
      hourly_rate: 35000,
      half_day_rate: 150000,
      daily_rate: 250000,
      amenities: [
        'Mezzanine Gallery',
        'Integrated Podium with Digital Screen',
        'Surround Sound & Wireless Microphones',
        'High-Definition Projection',
        'Central Air Conditioning',
        'Dedicated Sound Engineer',
        'Backup Power Generator',
        'Wheelchair Accessible',
      ],
      images: ['/images/Header2.jpg', '/images/FrontView.jpg'],
      operating_hours: {
        weekdays: { open: '08:00', close: '18:00' },
        saturday: { open: '09:00', close: '17:00' },
        sunday: null,
      },
      setup_buffer_mins: 45,
      teardown_buffer_mins: 45,
      min_hours: 2,
      max_hours: 12,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'f2222222-2222-2222-2222-222222222222',
      category_id: 'c2222222-2222-2222-2222-222222222222',
      name: 'Executive Boardroom Suite',
      slug: 'executive-boardroom',
      description: 'Prestigious boardroom furnished with ergonomic executive leather chairs, 75-inch 4K smart interactive display, hybrid video conferencing system, and a discreet beverage preparation station.',
      capacity: 18,
      hourly_rate: 20000,
      half_day_rate: 65000,
      daily_rate: 110000,
      amenities: [
        '75-inch 4K Smart Display',
        'Cisco Hybrid Video Conference Bar',
        'Omnidirectional Microphones',
        'Executive Leather Seating',
        'High-Speed Dedicated Wi-Fi',
        'Coffee & Tea Service Point',
      ],
      images: ['/images/FrontView.jpg', '/images/Header2.jpg'],
      operating_hours: {
        weekdays: { open: '08:00', close: '19:00' },
        saturday: { open: '09:00', close: '16:00' },
        sunday: null,
      },
      setup_buffer_mins: 30,
      teardown_buffer_mins: 30,
      min_hours: 1,
      max_hours: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'f3333333-3333-3333-3333-333333333333',
      category_id: 'c3333333-3333-3333-3333-333333333333',
      name: 'Interactive Training Lab',
      slug: 'training-lab',
      description: 'Modern modular computer and training laboratory designed for collaborative learning, practical tech workshops, masterclasses, and corporate simulations with dual high-lumen projectors.',
      capacity: 36,
      hourly_rate: 15000,
      half_day_rate: 50000,
      daily_rate: 85000,
      amenities: [
        'Modular Mobile Desks',
        'Interactive Whiteboards',
        'Dual Projectors',
        'Dedicated Fiber Internet (100Mbps)',
        'Multiple Floor Power Outlets',
        'Air Conditioned',
      ],
      images: ['/images/Header2.jpg'],
      operating_hours: {
        weekdays: { open: '08:00', close: '18:00' },
        saturday: { open: '09:00', close: '16:00' },
        sunday: null,
      },
      setup_buffer_mins: 30,
      teardown_buffer_mins: 30,
      min_hours: 2,
      max_hours: 8,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'f4444444-4444-4444-4444-444444444444',
      category_id: 'c4444444-4444-4444-4444-444444444444',
      name: 'Synergy Meeting Room',
      slug: 'synergy-meeting-room',
      description: 'Compact, sound-isolated strategy room tailored for confidential interviews, client presentations, and focused team brainstorming sessions.',
      capacity: 8,
      hourly_rate: 10000,
      half_day_rate: 35000,
      daily_rate: 60000,
      amenities: [
        '55-inch Presentation Screen',
        'Magnetic Glass Whiteboard',
        'High-Speed WiFi',
        'Video Call Bar',
      ],
      images: ['/images/FrontView.jpg'],
      operating_hours: {
        weekdays: { open: '08:00', close: '18:00' },
        saturday: { open: '09:00', close: '16:00' },
        sunday: null,
      },
      setup_buffer_mins: 15,
      teardown_buffer_mins: 15,
      min_hours: 1,
      max_hours: 8,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  plans: [
    {
      id: 'p1111111-1111-1111-1111-111111111111',
      code: 'MEM-INDIVIDUAL',
      name: 'Individual Professional',
      description: 'Designed for consultants, professionals, and lifelong learners seeking an inspiring environment, facility discounts, and high-level networking.',
      duration_months: 1,
      fee: 25000,
      currency: 'NGN',
      benefits: [
        '10 Hours complimentary meeting room credits per month',
        '20% discount on Auditorium and Lab bookings',
        'High-speed secure fiber Wi-Fi',
        'Access to Ten42 digital resource library',
        'Priority invitations to institutional workshops',
      ],
      eligibility: 'Open to working professionals, entrepreneurs, and independent researchers.',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'p2222222-2222-2222-2222-222222222222',
      code: 'MEM-STUDENT',
      name: 'Student & Early Career',
      description: 'Subsidized membership for verified tertiary students and emerging young changemakers committed to personal development and skill acquisition.',
      duration_months: 1,
      fee: 15000,
      currency: 'NGN',
      benefits: [
        'Full access to Ten42 study lounge & library hub',
        'Free entry to selected monthly masterclasses',
        'High-speed Wi-Fi access',
        'Mentorship matching opportunities',
        '15% discount on certified training courses',
      ],
      eligibility: 'Valid student ID card or national youth service letter required.',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'p3333333-3333-3333-3333-333333333333',
      code: 'MEM-CORPORATE',
      name: 'Corporate Enterprise',
      description: 'Comprehensive institutional package for businesses, NGOs, and teams requiring reliable executive meeting spaces and staff capacity development.',
      duration_months: 1,
      fee: 120000,
      currency: 'NGN',
      benefits: [
        '5 Registered staff membership passes',
        '25 Hours Boardroom and Meeting Suite credits',
        '30% discount on Grand Auditorium reservations',
        'Branded visitor welcome on front desk screen',
        'Dedicated account officer',
      ],
      eligibility: 'Registered corporate entities, development agencies, and non-profits.',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'p4444444-4444-4444-4444-444444444444',
      code: 'MEM-COMMUNITY',
      name: 'Community Associate',
      description: 'Entry-level membership for community advocates, volunteers, and remote workers desiring connection with the Ten42 ecosystem.',
      duration_months: 1,
      fee: 10000,
      currency: 'NGN',
      benefits: [
        'Access to open community networking forums',
        'Discounted day pass to coworking spaces',
        'Monthly institutional newsletter and publications',
        'Invitations to public impact talks',
      ],
      eligibility: 'Open to all community members.',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  bookings: [
    {
      id: 'b1111111-1111-1111-1111-111111111111',
      booking_reference: 'T42-BK-261015-A101',
      facility_id: 'f1111111-1111-1111-1111-111111111111',
      guest_name: 'Dr. Chinedu Eze',
      guest_email: 'c.eze@nigerianhealthleaders.org',
      guest_phone: '+234 803 111 2233',
      organization: 'West African Healthcare Initiative',
      start_time: '2026-10-18T09:00:00Z',
      end_time: '2026-10-18T16:00:00Z',
      purpose: 'Annual Healthcare Leaders Strategy Summit',
      attendee_count: 220,
      estimated_price: 250000,
      approved_price: 250000,
      booking_status: 'confirmed',
      payment_status: 'paid',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'b2222222-2222-2222-2222-222222222222',
      booking_reference: 'T42-BK-261016-B202',
      facility_id: 'f2222222-2222-2222-2222-222222222222',
      guest_name: 'Amina Bello',
      guest_email: 'amina.bello@apexpartners.ng',
      guest_phone: '+234 802 444 5566',
      organization: 'Apex Capital Partners',
      start_time: '2026-10-19T10:00:00Z',
      end_time: '2026-10-19T14:00:00Z',
      purpose: 'Q4 Board of Directors Strategic Audit',
      attendee_count: 14,
      estimated_price: 65000,
      approved_price: 65000,
      booking_status: 'pending',
      payment_status: 'unpaid',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  memberships: [
    {
      id: 'm1111111-1111-1111-1111-111111111111',
      membership_number: 'T42-MEM-2026-0001',
      user_id: 'u1111111-1111-1111-1111-111111111111',
      plan_id: 'p1111111-1111-1111-1111-111111111111',
      status: 'active',
      start_date: '2026-10-01',
      expiry_date: '2026-11-01',
      emergency_contact: {
        name: 'Funke Balogun',
        phone: '+234 803 999 8877',
        relationship: 'Spouse',
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'm2222222-2222-2222-2222-222222222222',
      membership_number: 'T42-MEM-2026-0002',
      user_id: 'u2222222-2222-2222-2222-222222222222',
      plan_id: 'p2222222-2222-2222-2222-222222222222',
      status: 'application_pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  guests: [
    {
      id: 'g1111111-1111-1111-1111-111111111111',
      full_name: 'Tunde Bakare',
      phone: '+234 809 123 4567',
      email: 'tunde@bakareconsult.com',
      organization: 'Bakare Advisory',
      created_at: new Date().toISOString(),
    },
    {
      id: 'g2222222-2222-2222-2222-222222222222',
      full_name: 'Ngozi Okonjo',
      phone: '+234 805 789 0123',
      email: 'ngozi@tradebridge.org',
      organization: 'TradeBridge Network',
      created_at: new Date().toISOString(),
    },
  ],
  visits: [
    {
      id: 'v1111111-1111-1111-1111-111111111111',
      visit_reference: 'T42-VST-261015-001',
      guest_id: 'g1111111-1111-1111-1111-111111111111',
      purpose: 'Meeting with Operations Director',
      host_person: 'Facility Management Team',
      destination: 'Executive Boardroom',
      group_size: 1,
      check_in_time: new Date(Date.now() - 3600000 * 2).toISOString(),
      status: 'checked_in',
      notes: 'Visitor badge #04 issued',
      created_at: new Date().toISOString(),
    },
    {
      id: 'v2222222-2222-2222-2222-222222222222',
      visit_reference: 'T42-VST-261015-002',
      guest_id: 'g2222222-2222-2222-2222-222222222222',
      purpose: 'Training Lab Inspection',
      host_person: 'Technical Director',
      destination: 'Training Lab',
      group_size: 2,
      check_in_time: new Date(Date.now() - 3600000 * 4).toISOString(),
      check_out_time: new Date(Date.now() - 3600000 * 1).toISOString(),
      status: 'checked_out',
      notes: 'Tour concluded successfully',
      created_at: new Date().toISOString(),
    },
  ],
  payments: [
    {
      id: 'pay11111-1111-1111-1111-111111111111',
      payment_reference: 'T42-PAY-261015-P001',
      booking_id: 'b1111111-1111-1111-1111-111111111111',
      amount: 250000,
      currency: 'NGN',
      payment_method: 'bank_transfer',
      payment_date: '2026-10-15',
      receipt_reference: 'ZB-TXN-998877221',
      status: 'verified',
      notes: 'Verified via Zenith Bank alert',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'pay22222-2222-2222-2222-222222222222',
      payment_reference: 'T42-PAY-261015-P002',
      membership_id: 'm1111111-1111-1111-1111-111111111111',
      amount: 25000,
      currency: 'NGN',
      payment_method: 'bank_transfer',
      payment_date: '2026-10-01',
      receipt_reference: 'ZB-TXN-11223344',
      status: 'verified',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  invoices: [],
  enquiries: [
    {
      id: 'e1111111-1111-1111-1111-111111111111',
      reference: 'T42-ENQ-2026-0001',
      full_name: 'Engr. Segun Johnson',
      email: 's.johnson@technigeria.com',
      phone: '+234 803 765 4321',
      category: 'facility_booking',
      subject: 'Inquiry for 3-Day Engineering Hackathon Hall Rental',
      message: 'Good day, we are planning a 3-day hackathon for 150 software developers in December. Does the Grand Auditorium have uninterrupted high-capacity WiFi and power redundancy?',
      preferred_contact_method: 'email',
      status: 'new',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  programs: [
    {
      id: 'pg111111-1111-1111-1111-111111111111',
      slug: 'executive-leadership-governance-2026',
      title: 'Executive Leadership & Institutional Governance',
      description: 'An intensive 3-day executive masterclass focusing on ethical leadership, organizational culture, fiduciary stewardship, and adaptive strategic planning for public and private sector leaders.',
      category: 'Leadership',
      featured_image: '/images/Header2.jpg',
      instructor: 'Dr. K. Adeleke & Visiting Faculty',
      start_date: '2026-11-10',
      end_date: '2026-11-12',
      venue: 'Grand Auditorium, Ten42 Center',
      registration_deadline: '2026-11-05',
      capacity: 50,
      fee: 75000,
      currency: 'NGN',
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'pg222222-2222-2222-2222-222222222222',
      slug: 'digital-skills-data-analytics',
      title: 'Applied Data Analytics for Decision Makers',
      description: 'Practical hands-on training providing professionals with the tools to translate raw business metrics into actionable insights using modern analytics, dashboards, and automated reporting.',
      category: 'Technology',
      featured_image: '/images/FrontView.jpg',
      instructor: 'Engr. T. Olatunji',
      start_date: '2026-11-20',
      end_date: '2026-11-22',
      venue: 'Interactive Training Lab',
      registration_deadline: '2026-11-15',
      capacity: 30,
      fee: 45000,
      currency: 'NGN',
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  settings: {
    general_info: {
      center_name: 'Ten42 Training and Resource Center',
      tagline: 'Training for Right Living...',
      phone: '+234 800 000 1042',
      email: 'info@ten42.org',
      address: 'Plot 1042 Commercial Layout, Victoria Island, Lagos, Nigeria',
      currency: 'NGN',
      timezone: 'Africa/Lagos',
      operating_hours: 'Monday - Friday: 8:00 AM - 6:00 PM | Saturday: 9:00 AM - 5:00 PM',
    },
    bank_details: {
      bank_name: 'Zenith Bank Plc',
      account_name: 'Ten42 Training and Resource Center Ltd',
      account_number: '1042000000',
      sort_code: '057150000',
      swift_code: 'ZEIBNGLA',
    },
  },
  users: [
    {
      id: 'u-admin-1',
      email: 'admin@ten42.org',
      full_name: 'System Administrator',
      role: 'super_admin',
    },
    {
      id: 'u-frontdesk-1',
      email: 'reception@ten42.org',
      full_name: 'Front Desk Reception',
      role: 'front_desk',
    },
    {
      id: 'u1111111-1111-1111-1111-111111111111',
      email: 'member@example.com',
      full_name: 'Tunde Balogun',
      role: 'member',
    },
  ],
};

function getDb(): DatabaseData {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE_PATH)) {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      return INITIAL_DATA;
    }
    const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading DB file, returning initial data fallback', err);
    return INITIAL_DATA;
  }
}

function saveDb(data: DatabaseData): void {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB file', err);
  }
}

// ------------------------------------------------------------------------------
// Data Access Methods with Concurrency & Business Rules
// ------------------------------------------------------------------------------

export const db = {
  // Facilities
  getFacilities: async (): Promise<Facility[]> => {
    return getDb().facilities;
  },

  getFacilityBySlug: async (slug: string): Promise<Facility | null> => {
    return getDb().facilities.find((f) => f.slug === slug) || null;
  },

  getFacilityById: async (id: string): Promise<Facility | null> => {
    return getDb().facilities.find((f) => f.id === id) || null;
  },

  createFacility: async (facility: Omit<Facility, 'id' | 'created_at' | 'updated_at'>): Promise<Facility> => {
    const data = getDb();
    const newFacility: Facility = {
      ...facility,
      id: `f-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    data.facilities.push(newFacility);
    saveDb(data);
    return newFacility;
  },

  updateFacility: async (id: string, updates: Partial<Facility>): Promise<Facility | null> => {
    const data = getDb();
    const idx = data.facilities.findIndex((f) => f.id === id);
    if (idx === -1) return null;
    data.facilities[idx] = {
      ...data.facilities[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    saveDb(data);
    return data.facilities[idx];
  },

  // Categories
  getCategories: async (): Promise<FacilityCategory[]> => {
    return getDb().categories;
  },

  // Bookings with Concurrency Conflict Prevention
  getBookings: async (): Promise<Booking[]> => {
    const data = getDb();
    return data.bookings.map((b) => ({
      ...b,
      facility: data.facilities.find((f) => f.id === b.facility_id),
    }));
  },

  getBookingByReference: async (ref: string): Promise<Booking | null> => {
    const data = getDb();
    const booking = data.bookings.find((b) => b.booking_reference === ref);
    if (!booking) return null;
    return {
      ...booking,
      facility: data.facilities.find((f) => f.id === booking.facility_id),
    };
  },

  /**
   * Check for overlapping booking conflicts including buffer times
   */
  checkBookingConflict: async (
    facilityId: string,
    startTime: string,
    endTime: string,
    excludeBookingId?: string
  ): Promise<{ hasConflict: boolean; reason?: string }> => {
    const data = getDb();
    const facility = data.facilities.find((f) => f.id === facilityId);
    if (!facility) return { hasConflict: true, reason: 'Facility not found' };

    const reqStart = new Date(startTime).getTime();
    const reqEnd = new Date(endTime).getTime();

    if (reqEnd <= reqStart) {
      return { hasConflict: true, reason: 'End time must be after start time' };
    }

    const bufferMs = (facility.setup_buffer_mins || 30) * 60 * 1000;

    for (const b of data.bookings) {
      if (b.facility_id !== facilityId) continue;
      if (excludeBookingId && b.id === excludeBookingId) continue;
      if (b.booking_status === 'rejected' || b.booking_status === 'cancelled') continue;

      const existingStart = new Date(b.start_time).getTime() - bufferMs;
      const existingEnd = new Date(b.end_time).getTime() + bufferMs;

      // Overlap formula: (StartA < EndB) and (EndA > StartB)
      if (reqStart < existingEnd && reqEnd > existingStart) {
        return {
          hasConflict: true,
          reason: `Requested time conflicts with an existing reservation (${b.booking_reference}) or required preparation buffer.`,
        };
      }
    }

    return { hasConflict: false };
  },

  createBooking: async (
    booking: Omit<Booking, 'id' | 'booking_reference' | 'created_at' | 'updated_at' | 'booking_status' | 'payment_status'>
  ): Promise<{ success: boolean; booking?: Booking; error?: string }> => {
    const conflict = await db.checkBookingConflict(booking.facility_id, booking.start_time, booking.end_time);
    if (conflict.hasConflict) {
      return { success: false, error: conflict.reason };
    }

    const data = getDb();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const reference = `T42-BK-${dateStr}-${rand}`;

    const newBooking: Booking = {
      ...booking,
      id: `b-${Date.now()}-${rand}`,
      booking_reference: reference,
      booking_status: 'pending',
      payment_status: 'unpaid',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    data.bookings.push(newBooking);
    saveDb(data);

    return {
      success: true,
      booking: {
        ...newBooking,
        facility: data.facilities.find((f) => f.id === newBooking.facility_id),
      },
    };
  },

  updateBookingStatus: async (
    id: string,
    status: Booking['booking_status'],
    adminNotes?: string,
    cancellationReason?: string
  ): Promise<Booking | null> => {
    const data = getDb();
    const idx = data.bookings.findIndex((b) => b.id === id);
    if (idx === -1) return null;

    data.bookings[idx] = {
      ...data.bookings[idx],
      booking_status: status,
      ...(adminNotes ? { admin_notes: adminNotes } : {}),
      ...(cancellationReason ? { cancellation_reason: cancellationReason } : {}),
      updated_at: new Date().toISOString(),
    };
    saveDb(data);
    return data.bookings[idx];
  },

  // Memberships & Plans
  getPlans: async (): Promise<MembershipPlan[]> => {
    return getDb().plans;
  },

  getPlanByCode: async (code: string): Promise<MembershipPlan | null> => {
    return getDb().plans.find((p) => p.code === code) || null;
  },

  getMemberships: async (): Promise<Membership[]> => {
    const data = getDb();
    return data.memberships.map((m) => ({
      ...m,
      plan: data.plans.find((p) => p.id === m.plan_id),
      user: data.users.find((u) => u.id === m.user_id) as any,
    }));
  },

  createMembershipApplication: async (
    application: Omit<Membership, 'id' | 'membership_number' | 'status' | 'created_at' | 'updated_at'>
  ): Promise<Membership> => {
    const data = getDb();
    const year = new Date().getFullYear();
    const count = data.memberships.length + 1;
    const membershipNumber = `T42-MEM-${year}-${String(count).padStart(4, '0')}`;

    const newMembership: Membership = {
      ...application,
      id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      membership_number: membershipNumber,
      status: 'application_pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    data.memberships.push(newMembership);
    saveDb(data);
    return newMembership;
  },

  updateMembershipStatus: async (
    id: string,
    status: Membership['status'],
    startDate?: string,
    expiryDate?: string
  ): Promise<Membership | null> => {
    const data = getDb();
    const idx = data.memberships.findIndex((m) => m.id === id);
    if (idx === -1) return null;

    data.memberships[idx] = {
      ...data.memberships[idx],
      status,
      ...(startDate ? { start_date: startDate } : {}),
      ...(expiryDate ? { expiry_date: expiryDate } : {}),
      updated_at: new Date().toISOString(),
    };
    saveDb(data);
    return data.memberships[idx];
  },

  // Front Desk Visitors & Check-in / Check-out
  getVisits: async (): Promise<Visit[]> => {
    const data = getDb();
    return data.visits.map((v) => ({
      ...v,
      guest: data.guests.find((g) => g.id === v.guest_id),
    }));
  },

  recordGuestCheckIn: async (
    guestData: { full_name: string; phone?: string; email?: string; organization?: string },
    visitData: { purpose: string; host_person?: string; destination?: string; group_size: number; notes?: string }
  ): Promise<Visit> => {
    const data = getDb();

    // Check or find existing guest by phone/email
    let guest = data.guests.find(
      (g) => (guestData.phone && g.phone === guestData.phone) || (guestData.email && g.email === guestData.email)
    );

    if (!guest) {
      guest = {
        id: `g-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        full_name: guestData.full_name,
        phone: guestData.phone || null,
        email: guestData.email || null,
        organization: guestData.organization || null,
        created_at: new Date().toISOString(),
      };
      data.guests.push(guest);
    }

    const ref = `T42-VST-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    const newVisit: Visit = {
      id: `v-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      visit_reference: ref,
      guest_id: guest.id,
      purpose: visitData.purpose,
      host_person: visitData.host_person || null,
      destination: visitData.destination || null,
      group_size: visitData.group_size || 1,
      check_in_time: new Date().toISOString(),
      status: 'checked_in',
      notes: visitData.notes || null,
      created_at: new Date().toISOString(),
      guest,
    };

    data.visits.unshift(newVisit);
    saveDb(data);
    return newVisit;
  },

  recordGuestCheckOut: async (visitId: string): Promise<Visit | null> => {
    const data = getDb();
    const idx = data.visits.findIndex((v) => v.id === visitId);
    if (idx === -1) return null;

    data.visits[idx] = {
      ...data.visits[idx],
      check_out_time: new Date().toISOString(),
      status: 'checked_out',
    };
    saveDb(data);
    return data.visits[idx];
  },

  // Payments & Verification
  getPayments: async (): Promise<Payment[]> => {
    return getDb().payments;
  },

  createPayment: async (
    payment: Omit<Payment, 'id' | 'payment_reference' | 'status' | 'created_at' | 'updated_at'>
  ): Promise<Payment> => {
    const data = getDb();
    const ref = `T42-PAY-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPayment: Payment = {
      ...payment,
      id: `pay-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      payment_reference: ref,
      status: 'unverified',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    data.payments.unshift(newPayment);
    saveDb(data);
    return newPayment;
  },

  verifyPayment: async (paymentId: string, verifiedBy: string, notes?: string): Promise<Payment | null> => {
    const data = getDb();
    const idx = data.payments.findIndex((p) => p.id === paymentId);
    if (idx === -1) return null;

    const payment = data.payments[idx];
    data.payments[idx] = {
      ...payment,
      status: 'verified',
      verified_by: verifiedBy,
      verified_at: new Date().toISOString(),
      notes: notes || payment.notes,
      updated_at: new Date().toISOString(),
    };

    // If linked to membership, activate membership
    if (payment.membership_id) {
      const mIdx = data.memberships.findIndex((m) => m.id === payment.membership_id);
      if (mIdx !== -1) {
        const plan = data.plans.find((p) => p.id === data.memberships[mIdx].plan_id);
        const durationMonths = plan?.duration_months || 1;
        const startDate = new Date().toISOString().slice(0, 10);
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + durationMonths);
        const expiryDate = expiry.toISOString().slice(0, 10);

        data.memberships[mIdx] = {
          ...data.memberships[mIdx],
          status: 'active',
          start_date: startDate,
          expiry_date: expiryDate,
          approved_by: verifiedBy,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
    }

    // If linked to booking, update payment_status
    if (payment.booking_id) {
      const bIdx = data.bookings.findIndex((b) => b.id === payment.booking_id);
      if (bIdx !== -1) {
        data.bookings[bIdx] = {
          ...data.bookings[bIdx],
          payment_status: 'paid',
          updated_at: new Date().toISOString(),
        };
      }
    }

    saveDb(data);
    return data.payments[idx];
  },

  // Enquiries
  getEnquiries: async (): Promise<Enquiry[]> => {
    return getDb().enquiries;
  },

  createEnquiry: async (enquiry: Omit<Enquiry, 'id' | 'reference' | 'status' | 'created_at' | 'updated_at'>): Promise<Enquiry> => {
    const data = getDb();
    const year = new Date().getFullYear();
    const count = data.enquiries.length + 1;
    const ref = `T42-ENQ-${year}-${String(count).padStart(4, '0')}`;

    const newEnquiry: Enquiry = {
      ...enquiry,
      id: `e-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      reference: ref,
      status: 'new',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    data.enquiries.unshift(newEnquiry);
    saveDb(data);
    return newEnquiry;
  },

  updateEnquiryStatus: async (id: string, status: Enquiry['status'], internalNotes?: string): Promise<Enquiry | null> => {
    const data = getDb();
    const idx = data.enquiries.findIndex((e) => e.id === id);
    if (idx === -1) return null;

    data.enquiries[idx] = {
      ...data.enquiries[idx],
      status,
      ...(internalNotes ? { internal_notes: internalNotes } : {}),
      updated_at: new Date().toISOString(),
    };
    saveDb(data);
    return data.enquiries[idx];
  },

  // Programs
  getPrograms: async (): Promise<Program[]> => {
    return getDb().programs;
  },

  getProgramBySlug: async (slug: string): Promise<Program | null> => {
    return getDb().programs.find((p) => p.slug === slug) || null;
  },

  createProgram: async (program: Omit<Program, 'id' | 'created_at' | 'updated_at'>): Promise<Program> => {
    const data = getDb();
    const newProgram: Program = {
      ...program,
      id: `pg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    data.programs.push(newProgram);
    saveDb(data);
    return newProgram;
  },

  // System Settings
  getSettings: async (): Promise<Record<string, unknown>> => {
    return getDb().settings;
  },

  // Analytics & KPIs
  getDashboardMetrics: async () => {
    const data = getDb();
    const totalMembers = data.memberships.length;
    const activeMembers = data.memberships.filter((m) => m.status === 'active').length;
    const pendingMemberships = data.memberships.filter((m) => m.status === 'application_pending').length;

    const todayStr = new Date().toISOString().slice(0, 10);
    const todayBookings = data.bookings.filter((b) => b.start_time.startsWith(todayStr)).length;
    const pendingBookings = data.bookings.filter((b) => b.booking_status === 'pending').length;

    const todayVisits = data.visits.filter((v) => v.check_in_time.startsWith(todayStr)).length;
    const currentlyCheckedIn = data.visits.filter((v) => v.status === 'checked_in').length;

    const unresolvedEnquiries = data.enquiries.filter((e) => e.status === 'new' || e.status === 'in_progress').length;

    const verifiedRevenue = data.payments
      .filter((p) => p.status === 'verified')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      totalMembers,
      activeMembers,
      pendingMemberships,
      todayBookings,
      pendingBookings,
      todayVisits,
      currentlyCheckedIn,
      unresolvedEnquiries,
      verifiedRevenue,
      currency: 'NGN',
    };
  },
};

