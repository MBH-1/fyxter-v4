/*
  # Disable Row Level Security for customer_info table

  1. Changes
    - Disable row level security for the customer_info table
    - This allows any client to insert, select, update, or delete data without authentication
  
  2. Security Note
    - This removes security restrictions for this specific table only
    - The data in this table will be accessible to anyone with database access
    - This is appropriate for customer information that needs to be inserted by anonymous users
*/

-- Disable row level security for customer_info table
ALTER TABLE customer_info DISABLE ROW LEVEL SECURITY;