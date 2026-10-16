-- ==============================================================================
-- 003_CONCURRENCY_AND_FUNCTIONS.SQL: TEN42 TRANSACTIONAL ENGINE
-- Concurrency-safe booking procedures, reference generators, and automated status triggers
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Reference Number Generators
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS TEXT AS $$
DECLARE
    prefix TEXT := 'T42-BK-';
    random_part TEXT;
    candidate TEXT;
    exists_already BOOLEAN;
BEGIN
    LOOP
        random_part := to_char(now(), 'YYMMDD') || '-' || upper(substr(md5(random()::text), 1, 4));
        candidate := prefix || random_part;
        SELECT EXISTS(SELECT 1 FROM public.bookings WHERE booking_reference = candidate) INTO exists_already;
        IF NOT exists_already THEN
            RETURN candidate;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql VOLATILE;

CREATE OR REPLACE FUNCTION public.generate_membership_number()
RETURNS TEXT AS $$
DECLARE
    prefix TEXT := 'T42-MEM-';
    counter INT;
    candidate TEXT;
BEGIN
    SELECT count(*) + 1 INTO counter FROM public.memberships;
    candidate := prefix || to_char(now(), 'YYYY') || '-' || lpad(counter::text, 4, '0');
    RETURN candidate;
END;
$$ LANGUAGE plpgsql VOLATILE;

CREATE OR REPLACE FUNCTION public.generate_visit_reference()
RETURNS TEXT AS $$
DECLARE
    prefix TEXT := 'T42-VST-';
    random_part TEXT;
BEGIN
    random_part := to_char(now(), 'YYMMDD') || '-' || upper(substr(md5(random()::text), 1, 4));
    RETURN prefix || random_part;
END;
$$ LANGUAGE plpgsql VOLATILE;

CREATE OR REPLACE FUNCTION public.generate_enquiry_reference()
RETURNS TEXT AS $$
DECLARE
    prefix TEXT := 'T42-ENQ-';
    random_part TEXT;
BEGIN
    random_part := to_char(now(), 'YYYY') || '-' || upper(substr(md5(random()::text), 1, 5));
    RETURN prefix || random_part;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- ------------------------------------------------------------------------------
