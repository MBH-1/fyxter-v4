/*
  # Create device_price_2 table

  1. New Tables
    - `device_price_2`
      - `id` (uuid, primary key)
      - `brand` (text)
      - `model` (text)
      - `part_type` (text)
      - `original_part` (integer)
      - `aftermarket_part` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `device_price_2` table
    - Add policy for public read access

  3. Constraints
    - Non-negative prices
    - Valid part types
    - Unique device part combinations
*/

-- Create the device_price_2 table
CREATE TABLE IF NOT EXISTS device_price_2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  part_type text NOT NULL,
  original_part integer NOT NULL,
  aftermarket_part integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add constraints
ALTER TABLE device_price_2
ADD CONSTRAINT non_negative_prices
CHECK (original_part >= 0 AND aftermarket_part >= 0);

ALTER TABLE device_price_2
ADD CONSTRAINT valid_part_type
CHECK (part_type IN (
  'screen',
  'digitizer',
  'battery',
  'charging_port',
  'front_camera',
  'back_camera',
  'speaker'
));

ALTER TABLE device_price_2
ADD CONSTRAINT unique_device_part
UNIQUE (brand, model, part_type);

-- Enable RLS
ALTER TABLE device_price_2 ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access"
  ON device_price_2
  FOR SELECT
  TO public
  USING (true);

-- Insert sample data
INSERT INTO device_price_2 (brand, model, part_type, original_part, aftermarket_part)
VALUES
  ('Iphone', 'iPhone_15_Pro_Max', 'screen', 520, 137),
  ('Iphone', 'iPhone_15_Pro', 'screen', 435, 140),
  ('Iphone', 'iPhone_15_Plus', 'screen', 315, 96),
  ('Iphone', 'iPhone_15', 'screen', 320, 88),
  ('Samsung', 'Samsung_S24_Ultra', 'screen', 360, 265),
  ('Samsung', 'Samsung_S24_Plus', 'screen', 270, 0),
  ('Samsung', 'Samsung_S24', 'screen', 235, 0),
  ('Google', 'Google_Pixel_8_Pro', 'screen', 270, 185),
  ('Google', 'Google_Pixel_8', 'screen', 200, 0);