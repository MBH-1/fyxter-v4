/*
  # Create screen prices table with complete data

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

  3. Data
    - All 156 screen price records from the provided CSV
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

-- Insert ALL screen prices data
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
  ('Samsung', 'Samsung_S7', 105, 0),
  ('Samsung', 'Samsung_S8', 162, 120),
  ('Samsung', 'Samsung_S8_Plus', 187, 120),
  ('Samsung', 'Samsung_S9', 165, 115),
  ('Samsung', 'Samsung_S9_Plus', 177, 150),
  ('Samsung', 'Samsung_S20_Fe', 145, 108),
  ('Samsung', 'Samsung_S24_fe', 0, 170),

  -- Samsung Galaxy A Series
  ('Samsung', 'Samsung_A02', 87, 0),
  ('Samsung', 'Samsung_A02S', 87, 0),
  ('Samsung', 'Samsung_A03_Core', 85, 0),
  ('Samsung', 'Samsung_A03S', 88, 0),
  ('Samsung', 'Samsung_A04', 88, 0),
  ('Samsung', 'Samsung_A04E', 88, 0),
  ('Samsung', 'Samsung_A04S', 89, 0),
  ('Samsung', 'Samsung_A05', 90, 0),
  ('Samsung', 'Samsung_A05S', 93, 0),
  ('Samsung', 'Samsung_A10', 88, 0),
  ('Samsung', 'Samsung_A10E', 88, 0),
  ('Samsung', 'Samsung_A10S', 86, 0),
  ('Samsung', 'Samsung_A11', 90, 0),
  ('Samsung', 'Samsung_A12', 89, 0),
  ('Samsung', 'Samsung_A12_Nacho', 90, 0),
  ('Samsung', 'Samsung_A13_4G', 90, 0),
  ('Samsung', 'Samsung_A13_5G', 88, 0),
  ('Samsung', 'Samsung_A15', 140, 100),
  ('Samsung', 'Samsung_A20', 120, 0),
  ('Samsung', 'Samsung_A20S', 87, 0),
  ('Samsung', 'Samsung_A21', 92, 0),
  ('Samsung', 'Samsung_A21S', 91, 0),
  ('Samsung', 'Samsung_A22_4G', 125, 0),
  ('Samsung', 'Samsung_A22_5G', 89, 0),
  ('Samsung', 'Samsung_A23', 90, 0),
  ('Samsung', 'Samsung_A24_4G', 0, 100),
  ('Samsung', 'Samsung_A25_5G', 155, 0),
  ('Samsung', 'Samsung_A32_5G', 90, 0),
  ('Samsung', 'Samsung_A34_5G', 0, 70),
  ('Samsung', 'Samsung_A5_2015', 98, 0),
  ('Samsung', 'Samsung_A5_2017', 115, 0),
  ('Samsung', 'Samsung_A50', 125, 103),
  ('Samsung', 'Samsung_A51_4G', 141, 107),
  ('Samsung', 'Samsung_A52_4G', 155, 117),
  ('Samsung', 'Samsung_A53_5G', 165, 118),
  ('Samsung', 'Samsung_A54_5G', 165, 116),
  ('Samsung', 'Samsung_A55_5G', 175, 140),
  ('Samsung', 'Samsung_A70', 168, 127),
  ('Samsung', 'Samsung_A71', 165, 118),
  ('Samsung', 'Samsung_A8', 117, 0),
  ('Samsung', 'Samsung_A03', 87, 0),
  ('Samsung', 'Samsung_A14_4G', 90, 0),
  ('Samsung', 'Samsung_A14_5G', 91, 0),
  ('Samsung', 'Samsung_A32_4G', 0, 106),
  ('Samsung', 'Samsung_A35', 0, 126),

  -- Samsung Galaxy Note Series
  ('Samsung', 'Samsung_Note_4', 80, 0),
  ('Samsung', 'Samsung_Note_5', 108, 0),
  ('Samsung', 'Samsung_Note_8', 180, 0),
  ('Samsung', 'Samsung_Note_9', 220, 0),
  ('Samsung', 'Samsung_Note_10', 205, 160),
  ('Samsung', 'Samsung_Note_10_Plus', 275, 127),
  ('Samsung', 'Samsung_Note_20', 187, 130),
  ('Samsung', 'Samsung_Note_20_Ultra', 305, 172),

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
  ('Ipad', 'iPad_Air_6_13', 465, 0),
  ('Ipad', 'iPad_Mini_1', 137, 0),
  ('Ipad', 'iPad_Mini_2', 138, 0),
  ('Ipad', 'iPad_Mini_3', 138, 0),
  ('Ipad', 'iPad_Mini_4', 180, 0),
  ('Ipad', 'iPad_Mini_5', 185, 0),
  ('Ipad', 'iPad_Mini_6', 390, 0),
  ('Ipad', 'iPad_Mini_7', 430, 0),
  ('Ipad', 'iPad_Pro_10_5', 230, 0),
  ('Ipad', 'iPad_Pro_11_1st_Gen', 265, 0),
  ('Ipad', 'iPad_Pro_11_2nd_Gen', 265, 0),
  ('Ipad', 'iPad_Pro_11_3th_Gen', 265, 0),
  ('Ipad', 'iPad_Pro_11_4th_Gen', 265, 0),
  ('Ipad', 'iPad_Pro_12_9_1st_Gen', 280, 0),
  ('Ipad', 'iPad_Pro_12_9_2nd_Gen', 435, 0),
  ('Ipad', 'iPad_Pro_12_9_4th_Gen', 285, 0),
  ('Ipad', 'iPad_Pro_12_9_3rd_Gen', 285, 0),
  ('Ipad', 'iPad_Pro_12_9_5th_Gen_2021', 360, 0),
  ('Ipad', 'iPad_Pro_12_9_6th_Gen', 360, 0),
  ('Ipad', 'iPad_Pro_13_7th_Gen', 350, 0);