/*
  # Add customer information table

  1. New Tables
    - `customer_info`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to read/write their own data
*/

CREATE TABLE IF NOT EXISTS customer_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customer_info ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own info"
  ON customer_info
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own info"
  ON customer_info
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_customer_info_updated_at
  BEFORE UPDATE ON customer_info
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();