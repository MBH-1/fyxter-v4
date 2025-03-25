/*
  # Add image storage capabilities
  
  1. New Tables
    - `images`
      - `id` (uuid, primary key)
      - `url` (text, not null)
      - `alt_text` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `images` table
    - Add policy for public read access
*/

-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  alt_text text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access"
  ON images
  FOR SELECT
  TO public
  USING (true);

-- Insert the hero image
INSERT INTO images (url, alt_text) VALUES
  ('https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/fyxters-superhero.png', 'Fyxters Phone Repair Superhero');