/*
  # Update hero image URL
  
  Updates the hero image URL to the new Imgur image
*/

UPDATE images 
SET url = 'https://i.imgur.com/UcNyiTd.png'
WHERE url LIKE '%imgur.com%';