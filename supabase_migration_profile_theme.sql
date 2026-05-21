-- Public profile / leaderboard card theme (separate from avatar URL)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_theme text DEFAULT 'default';

COMMENT ON COLUMN profiles.profile_theme IS 'Leaderboard style: default, pink-glass, oled, cyberpunk';
