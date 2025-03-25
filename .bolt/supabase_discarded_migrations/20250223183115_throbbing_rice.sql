/*
  # Fix repair types data

  1. Changes
    - Ensures all models have proper repair types
    - Maintains unique constraint on (brand, model, part_type)
    - Adds missing repair types for existing models
    - Updates prices for consistency

  2. Security
    - Maintains existing RLS policies
*/

-- First ensure we have the unique constraint
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_device_part'
  ) THEN
    ALTER TABLE device_prices
    ADD CONSTRAINT unique_device_part
    UNIQUE (brand, model, part_type);
  END IF;
END $$;

-- Update or insert repair types with consistent pricing
INSERT INTO device_prices (brand, model, part_type, original_part, aftermarket_part)
SELECT * FROM (
  SELECT 
    d.brand,
    d.model,
    r.part_type,
    CASE 
      WHEN r.part_type = 'battery' THEN 
        CASE 
          WHEN d.brand = 'Iphone' THEN 95
          WHEN d.brand = 'Samsung' THEN 150
          WHEN d.brand = 'Google' THEN 140
          ELSE 0
        END
      WHEN r.part_type = 'charging_port' THEN 60
      WHEN r.part_type = 'back_camera' THEN 
        CASE 
          WHEN d.brand = 'Iphone' THEN 175
          WHEN d.brand = 'Samsung' THEN 180
          WHEN d.brand = 'Google' THEN 170
          ELSE 0
        END
      WHEN r.part_type = 'front_camera' THEN 70
      WHEN r.part_type = 'speaker' THEN 45
      ELSE d.original_part
    END as original_part,
    CASE 
      WHEN r.part_type = 'screen' THEN d.aftermarket_part
      ELSE 0
    END as aftermarket_part
  FROM (
    SELECT DISTINCT brand, model 
    FROM device_prices 
    WHERE part_type = 'screen'
  ) d
  CROSS JOIN (
    SELECT unnest(ARRAY[
      'screen',
      'battery',
      'charging_port',
      'back_camera',
      'front_camera',
      'speaker'
    ]) as part_type
  ) r
  WHERE d.brand IN ('Iphone', 'Samsung', 'Google')
) AS source
ON CONFLICT (brand, model, part_type) 
DO UPDATE SET
  original_part = EXCLUDED.original_part,
  aftermarket_part = EXCLUDED.aftermarket_part;