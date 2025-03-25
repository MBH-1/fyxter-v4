/*
  # Create and fix anonymous customer tables

  1. New Tables
    - `customer_info_anonymous` - Stores customer information without requiring authentication
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `repair_orders_anonymous` - Stores repair orders from anonymous customers
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key to customer_info_anonymous)
      - `model` (text)
      - `repair_type` (text)
      - `service_type` (text)
      - `price` (numeric)
      - `status` (text)
      - `technician_id` (uuid, foreign key to technicians)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on both tables
    - Create policies for anonymous public access (insert/select)
    - Allow technicians to update assigned orders
*/

-- Create customer_info_anonymous table
CREATE TABLE IF NOT EXISTS customer_info_anonymous (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create repair_orders_anonymous table
CREATE TABLE IF NOT EXISTS repair_orders_anonymous (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customer_info_anonymous NOT NULL,
  model text NOT NULL,
  repair_type text NOT NULL,
  service_type text NOT NULL,
  price numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  technician_id uuid REFERENCES technicians,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS for both tables
ALTER TABLE customer_info_anonymous ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_orders_anonymous ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  BEGIN
    DROP POLICY IF EXISTS "Allow public insert on customer_info_anonymous" ON customer_info_anonymous;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow public select on customer_info_anonymous" ON customer_info_anonymous;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow public insert on repair_orders_anonymous" ON repair_orders_anonymous;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow public select on repair_orders_anonymous" ON repair_orders_anonymous;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Technicians can update assigned anonymous orders" ON repair_orders_anonymous;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
END $$;

-- Create policies for customer_info_anonymous
CREATE POLICY "Allow public insert on customer_info_anonymous"
  ON customer_info_anonymous
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public select on customer_info_anonymous"
  ON customer_info_anonymous
  FOR SELECT
  TO public
  USING (true);

-- Create policies for repair_orders_anonymous
CREATE POLICY "Allow public insert on repair_orders_anonymous"
  ON repair_orders_anonymous
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public select on repair_orders_anonymous"
  ON repair_orders_anonymous
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Technicians can update assigned anonymous orders"
  ON repair_orders_anonymous
  FOR UPDATE
  TO authenticated
  USING (technician_id = auth.uid())
  WITH CHECK (technician_id = auth.uid());

-- Create updated_at triggers if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_customer_info_anonymous_updated_at'
  ) THEN
    CREATE TRIGGER update_customer_info_anonymous_updated_at
      BEFORE UPDATE ON customer_info_anonymous
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_repair_orders_anonymous_updated_at'
  ) THEN
    CREATE TRIGGER update_repair_orders_anonymous_updated_at
      BEFORE UPDATE ON repair_orders_anonymous
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;