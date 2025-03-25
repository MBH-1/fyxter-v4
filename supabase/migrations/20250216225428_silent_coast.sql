/*
  # Update hero image to Cloudinary
  
  Updates the hero image URL to use Cloudinary with background removal and PNG format
*/

UPDATE images 
SET url = 'https://res.cloudinary.com/dqwxexsra/image/upload/e_background_removal/f_png/v1739746162/DALL_E_2025-02-16_16.24.24_-_A_superhero_with_a_bold_letter_F_on_his_chest_wearing_a_modern_and_sleek_superhero_suit._He_is_holding_a_smartphone_in_one_hand_and_smiling_confide_o56dxv.webp',
    alt_text = 'Fyxters Superhero with Phone'
WHERE url LIKE '%imgur.com%';