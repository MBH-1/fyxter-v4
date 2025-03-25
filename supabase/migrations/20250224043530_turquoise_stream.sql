/*
  # Create technician applications table

  1. New Tables
    - `technician_applications`
      - Basic info: name, email, phone, address, coordinates
      - Professional info: experience, specializations, certifications
      - Requirements: background check consent, tools, transportation, insurance
      - Status tracking and timestamps
  
  2. Security
    - Enable RLS
    - Allow public insert for applications
    - Allow authenticated users to view their own applications
*/

-- Create technician applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS technician_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  experience_years integer NOT NULL,
  specializations text[] NOT NULL,
  certifications text,
  availability text NOT NULL,
  background_check_consent boolean NOT NULL DEFAULT false,
  has_tools boolean NOT NULL DEFAULT false,
  has_transportation boolean NOT NULL DEFAULT false,
  has_insurance boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE technician_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public insert" ON technician_applications;
  DROP POLICY IF EXISTS "Users can view own applications" ON technician_applications;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create policies
CREATE POLICY "Allow public insert"
  ON technician_applications
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view own applications"
  ON technician_applications
  FOR SELECT
  TO authenticated
  USING (
    CASE 
      WHEN auth.uid() IS NOT NULL THEN
        user_id = auth.uid()
      ELSE
        false
    END
  );

-- Create updated_at trigger if it doesn't exist
DO $$ 
BEGIN
  CREATE TRIGGER update_technician_applications_updated_at
    BEFORE UPDATE ON technician_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

-- Create indexes if they don't exist
DO $$ 
BEGIN
  CREATE INDEX IF NOT EXISTS idx_technician_applications_user_id ON technician_applications(user_id);
  CREATE INDEX IF NOT EXISTS idx_technician_applications_status ON technician_applications(status);
  CREATE INDEX IF NOT EXISTS idx_technician_applications_created_at ON technician_applications(created_at);
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;