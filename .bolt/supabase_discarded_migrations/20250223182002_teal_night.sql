/*
  # Add repair types for all devices

  1. Changes
    - Add unique constraint for brand, model, and part_type
    - Insert new repair types for iPhone, Samsung, and Google devices
*/

-- First ensure the unique constraint exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_device_part'
  ) THEN
    ALTER TABLE device_prices
    ADD CONSTRAINT unique_device_part
    UNIQUE (brand, model, part_type);
  END IF;
END $$;

-- Insert new repair types
INSERT INTO device_prices (brand, model, part_type, original_part, aftermarket_part)
VALUES
  -- Batteries
  ('Iphone', 'iPhone_13_Pro_Max', 'battery', 95, 0),
  ('Iphone', 'iPhone_13_Pro', 'battery', 95, 0),
  ('Iphone', 'iPhone_13', 'battery', 90, 0),
  ('Iphone', 'iPhone_12_Pro_Max', 'battery', 90, 0),
  ('Iphone', 'iPhone_12_Pro', 'battery', 90, 0),
  ('Iphone', 'iPhone_12', 'battery', 85, 0),
  ('Iphone', 'iPhone_11_Pro_Max', 'battery', 85, 0),
  ('Iphone', 'iPhone_11_Pro', 'battery', 85, 0),
  ('Iphone', 'iPhone_11', 'battery', 80, 0),

  -- Charging Ports
  ('Iphone', 'iPhone_14_Pro_Max', 'charging_port', 60, 0),
  ('Iphone', 'iPhone_14_Pro', 'charging_port', 60, 0),
  ('Iphone', 'iPhone_14', 'charging_port', 60, 0),
  ('Iphone', 'iPhone_13_Pro_Max', 'charging_port', 55, 0),
  ('Iphone', 'iPhone_13_Pro', 'charging_port', 55, 0),
  ('Iphone', 'iPhone_13', 'charging_port', 55, 0),
  ('Iphone', 'iPhone_12_Pro_Max', 'charging_port', 55, 0),
  ('Iphone', 'iPhone_12_Pro', 'charging_port', 55, 0),
  ('Iphone', 'iPhone_12', 'charging_port', 55, 0),

  -- Back Cameras
  ('Iphone', 'iPhone_14_Pro_Max', 'back_camera', 175, 0),
  ('Iphone', 'iPhone_14_Pro', 'back_camera', 165, 0),
  ('Iphone', 'iPhone_14', 'back_camera', 95, 0),
  ('Iphone', 'iPhone_13_Pro_Max', 'back_camera', 165, 0),
  ('Iphone', 'iPhone_13_Pro', 'back_camera', 155, 0),
  ('Iphone', 'iPhone_13', 'back_camera', 90, 0),

  -- Front Cameras
  ('Iphone', 'iPhone_14_Pro_Max', 'front_camera', 65, 0),
  ('Iphone', 'iPhone_14_Pro', 'front_camera', 65, 0),
  ('Iphone', 'iPhone_14', 'front_camera', 65, 0),
  ('Iphone', 'iPhone_13_Pro_Max', 'front_camera', 60, 0),
  ('Iphone', 'iPhone_13_Pro', 'front_camera', 60, 0),
  ('Iphone', 'iPhone_13', 'front_camera', 60, 0),

  -- Speakers
  ('Iphone', 'iPhone_15_Pro_Max', 'speaker', 45, 0),
  ('Iphone', 'iPhone_15_Pro', 'speaker', 45, 0),
  ('Iphone', 'iPhone_15_Plus', 'speaker', 45, 0),
  ('Iphone', 'iPhone_15', 'speaker', 45, 0),
  ('Iphone', 'iPhone_14_Pro_Max', 'speaker', 40, 0),
  ('Iphone', 'iPhone_14_Pro', 'speaker', 40, 0),
  ('Iphone', 'iPhone_14_Plus', 'speaker', 40, 0),
  ('Iphone', 'iPhone_14', 'speaker', 40, 0),
  ('Iphone', 'iPhone_13_Pro_Max', 'speaker', 40, 0),
  ('Iphone', 'iPhone_13_Pro', 'speaker', 40, 0),
  ('Iphone', 'iPhone_13', 'speaker', 40, 0),

  -- Samsung Repair Types
  ('Samsung', 'Samsung_S23_Ultra', 'battery', 150, 0),
  ('Samsung', 'Samsung_S23_Plus', 'battery', 140, 0),
  ('Samsung', 'Samsung_S23', 'battery', 130, 0),
  ('Samsung', 'Samsung_S23_Ultra', 'charging_port', 60, 0),
  ('Samsung', 'Samsung_S23_Plus', 'charging_port', 60, 0),
  ('Samsung', 'Samsung_S23', 'charging_port', 60, 0),
  ('Samsung', 'Samsung_S23_Ultra', 'back_camera', 180, 0),
  ('Samsung', 'Samsung_S23_Plus', 'back_camera', 160, 0),
  ('Samsung', 'Samsung_S23', 'back_camera', 150, 0),
  ('Samsung', 'Samsung_S23_Ultra', 'front_camera', 70, 0),
  ('Samsung', 'Samsung_S23_Plus', 'front_camera', 70, 0),
  ('Samsung', 'Samsung_S23', 'front_camera', 70, 0),
  ('Samsung', 'Samsung_S23_Ultra', 'speaker', 45, 0),
  ('Samsung', 'Samsung_S23_Plus', 'speaker', 45, 0),
  ('Samsung', 'Samsung_S23', 'speaker', 45, 0),

  -- Google Pixel Repair Types
  ('Google', 'Google_Pixel_8_Pro', 'battery', 140, 0),
  ('Google', 'Google_Pixel_8', 'battery', 130, 0),
  ('Google', 'Google_Pixel_8_Pro', 'charging_port', 60, 0),
  ('Google', 'Google_Pixel_8', 'charging_port', 60, 0),
  ('Google', 'Google_Pixel_8_Pro', 'back_camera', 170, 0),
  ('Google', 'Google_Pixel_8', 'back_camera', 150, 0),
  ('Google', 'Google_Pixel_8_Pro', 'front_camera', 70, 0),
  ('Google', 'Google_Pixel_8', 'front_camera', 70, 0),
  ('Google', 'Google_Pixel_8_Pro', 'speaker', 45, 0),
  ('Google', 'Google_Pixel_8', 'speaker', 45, 0)
ON CONFLICT (brand, model, part_type) DO NOTHING;