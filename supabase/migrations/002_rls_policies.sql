-- ==============================================================================
-- 002_RLS_POLICIES.SQL: TEN42 ROW LEVEL SECURITY
-- Secure role-based data access policies across all application tables
-- ==============================================================================

-- Enable RLS on all sensitive tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_blackouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user is a staff member
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role IN ('super_admin', 'admin', 'front_desk', 'facility_manager')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role IN ('super_admin', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if the current user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 1. Profiles Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Staff can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_staff());

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Super admins can manage all profiles"
    ON public.profiles FOR ALL
    USING (public.is_super_admin());

-- ------------------------------------------------------------------------------
-- 2. Facilities & Categories Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view active facilities"
    ON public.facilities FOR SELECT
    USING (is_active = TRUE OR public.is_staff());

CREATE POLICY "Staff can manage facilities"
    ON public.facilities FOR ALL
    USING (public.is_staff());

CREATE POLICY "Public can view categories"
    ON public.facility_categories FOR SELECT
    USING (TRUE);

CREATE POLICY "Staff can manage categories"
    ON public.facility_categories FOR ALL
    USING (public.is_staff());

CREATE POLICY "Public can view blackouts"
    ON public.facility_blackouts FOR SELECT
    USING (TRUE);

CREATE POLICY "Staff can manage blackouts"
    ON public.facility_blackouts FOR ALL
    USING (public.is_staff());

-- ------------------------------------------------------------------------------
-- 3. Bookings Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = user_id OR public.is_staff());

CREATE POLICY "Anyone can create a booking request"
    ON public.bookings FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Users can cancel their own pending booking"
    ON public.bookings FOR UPDATE
    USING (auth.uid() = user_id AND booking_status = 'pending')
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can manage all bookings"
    ON public.bookings FOR ALL
    USING (public.is_staff());

CREATE POLICY "View booking services"
    ON public.booking_services FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = booking_id
              AND (b.user_id = auth.uid() OR public.is_staff())
        )
    );

CREATE POLICY "Manage booking services"
    ON public.booking_services FOR ALL
    USING (public.is_staff());

-- ------------------------------------------------------------------------------
-- 4. Memberships & Plans Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view active membership plans"
    ON public.membership_plans FOR SELECT
    USING (is_active = TRUE OR public.is_staff());

CREATE POLICY "Admins can manage membership plans"
    ON public.membership_plans FOR ALL
    USING (public.is_admin());

CREATE POLICY "Users can view own memberships"
    ON public.memberships FOR SELECT
    USING (auth.uid() = user_id OR public.is_staff());

CREATE POLICY "Users can apply for membership"
    ON public.memberships FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can manage all memberships"
    ON public.memberships FOR ALL
    USING (public.is_staff());

CREATE POLICY "Users can view own subscription periods"
    ON public.subscription_periods FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships m
            WHERE m.id = membership_id
              AND (m.user_id = auth.uid() OR public.is_staff())
        )
    );

-- ------------------------------------------------------------------------------
-- 5. Invoices and Payments Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view own invoices"
    ON public.invoices FOR SELECT
    USING (auth.uid() = user_id OR public.is_staff());

CREATE POLICY "Staff can manage all invoices"
    ON public.invoices FOR ALL
    USING (public.is_staff());

CREATE POLICY "Users can view own payments"
    ON public.payments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.invoices inv
            WHERE inv.id = invoice_id AND inv.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.memberships m
            WHERE m.id = membership_id AND m.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = booking_id AND b.user_id = auth.uid()
        )
        OR public.is_staff()
    );

CREATE POLICY "Users can submit payment proof"
    ON public.payments FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Staff can verify and manage payments"
    ON public.payments FOR ALL
    USING (public.is_staff());

-- ------------------------------------------------------------------------------
-- 6. Front Desk Visitor Management (Guests & Visits) Policies
-- ------------------------------------------------------------------------------
-- Strict privacy: only front desk & admin staff can view guest and visit logs
CREATE POLICY "Staff can view and manage guests"
    ON public.guests FOR ALL
    USING (public.is_staff());

CREATE POLICY "Staff can view and manage visits"
    ON public.visits FOR ALL
    USING (public.is_staff());

-- ------------------------------------------------------------------------------
-- 7. Programs & Enquiries Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published programs"
    ON public.programs FOR SELECT
    USING (status = 'published' OR public.is_staff());

CREATE POLICY "Staff can manage programs"
    ON public.programs FOR ALL
    USING (public.is_staff());

CREATE POLICY "Public can create an enquiry"
    ON public.enquiries FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Staff can view and manage enquiries"
    ON public.enquiries FOR ALL
    USING (public.is_staff());

CREATE POLICY "Staff can manage enquiry notes"
    ON public.enquiry_notes FOR ALL
    USING (public.is_staff());

-- ------------------------------------------------------------------------------
-- 8. Audit Logs and Settings Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins can view audit logs"
    ON public.audit_logs FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Public can read public system settings"
    ON public.system_settings FOR SELECT
    USING (TRUE);

CREATE POLICY "Super admins can manage system settings"
    ON public.system_settings FOR ALL
    USING (public.is_super_admin());

