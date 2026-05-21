-- Mock test results (Max students) — powers spec heatmaps for teachers & students

CREATE TABLE IF NOT EXISTS mock_test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE SET NULL,
  test_type text NOT NULL CHECK (test_type IN ('theory', 'programming')),
  topic_scores jsonb NOT NULL DEFAULT '{}',
  total_correct integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL DEFAULT 0,
  completed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mock_test_student ON mock_test_results(student_id);
CREATE INDEX IF NOT EXISTS idx_mock_test_class ON mock_test_results(class_id);

ALTER TABLE mock_test_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students insert own mock tests" ON mock_test_results;
CREATE POLICY "Students insert own mock tests"
  ON mock_test_results FOR INSERT
  WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Students read own mock tests" ON mock_test_results;
CREATE POLICY "Students read own mock tests"
  ON mock_test_results FOR SELECT
  USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Teachers read class mock tests" ON mock_test_results;
CREATE POLICY "Teachers read class mock tests"
  ON mock_test_results FOR SELECT
  USING (
    class_id IN (SELECT id FROM classes WHERE teacher_id = auth.uid())
  );
