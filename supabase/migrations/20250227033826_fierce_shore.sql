/*
  # Create customer_info table for non-authenticated users

  1. New Structure
    - `customer_info` - Stores customer information without requiring authentication
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `repair_orders` - Updated to use customer_id instead of user_id
      - Add `customer_id` (uuid, foreign key to customer_info)
  
  2. Security
    - Enable RLS on the new table
    - Create policies for public access (insert/select)
*/

-- Create customer_info table
CREATE TABLE IF NOT EXISTS customer_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customer_info ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public insert on customer_info"
  ON customer_info
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public select on customer_info"
  ON customer_info
  FOR SELECT
  TO public
  USING (true);

-- Add customer_id to repair_orders if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'repair_orders' AND column_name = 'customer_id'
  ) THEN
    ALTER TABLE repair_orders ADD COLUMN customer_id uuid REFERENCES customer_info;
  END IF;
END $$;

-- Create updated_at trigger
CREATE TRIGGER update_customer_info_updated_at
  BEFORE UPDATE ON customer_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();