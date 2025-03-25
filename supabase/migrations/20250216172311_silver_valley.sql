/*
  # Add iPhone repair prices

  1. New Data
    - Adds repair prices for various iPhone models to the `iphone_prices` table
    - Includes prices for:
      - Original screen replacement
      - Aftermarket screen replacement
      - On-site repair service

  2. Security
    - Table already has RLS enabled
    - Public read access policy exists
*/

INSERT INTO iphone_prices (model, original_screen, aftermarket_screen, on_site_repair) VALUES
  ('iPhone 11 LCD', 95, 72, 205),
  ('iPhone 11 Pro Max OLED', 151, 74, 261),
  ('iPhone 11 Pro OLED', 137, 74, 247),
  ('iPhone 12 OLED', 150, 74, 260),
  ('iPhone 12 Mini OLED', 140, 84, 250),
  ('iPhone 12 Pro Max OLED', 217, 76, 327),
  ('iPhone 12 Pro OLED', 150, 74, 260),
  ('iPhone 13 OLED', 165, 81, 275),
  ('iPhone 13 Pro Max OLED', 320, 115, 430),
  ('iPhone 13 Pro OLED', 375, 95, 485),
  ('iPhone 14 OLED', 215, 82, 325),
  ('iPhone 14 Plus OLED', 215, 82, 325),
  ('iPhone 14 Pro Max OLED', 510, 85, 620),
  ('iPhone 14 Pro OLED', 435, 110, 545),
  ('iPhone 15 OLED', 320, 88, 430),
  ('iPhone 15 Plus OLED', 315, 96, 425),
  ('iPhone 15 Pro Max OLED', 520, 137, 630),
  ('iPhone 15 Pro OLED', 435, 140, 545),
  ('iPhone X OLED', 125, 71, 235),
  ('iPhone XR LCD', 95, 72, 205),
  ('iPhone XS Max OLED', 150, 74, 260),
  ('iPhone XS OLED', 130, 71, 240),
  ('iPhone 8/SE LCD', 85, 67, 195),
  ('iPhone 8 Plus LCD', 75, 67, 175);