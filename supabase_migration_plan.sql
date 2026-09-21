-- Add subscription plan column for redeem codes (PRO123 / MAX456)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free';

-- Allow users to update their own plan (redeem flow)
DROP POLICY IF EXISTS "Users can update own plan" ON profiles;
CREATE POLICY "Users can update own plan"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
