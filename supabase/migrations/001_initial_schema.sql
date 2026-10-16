-- ==============================================================================
-- 001_INITIAL_SCHEMA.SQL: TEN42 TRAINING AND RESOURCE CENTER
-- Complete normalized PostgreSQL schema with custom types, indexes, and constraints
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Custom Enumerated Types
CREATE TYPE user_role AS ENUM (
    'super_admin',
    'admin',
    'front_desk',
    'facility_manager',
    'member',
    'guest'
);

CREATE TYPE booking_status AS ENUM (
    'pending',
    'confirmed',
    'rejected',
    'cancelled',
    'completed',
    'no_show'
);

CREATE TYPE payment_status AS ENUM (
    'unpaid',
    'partially_paid',
    'paid',
    'refunded'
);

CREATE TYPE payment_method AS ENUM (
    'bank_transfer',
    'cash',
    'pos',
    'online_card'
);

CREATE TYPE payment_verification_status AS ENUM (
    'unverified',
    'verified',
    'rejected'
);

CREATE TYPE membership_status AS ENUM (
    'application_pending',
    'active',
    'expiring_soon',
    'expired',
    'suspended',
    'cancelled'
);

CREATE TYPE visit_status AS ENUM (
    'checked_in',
    'checked_out',
    'overdue'
);

CREATE TYPE enquiry_status AS ENUM (
    'new',
    'in_progress',
    'resolved',
    'closed'
);

CREATE TYPE program_status AS ENUM (
    'draft',
    'published',
    'archived'
);

-- ------------------------------------------------------------------------------
-- 1. Profiles (linked to auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    organization TEXT,
    role user_role NOT NULL DEFAULT 'member',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 2. Facility Categories & Facilities
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.facility_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.facility_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    hourly_rate NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (hourly_rate >= 0),
    half_day_rate NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (half_day_rate >= 0),
    daily_rate NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (daily_rate >= 0),
    amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
    images TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    operating_hours JSONB NOT NULL DEFAULT '{"weekdays": {"open": "08:00", "close": "18:00"}, "saturday": {"open": "09:00", "close": "16:00"}, "sunday": null}'::jsonb,
    setup_buffer_mins INT NOT NULL DEFAULT 30 CHECK (setup_buffer_mins >= 0),
    teardown_buffer_mins INT NOT NULL DEFAULT 30 CHECK (teardown_buffer_mins >= 0),
    min_hours INT NOT NULL DEFAULT 1 CHECK (min_hours >= 1),
    max_hours INT NOT NULL DEFAULT 12 CHECK (max_hours >= min_hours),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.facility_blackouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    reason TEXT NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT valid_blackout_range CHECK (end_time > start_time)
);

-- ------------------------------------------------------------------------------
-- 3. Bookings and Reservations
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference TEXT NOT NULL UNIQUE,
    facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE RESTRICT,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    organization TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    purpose TEXT NOT NULL,
    attendee_count INT NOT NULL CHECK (attendee_count > 0),
    estimated_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (estimated_price >= 0),
    approved_price NUMERIC(12, 2) CHECK (approved_price >= 0),
    booking_status booking_status NOT NULL DEFAULT 'pending',
    payment_status payment_status NOT NULL DEFAULT 'unpaid',
    admin_notes TEXT,
    cancellation_reason TEXT,
    approved_by UUID REFERENCES public.profiles(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT valid_booking_time_range CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS public.booking_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (unit_price >= 0),
    total_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (total_price >= 0)
);

CREATE TABLE IF NOT EXISTS public.booking_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    old_status booking_status,
    new_status booking_status NOT NULL,
    changed_by UUID REFERENCES public.profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 4. Membership Plans and Subscriptions
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.membership_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    duration_months INT NOT NULL CHECK (duration_months > 0),
    fee NUMERIC(12, 2) NOT NULL CHECK (fee >= 0),
    currency TEXT NOT NULL DEFAULT 'NGN',
    benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
    eligibility TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    membership_number TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.membership_plans(id) ON DELETE RESTRICT,
    status membership_status NOT NULL DEFAULT 'application_pending',
    start_date DATE,
    expiry_date DATE,
    emergency_contact JSONB,
    supporting_documents JSONB DEFAULT '[]'::jsonb,
    approved_by UUID REFERENCES public.profiles(id),
    approved_at TIMESTAMPTZ,
    last_reminder_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.subscription_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    membership_id UUID NOT NULL REFERENCES public.memberships(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    currency TEXT NOT NULL DEFAULT 'NGN',
    payment_reference TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT valid_sub_period CHECK (period_end >= period_start)
);

-- ------------------------------------------------------------------------------
-- 5. Invoices and Payments
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    membership_id UUID REFERENCES public.memberships(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    currency TEXT NOT NULL DEFAULT 'NGN',
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'cancelled', 'overdue')),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_reference TEXT NOT NULL UNIQUE,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    membership_id UUID REFERENCES public.memberships(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'NGN',
    payment_method payment_method NOT NULL DEFAULT 'bank_transfer',
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    receipt_reference TEXT,
    proof_file_url TEXT,
    status payment_verification_status NOT NULL DEFAULT 'unverified',
    verified_by UUID REFERENCES public.profiles(id),
    verified_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 6. Front Desk Visitor Management (Guests & Visits)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    organization TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visit_reference TEXT NOT NULL UNIQUE,
    guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
    member_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    purpose TEXT NOT NULL,
    host_person TEXT,
    destination TEXT,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    group_size INT NOT NULL DEFAULT 1 CHECK (group_size >= 1),
    check_in_time TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    check_out_time TIMESTAMPTZ,
    status visit_status NOT NULL DEFAULT 'checked_in',
    notes TEXT,
    logged_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 7. Programs, Training, and Registrations
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    featured_image TEXT,
    instructor TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    venue TEXT NOT NULL DEFAULT 'Ten42 Training Center',
    registration_deadline DATE,
    capacity INT CHECK (capacity > 0),
    fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (fee >= 0),
    currency TEXT NOT NULL DEFAULT 'NGN',
    status program_status NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.program_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    registrant_name TEXT NOT NULL,
    registrant_email TEXT NOT NULL,
    registrant_phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
    payment_status payment_status NOT NULL DEFAULT 'unpaid',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 8. Enquiries and Communications
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    category TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    preferred_contact_method TEXT NOT NULL DEFAULT 'email',
    status enquiry_status NOT NULL DEFAULT 'new',
    assigned_to UUID REFERENCES public.profiles(id),
    internal_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.enquiry_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 9. Notifications, Audit Logs & System Settings
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient TEXT NOT NULL,
    event_type TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    provider_reference TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- Performance Indexes
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_facilities_slug ON public.facilities(slug);
CREATE INDEX IF NOT EXISTS idx_facilities_active ON public.facilities(is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_facility_time ON public.bookings(facility_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON public.memberships(status);
CREATE INDEX IF NOT EXISTS idx_memberships_expiry ON public.memberships(expiry_date);
CREATE INDEX IF NOT EXISTS idx_visits_status ON public.visits(status);
CREATE INDEX IF NOT EXISTS idx_visits_guest ON public.visits(guest_id);
CREATE INDEX IF NOT EXISTS idx_visits_checkin ON public.visits(check_in_time);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);

