/*
  # Update device prices structure

  1. Changes
    - Drop existing iphone_prices table
    - Create new device_prices table with brand support
    - Add comprehensive pricing data for multiple brands and repair types

  2. Security
    - Enable RLS
    - Add policy for public read access
*/

-- Drop the existing table
DROP TABLE IF EXISTS iphone_prices;

-- Create new device_prices table
CREATE TABLE IF NOT EXISTS device_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  part_type text NOT NULL,
  original_part integer NOT NULL,
  aftermarket_part integer NOT NULL,
  on_site_repair integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE device_prices ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access"
  ON device_prices
  FOR SELECT
  TO public
  USING (true);

-- Insert the device price data
INSERT INTO device_prices (brand, model, part_type, original_part, aftermarket_part, on_site_repair) VALUES
  ('Iphone', 'iPhone_11_LCD', 'screen', 95, 72, 205),
  ('Iphone', 'iPhone_11_Pro_Max_OLED', 'screen', 151, 74, 261),
  ('Iphone', 'iPhone_11_Pro_OLED', 'screen', 137, 74, 247),
  ('Iphone', 'iPhone_12_OLED', 'screen', 150, 74, 260),
  ('Iphone', 'iPhone_12_Mini_OLED', 'screen', 140, 84, 250),
  ('Iphone', 'iPhone_12_Pro_Max_OLED', 'screen', 217, 76, 327),
  ('Iphone', 'iPhone_12_Pro_OLED', 'screen', 150, 74, 260),
  ('Iphone', 'iPhone_13_OLED', 'screen', 165, 81, 275),
  ('Iphone', 'iPhone_13_Pro_Max_OLED', 'screen', 320, 115, 430),
  ('Iphone', 'iPhone_13_Pro_OLED', 'screen', 375, 95, 485),
  ('Iphone', 'iPhone_14_OLED', 'screen', 215, 82, 325),
  ('Iphone', 'iPhone_14_Plus_OLED', 'screen', 215, 82, 325),
  ('Iphone', 'iPhone_14_Pro_Max_OLED', 'screen', 510, 85, 620),
  ('Iphone', 'iPhone_14_Pro_OLED', 'screen', 435, 110, 545),
  ('Iphone', 'iPhone_15_OLED', 'screen', 320, 88, 430),
  ('Iphone', 'iPhone_15_Plus_OLED', 'screen', 315, 96, 425),
  ('Iphone', 'iPhone_15_Pro_Max_OLED', 'screen', 520, 137, 630),
  ('Iphone', 'iPhone_15_Pro_OLED', 'screen', 435, 140, 545),
  ('Iphone', 'iPhone_X_OLED', 'screen', 125, 71, 235),
  ('Iphone', 'iPhone_XR_LCD', 'screen', 95, 72, 205),
  ('Iphone', 'iPhone_XS_Max_OLED', 'screen', 150, 74, 260),
  ('Iphone', 'iPhone_XS_OLED', 'screen', 130, 71, 240),
  ('Iphone', 'iPhone_8_SE_LCD', 'screen', 85, 67, 195),
  ('Iphone', 'iPhone_8_Plus_LCD', 'screen', 75, 67, 175),
  ('Iphone', 'iPhone_13_Pro_Max_OLED', 'back_Camera', 100, 0, 100),
  ('Iphone', 'iPhone_13_Pro_Max_OLED', 'front_Camera', 50, 0, 50),
  ('Google', 'Google pixel 8', 'screen', 200, 100, 300),
  ('Samsung', 'Samsung S23 Ultra', 'battery', 150, 0, 200);