/*
  # Make user_id column nullable in customer_info table

  1. Changes
    - Alter customer_info table to make user_id column nullable
    - This allows anonymous users to submit their information without authentication

  2. Problem Solved
    - Fixes issue with customer info form submission for non-authenticated users
    - Allows the application to store customer data without requiring a user account
*/

-- Alter customer_info table to make user_id column nullable
ALTER TABLE customer_info ALTER COLUMN user_id DROP NOT NULL;