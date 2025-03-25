/*
  # Update device prices schema

  1. Changes
    - Drop on_site_repair column
    - Update part_type values to match new naming convention
    - Add constraints for data integrity

  2. Schema Updates
    - device_prices table:
      - Standardize part_type values
      - Add data validation constraints
      - Ensure non-negative prices

  3. Notes
    - Maintains existing data while updating schema
    - Ensures backward compatibility
    - Adds data integrity checks
*/

-- First, update existing part_type values to match new naming convention
UPDATE device_prices
SET part_type = CASE
  WHEN part_type ILIKE '%front%camera%' THEN 'front_camera'
  WHEN part_type ILIKE '%back%camera%' THEN 'back_camera'
  WHEN part_type ILIKE '%charging%port%' THEN 'charging_port'
  ELSE LOWER(REGEXP_REPLACE(part_type, '[^a-zA-Z0-9]+', '_'))
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