/*
  # Update hero image URL
  
  Updates the hero image URL to use the provided Imgur link
*/

UPDATE images 
SET url = 'https://imgur.com/a/YSwdATK',
    alt_text = 'Fyxters Phone Repair Hero'
WHERE url LIKE '%fyxters-superhero.png';