/*
  # Create screen prices table

  1. New Tables
    - `screen_prices`
      - `id` (uuid, primary key)
      - `brand` (text)
      - `model` (text)
      - `original_part` (integer)
      - `aftermarket_part` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `screen_prices` table
    - Add policy for public read access
*/

-- Drop existing table and policies if they exist
DROP TABLE IF EXISTS screen_prices CASCADE;

-- Create screen prices table
CREATE TABLE screen_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  original_part integer NOT NULL,
  aftermarket_part integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT non_negative_prices CHECK (original_part >= 0 AND aftermarket_part >= 0),
  CONSTRAINT unique_screen_model UNIQUE (brand, model)
);

-- Enable RLS
ALTER TABLE screen_prices ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access"
  ON screen_prices
  FOR SELECT
  TO public
  USING (true);

-- Insert screen prices data
INSERT INTO screen_prices (brand, model, original_part, aftermarket_part) VALUES
  -- iPhones
  ('Iphone', 'iPhone_11', 95, 72),
  ('Iphone', 'iPhone_11_Pro_Max', 151, 74),
  ('Iphone', 'iPhone_11_Pro', 137, 74),
  ('Iphone', 'iPhone_12', 150, 74),
  ('Iphone', 'iPhone_12_Mini', 140, 84),
  ('Iphone', 'iPhone_12_Pro_Max', 217, 76),
  ('Iphone', 'iPhone_12_Pro', 150, 74),
  ('Iphone', 'iPhone_13', 165, 81),
  ('Iphone', 'iPhone_13_Pro_Max', 320, 115),
  ('Iphone', 'iPhone_13_Pro', 375, 95),
  ('Iphone', 'iPhone_14', 215, 82),
  ('Iphone', 'iPhone_14_Plus', 215, 82),
  ('Iphone', 'iPhone_14_Pro_Max', 510, 85),
  ('Iphone', 'iPhone_14_Pro', 435, 110),
  ('Iphone', 'iPhone_15', 320, 88),
  ('Iphone', 'iPhone_15_Plus', 315, 96),
  ('Iphone', 'iPhone_15_Pro_Max', 520, 137),
  ('Iphone', 'iPhone_15_Pro', 435, 140),
  ('Iphone', 'iPhone_X', 125, 71),
  ('Iphone', 'iPhone_XR', 95, 72),
  ('Iphone', 'iPhone_XS_Max', 150, 74),
  ('Iphone', 'iPhone_XS', 130, 71),
  ('Iphone', 'iPhone_8_SE', 85, 67),
  ('Iphone', 'iPhone_8_Plus', 75, 67),

  -- Google Pixels
  ('Google', 'Google_Pixel_4A', 170, 0),
  ('Google', 'Google_Pixel_5', 210, 0),
  ('Google', 'Google_Pixel_4A_5G', 170, 0),
  ('Google', 'Google_Pixel_7A', 175, 0),
  ('Google', 'Google_Pixel_8', 200, 0),
  ('Google', 'Google_Pixel_8a', 175, 0),
  ('Google', 'Google_Pixel_9', 210, 0),
  ('Google', 'Google_Pixel_9_Pro', 210, 0),
  ('Google', 'Google_Pixel_9_XL', 300, 0),
  ('Google', 'Google_Pixel_6_Pro', 235, 159),
  ('Google', 'Google_Pixel_7_Pro', 240, 175),
  ('Google', 'Google_Pixel_6', 200, 174),
  ('Google', 'Google_Pixel_5A_5G', 195, 100),
  ('Google', 'Google_Pixel_8_Pro', 270, 185),
  ('Google', 'Google_Pixel_6A', 170, 190),
  ('Google', 'Google_Pixel_7', 205, 185),

  -- Samsung Galaxy S Series
  ('Samsung', 'Samsung_S10', 195, 110),
  ('Samsung', 'Samsung_S10_Plus', 265, 115),
  ('Samsung', 'Samsung_S10E', 145, 0),
  ('Samsung', 'Samsung_S20', 210, 160),
  ('Samsung', 'Samsung_S20_Plus', 235, 140),
  ('Samsung', 'Samsung_S20_Ultra', 275, 165),
  ('Samsung', 'Samsung_S21', 215, 160),
  ('Samsung', 'Samsung_S21_FE', 215, 130),
  ('Samsung', 'Samsung_S21_Plus', 215, 155),
  ('Samsung', 'Samsung_S21_Ultra', 280, 165),
  ('Samsung', 'Samsung_S22', 265, 210),
  ('Samsung', 'Samsung_S22_Plus', 235, 160),
  ('Samsung', 'Samsung_S22_Ultra', 330, 190),
  ('Samsung', 'Samsung_S23', 245, 0),
  ('Samsung', 'Samsung_S23_Fe', 190, 125),
  ('Samsung', 'Samsung_S23_Plus', 205, 160),
  ('Samsung', 'Samsung_S23_Ultra', 355, 195),
  ('Samsung', 'Samsung_S24', 235, 0),
  ('Samsung', 'Samsung_S24_Plus', 270, 0),
  ('Samsung', 'Samsung_S24_Ultra', 360, 265),

  -- iPads
  ('Ipad', 'iPad_10', 230, 0),
  ('Ipad', 'iPad_7', 160, 0),
  ('Ipad', 'iPad_8', 160, 0),
  ('Ipad', 'iPad_9', 160, 0),
  ('Ipad', 'iPad_3', 135, 0),
  ('Ipad', 'iPad_4', 135, 0),
  ('Ipad', 'iPad_6', 161, 0),
  ('Ipad', 'iPad_Air', 170, 0),
  ('Ipad', 'iPad_5', 170, 0),
  ('Ipad', 'iPad_Air_2', 204, 0),
  ('Ipad', 'iPad_Air_3', 225, 0),
  ('Ipad', 'iPad_Air_4', 300, 0),
  ('Ipad', 'iPad_Air_5', 300, 0),
  ('Ipad', 'iPad_Air_6_11', 350, 0),
  ('Ipad', 'iPad_Air_6_13', 465, 0);