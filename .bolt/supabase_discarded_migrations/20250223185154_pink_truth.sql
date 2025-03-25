/*
  # Add device_price_2 table

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
*/

-- Create device_price_2 table
CREATE TABLE IF NOT EXISTS device_price_2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  part_type text NOT NULL,
  original_part integer NOT NULL,
  aftermarket_part integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE device_price_2 ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access"
  ON device_price_2
  FOR SELECT
  TO public
  USING (true);

-- Add check constraint for non-negative prices
ALTER TABLE device_price_2
ADD CONSTRAINT non_negative_prices
CHECK (original_part >= 0 AND aftermarket_part >= 0);

-- Add check constraint for valid part types
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

-- Copy data from device_prices to device_price_2
INSERT INTO device_price_2 (brand, model, part_type, original_part, aftermarket_part)
SELECT brand, model, part_type, original_part, aftermarket_part
FROM device_prices;