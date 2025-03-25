/*
  # Fix unique constraint and repair types

  1. Changes
    - Adds unique constraint for brand, model, and part_type
    - Cleans up any potential duplicate data
    - Re-inserts repair types with proper constraints

  2. Security
    - Maintains existing RLS policies
*/

-- First, remove any duplicate entries keeping the one with the highest price
DELETE FROM device_prices a USING (
  SELECT brand, model, part_type, MAX(id) as max_id
  FROM device_prices
  GROUP BY brand, model, part_type
  HAVING COUNT(*) > 1
) b
WHERE a.brand = b.brand 
  AND a.model = b.model 
  AND a.part_type = b.part_type 
  AND a.id != b.max_id;

-- Now add the unique constraint
ALTER TABLE device_prices
ADD CONSTRAINT unique_device_part UNIQUE (brand, model, part_type);

-- Insert repair types with consistent pricing
INSERT INTO device_prices (brand, model, part_type, original_part, aftermarket_part)
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
ON CONFLICT (brand, model, part_type) 
DO UPDATE SET
  original_part = EXCLUDED.original_part,
  aftermarket_part = EXCLUDED.aftermarket_part;