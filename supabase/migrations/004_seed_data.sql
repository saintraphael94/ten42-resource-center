-- ==============================================================================
-- 004_SEED_DATA.SQL: TEN42 PRODUCTION SEED DATA
-- Authentic initial facilities, membership plans, categories, and settings
-- ==============================================================================

-- 1. Facility Categories
INSERT INTO public.facility_categories (id, name, slug, description, sort_order)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Conference & Auditorium', 'auditorium', 'Large capacity halls for congresses, general assemblies, summits, and symposiums.', 1),
    ('c2222222-2222-2222-2222-222222222222', 'Executive Boardrooms', 'boardrooms', 'Premium executive meeting spaces for board discussions and strategic negotiations.', 2),
    ('c3333333-3333-3333-3333-333333333333', 'Training & Computer Labs', 'training-labs', 'Equipped learning spaces for hands-on technical workshops and professional certifications.', 3),
    ('c4444444-4444-4444-4444-444444444444', 'Meeting Suites', 'meeting-suites', 'Focus-oriented rooms for client pitches, interviews, and team strategy breakouts.', 4),
    ('c5555555-5555-5555-5555-555555555555', 'Coworking & Shared Hub', 'coworking', 'Dynamic flexible desks and quiet study areas for members and independent professionals.', 5)
ON CONFLICT (slug) DO NOTHING;