-- 2. Concurrency-Safe Facility Conflict Checker
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_facility_conflict(
    p_facility_id UUID,
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ,
    p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS TABLE (
    has_conflict BOOLEAN,
    conflict_reason TEXT
) AS $$
DECLARE
    v_buffer_setup INT;
    v_buffer_teardown INT;
    v_buffered_start TIMESTAMPTZ;
    v_buffered_end TIMESTAMPTZ;
    v_blackout_exists BOOLEAN;
    v_booking_exists BOOLEAN;
BEGIN
    -- Retrieve facility setup/teardown buffers
    SELECT setup_buffer_mins, teardown_buffer_mins 
    INTO v_buffer_setup, v_buffer_teardown
    FROM public.facilities
    WHERE id = p_facility_id;

    IF v_buffer_setup IS NULL THEN
        v_buffer_setup := 30;
    END IF;
    IF v_buffer_teardown IS NULL THEN
        v_buffer_teardown := 30;
    END IF;

    -- Apply buffer margins
    v_buffered_start := p_start_time - (v_buffer_setup || ' minutes')::INTERVAL;
    v_buffered_end := p_end_time + (v_buffer_teardown || ' minutes')::INTERVAL;

    -- 1. Check Blackouts / Maintenance Closures
    SELECT EXISTS (
        SELECT 1 FROM public.facility_blackouts
        WHERE facility_id = p_facility_id
          AND tsrange(start_time, end_time) && tsrange(p_start_time, p_end_time)
    ) INTO v_blackout_exists;

    IF v_blackout_exists THEN
        RETURN QUERY SELECT TRUE, 'The facility is closed for maintenance or administrative blackout during this period.';
        RETURN;
    END IF;

    -- 2. Check Overlapping Active or Pending Reservations
    SELECT EXISTS (
        SELECT 1 FROM public.bookings
        WHERE facility_id = p_facility_id
          AND booking_status IN ('confirmed', 'pending')
          AND (p_exclude_booking_id IS NULL OR id <> p_exclude_booking_id)
          AND tsrange(
                start_time - (v_buffer_setup || ' minutes')::INTERVAL, 
                end_time + (v_buffer_teardown || ' minutes')::INTERVAL
              ) && tsrange(p_start_time, p_end_time)
    ) INTO v_booking_exists;

    IF v_booking_exists THEN
        RETURN QUERY SELECT TRUE, 'This time slot conflicts with an existing reservation or required preparation buffer.';
        RETURN;
    END IF;

    -- No conflict found
    RETURN QUERY SELECT FALSE, 'Time slot is available.';
END;
$$ LANGUAGE plpgsql STABLE;

-- ------------------------------------------------------------------------------
-- 3. Atomic Transactional Booking Creation
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_booking_atomic(
    p_facility_id UUID,
    p_user_id UUID,
    p_guest_name TEXT,
    p_guest_email TEXT,
    p_guest_phone TEXT,
    p_organization TEXT,
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ,
    p_purpose TEXT,
    p_attendee_count INT,
    p_estimated_price NUMERIC
)
RETURNS TABLE (
    success BOOLEAN,
    booking_id UUID,
    reference TEXT,
    message TEXT
) AS $$
DECLARE
    v_conflict BOOLEAN;
    v_conflict_reason TEXT;
    v_ref TEXT;
    v_booking_id UUID;
BEGIN
    -- Acquire exclusive row lock on the facility to prevent concurrent race conditions
    PERFORM id FROM public.facilities WHERE id = p_facility_id FOR UPDATE;

    -- Run conflict check with locked facility row
    SELECT has_conflict, conflict_reason
    INTO v_conflict, v_conflict_reason
    FROM public.check_facility_conflict(p_facility_id, p_start_time, p_end_time);

    IF v_conflict THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, NULL::TEXT, v_conflict_reason;
        RETURN;
    END IF;

    -- Generate reference and insert
    v_ref := public.generate_booking_reference();
    
    INSERT INTO public.bookings (
        booking_reference,
        facility_id,
        user_id,
        guest_name,
        guest_email,
        guest_phone,
        organization,
        start_time,
        end_time,
        purpose,
        attendee_count,
        estimated_price,
        booking_status,
        payment_status
    ) VALUES (
        v_ref,
        p_facility_id,
        p_user_id,
        p_guest_name,
        p_guest_email,
        p_guest_phone,
        p_organization,
        p_start_time,
        p_end_time,
        p_purpose,
        p_attendee_count,
        p_estimated_price,
        'pending',
        'unpaid'
    ) RETURNING id INTO v_booking_id;

    -- Record initial history status
    INSERT INTO public.booking_status_history (
        booking_id,
        old_status,
        new_status,
        notes
    ) VALUES (
        v_booking_id,
        NULL,
        'pending',
        'Reservation request submitted'
    );

    RETURN QUERY SELECT TRUE, v_booking_id, v_ref, 'Reservation request successfully created.'::TEXT;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- ------------------------------------------------------------------------------
-- 4. Payment Verification & Membership Activation Engine
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.verify_payment_and_activate(
    p_payment_id UUID,
    p_verified_by UUID,
    p_notes TEXT DEFAULT NULL
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    v_payment RECORD;
    v_plan RECORD;
    v_start_date DATE := CURRENT_DATE;
    v_expiry_date DATE;
BEGIN
    -- Fetch payment record
    SELECT * INTO v_payment FROM public.payments WHERE id = p_payment_id FOR UPDATE;

    IF v_payment.id IS NULL THEN
        RETURN QUERY SELECT FALSE, 'Payment record not found.';
        RETURN;
    END IF;

    IF v_payment.status = 'verified' THEN
        RETURN QUERY SELECT FALSE, 'Payment has already been verified.';
        RETURN;
    END IF;

    -- Mark payment verified
    UPDATE public.payments
    SET status = 'verified',
        verified_by = p_verified_by,
        verified_at = timezone('utc'::text, now()),
        notes = coalesce(p_notes, notes),
        updated_at = timezone('utc'::text, now())
    WHERE id = p_payment_id;

    -- 1. If linked to membership, activate subscription
    IF v_payment.membership_id IS NOT NULL THEN
        SELECT p.* INTO v_plan
        FROM public.memberships m
        JOIN public.membership_plans p ON p.id = m.plan_id
        WHERE m.id = v_payment.membership_id;

        v_expiry_date := v_start_date + (v_plan.duration_months || ' months')::INTERVAL;

        UPDATE public.memberships
        SET status = 'active',
            start_date = v_start_date,
            expiry_date = v_expiry_date,
            approved_by = p_verified_by,
            approved_at = timezone('utc'::text, now()),
            updated_at = timezone('utc'::text, now())
        WHERE id = v_payment.membership_id;

        INSERT INTO public.subscription_periods (
            membership_id,
            period_start,
            period_end,
            amount,
            currency,
            payment_reference
        ) VALUES (
            v_payment.membership_id,
            v_start_date,
            v_expiry_date,
            v_payment.amount,
            v_payment.currency,
            v_payment.payment_reference
        );
    END IF;

    -- 2. If linked to booking, update booking payment status
    IF v_payment.booking_id IS NOT NULL THEN
        UPDATE public.bookings
        SET payment_status = 'paid',
            updated_at = timezone('utc'::text, now())
        WHERE id = v_payment.booking_id;
    END IF;

    RETURN QUERY SELECT TRUE, 'Payment verified and records updated successfully.';
END;
$$ LANGUAGE plpgsql VOLATILE;

-- ------------------------------------------------------------------------------
-- 5. Automatic Profile Creation Trigger on Supabase Auth Sign Up
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        avatar_url,
        created_at,
        updated_at
    ) VALUES (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        'member',
        new.raw_user_meta_data->>'avatar_url',
        now(),
        now()
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

