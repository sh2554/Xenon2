-- Extend mock_test_results for per-test catalog (run after supabase_migration_mock_tests.sql)

ALTER TABLE mock_test_results ADD COLUMN IF NOT EXISTS test_id text;
ALTER TABLE mock_test_results ADD COLUMN IF NOT EXISTS percent integer;
ALTER TABLE mock_test_results ADD COLUMN IF NOT EXISTS grade text;

CREATE INDEX IF NOT EXISTS idx_mock_test_test_id ON mock_test_results(test_id);
