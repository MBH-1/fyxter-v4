/*
  # Fix part type constraints and validation
  
  1. Changes
    - Standardize part type values
    - Add constraints for data validation
    - Remove unused on_site_repair column
    
  2. Data Cleanup
    - Normalize part type names
    - Convert to lowercase with underscores
    - Ensure all values match valid types
    
  3. Constraints Added
    - Non-negative prices
    - Valid part types
    - Unique device/part combinations
*/

-- First, standardize existing part type values
UPDATE device_prices
SET part_type = CASE
  WHEN part_type ILIKE 'Charging Port' THEN 'charging_port'
  WHEN part_type ILIKE 'Front Camera' THEN 'front_camera'
  WHEN part_type ILIKE 'Back camera' THEN 'back_camera'
  ELSE LOWER(REPLACE(part_type, ' ', '_'))
END;

-- Drop the on_site_repair column if it exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'device_prices' AND column_name = 'on_site_repair'
  ) THEN
    ALTER TABLE device_prices DROP COLUMN on_site_repair;
  END IF;
END $$;

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

-- Add check constraint for valid part types after data is cleaned
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

-- Add unique constraint to prevent duplicate entries
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_device_part'
  ) THEN
    ALTER TABLE device_prices
    ADD CONSTRAINT unique_device_part
    UNIQUE (brand, model, part_type);
  END IF;
END $$;