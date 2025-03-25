/*
  # Add initial technician data

  1. Data Addition
    - Add first technician (Hassen)
      - Located at 348 Rue Jean-Talon E, Montréal
      - Coordinates: 45.5386, -73.6179 (Jean-Talon location)
      - Default 10km service radius
*/

INSERT INTO technicians (
  name,
  email,
  phone,
  address,
  latitude,
  longitude,
  service_radius_km,
  specializations
) VALUES (
  'Hassen',
  'hassen@fyxters.com',
  '(514) 555-0123',
  '348 Rue Jean-Talon E, Montréal, QC H2R 1T1',
  45.5386,
  -73.6179,
  10.0,
  ARRAY['iPhone', 'Samsung', 'Screen Repair', 'Battery Replacement']
);