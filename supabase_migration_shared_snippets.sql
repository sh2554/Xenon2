-- Shared code snippets for the IDE share-link feature

CREATE TABLE IF NOT EXISTS shared_snippets (
  slug varchar(6) PRIMARY KEY,
  code text NOT NULL,
  language text NOT NULL DEFAULT 'python',
  owner_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shared_snippets_owner ON shared_snippets(owner_id);

ALTER TABLE shared_snippets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read shared snippets" ON shared_snippets;
CREATE POLICY "Anyone can read shared snippets"
  ON shared_snippets FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert shared snippets" ON shared_snippets;
CREATE POLICY "Anyone can insert shared snippets"
  ON shared_snippets FOR INSERT
  WITH CHECK (true);