-- 2. Facilities
INSERT INTO public.facilities (
    id, category_id, name, slug, description, capacity, hourly_rate, half_day_rate, daily_rate, amenities, images, operating_hours, setup_buffer_mins, teardown_buffer_mins, min_hours, max_hours, is_active
) VALUES
(
    'f1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111111',
    'Main Auditorium & Grand Conference Hall',
    'main-auditorium',
    'Flagship multi-level conference hall featuring a mezzanine gallery, stage podium with integrated digital screen, surround sound acoustics, dual ceiling projector arrays, and ergonomic auditorium seating. Ideal for summits, conventions, graduations, and institutional assemblies.',
    280,
    35000.00,
    150000.00,
    250000.00,
    '["Mezzanine Gallery", "Integrated Podium with Digital Screen", "Surround Sound & Wireless Microphones", "High-Definition Projection", "Central Air Conditioning", "Dedicated Sound Engineer", "Backup Power Generator", "Wheelchair Accessible"]'::jsonb,
    ARRAY['/images/Header2.jpg', '/images/FrontView.jpg'],
    '{"weekdays": {"open": "08:00", "close": "18:00"}, "saturday": {"open": "09:00", "close": "17:00"}, "sunday": null}'::jsonb,
    45, 45, 2, 12, TRUE
),
(
    'f2222222-2222-2222-2222-222222222222',
    'c2222222-2222-2222-2222-222222222222',
    'Executive Boardroom Suite',
    'executive-boardroom',
    'Prestigious boardroom furnished with ergonomic executive leather chairs, 75-inch 4K smart interactive display, hybrid video conferencing system, and a discreet beverage preparation station.',
    18,
    20000.00,
    65000.00,
    110000.00,
    '["75-inch 4K Smart Display", "Cisco Hybrid Video Conference Bar", "Omnidirectional Microphones", "Executive Leather Seating", "High-Speed Dedicated Wi-Fi", "Coffee & Tea Service Point"]'::jsonb,
    ARRAY['/images/FrontView.jpg', '/images/Header2.jpg'],
    '{"weekdays": {"open": "08:00", "close": "19:00"}, "saturday": {"open": "09:00", "close": "16:00"}, "sunday": null}'::jsonb,
    30, 30, 1, 10, TRUE
),
(
    'f3333333-3333-3333-3333-333333333333',
    'c3333333-3333-3333-3333-333333333333',
    'Interactive Training Lab',
    'training-lab',
    'Modern modular computer and training laboratory designed for collaborative learning, practical tech workshops, masterclasses, and corporate simulations with dual high-lumen projectors.',
    36,
    15000.00,
    50000.00,
    85000.00,
    '["Modular Mobile Desks", "Interactive Whiteboards", "Dual Projectors", "Dedicated Fiber Internet (100Mbps)", "Multiple Floor Power Outlets", "Air Conditioned"]'::jsonb,
    ARRAY['/images/Header2.jpg'],
    '{"weekdays": {"open": "08:00", "close": "18:00"}, "saturday": {"open": "09:00", "close": "16:00"}, "sunday": null}'::jsonb,
    30, 30, 2, 8, TRUE
),
(
    'f4444444-4444-4444-4444-444444444444',
    'c4444444-4444-4444-4444-444444444444',
    'Synergy Meeting Room',
    'synergy-meeting-room',
    'Compact, sound-isolated strategy room tailored for confidential interviews, client presentations, and focused team brainstorming sessions.',
    8,
    10000.00,
    35000.00,
    60000.00,
    '["55-inch Presentation Screen", "Magnetic Glass Whiteboard", "High-Speed WiFi", "Video Call Bar"]'::jsonb,
    ARRAY['/images/FrontView.jpg'],
    '{"weekdays": {"open": "08:00", "close": "18:00"}, "saturday": {"open": "09:00", "close": "16:00"}, "sunday": null}'::jsonb,
    15, 15, 1, 8, TRUE
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Membership Plans
INSERT INTO public.membership_plans (
    id, code, name, description, duration_months, fee, currency, benefits, eligibility, is_active
) VALUES
(
    'p1111111-1111-1111-1111-111111111111',
    'MEM-INDIVIDUAL',
    'Individual Professional',
    'Designed for consultants, professionals, and lifelong learners seeking an inspiring environment, facility discounts, and high-level networking.',
    1,
    25000.00,
    'NGN',
    '["10 Hours complimentary meeting room credits per month", "20% discount on Auditorium and Lab bookings", "High-speed secure fiber Wi-Fi", "Access to Ten42 digital resource library", "Priority invitations to institutional workshops"]'::jsonb,
    'Open to working professionals, entrepreneurs, and independent researchers.',
    TRUE
),
(
    'p2222222-2222-2222-2222-222222222222',
    'MEM-STUDENT',
    'Student & Early Career',
    'Subsidized membership for verified tertiary students and emerging young changemakers committed to personal development and skill acquisition.',
    1,
    15000.00,
    'NGN',
    '["Full access to Ten42 study lounge & library hub", "Free entry to selected monthly masterclasses", "High-speed Wi-Fi access", "Mentorship matching opportunities", "15% discount on certified training courses"]'::jsonb,
    'Valid student ID card or national youth service letter required.',
    TRUE
),
(
    'p3333333-3333-3333-3333-333333333333',
    'MEM-CORPORATE',
    'Corporate Enterprise',
    'Comprehensive institutional package for businesses, NGOs, and teams requiring reliable executive meeting spaces and staff capacity development.',
    1,
    120000.00,
    'NGN',
    '["5 Registered staff membership passes", "25 Hours Boardroom and Meeting Suite credits", "30% discount on Grand Auditorium reservations", "Branded visitor welcome on front desk screen", "Dedicated account officer"]'::jsonb,
    'Registered corporate entities, development agencies, and non-profits.',
    TRUE
),
(
    'p4444444-4444-4444-4444-444444444444',
    'MEM-COMMUNITY',
    'Community Associate',
    'Entry-level membership for community advocates, volunteers, and remote workers desiring connection with the Ten42 ecosystem.',
    1,
    10000.00,
    'NGN',
    '["Access to open community networking forums", "Discounted day pass to coworking spaces", "Monthly institutional newsletter and publications", "Invitations to public impact talks"]'::jsonb,
    'Open to all community members.',
    TRUE
)
ON CONFLICT (code) DO NOTHING;

-- 4. Programs & Training Opportunities
INSERT INTO public.programs (
    id, slug, title, description, category, featured_image, instructor, start_date, end_date, venue, registration_deadline, capacity, fee, currency, status
) VALUES
(
    'pg111111-1111-1111-1111-111111111111',
    'executive-leadership-governance-2026',
    'Executive Leadership & Institutional Governance',
    'An intensive 3-day executive masterclass focusing on ethical leadership, organizational culture, fiduciary stewardship, and adaptive strategic planning for public and private sector leaders.',
    'Leadership',
    '/images/Header2.jpg',
    'Dr. K. Adeleke & Visiting Faculty',
    '2026-11-10',
    '2026-11-12',
    'Grand Auditorium, Ten42 Center',
    '2026-11-05',
    50,
    75000.00,
    'NGN',
    'published'
),
(
    'pg222222-2222-2222-2222-222222222222',
    'digital-skills-data-analytics',
    'Applied Data Analytics for Decision Makers',
    'Practical hands-on training providing professionals with the tools to translate raw business metrics into actionable insights using modern analytics, dashboards, and automated reporting.',
    'Technology',
    '/images/FrontView.jpg',
    'Engr. T. Olatunji',
    '2026-11-20',
    '2026-11-22',
    'Interactive Training Lab',
    '2026-11-15',
    30,
    45000.00,
    'NGN',
    'published'
),
(
    'pg333333-3333-3333-3333-333333333333',
    'grant-writing-resource-mobilization',
    'Grant Writing & Resource Mobilization for Non-Profits',
    'Master the methodology of developing winning funding proposals, navigating international donor landscapes, and building sustainable institutional partnerships.',
    'Capacity Building',
    '/images/Header2.jpg',
    'Mrs. F. Alabi (International Development Specialist)',
    '2026-12-03',
    '2026-12-04',
    'Executive Boardroom Suite',
    '2026-11-28',
    25,
    35000.00,
    'NGN',
    'published'
)
ON CONFLICT (slug) DO NOTHING;

-- 5. System Settings
INSERT INTO public.system_settings (key, value, description)
VALUES
    ('general_info', '{
        "center_name": "Ten42 Training and Resource Center",
        "tagline": "Training for Right Living...",
        "phone": "+234 800 000 1042",
        "email": "info@ten42.org",
        "address": "Plot 1042 Commercial Layout, Victoria Island, Lagos, Nigeria",
        "currency": "NGN",
        "timezone": "Africa/Lagos",
        "operating_hours": "Monday - Friday: 8:00 AM - 6:00 PM | Saturday: 9:00 AM - 5:00 PM"
    }'::jsonb, 'General institutional information and contact configuration'),
    ('bank_details', '{
        "bank_name": "Zenith Bank Plc",
        "account_name": "Ten42 Training and Resource Center Ltd",
        "account_number": "1042000000",
        "sort_code": "057150000",
        "swift_code": "ZEIBNGLA"
    }'::jsonb, 'Official bank transfer instructions for manual payment verification')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

