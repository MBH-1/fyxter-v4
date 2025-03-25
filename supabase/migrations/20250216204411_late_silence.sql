/*
  # Add missing RLS policies for repair orders

  1. Security Changes
    - Add policy for users to insert their own orders
    - Add policy for technicians to update their assigned orders
*/

-- Allow users to insert their own orders
CREATE POLICY "Users can insert own orders"
ON repair_orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow technicians to update assigned orders
CREATE POLICY "Technicians can update assigned orders"
ON repair_orders
FOR UPDATE
TO authenticated
USING (technician_id = auth.uid())
WITH CHECK (technician_id = auth.uid());