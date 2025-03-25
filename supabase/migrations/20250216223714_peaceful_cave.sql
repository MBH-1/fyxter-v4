/*
  # Fix hero image URL format
  
  Updates the hero image URL to use the correct Imgur direct image format
*/

UPDATE images 
SET url = 'https://i.imgur.com/YSwdATK.jpg'
WHERE url LIKE '%imgur.com%';