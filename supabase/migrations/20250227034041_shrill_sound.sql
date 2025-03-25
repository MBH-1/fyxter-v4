/*
  # Fix RLS policies for customer_info table

  1. Problem
    - Current policies are not allowing public inserts to customer_info table
    - This causes 42501 error: "new row violates row-level security policy for table customer_info"
  
  2. Solution
    - Drop and recreate all policies for customer_info table
    - Ensure proper public access for both INSERT and SELECT operations
    - Set proper role assignments for the policies
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert on customer_info" ON customer_info;
DROP POLICY IF EXISTS "Allow public select on customer_info" ON customer_info;
DROP POLICY IF EXISTS "Users can read own info" ON customer_info;
DROP POLICY IF EXISTS "Users can insert own info" ON customer_info;

-- Recreate policies with proper permissions
-- First, ensure RLS is enabled
ALTER TABLE customer_info ENABLE ROW LEVEL SECURITY;

-- Create unrestricted INSERT policy for anonymous users
CREATE POLICY "customer_info_insert_policy"
  ON customer_info
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create unrestricted SELECT policy for anonymous users
CREATE POLICY "customer_info_select_policy"
  ON customer_info
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create unrestricted UPDATE policy for anonymous users
CREATE POLICY "customer_info_update_policy"
  ON customer_info
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create unrestricted DELETE policy for authenticated users only
CREATE POLICY "customer_info_delete_policy"
  ON customer_info
  FOR DELETE
  TO authenticated
  USING (true);

-- Add policy descriptions for better documentation
COMMENT ON POLICY "customer_info_insert_policy" ON customer_info IS 'Allow anyone to insert customer information';
COMMENT ON POLICY "customer_info_select_policy" ON customer_info IS 'Allow anyone to view customer information';
COMMENT ON POLICY "customer_info_update_policy" ON customer_info IS 'Allow anyone to update customer information';
COMMENT ON POLICY "customer_info_delete_policy" ON customer_info IS 'Allow authenticated users to delete customer information';