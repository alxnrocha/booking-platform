-- ==============================================================================
-- StayHub Booking Platform — PostgreSQL 17 Seed Data
-- ==============================================================================

INSERT INTO users (id, name, email, avatar_url, role, is_superhost, years_hosting) VALUES
('usr_host_marco', 'Marco Rossi', 'marco.rossi@stayhub.test', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', 'HOST', true, 5),
('usr_host_elena', 'Elena Rostova', 'elena.rostova@stayhub.test', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80', 'HOST', true, 4),
('usr_guest_alex', 'Alex Vance', 'alex.vance@stayhub.test', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80', 'GUEST', false, 0),
('usr_admin_master', 'Admin StayHub', 'admin@stayhub.test', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80', 'ADMIN', false, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO properties (
    id, host_id, title, subtitle, description, location, country, category,
    price_per_night, cleaning_fee, service_fee_rate, rating, review_count,
    is_superhost, max_guests, bedrooms, beds, baths, cancellation_days, instant_booking
) VALUES
(
    'prop_amalfi_villa',
    'usr_host_marco',
    'Cliffside Glass Villa with Infinity Pool',
    'Panoramic Sea View',
    'Experience luxury at its finest in this architectural masterpiece perched on the Amalfi Coast cliffs. Floor-to-ceiling glass, infinity pool, and breathtaking sea views.',
    'Amalfi Coast',
    'Italy',
    'Beachfront',
    320.00,
    75.00,
    0.1145,
    4.99,
    186,
    true,
    6,
    3,
    4,
    3,
    30,
    true
),
(
    'prop_costa_brava',
    'usr_host_marco',
    'Villa Costa Brava',
    'Panoramic Sea View',
    'Spectacular modern villa overlooking the Mediterranean azure waters in Tossa de Mar.',
    'Tossa de Mar',
    'Spain',
    'Beachfront',
    280.00,
    65.00,
    0.1145,
    4.98,
    124,
    true,
    8,
    4,
    5,
    3,
    14,
    true
),
(
    'prop_cliff_house',
    'usr_host_elena',
    'Modern Cliff House',
    'Private Infinity Pool',
    'Stunning minimalist architecture with heated infinity pool perched over the Algarve ocean cliffs.',
    'Algarve',
    'Portugal',
    'Infinity Pools',
    350.00,
    80.00,
    0.1145,
    4.96,
    89,
    true,
    4,
    2,
    2,
    2,
    30,
    true
),
(
    'prop_malibu_ocean',
    'usr_host_elena',
    'Malibu Oceanfront',
    'Beach Access',
    'Direct beach access private residence with sunset terrace and designer interiors.',
    'Malibu, California',
    'USA',
    'Luxury Villas',
    620.00,
    120.00,
    0.1145,
    4.97,
    156,
    true,
    6,
    3,
    4,
    3,
    30,
    true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO reservations (
    id, property_id, guest_id, check_in, check_out, nights, guests_count,
    base_price, cleaning_fee, service_fee, total_price, status, confirmation_code
) VALUES
(
    'res_demo_001',
    'prop_amalfi_villa',
    'usr_guest_alex',
    '2026-06-10',
    '2026-06-13',
    3,
    2,
    960.00,
    75.00,
    110.00,
    1145.00,
    'CONFIRMED',
    'STAY-AMALFI-2026'
)
ON CONFLICT (id) DO NOTHING;
