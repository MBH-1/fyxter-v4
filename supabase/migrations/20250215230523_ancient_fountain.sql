/*
  # iPhone Repair Pricing Schema

  1. New Tables
    - `iphone_prices`
      - `id` (uuid, primary key)
      - `model` (text) - iPhone model name
      - `original_screen` (integer) - Original screen repair price
      - `aftermarket_screen` (integer) - Aftermarket screen repair price
      - `on_site_repair` (integer) - On-site repair price
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `iphone_prices` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS iphone_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model text NOT NULL,
  original_screen integer NOT NULL,
  aftermarket_screen integer NOT NULL,
  on_site_repair integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE iphone_prices ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access"
  ON iphone_prices
  FOR SELECT
  TO public
  USING (true);

-- Insert the iPhone price data
INSERT INTO iphone_prices (model, original_screen, aftermarket_screen, on_site_repair) VALUES
  ('iPhone 11 LCD', 95, 72, 205),
  ('iPhone 11 Pro Max OLED', 151, 74, 261),
  ('iPhone 11 Pro OLED', 137, 74, 247),
  ('iPhone 12 OLED', 150, 74, 260),
  ('iPhone 12 Mini OLED', 140, 84, 250),
  ('iPhone 12 Pro Max OLED', 217, 76, 327),
  ('iPhone 12 Pro OLED', 150, 74, 260),
  ('iPhone 13 OLED', 165, 81, 275),
  ('iPhone 13 Pro Max OLED', 320, 115, 430),
  ('iPhone 13 Pro OLED', 375, 95, 485),
  ('iPhone 14 OLED', 215, 82, 325),
  ('iPhone 14 Plus OLED', 215, 82, 325),
  ('iPhone 14 Pro Max OLED', 510, 85, 620),
  ('iPhone 14 Pro OLED', 435, 110, 545),
  ('iPhone 15 OLED', 320, 88, 430),
  ('iPhone 15 Plus OLED', 315, 96, 425),
  ('iPhone 15 Pro Max OLED', 520, 137, 630),
  ('iPhone 15 Pro OLED', 435, 140, 545),
  ('iPhone X OLED', 125, 71, 235),
  ('iPhone XR LCD', 95, 72, 205),
  ('iPhone XS Max OLED', 150, 74, 260),
  ('iPhone XS OLED', 130, 71, 240),
  ('iPhone 8/SE LCD', 85, 67, 195),
  ('iPhone 8 Plus LCD', 75, 67, 175);