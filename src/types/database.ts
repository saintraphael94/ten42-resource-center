export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'front_desk'
  | 'facility_manager'
  | 'member'
  | 'guest';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'cancelled'
  | 'completed'
  | 'no_show';

export type PaymentStatus =
  | 'unpaid'
  | 'partially_paid'
  | 'paid'
  | 'refunded';

export type PaymentMethod =
  | 'bank_transfer'
  | 'cash'
  | 'pos'
  | 'online_card';

export type PaymentVerificationStatus =
  | 'unverified'
  | 'verified'
  | 'rejected';

export type MembershipStatus =
  | 'application_pending'
  | 'active'
  | 'expiring_soon'
  | 'expired'
  | 'suspended'
  | 'cancelled';

export type VisitStatus =
  | 'checked_in'
  | 'checked_out'
  | 'overdue';

export type EnquiryStatus =
  | 'new'
  | 'in_progress'
  | 'resolved'
  | 'closed';

export type ProgramStatus =
  | 'draft'
  | 'published'
  | 'archived';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  organization?: string | null;
  role: UserRole;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FacilityCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sort_order: number;
  created_at: string;
}

export interface Facility {
  id: string;
  category_id?: string | null;
  name: string;
  slug: string;
  description: string;
  capacity: number;
  hourly_rate: number;
  half_day_rate: number;
  daily_rate: number;
  amenities: string[];
  images: string[];
  operating_hours: {
    weekdays?: { open: string; close: string } | null;
    saturday?: { open: string; close: string } | null;
    sunday?: { open: string; close: string } | null;
  };
  setup_buffer_mins: number;
  teardown_buffer_mins: number;
  min_hours: number;
  max_hours: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FacilityBlackout {
  id: string;
  facility_id: string;
  start_time: string;
  end_time: string;
  reason: string;
  created_by?: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  booking_reference: string;
  facility_id: string;
  user_id?: string | null;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  organization?: string | null;
  start_time: string;
  end_time: string;
  purpose: string;
  attendee_count: number;
  estimated_price: number;
  approved_price?: number | null;
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  admin_notes?: string | null;
  cancellation_reason?: string | null;
  approved_by?: string | null;
  approved_at?: string | null;
  created_at: string;
  updated_at: string;
  facility?: Facility;
}

export interface BookingService {
  id: string;
  booking_id: string;
  service_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface MembershipPlan {
  id: string;
  code: string;
  name: string;
  description: string;
  duration_months: number;
  fee: number;
  currency: string;
  benefits: string[];
  eligibility?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: string;
  membership_number: string;
  user_id: string;
  plan_id: string;
  status: MembershipStatus;
  start_date?: string | null;
  expiry_date?: string | null;
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  } | null;
  supporting_documents?: string[];
  approved_by?: string | null;
  approved_at?: string | null;
  last_reminder_sent_at?: string | null;
  created_at: string;
  updated_at: string;
  plan?: MembershipPlan;
  user?: Profile;
}

export interface SubscriptionPeriod {
  id: string;
  membership_id: string;
  period_start: string;
  period_end: string;
  amount: number;
  currency: string;
  payment_reference?: string | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  user_id?: string | null;
  booking_id?: string | null;
  membership_id?: string | null;
  amount: number;
  currency: string;
  due_date: string;
  status: 'unpaid' | 'paid' | 'cancelled' | 'overdue';
  items: Array<{ description: string; amount: number; quantity: number }>;
  created_at: string;
}

export interface Payment {
  id: string;
  payment_reference: string;
  invoice_id?: string | null;
  booking_id?: string | null;
  membership_id?: string | null;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  payment_date: string;
  receipt_reference?: string | null;
  proof_file_url?: string | null;
  status: PaymentVerificationStatus;
  verified_by?: string | null;
  verified_at?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Guest {
  id: string;
  full_name: string;
  phone?: string | null;
  email?: string | null;
  organization?: string | null;
  created_at: string;
}

export interface Visit {
  id: string;
  visit_reference: string;
  guest_id: string;
  member_id?: string | null;
  purpose: string;
  host_person?: string | null;
  destination?: string | null;
  booking_id?: string | null;
  group_size: number;
  check_in_time: string;
  check_out_time?: string | null;
  status: VisitStatus;
  notes?: string | null;
  logged_by?: string | null;
  created_at: string;
  guest?: Guest;
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  featured_image?: string | null;
  instructor: string;
  start_date?: string | null;
  end_date?: string | null;
  venue: string;
  registration_deadline?: string | null;
  capacity?: number | null;
  fee: number;
  currency: string;
  status: ProgramStatus;
  created_at: string;
  updated_at: string;
}

export interface Enquiry {
  id: string;
  reference: string;
  full_name: string;
  email: string;
  phone?: string | null;
  category: string;
  subject: string;
  message: string;
  preferred_contact_method: string;
  status: EnquiryStatus;
  assigned_to?: string | null;
  internal_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SystemSetting {
  key: string;
  value: Record<string, unknown>;
  description?: string;
  updated_at: string;
}

