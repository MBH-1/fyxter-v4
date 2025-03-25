/*
  # Insert device prices data
  
  1. Changes
    - Insert comprehensive device price data for all brands and models
    - Includes prices for screens, batteries, charging ports, cameras, etc.
    
  2. Data Structure
    - Organized by brand (iPhone, Samsung, Google, iPad)
    - Each entry includes:
      - Brand
      - Model
      - Part type (screen, battery, etc.)
      - Original part price
      - Aftermarket part price
      
  3. Notes
    - All prices are in USD
    - Some models only have original part prices (aftermarket = 0)
    - Maintains data consistency with existing schema
*/

-- Insert device prices data
INSERT INTO device_prices (brand, model, part_type, original_part, aftermarket_part) VALUES
  -- iPhone Screens
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

  -- Google Pixel Screens
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

  -- Samsung Screens
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

  -- iPad Screens and Digitizers
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

  -- Add digitizers for iPads
  ('Ipad', 'iPad_Air', 'digitizer', 96, 0),
  ('Ipad', 'iPad_5', 'digitizer', 96, 0),
  ('Ipad', 'iPad_Mini_1', 'digitizer', 90, 0),
  ('Ipad', 'iPad_Mini_2', 'digitizer', 90, 0),
  ('Ipad', 'iPad_Mini_3', 'digitizer', 91, 0),
  ('Ipad', 'iPad_3', 'digitizer', 88, 0),
  ('Ipad', 'iPad_4', 'digitizer', 88, 0),
  ('Ipad', 'iPad_6', 'digitizer', 95, 0),
  ('Ipad', 'iPad_7', 'digitizer', 96, 0),
  ('Ipad', 'iPad_8', 'digitizer', 96, 0),
  ('Ipad', 'iPad_9', 'digitizer', 98, 0),
  ('Ipad', 'iPad_10', 'digitizer', 102, 0),

  -- Batteries
  ('Iphone', 'iPhone_15_Pro_Max', 'battery', 105, 0),
  ('Iphone', 'iPhone_15_Pro', 'battery', 100, 0),
  ('Iphone', 'iPhone_15_Plus', 'battery', 95, 0),
  ('Iphone', 'iPhone_15', 'battery', 95, 0),
  ('Iphone', 'iPhone_14_Pro_Max', 'battery', 87, 0),
  ('Iphone', 'iPhone_14_Pro', 'battery', 87, 0),
  ('Iphone', 'iPhone_14_Plus', 'battery', 86, 0),
  ('Iphone', 'iPhone_14', 'battery', 85, 0),

  -- Charging Ports (sample)
  ('Iphone', 'iPhone_15_Pro_Max', 'charging_port', 60, 0),
  ('Iphone', 'iPhone_15_Pro', 'charging_port', 60, 0),
  ('Iphone', 'iPhone_15_Plus', 'charging_port', 60, 0),
  ('Iphone', 'iPhone_15', 'charging_port', 60, 0),
  ('Samsung', 'Samsung_S24_Ultra', 'charging_port', 60, 0),
  ('Samsung', 'Samsung_S24_Plus', 'charging_port', 60, 0),
  ('Samsung', 'Samsung_S24', 'charging_port', 60, 0),

  -- Cameras (sample)
  ('Iphone', 'iPhone_15_Pro_Max', 'back_camera', 185, 0),
  ('Iphone', 'iPhone_15_Pro', 'back_camera', 175, 0),
  ('Iphone', 'iPhone_15_Plus', 'back_camera', 100, 0),
  ('Iphone', 'iPhone_15', 'back_camera', 100, 0),
  ('Iphone', 'iPhone_15_Pro_Max', 'front_camera', 70, 0),
  ('Iphone', 'iPhone_15_Pro', 'front_camera', 70, 0),
  ('Iphone', 'iPhone_15_Plus', 'front_camera', 70, 0),
  ('Iphone', 'iPhone_15', 'front_camera', 70, 0);