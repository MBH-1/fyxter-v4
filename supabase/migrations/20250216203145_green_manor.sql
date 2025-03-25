/*
  # Create repair orders and user profiles tables

  1. New Tables
    - `repair_orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `model` (text)
      - `repair_type` (text)
      - `service_type` (text)
      - `price` (numeric)
      - `status` (text)
      - `technician_id` (uuid, references technicians)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `phone` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to read their own data
    - Add policies for technicians to read assigned orders
*/

-- Create repair_orders table
CREATE TABLE IF NOT EXISTS repair_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  model text NOT NULL,
  repair_type text NOT NULL,
  service_type text NOT NULL,
  price numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  technician_id uuid REFERENCES technicians,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE repair_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for repair_orders
CREATE POLICY "Users can read own repair orders"
  ON repair_orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Technicians can read assigned orders"
  ON repair_orders
  FOR SELECT
  TO authenticated
  USING (technician_id = auth.uid());

-- Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_repair_orders_updated_at
  BEFORE UPDATE ON repair_orders
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();