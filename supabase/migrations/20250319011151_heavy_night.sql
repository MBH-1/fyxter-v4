/*
  # Check and forcefully disable RLS on customer_info table
  
  1. Diagnostic Query
    - First check if RLS is currently enabled
    - Output the current RLS status in the migration logs
  
  2. Fix
    - Forcefully disable RLS on the customer_info table
    - This ensures the previous migration took effect
*/

-- Check and report the current RLS status
DO $$
DECLARE
  is_rls_enabled boolean;
BEGIN
  SELECT relrowsecurity INTO is_rls_enabled
  FROM pg_class
  WHERE oid = 'customer_info'::regclass;
  
  RAISE NOTICE 'Current RLS status for customer_info: % (true=enabled, false=disabled)', is_rls_enabled;
END $$;

-- Force-disable RLS on the customer_info table
ALTER TABLE customer_info DISABLE ROW LEVEL SECURITY;

-- Verify that user_id is nullable
DO $$
DECLARE
  is_nullable text;
BEGIN
  SELECT is_nullable INTO is_nullable
  FROM information_schema.columns
  WHERE table_name = 'customer_info' AND column_name = 'user_id';
  
  RAISE NOTICE 'user_id nullable status: %', is_nullable;
END $$;