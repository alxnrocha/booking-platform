-- ==============================================================================
-- StayHub Booking Platform — PostgreSQL 17 DDL Schema
-- Description: Multi-tenant vacation rental & booking system relational schema
-- ==============================================================================

CREATE TYPE user_role AS ENUM ('GUEST', 'HOST', 'ADMIN');
CREATE TYPE reservation_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- 1. Users table (RBAC multi-tenant)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'GUEST',
    is_superhost BOOLEAN NOT NULL DEFAULT FALSE,
    years_hosting INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Properties table
CREATE TABLE IF NOT EXISTS properties (
    id VARCHAR(64) PRIMARY KEY,
    host_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price_per_night NUMERIC(10, 2) NOT NULL,
    cleaning_fee NUMERIC(10, 2) NOT NULL DEFAULT 75.00,
    service_fee_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.1145,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    review_count INT NOT NULL DEFAULT 0,
    is_superhost BOOLEAN NOT NULL DEFAULT FALSE,
    max_guests INT NOT NULL DEFAULT 4,
    bedrooms INT NOT NULL DEFAULT 2,
    beds INT NOT NULL DEFAULT 3,
    baths INT NOT NULL DEFAULT 2,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
    sleeping_details JSONB NOT NULL DEFAULT '[]'::jsonb,
    cancellation_days INT NOT NULL DEFAULT 30,
    instant_booking BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for search & discovery performance
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_host_id ON properties(host_id);

-- 3. Reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id VARCHAR(64) PRIMARY KEY,
    property_id VARCHAR(64) NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    guest_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    nights INT NOT NULL CHECK (nights >= 1),
    guests_count INT NOT NULL CHECK (guests_count >= 1),
    base_price NUMERIC(10, 2) NOT NULL,
    cleaning_fee NUMERIC(10, 2) NOT NULL,
    service_fee NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    status reservation_status NOT NULL DEFAULT 'CONFIRMED',
    confirmation_code VARCHAR(32) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_dates_validity CHECK (check_out > check_in)
);

-- Indexes for fast booking lookup and double booking verification
CREATE INDEX IF NOT EXISTS idx_reservations_property_dates ON reservations(property_id, check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_reservations_guest ON reservations(guest_id);
CREATE INDEX IF NOT EXISTS idx_reservations_code ON reservations(confirmation_code);

-- 4. Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(64) PRIMARY KEY,
    property_id VARCHAR(64) NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    author_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_property ON reviews(property_id);
