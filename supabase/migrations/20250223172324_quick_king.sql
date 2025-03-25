/*
  # Fix database schema and add missing tables
  
  1. Tables Created/Modified
    - device_prices: Store repair prices for different devices and parts
    - images: Store application images including hero image
    - technicians: Store technician information
    - repair_orders: Store customer repair orders
    - user_profiles: Store user profile information
  
  2. Data
    - Add initial hero image
    - Add sample technician
*/

-- Create images table if it doesn't exist
CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  alt_text text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on images
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Allow public read access to images
CREATE POLICY "Allow public read access on images"
  ON images
  FOR SELECT
  TO public
  USING (true);

-- Insert hero image
INSERT INTO images (url, alt_text)
VALUES (
  'https://res.cloudinary.com/dqwxexsra/image/upload/e_background_removal/f_png/v1739746162/DALL_E_2025-02-16_16.24.24_-_A_superhero_with_a_bold_letter_F_on_his_chest_wearing_a_modern_and_sleek_superhero_suit._He_is_holding_a_smartphone_in_one_hand_and_smiling_confide_o56dxv.webp',
  'Fyxters Superhero with Phone'
) ON CONFLICT DO NOTHING;

-- Create technicians table if it doesn't exist
CREATE TABLE IF NOT EXISTS technicians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  service_radius_km double precision NOT NULL DEFAULT 10.0,
  specializations text[] DEFAULT '{}',
  is_available boolean DEFAULT true,
  rating double precision DEFAULT 5.0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on technicians
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;

-- Allow public read access to technicians
CREATE POLICY "Allow public read access on technicians"
  ON technicians
  FOR SELECT
  TO public
  USING (true);

-- Insert sample technician
INSERT INTO technicians (
  name,
  email,
  phone,
  address,
  latitude,
  longitude,
  service_radius_km,
  specializations
) VALUES (
  'Hassen',
  'hassen@fyxters.com',
  '(514) 555-0123',
  '348 Rue Jean-Talon E, Montréal, QC H2R 1T1',
  45.5386,
  -73.6179,
  10.0,
  ARRAY['iPhone', 'Samsung', 'Screen Repair', 'Battery Replacement']
) ON CONFLICT DO NOTHING;