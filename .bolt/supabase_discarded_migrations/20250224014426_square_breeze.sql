-- Update the hero image URL
UPDATE images 
SET url = 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=1080&auto=format&fit=crop',
    alt_text = 'Phone repair technician fixing a smartphone'
WHERE id IS NOT NULL;

-- Insert if no image exists
INSERT INTO images (url, alt_text)
SELECT 
  'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=1080&auto=format&fit=crop',
  'Phone repair technician fixing a smartphone'
WHERE NOT EXISTS (SELECT 1 FROM images LIMIT 1);