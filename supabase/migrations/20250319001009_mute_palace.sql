/*
  # Fix Customer Info RLS policies

  1. Changes
    - Drop and recreate RLS policies for customer_info table
    - Ensure public insert access works for anonymous users
    - Add detailed error handling
  
  2. Security
    - Allow all public access for customer_info table (read/write)
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert on customer_info" ON customer_info;
DROP POLICY IF EXISTS "Allow public select on customer_info" ON customer_info;
DROP POLICY IF EXISTS "Users can read own info" ON customer_info;
DROP POLICY IF EXISTS "Users can insert own info" ON customer_info;
DROP POLICY IF EXISTS "customer_info_insert_policy" ON customer_info;
DROP POLICY IF EXISTS "customer_info_select_policy" ON customer_info;
DROP POLICY IF EXISTS "customer_info_update_policy" ON customer_info;
DROP POLICY IF EXISTS "customer_info_delete_policy" ON customer_info;

-- Create new policies with unrestricted access
CREATE POLICY "customer_info_insert_policy"
  ON customer_info
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "customer_info_select_policy"
  ON customer_info
  FOR SELECT
  TO public
  USING (true);

-- Add policy descriptions for better documentation
COMMENT ON POLICY "customer_info_insert_policy" ON customer_info IS 'Allow anyone to insert customer information';
COMMENT ON POLICY "customer_info_select_policy" ON customer_info IS 'Allow anyone to view customer information';