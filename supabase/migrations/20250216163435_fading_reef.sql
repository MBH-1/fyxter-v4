/*
  # Create technicians table and location-based functions

  1. New Tables
    - `technicians`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `address` (text)
      - `latitude` (double precision)
      - `longitude` (double precision)
      - `service_radius_km` (double precision)
      - `specializations` (text[])
      - `is_available` (boolean)
      - `rating` (double precision)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `technicians` table
    - Add policy for public read access
    - Add policy for authenticated technicians to update their own data

  3. Functions
    - Create function to find nearest technicians
*/

-- Create the technicians table
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

-- Enable RLS
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access"
  ON technicians
  FOR SELECT
  TO public
  USING (true);

-- Create policy for technicians to update their own data
CREATE POLICY "Technicians can update own data"
  ON technicians
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Function to calculate distance between two points
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 double precision,
  lon1 double precision,
  lat2 double precision,
  lon2 double precision
)
RETURNS double precision
LANGUAGE plpgsql
AS $$
DECLARE
  R double precision := 6371; -- Earth's radius in kilometers
  dlat double precision;
  dlon double precision;
  a double precision;
  c double precision;
BEGIN
  -- Convert degrees to radians
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  
  -- Haversine formula
  a := sin(dlat/2) * sin(dlat/2) +
       cos(radians(lat1)) * cos(radians(lat2)) *
       sin(dlon/2) * sin(dlon/2);
  c := 2 * asin(sqrt(a));
  
  RETURN round((R * c)::numeric, 1); -- Distance in kilometers, rounded to 1 decimal
END;
$$;

-- Function to find nearest technicians
CREATE OR REPLACE FUNCTION find_nearest_technicians(
  user_lat double precision,
  user_lon double precision,
  max_distance double precision DEFAULT 50.0 -- Default 50km radius
)
RETURNS TABLE (
  id uuid,
  name text,
  distance double precision,
  address text,
  phone text,
  is_available boolean,
  rating double precision,
  specializations text[]
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.name,
    calculate_distance(user_lat, user_lon, t.latitude, t.longitude) as distance,
    t.address,
    t.phone,
    t.is_available,
    t.rating,
    t.specializations
  FROM technicians t
  WHERE calculate_distance(user_lat, user_lon, t.latitude, t.longitude) <= LEAST(max_distance, t.service_radius_km)
    AND t.is_available = true
  ORDER BY distance ASC;
END;
$$;