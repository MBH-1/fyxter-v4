/*
  # Create Anonymous Tables for Unauthenticated Users

  1. New Tables
    - `customer_info_anonymous`: Stores customer information without requiring authentication
    - `repair_orders_anonymous`: Stores repair orders without requiring user accounts
  
  2. Security
    - Enable RLS on tables
    - Allow public inserts for unauthenticated users
    - Restrict updates and deletes to maintain data integrity
*/

-- Create table for anonymous customer information
CREATE TABLE IF NOT EXISTS customer_info_anonymous (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create table for anonymous repair orders
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

-- Create updated_at triggers for both tables
CREATE TRIGGER update_customer_info_anonymous_updated_at
  BEFORE UPDATE ON customer_info_anonymous
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_repair_orders_anonymous_updated_at
  BEFORE UPDATE ON repair_orders_anonymous
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();