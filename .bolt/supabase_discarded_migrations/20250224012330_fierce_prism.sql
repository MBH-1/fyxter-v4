/*
  # Create device_price_2 table

  1. New Table
    - `device_price_2`
      - `id` (uuid, primary key)
      - `brand` (text)
      - `model` (text)
      - `part_type` (text)
      - `original_part` (integer)
      - `aftermarket_part` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policy for public read access
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

-- Enable RLS
ALTER TABLE device_price_2 ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access"
  ON device_price_2
  FOR SELECT
  TO public
  USING (true);