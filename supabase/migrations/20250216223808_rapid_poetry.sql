/*
  # Fix hero image URL format for PNG
  
  Updates the hero image URL to use the correct Imgur direct PNG image format
*/

UPDATE images 
SET url = 'https://i.imgur.com/YSwdATK.png'
WHERE url LIKE '%imgur.com%';