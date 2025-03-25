/*
  # Update device prices table

  1. Changes
    - Drop unique constraint on device_prices table
    - Re-insert all device prices data with standardized values
    - Add non-negative price constraint
    - Add valid part type constraint
*/

-- Drop the unique constraint if it exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'unique_device_part'
  ) THEN
    ALTER TABLE device_prices DROP CONSTRAINT unique_device_part;
  END IF;
END $$;

-- Clean up existing data
TRUNCATE device_prices;

-- Insert device prices data with standardized values
INSERT INTO device_prices (brand, model, part_type, original_part, aftermarket_part) VALUES
  ('Iphone', 'iPhone_11', 'screen', 95, 72),
  ('Iphone', 'iPhone_11_Pro_Max', 'screen', 151, 74),
  ('Iphone', 'iPhone_11_Pro', 'screen', 137, 74),
  ('Iphone', 'iPhone_12', 'screen', 150, 74),
  ('Iphone', 'iPhone_12_Mini', 'screen', 140, 84),
  ('Iphone', 'iPhone_12_Pro_Max', 'screen', 217, 76),
  ('Iphone', 'iPhone_12_Pro', 'screen', 150, 74),
  ('Iphone', 'iPhone_13', 'screen', 165, 81),
  ('Iphone', 'iPhone_13_Pro_Max', 'screen', 320, 115),
  ('Iphone', 'iPhone_13_Pro', 'screen', 375, 95),
  ('Iphone', 'iPhone_14', 'screen', 215, 82),
  ('Iphone', 'iPhone_14_Plus', 'screen', 215, 82),
  ('Iphone', 'iPhone_14_Pro_Max', 'screen', 510, 85),
  ('Iphone', 'iPhone_14_Pro', 'screen', 435, 110),
  ('Iphone', 'iPhone_15', 'screen', 320, 88),
  ('Iphone', 'iPhone_15_Plus', 'screen', 315, 96),
  ('Iphone', 'iPhone_15_Pro_Max', 'screen', 520, 137),
  ('Iphone', 'iPhone_15_Pro', 'screen', 435, 140),
  ('Iphone', 'iPhone_X', 'screen', 125, 71),
  ('Iphone', 'iPhone_XR', 'screen', 95, 72),
  ('Iphone', 'iPhone_XS_Max', 'screen', 150, 74),
  ('Iphone', 'iPhone_XS', 'screen', 130, 71),
  ('Iphone', 'iPhone_8_SE', 'screen', 85, 67),
  ('Iphone', 'iPhone_8_Plus', 'screen', 75, 67),
  ('Google', 'Google_Pixel_4A', 'screen', 170, 0),
  ('Google', 'Google_Pixel_5', 'screen', 210, 0),
  ('Google', 'Google_Pixel_4A_5G', 'screen', 170, 0),
  ('Google', 'Google_Pixel_7A', 'screen', 175, 0),
  ('Google', 'Google_Pixel_8', 'screen', 200, 0),
  ('Google', 'Google_Pixel_8a', 'screen', 175, 0),
  ('Google', 'Google_Pixel_9', 'screen', 210, 0),
  ('Google', 'Google_Pixel_9_Pro', 'screen', 210, 0),
  ('Google', 'Google_Pixel_9_XL', 'screen', 300, 0),
  ('Google', 'Google_Pixel_6_Pro', 'screen', 235, 159),
  ('Google', 'Google_Pixel_7_Pro', 'screen', 240, 175),
  ('Google', 'Google_Pixel_6', 'screen', 200, 174),
  ('Google', 'Google_Pixel_5A_5G', 'screen', 195, 100),
  ('Google', 'Google_Pixel_8_Pro', 'screen', 270, 185),
  ('Google', 'Google_Pixel_6A', 'screen', 170, 190),
  ('Google', 'Google_Pixel_7', 'screen', 205, 185),
  ('Samsung', 'Samsung_S10', 'screen', 195, 110),
  ('Samsung', 'Samsung_S10_Plus', 'screen', 265, 115),
  ('Samsung', 'Samsung_S10E', 'screen', 145, 0),
  ('Samsung', 'Samsung_S20', 'screen', 210, 160),
  ('Samsung', 'Samsung_S20_Plus', 'screen', 235, 140),
  ('Samsung', 'Samsung_S20_Ultra', 'screen', 275, 165),
  ('Samsung', 'Samsung_S21', 'screen', 215, 160),
  ('Samsung', 'Samsung_S21_FE', 'screen', 215, 130),
  ('Samsung', 'Samsung_S21_Plus', 'screen', 215, 155),
  ('Samsung', 'Samsung_S21_Ultra', 'screen', 280, 165),
  ('Samsung', 'Samsung_S22', 'screen', 265, 210),
  ('Samsung', 'Samsung_S22_Plus', 'screen', 235, 160),
  ('Samsung', 'Samsung_S22_Ultra', 'screen', 330, 190),
  ('Samsung', 'Samsung_S23', 'screen', 245, 0),
  ('Samsung', 'Samsung_S23_Fe', 'screen', 190, 125),
  ('Samsung', 'Samsung_S23_Plus', 'screen', 205, 160),
  ('Samsung', 'Samsung_S23_Ultra', 'screen', 355, 195),
  ('Samsung', 'Samsung_S24', 'screen', 235, 0),
  ('Samsung', 'Samsung_S24_Plus', 'screen', 270, 0),
  ('Samsung', 'Samsung_S24_Ultra', 'screen', 360, 265),
  ('Samsung', 'Samsung_S7', 'screen', 105, 0),
  ('Samsung', 'Samsung_S8', 'screen', 162, 120),
  ('Samsung', 'Samsung_S8_Plus', 'screen', 187, 120),
  ('Samsung', 'Samsung_S9', 'screen', 165, 115),
  ('Samsung', 'Samsung_S9_Plus', 'screen', 177, 150),
  ('Samsung', 'Samsung_S20_Fe', 'screen', 145, 108),
  ('Samsung', 'Samsung_S24_fe', 'screen', 0, 170),
  ('Samsung', 'Samsung_A02', 'screen', 87, 0),
  ('Samsung', 'Samsung_A02S', 'screen', 87, 0),
  ('Samsung', 'Samsung_A03_Core', 'screen', 85, 0),
  ('Samsung', 'Samsung_A03S', 'screen', 88, 0),
  ('Samsung', 'Samsung_A04', 'screen', 88, 0),
  ('Samsung', 'Samsung_A04E', 'screen', 88, 0),
  ('Samsung', 'Samsung_A04S', 'screen', 89, 0),
  ('Samsung', 'Samsung_A05', 'screen', 90, 0),
  ('Samsung', 'Samsung_A05S', 'screen', 93, 0),
  ('Samsung', 'Samsung_A10', 'screen', 88, 0),
  ('Samsung', 'Samsung_A10E', 'screen', 88, 0),
  ('Samsung', 'Samsung_A10S', 'screen', 86, 0),
  ('Samsung', 'Samsung_A11', 'screen', 90, 0),
  ('Samsung', 'Samsung_A12', 'screen', 89, 0),
  ('Samsung', 'Samsung_A12_Nacho', 'screen', 90, 0),
  ('Samsung', 'Samsung_A13_4G', 'screen', 90, 0),
  ('Samsung', 'Samsung_A13_5G', 'screen', 88, 0),
  ('Samsung', 'Samsung_A15', 'screen', 140, 100),
  ('Samsung', 'Samsung_A20', 'screen', 120, 0),
  ('Samsung', 'Samsung_A20S', 'screen', 87, 0),
  ('Samsung', 'Samsung_A21', 'screen', 92, 0),
  ('Samsung', 'Samsung_A21S', 'screen', 91, 0),
  ('Samsung', 'Samsung_A22_4G', 'screen', 125, 0),
  ('Samsung', 'Samsung_A22_5G', 'screen', 89, 0),
  ('Samsung', 'Samsung_A23', 'screen', 90, 0),
  ('Samsung', 'Samsung_A24_4G', 'screen', 0, 100),
  ('Samsung', 'Samsung_A25_5G', 'screen', 155, 0),
  ('Samsung', 'Samsung_A32_5G', 'screen', 90, 0),
  ('Samsung', 'Samsung_A34_5G', 'screen', 0, 70),
  ('Samsung', 'Samsung_A5_2015', 'screen', 98, 0),
  ('Samsung', 'Samsung_A5_2017', 'screen', 115, 0),
  ('Samsung', 'Samsung_A50', 'screen', 125, 103),
  ('Samsung', 'Samsung_A51_4G', 'screen', 141, 107),
  ('Samsung', 'Samsung_A52_4G', 'screen', 155, 117),
  ('Samsung', 'Samsung_A53_5G', 'screen', 165, 118),
  ('Samsung', 'Samsung_A54_5G', 'screen', 165, 116),
  ('Samsung', 'Samsung_A55_5G', 'screen', 175, 140),
  ('Samsung', 'Samsung_A70', 'screen', 168, 127),
  ('Samsung', 'Samsung_A71', 'screen', 165, 118),
  ('Samsung', 'Samsung_A8', 'screen', 117, 0),
  ('Samsung', 'Samsung_A03', 'screen', 87, 0),
  ('Samsung', 'Samsung_A14_4G', 'screen', 90, 0),
  ('Samsung', 'Samsung_A14_5G', 'screen', 91, 0),
  ('Samsung', 'Samsung_A32_4G', 'screen', 0, 106),
  ('Samsung', 'Samsung_A35', 'screen', 0, 126),
  ('Samsung', 'Samsung_Note_4', 'screen', 80, 0),
  ('Samsung', 'Samsung_Note_5', 'screen', 108, 0),
  ('Samsung', 'Samsung_Note_8', 'screen', 180, 0),
  ('Samsung', 'Samsung_Note_9', 'screen', 220, 0),
  ('Samsung', 'Samsung_Note_10', 'screen', 205, 160),
  ('Samsung', 'Samsung_Note_10_Plus', 'screen', 275, 127),
  ('Samsung', 'Samsung_Note_20', 'screen', 187, 130),
  ('Samsung', 'Samsung_Note_20_Ultra', 'screen', 305, 172),
  ('Ipad', 'iPad_10', 'screen', 230, 0),
  ('Ipad', 'iPad_7', 'screen', 160, 0),
  ('Ipad', 'iPad_8', 'screen', 160, 0),
  ('Ipad', 'iPad_9', 'screen', 160, 0),
  ('Ipad', 'iPad_3', 'screen', 135, 0),
  ('Ipad', 'iPad_4', 'screen', 135, 0),
  ('Ipad', 'iPad_6', 'screen', 161, 0),
  ('Ipad', 'iPad_Air', 'screen', 170, 0),
  ('Ipad', 'iPad_5', 'screen', 170, 0),
  ('Ipad', 'iPad_Air_2', 'screen', 204, 0),
  ('Ipad', 'iPad_Air_3', 'screen', 225, 0),
  ('Ipad', 'iPad_Air_4', 'screen', 300, 0),
  ('Ipad', 'iPad_Air_5', 'screen', 300, 0),
  ('Ipad', 'iPad_Air_6_11', 'screen', 350, 0),
  ('Ipad', 'iPad_Air_6_13', 'screen', 465, 0),
  ('Ipad', 'iPad_Mini_1', 'screen', 137, 0),
  ('Ipad', 'iPad_Mini_2', 'screen', 138, 0),
  ('Ipad', 'iPad_Mini_3', 'screen', 138, 0),
  ('Ipad', 'iPad_Mini_4', 'screen', 180, 0),
  ('Ipad', 'iPad_Mini_5', 'screen', 185, 0),
  ('Ipad', 'iPad_Mini_6', 'screen', 390, 0),
  ('Ipad', 'iPad_Mini_7', 'screen', 430, 0),
  ('Ipad', 'iPad_Pro_10_5', 'screen', 230, 0),
  ('Ipad', 'iPad_Pro_11_1st_Gen', 'screen', 265, 0),
  ('Ipad', 'iPad_Pro_11_2nd_Gen', 'screen', 265, 0),
  ('Ipad', 'iPad_Pro_11_3th_Gen', 'screen', 265, 0),
  ('Ipad', 'iPad_Pro_11_4th_Gen', 'screen', 265, 0),
  ('Ipad', 'iPad_Pro_12_9_1st_Gen', 'screen', 280, 0),
  ('Ipad', 'iPad_Pro_12_9_2nd_Gen', 'screen', 435, 0),
  ('Ipad', 'iPad_Pro_12_9_4th_Gen', 'screen', 285, 0),
  ('Ipad', 'iPad_Pro_12_9_3rd_Gen', 'screen', 285, 0),
  ('Ipad', 'iPad_Pro_12_9_5th_Gen_2021', 'screen', 360, 0),
  ('Ipad', 'iPad_Pro_12_9_6th_Gen', 'screen', 360, 0),
  ('Ipad', 'iPad_Pro_13_7th_Gen', 'screen', 350, 0);

-- Add check constraint for non-negative prices
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'non_negative_prices'
  ) THEN
    ALTER TABLE device_prices
    ADD CONSTRAINT non_negative_prices
    CHECK (original_part >= 0 AND aftermarket_part >= 0);
  END IF;
END $$;

-- Add check constraint for valid part types
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'valid_part_type'
  ) THEN
    ALTER TABLE device_prices
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
  END IF;
END $$;